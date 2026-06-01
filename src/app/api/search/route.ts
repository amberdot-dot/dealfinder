import { NextRequest, NextResponse } from 'next/server'
import { searchTrademe } from '@/lib/scrapers/trademe'
import { searchRetailers } from '@/lib/scrapers/retailers'
import { calculateDealScore, generateDealSummary } from '@/lib/ai/dealAnalyzer'
import { parseSearchQuery } from '@/lib/ai/queryParser'
import type { Category, SearchResult, PriceListing, ParsedSearch } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const category = (searchParams.get('category') as Category) || 'all'

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 })
  }

  try {
    const parsed: ParsedSearch = await parseSearchQuery(query)

    const effectiveCategory = (parsed.category !== 'all' ? parsed.category : category) as Category

    const [trademeListings, retailerListings] = await Promise.all([
      searchTrademe(query, effectiveCategory),
      searchRetailers(query, parsed),
    ])

    const allListings: PriceListing[] = [...trademeListings, ...retailerListings]

    const scoredListings = allListings.map((listing) => {
      const { score, rating, reason } = calculateDealScore(listing, allListings)
      return { ...listing, deal_score: score, deal_rating: rating, deal_reason: reason }
    })

    const grouped = buildResults(scoredListings, query, parsed, effectiveCategory)

    grouped.sort((a, b) => {
      const order = { great: 0, good: 1, fair: 2, poor: 3 }
      return order[a.deal_rating] - order[b.deal_rating]
    })

    const aiSummary = await generateDealSummary(query, grouped, parsed)

    return NextResponse.json({
      query,
      category: effectiveCategory,
      parsed_query: parsed,
      results: grouped,
      ai_summary: aiSummary,
      total: grouped.length,
      fetched_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

function buildResults(
  listings: PriceListing[],
  query: string,
  parsed: ParsedSearch,
  category: Category
): SearchResult[] {
  const prices = listings.map((l) => l.price)
  const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0

  return listings.map((listing) => {
    const savings = listing.original_price && listing.original_price > listing.price
      ? Math.round(listing.original_price - listing.price)
      : avgPrice > listing.price
      ? Math.round(avgPrice - listing.price)
      : null

    return {
      product: {
        id: listing.id,
        name: listing.listing_title,
        brand: extractBrand(listing.listing_title),
        model: listing.listing_title,
        category,
        image_url: null,
        description: null,
        created_at: new Date().toISOString(),
      },
      listings: [listing],
      best_price: listing.price,
      best_source: listing.source,
      avg_market_price: Math.round(avgPrice),
      ai_summary: null,
      deal_rating: listing.deal_rating ?? 'fair',
      savings,
      deal_reason: listing.deal_reason,
      parsed_query: parsed,
    }
  })
}

function extractBrand(title: string): string {
  const brands = [
    'Samsung', 'LG', 'Fisher & Paykel', 'Bosch', 'Electrolux', 'Haier', 'Panasonic',
    'Miele', 'Whirlpool', 'Westinghouse', 'Apple', 'Sony', 'Toyota', 'Honda',
    'Mitsubishi', 'Dyson', 'Makita', 'DeWalt', 'Milwaukee',
  ]
  for (const brand of brands) {
    if (title.toLowerCase().includes(brand.toLowerCase())) return brand
  }
  return 'Unknown'
}
