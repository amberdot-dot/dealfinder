export type Source =
  | 'trademe'
  | 'harvey_norman'
  | 'noel_leeming'
  | 'bond_and_bond'
  | 'briscoes'
  | 'the_warehouse'
  | 'my_appliances'
  | 'pb_tech'
  | 'jb_hifi'
  | 'spark'
  | 'two_degrees'
  | 'turners'
  | 'freedom'
  | 'early_settler'
  | 'mocka'
  | 'mitre10'
  | 'bunnings'
  | 'themarket'

export type DealRating = 'great' | 'good' | 'fair' | 'poor'

export type Category =
  | 'whiteware'
  | 'washing-machines'
  | 'dryers'
  | 'fridges'
  | 'dishwashers'
  | 'ovens'
  | 'rangehoods'
  | 'electronics'
  | 'tvs'
  | 'laptops'
  | 'phones'
  | 'tablets'
  | 'cameras'
  | 'audio'
  | 'gaming'
  | 'cars'
  | 'cars-under-10k'
  | 'cars-10k-20k'
  | 'cars-20k-40k'
  | 'cars-40k-plus'
  | 'electric-vehicles'
  | 'home-and-garden'
  | 'furniture'
  | 'outdoor'
  | 'tools'
  | 'appliances'
  | 'vacuum-cleaners'
  | 'air-conditioning'
  | 'heat-pumps'
  | 'water-heating'
  | 'all'

export interface ParsedSearch {
  category: string
  keywords: string[]
  max_price: number | null
  min_price: number
  features: string[]
  finance_required: boolean
  delivery_required: boolean
  brands_preferred: string[]
  brands_excluded: string[]
  condition: 'new'
  summary: string
}

export interface ScraperResult {
  source: Source
  listing_title: string
  price: number
  original_price: number | null
  url: string
  image_url: string | null
  in_stock: boolean
  delivery_available: boolean
  delivery_cost: number | null
  finance_available: boolean
  finance_rate: string | null
  warranty_months: number | null
  bonus_offers: string[]
  fetched_at: string
}

export interface DealFactors {
  price_vs_market: number
  finance_rate: number
  delivery_included: boolean
  warranty_length: number
  bonus_offers_value: number
  retailer_reputation: number
}

export interface Product {
  id: string
  name: string
  brand: string
  model: string
  category: Category
  image_url: string | null
  description: string | null
  created_at: string
}

export interface PriceListing {
  id: string
  product_id: string
  source: Source
  price: number
  original_price: number | null
  currency: 'NZD'
  url: string
  in_stock: boolean
  condition: 'new' | 'used' | 'refurbished'
  seller_name: string | null
  listing_title: string
  fetched_at: string
  deal_score: number | null
  deal_rating: DealRating | null
  delivery_available: boolean
  delivery_cost: number | null
  finance_available: boolean
  finance_rate: string | null
  warranty_months: number | null
  bonus_offers: string[]
  deal_reason: string | null
}

export interface SearchResult {
  product: Product
  listings: PriceListing[]
  best_price: number
  best_source: Source
  avg_market_price: number | null
  ai_summary: string | null
  deal_rating: DealRating
  savings: number | null
  deal_reason: string | null
  parsed_query: ParsedSearch | null
}

export interface PriceAlert {
  id: string
  user_id: string
  product_id: string
  target_price: number
  is_active: boolean
  created_at: string
  product?: Product
}

export interface User {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export type SortOption = 'price_asc' | 'price_desc' | 'deal_rating' | 'newest'

export interface Membership {
  id: string
  user_id: string
  plan: 'monthly' | 'annual'
  status: 'active' | 'cancelled' | 'trialing'
  started_at: string
  renews_at: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
}
