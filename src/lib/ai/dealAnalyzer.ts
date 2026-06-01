import OpenAI from 'openai'
import type { PriceListing, DealRating, SearchResult, ParsedSearch } from '@/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const RETAILER_REPUTATION: Record<string, number> = {
  harvey_norman: 8.5,
  noel_leeming: 8.5,
  bond_and_bond: 8.0,
  briscoes: 7.5,
  the_warehouse: 7.0,
  pb_tech: 8.5,
  jb_hifi: 8.0,
  my_appliances: 7.0,
  spark: 8.0,
  two_degrees: 7.5,
  freedom: 8.0,
  early_settler: 8.0,
  mocka: 7.5,
  mitre10: 8.0,
  bunnings: 8.5,
  turners: 7.5,
  trademe: 7.0,
  themarket: 7.0,
}

function estimateBonusValue(bonusOffers: string[]): number {
  let value = 0
  for (const offer of bonusOffers) {
    const lower = offer.toLowerCase()
    if (lower.includes('airpoints')) value += 80
    else if (lower.includes('gift card')) {
      const match = offer.match(/\$([\d,]+)/)
      value += match ? parseInt(match[1].replace(',', '')) : 50
    } else if (lower.includes('free delivery') || lower.includes('free installation')) value += 50
    else if (lower.includes('cashback')) {
      const match = offer.match(/\$([\d,]+)/)
      value += match ? parseInt(match[1].replace(',', '')) : 30
    } else {
      value += 20
    }
  }
  return value
}

function financeScore(financeRate: string | null, financeAvailable: boolean): number {
  if (!financeAvailable) return 0
  if (!financeRate) return 3
  const lower = financeRate.toLowerCase()
  if (lower.includes('interest free') || lower.includes('0%')) return 10
  if (lower.includes('low rate')) return 5
  return 3
}

export function calculateDealScore(
  listing: PriceListing,
  allListings: PriceListing[]
): { score: number; rating: DealRating; reason: string } {
  const prices = allListings.map((l) => l.price).filter((p) => p > 0)
  if (prices.length === 0) return { score: 5, rating: 'fair', reason: 'Insufficient data to compare.' }

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  const range = maxPrice - minPrice

  // 40% — price vs market
  let priceScore: number
  if (range === 0) {
    priceScore = 5
  } else {
    const position = (avgPrice - listing.price) / range
    priceScore = Math.min(10, Math.max(0, 5 + position * 5))
  }

  // 15% — finance
  const fScore = financeScore(listing.finance_rate ?? null, listing.finance_available ?? false)

  // 10% — delivery
  const deliveryScore = listing.delivery_available && listing.delivery_cost === 0 ? 10 : listing.delivery_available ? 5 : 0

  // 10% — warranty
  const warrantyMonths = listing.warranty_months ?? 12
  const warrantyScore = Math.min(10, (warrantyMonths / 24) * 10)

  // 15% — bonus offers
  const bonusValue = estimateBonusValue(listing.bonus_offers ?? [])
  const bonusScore = Math.min(10, (bonusValue / 150) * 10)

  // 10% — retailer reputation
  const repScore = RETAILER_REPUTATION[listing.source] ?? 7.0

  const weighted =
    priceScore * 0.4 +
    fScore * 0.15 +
    deliveryScore * 0.1 +
    warrantyScore * 0.1 +
    bonusScore * 0.15 +
    repScore * 0.1

  const score = Math.round(weighted * 10) / 10

  const rating: DealRating =
    score >= 7.5 ? 'great' : score >= 6 ? 'good' : score >= 4 ? 'fair' : 'poor'

  const reasons: string[] = []
  if (listing.price <= minPrice) reasons.push('lowest price in market')
  else if (listing.price < avgPrice) reasons.push(`$${Math.round(avgPrice - listing.price)} below average`)
  if (listing.finance_available && listing.finance_rate) reasons.push(listing.finance_rate)
  if (listing.delivery_available && listing.delivery_cost === 0) reasons.push('free delivery')
  if ((listing.bonus_offers ?? []).length > 0) reasons.push((listing.bonus_offers ?? [])[0])

  const reason = reasons.length > 0 ? reasons.join(' · ') : 'Competitive price'

  return { score, rating, reason }
}

export async function generateDealSummary(
  query: string,
  results: SearchResult[],
  parsed: ParsedSearch | null
): Promise<string> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
    return generateFallbackSummary(query, results)
  }

  const top = results.slice(0, 6)
  const listingsSummary = top
    .map((r) => {
      const l = r.listings[0]
      const extras = [
        l?.finance_available ? l.finance_rate || 'finance available' : null,
        l?.delivery_available && l.delivery_cost === 0 ? 'free delivery' : null,
        ...(l?.bonus_offers ?? []).slice(0, 1),
      ].filter(Boolean).join(', ')
      return `- ${l?.listing_title ?? r.product.name} from ${r.best_source}: $${r.best_price} NZD (${r.deal_rating})${extras ? ` — ${extras}` : ''}`
    })
    .join('\n')

  const financeNote = parsed?.finance_required ? ' The user specifically asked about interest-free finance.' : ''

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful NZ shopping advisor. Give a concise 2-3 sentence summary of the best deals considering price, finance, delivery, and any bonuses. Use NZD. Be direct about which is the best full deal and why. Don't use bullet points.${financeNote}`,
        },
        {
          role: 'user',
          content: `User searched for: "${query}"\n\nTop results:\n${listingsSummary}\n\nSummarise which is the best full deal and why.`,
        },
      ],
      max_tokens: 200,
      temperature: 0.6,
    })

    return completion.choices[0]?.message?.content || generateFallbackSummary(query, results)
  } catch (err) {
    console.error('OpenAI summary error:', err)
    return generateFallbackSummary(query, results)
  }
}

function generateFallbackSummary(query: string, results: SearchResult[]): string {
  if (results.length === 0) return `No results found for "${query}". Try broadening your search.`

  const best = results.reduce((a, b) => (a.deal_rating === 'great' && b.deal_rating !== 'great' ? a : b.deal_rating === 'great' ? b : a.best_price <= b.best_price ? a : b))
  const sourceLabel = best.best_source.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const financeNote = best.listings[0]?.finance_available ? ` They also offer ${best.listings[0].finance_rate || 'finance options'}.` : ''
  const deliveryNote = best.listings[0]?.delivery_available && best.listings[0].delivery_cost === 0 ? ' Free delivery included.' : ''

  return `Found ${results.length} results for "${query}". The best overall deal is from ${sourceLabel} at $${best.best_price.toLocaleString()} NZD.${financeNote}${deliveryNote}`
}
