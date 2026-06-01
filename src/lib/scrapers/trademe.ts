/**
 * Trade Me scraper
 * Uses Trade Me's public API (sandbox and production)
 * Docs: https://developer.trademe.co.nz/api-reference/
 */

import type { PriceListing, Category } from '@/types'

const TRADEME_API_BASE = 'https://api.trademe.co.nz/v1'
const TRADEME_SANDBOX_BASE = 'https://api.tmsandbox.co.nz/v1'

const BASE_URL = process.env.NODE_ENV === 'production' ? TRADEME_API_BASE : TRADEME_SANDBOX_BASE

// Category mapping: our categories -> Trade Me category IDs
const CATEGORY_MAP: Record<string, string> = {
  'washing-machines': '0371-5323-',
  'dryers': '0371-5324-',
  'fridges': '0371-5321-',
  'freezers': '0371-5322-',
  'dishwashers': '0371-5325-',
  'ovens': '0371-5326-',
  'microwaves': '0371-5327-',
}

interface TradeMeListingRaw {
  ListingId: number
  Title: string
  PriceDisplay: string
  BuyNowPrice: number | null
  StartPrice: number
  HasBuyNow: boolean
  PictureHref: string | null
  ListingUrl: string
  BuyerFreight: string
  IsNew: boolean
}

export async function searchTrademe(query: string, category?: Category): Promise<PriceListing[]> {
  const consumerKey = process.env.TRADEME_CONSUMER_KEY
  const consumerSecret = process.env.TRADEME_CONSUMER_SECRET

  if (!consumerKey || !consumerSecret) {
    console.warn('Trade Me API keys not configured, using mock data')
    return getMockListings(query)
  }

  const params = new URLSearchParams({
    search_string: query,
    buy_now_only: 'true',
    rows: '20',
    sort_order: 'BuyNowAsc',
  })

  if (category && category !== 'all' && CATEGORY_MAP[category]) {
    params.set('category', CATEGORY_MAP[category])
  }

  try {
    const res = await fetch(`${BASE_URL}/Search/General.json?${params}`, {
      headers: {
        Authorization: `OAuth oauth_consumer_key="${consumerKey}"`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`Trade Me API error: ${res.status}`)

    const data = await res.json()
    const listings: TradeMeListingRaw[] = data.List || []

    return listings.map((item) => ({
      id: `tm-${item.ListingId}`,
      product_id: '',
      source: 'trademe' as const,
      price: item.BuyNowPrice ?? item.StartPrice,
      original_price: null,
      currency: 'NZD' as const,
      url: item.ListingUrl || `https://www.trademe.co.nz/a/marketplace/listings/${item.ListingId}`,
      in_stock: true,
      condition: item.IsNew ? 'new' : 'used',
      seller_name: null,
      listing_title: item.Title,
      deal_score: null,
      deal_rating: null,
      fetched_at: new Date().toISOString(),
    }))
  } catch (err) {
    console.error('Trade Me scrape failed:', err)
    return getMockListings(query)
  }
}

function getMockListings(query: string): PriceListing[] {
  return [
    {
      id: 'tm-mock-1',
      product_id: '',
      source: 'trademe',
      price: 649,
      original_price: null,
      currency: 'NZD',
      url: 'https://www.trademe.co.nz',
      in_stock: true,
      condition: 'used',
      seller_name: 'bargain_appliances',
      listing_title: `${query} - Excellent Condition`,
      deal_score: 8.2,
      deal_rating: 'great',
      fetched_at: new Date().toISOString(),
    },
    {
      id: 'tm-mock-2',
      product_id: '',
      source: 'trademe',
      price: 899,
      original_price: null,
      currency: 'NZD',
      url: 'https://www.trademe.co.nz',
      in_stock: true,
      condition: 'new',
      seller_name: 'appliance_store_nz',
      listing_title: `Brand New ${query} - Sealed Box`,
      deal_score: 7.1,
      deal_rating: 'good',
      fetched_at: new Date().toISOString(),
    },
  ]
}
