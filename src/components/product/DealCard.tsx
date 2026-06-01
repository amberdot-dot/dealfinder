'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, TrendingDown, Truck, CreditCard, Shield, Info } from 'lucide-react'
import type { SearchResult, DealRating } from '@/types'

const SOURCE_LABELS: Record<string, string> = {
  trademe: 'Trade Me',
  harvey_norman: 'Harvey Norman',
  noel_leeming: 'Noel Leeming',
  bond_and_bond: 'Bond & Bond',
  briscoes: 'Briscoes',
  the_warehouse: 'The Warehouse',
  my_appliances: 'MyAppliances',
  pb_tech: 'PB Tech',
  jb_hifi: 'JB Hi-Fi',
  spark: 'Spark',
  two_degrees: '2degrees',
  turners: 'Turners',
  freedom: 'Freedom',
  early_settler: 'Early Settler',
  mocka: 'Mocka',
  mitre10: 'Mitre 10',
  bunnings: 'Bunnings',
  themarket: 'The Market',
}

const DEAL_CONFIG: Record<DealRating, { label: string; className: string; barColor: string }> = {
  great: { label: 'Great deal', className: 'bg-sage-50 text-sage-700 border-sage-200', barColor: 'bg-sage-500' },
  good: { label: 'Good deal', className: 'bg-blue-50 text-blue-700 border-blue-200', barColor: 'bg-blue-500' },
  fair: { label: 'Fair price', className: 'bg-amber-50 text-amber-700 border-amber-200', barColor: 'bg-amber-400' },
  poor: { label: 'Below average', className: 'bg-red-50 text-red-600 border-red-200', barColor: 'bg-red-400' },
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  'washing-machines': 'from-sky-100 to-blue-200',
  fridges: 'from-cyan-100 to-sky-200',
  dryers: 'from-violet-100 to-purple-200',
  dishwashers: 'from-teal-100 to-cyan-200',
  electronics: 'from-violet-100 to-indigo-200',
  tvs: 'from-violet-100 to-indigo-200',
  laptops: 'from-slate-100 to-blue-200',
  phones: 'from-purple-100 to-violet-200',
  cars: 'from-clay-100 to-orange-100',
  furniture: 'from-amber-100 to-yellow-200',
  outdoor: 'from-sage-100 to-green-100',
  tools: 'from-slate-100 to-gray-200',
  default: 'from-ink-100 to-ink-200',
}

interface DealCardProps {
  result: SearchResult
  rank?: number
  onWatchlist?: (id: string) => void
  isWatchlisted?: boolean
}

export function DealCard({ result, rank, onWatchlist, isWatchlisted = false }: DealCardProps) {
  const listing = result.listings[0]
  const deal = DEAL_CONFIG[result.deal_rating] ?? DEAL_CONFIG.fair
  const [saved, setSaved] = useState(isWatchlisted)
  const [savingAnimation, setSavingAnimation] = useState(false)

  const gradient = CATEGORY_GRADIENTS[result.product.category] ?? CATEGORY_GRADIENTS.default
  const productSlug = encodeURIComponent(listing?.listing_title || result.product.name)

  const discountPercent = listing?.original_price && listing.original_price > result.best_price
    ? Math.round(((listing.original_price - result.best_price) / listing.original_price) * 100)
    : null

  function handleSave(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setSavingAnimation(true)
    setSaved(!saved)
    setTimeout(() => setSavingAnimation(false), 300)
    onWatchlist?.(result.product.id)
  }

  return (
    <div className="card group flex flex-col overflow-hidden">
      {/* Image / visual area */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-clay-500 text-white text-2xs font-bold px-2 py-0.5 rounded-full">
            -{discountPercent}%
          </div>
        )}
        {rank === 1 && (
          <div className="absolute top-3 left-3 bg-sage-600 text-white text-2xs font-bold px-2 py-0.5 rounded-full">
            Best deal
          </div>
        )}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            saved
              ? 'bg-clay-500 text-white shadow-md'
              : 'bg-white/80 text-ink-400 hover:bg-white hover:text-clay-500 backdrop-blur-sm'
          } ${savingAnimation ? 'scale-125' : 'scale-100'}`}
          title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
        </button>
        <span className="text-5xl opacity-10 font-black text-ink-700 uppercase tracking-tighter">
          {(result.product.category || 'deal').slice(0, 3)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xs font-bold text-ink-400 uppercase tracking-wide">
            {SOURCE_LABELS[result.best_source] || result.best_source}
          </span>
          <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${deal.className}`}>
            {deal.label}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-ink-900 leading-snug mb-3 line-clamp-2 group-hover:text-clay-600 transition-colors flex-1">
          {listing?.listing_title || result.product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-black text-ink-900 tracking-tight">
            ${result.best_price.toLocaleString()}
          </span>
          <span className="text-xs text-ink-400">NZD</span>
          {listing?.original_price && listing.original_price > result.best_price && (
            <span className="text-xs text-ink-300 line-through">
              ${listing.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {result.savings && result.savings > 0 && (
          <p className="text-xs text-sage-600 font-semibold flex items-center gap-1 mb-3">
            <TrendingDown className="w-3 h-3" />
            Save ~${result.savings} vs average
          </p>
        )}

        {/* Real deal badges from data */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing?.finance_available && listing.finance_rate && (
            <span className="text-2xs font-medium text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CreditCard className="w-2.5 h-2.5" />
              {listing.finance_rate}
            </span>
          )}
          {listing?.delivery_available && listing.delivery_cost === 0 && (
            <span className="text-2xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Truck className="w-2.5 h-2.5" />
              Free delivery
            </span>
          )}
          {listing?.warranty_months && (
            <span className="text-2xs font-medium text-ink-500 bg-ink-50 border border-ink-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              {listing.warranty_months}mo warranty
            </span>
          )}
          {(listing?.bonus_offers ?? []).slice(0, 1).map((offer) => (
            <span key={offer} className="text-2xs font-medium text-sage-700 bg-sage-50 border border-sage-100 px-2 py-0.5 rounded-full">
              {offer}
            </span>
          ))}
        </div>

        {/* Deal reason */}
        {result.deal_reason && (
          <p className="text-2xs text-ink-400 flex items-start gap-1 mb-3">
            <Info className="w-3 h-3 flex-shrink-0 mt-0.5 text-ink-300" />
            {result.deal_reason}
          </p>
        )}

        {/* Deal score bar */}
        {listing?.deal_score != null && (
          <div className="mb-3">
            <div className="h-1 bg-ink-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${deal.barColor}`}
                style={{ width: `${(listing.deal_score / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        <Link href={`/product/${productSlug}`} className="btn-primary w-full text-xs py-2.5">
          Compare all offers
        </Link>
      </div>
    </div>
  )
}
