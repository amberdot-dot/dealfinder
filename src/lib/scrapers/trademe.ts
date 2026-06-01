import type { PriceListing, Category } from '@/types'

const TRADEME_API_BASE = 'https://api.trademe.co.nz/v1'
const TRADEME_SANDBOX_BASE = 'https://api.tmsandbox.co.nz/v1'
const BASE_URL = process.env.NODE_ENV === 'production' ? TRADEME_API_BASE : TRADEME_SANDBOX_BASE

const CATEGORY_MAP: Record<string, string> = {
  'washing-machines': '0371-5323-',
  'dryers': '0371-5324-',
  'fridges': '0371-5321-',
  'dishwashers': '0371-5325-',
  'ovens': '0371-5326-',
}

interface TradeMeListingRaw {
  ListingId: number
  Title: string
  BuyNowPrice: number | null
  StartPrice: number
  PictureHref: string | null
  ListingUrl: string
  IsNew: boolean
}

export async function searchTrademe(query: string, category?: Category): Promise<PriceListing[]> {
  const consumerKey = process.env.TRADEME_CONSUMER_KEY
  const consumerSecret = process.env.TRADEME_CONSUMER_SECRET

  if (!consumerKey || consumerKey === 'your_trademe_consumer_key' || !consumerSecret) {
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
      headers: { Authorization: `OAuth oauth_consumer_key="${consumerKey}"` },
      next: { revalidate: 7200 },
      signal: AbortSignal.timeout(8000),
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
      url: item.ListingUrl || `https://www.trademe.co.nz/listing/${item.ListingId}`,
      in_stock: true,
      condition: item.IsNew ? ('new' as const) : ('used' as const),
      seller_name: null,
      listing_title: item.Title,
      deal_score: null,
      deal_rating: null,
      delivery_available: true,
      delivery_cost: null,
      finance_available: false,
      finance_rate: null,
      warranty_months: null,
      bonus_offers: [],
      deal_reason: null,
      fetched_at: new Date().toISOString(),
    }))
  } catch (err) {
    console.error('Trade Me scrape failed:', err)
    return getMockListings(query)
  }
}

function getMockListings(query: string): PriceListing[] {
  const q = query.toLowerCase()
  const isCars = /car|suv|ute|toyota|honda|mazda|rav4|hilux/.test(q)

  if (isCars) {
    return [
      mkMock(`Toyota RAV4 2021 — 42,000km, 1 owner, dealer listing`, 34990, 'trademe', 'https://motors.trademe.co.nz'),
      mkMock(`Honda CR-V 2020 — 55,000km, full service history`, 27990, 'trademe', 'https://motors.trademe.co.nz'),
    ]
  }

  return [
    mkMock(`${query} — New in box, sealed, full warranty`, 899, 'trademe', 'https://www.trademe.co.nz'),
  ]
}

function mkMock(title: string, price: number, source: 'trademe', url: string): PriceListing {
  return {
    id: `tm-mock-${Math.random().toString(36).slice(2, 9)}`,
    product_id: '',
    source,
    price,
    original_price: null,
    currency: 'NZD',
    url,
    in_stock: true,
    condition: 'new',
    seller_name: 'Trade Me Seller',
    listing_title: title,
    deal_score: null,
    deal_rating: null,
    delivery_available: true,
    delivery_cost: null,
    finance_available: false,
    finance_rate: null,
    warranty_months: 12,
    bonus_offers: [],
    deal_reason: null,
    fetched_at: new Date().toISOString(),
  }
}
