/**
 * AI Deal Analyzer
 * Uses OpenAI to score deals, generate summaries, and recommend best options
 */

import OpenAI from 'openai'
import type { PriceListing, DealRating, SearchResult } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export function calculateDealScore(
  listing: PriceListing,
  allListings: PriceListing[]
): { score: number; rating: DealRating } {
  const prices = allListings.map((l) => l.price).filter((p) => p > 0)
  if (prices.length === 0) return { score: 5, rating: 'fair' }

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  const range = maxPrice - minPrice

  // Score 0-10 based on how far below average the price is
  let score: number
  if (range === 0) {
    score = 5
  } else {
    const position = (avgPrice - listing.price) / range
    score = Math.min(10, Math.max(0, 5 + position * 5))
  }

  // Bonus for used/secondhand condition
  if (listing.condition === 'used') score = Math.min(10, score + 1.5)

  // Bonus for original price showing a discount
  if (listing.original_price && listing.original_price > listing.price) {
    const discount = (listing.original_price - listing.price) / listing.original_price
    score = Math.min(10, score + discount * 3)
  }

  const rating: DealRating =
    score >= 8 ? 'great' : score >= 6 ? 'good' : score >= 4 ? 'fair' : 'poor'

  return { score: Math.round(score * 10) / 10, rating }
}

export async function generateDealSummary(
  query: string,
  results: Omit<SearchResult, 'ai_summary'>[]
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackSummary(query, results)
  }

  const listingsSummary = results
    .slice(0, 5)
    .map(
      (r) =>
        `- ${r.listings[0]?.listing_title} from ${r.best_source}: $${r.best_price} NZD (${r.deal_rating} deal)`
    )
    .join('\n')

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful NZ shopping assistant. Analyse these price listings and give a concise, friendly 2-3 sentence summary of the best deals. Focus on value for money. Use NZD. Don't use bullet points in your summary.`,
        },
        {
          role: 'user',
          content: `User searched for: "${query}"\n\nTop listings:\n${listingsSummary}\n\nSummarise the best options and whether now is a good time to buy.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || generateFallbackSummary(query, results)
  } catch (err) {
    console.error('OpenAI error:', err)
    return generateFallbackSummary(query, results)
  }
}

export async function analyzeIsGoodDeal(
  listing: PriceListing,
  query: string
): Promise<{ verdict: string; confidence: number; reasoning: string }> {
  const { score, rating } = calculateDealScore(listing, [listing])

  if (!process.env.OPENAI_API_KEY) {
    return {
      verdict: rating === 'great' || rating === 'good' ? 'Yes, good deal' : 'Average price',
      confidence: 0.6,
      reasoning: `This listing is priced at $${listing.price} NZD from ${listing.seller_name || listing.source}.`,
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a NZ appliance pricing expert. Give a quick verdict on whether this is a good deal. Be concise and direct.',
        },
        {
          role: 'user',
          content: `Is $${listing.price} NZD a good price for: "${listing.listing_title}"?\nCondition: ${listing.condition}\nSource: ${listing.source}\nOur deal score: ${score}/10`,
        },
      ],
      max_tokens: 100,
      temperature: 0.5,
    })

    const content = completion.choices[0]?.message?.content || ''
    return {
      verdict: rating === 'great' ? 'Great deal' : rating === 'good' ? 'Good deal' : rating === 'fair' ? 'Fair price' : 'Below average',
      confidence: score / 10,
      reasoning: content,
    }
  } catch {
    return {
      verdict: 'Fair price',
      confidence: 0.5,
      reasoning: `Priced at $${listing.price} NZD.`,
    }
  }
}

function generateFallbackSummary(
  query: string,
  results: Omit<SearchResult, 'ai_summary'>[]
): string {
  if (results.length === 0) return `No listings found for "${query}".`

  const best = results.reduce((a, b) => (a.best_price < b.best_price ? a : b))
  const greatDeals = results.filter((r) => r.deal_rating === 'great').length

  return `Found ${results.length} results for "${query}". Best price is $${best.best_price} NZD from ${best.best_source}. ${greatDeals > 0 ? `${greatDeals} listing${greatDeals > 1 ? 's' : ''} rated as a great deal.` : 'Prices are fairly competitive across retailers.'}`
}
