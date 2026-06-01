import { NextRequest, NextResponse } from 'next/server'
import { searchTrademe } from '@/lib/scrapers/trademe'
import { searchRetailers } from '@/lib/scrapers/retailers'
import { calculateDealScore, generateDealSummary } from '@/lib/ai/dealAnalyzer'
import type { Category, SearchResult, PriceListing } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const category = (searchParams.get('category') as Category) || 'all'

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 })
  }

  try {
    // Fetch from all sources in parallel
    const [trademeListings, retailerListings] = await Promise.all([
      searchTrademe(query, category),
      searchRetailers(query),
    ])

    const allListings: PriceListing[] = [...trademeListings, ...retailerListings]

    // Score all listings
    const scoredListings = allListings.map((listing) => {
      const { score, rating } = calculateDealScore(listing, allListings)
      return { ...listing, deal_score: score, deal_rating: rating }
    })

    // Group by product (simple grouping by source for now — in production, use embedding similarity)
    const grouped = groupByProduct(scoredListings, query)

    // Generate AI summary
    const aiSummary = await generateDealSummary(query, grouped)

    return NextResponse.json({
      query,
      category,
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

function groupByProduct(listings: PriceListing[], query: string): SearchResult[] {
  // Simple implementation: each unique listing becomes a result
  // In production: use embeddings to match listings to canonical products
  return listings.map((listing) => {
    const prices = listings.map((l) => l.price)
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    const savings = listing.original_price
      ? listing.original_price - listing.price
      : avgPrice > listing.price
      ? Math.round(avgPrice - listing.price)
      : null

    return {
      product: {
        id: listing.id,
        name: listing.listing_title,
        brand: extractBrand(listing.listing_title),
        model: listing.listing_title,
        category: 'all' as Category,
        image_url: null,
        description: null,
        created_at: new Date().toISOString(),
      },
      listings: [listing],
      best_price: listing.price,
      best_source: listing.source,
      avg_market_price: Math.round(avgPrice),
      ai_summary: null,
      deal_rating: listing.deal_rating || 'fair',
      savings,
    }
  })
}

function extractBrand(title: string): string {
  const brands = ['Samsung', 'LG', 'Fisher & Paykel', 'Bosch', 'Electrolux', 'Haier', 'Panasonic', 'Miele', 'Whirlpool', 'Westinghouse']
  for (const brand of brands) {
    if (title.toLowerCase().includes(brand.toLowerCase())) return brand
  }
  return 'Unknown'
}
