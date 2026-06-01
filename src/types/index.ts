export type Source = 'trademe' | 'harvey_norman' | 'noel_leeming' | 'themarket' | 'pb_tech'

export type DealRating = 'great' | 'good' | 'fair' | 'poor'

export type Category =
  | 'washing-machines'
  | 'dryers'
  | 'fridges'
  | 'freezers'
  | 'dishwashers'
  | 'ovens'
  | 'microwaves'
  | 'vacuum-cleaners'
  | 'all'

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
