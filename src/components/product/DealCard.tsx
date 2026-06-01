import { ExternalLink, Bell, TrendingDown } from 'lucide-react'
import type { SearchResult, DealRating } from '@/types'

const SOURCE_LABELS: Record<string, string> = {
  trademe: 'Trade Me',
  harvey_norman: 'Harvey Norman',
  noel_leeming: 'Noel Leeming',
  themarket: 'The Market',
  pb_tech: 'PB Tech',
}

const DEAL_CONFIG: Record<DealRating, { label: string; barColor: string; labelColor: string }> = {
  great: { label: 'Great deal', barColor: 'bg-green-500', labelColor: 'text-green-600' },
  good: { label: 'Good deal', barColor: 'bg-sky-500', labelColor: 'text-sky-600' },
  fair: { label: 'Fair price', barColor: 'bg-amber-400', labelColor: 'text-amber-600' },
  poor: { label: 'Below average', barColor: 'bg-red-400', labelColor: 'text-red-500' },
}

interface DealCardProps {
  result: SearchResult
}

export function DealCard({ result }: DealCardProps) {
  const listing = result.listings[0]
  const deal = DEAL_CONFIG[result.deal_rating] ?? DEAL_CONFIG.fair

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        {/* Source + condition */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {SOURCE_LABELS[result.best_source] || result.best_source}
          </span>
          {listing?.condition && listing.condition !== 'new' && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full capitalize">
              {listing.condition}
            </span>
          )}
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-4 line-clamp-2 flex-1">
          {listing?.listing_title || result.product.name}
        </h3>

        {/* Price */}
        <div className="flex items-end gap-2 mb-1">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            ${result.best_price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 mb-0.5">NZD</span>
          {listing?.original_price && listing.original_price > result.best_price && (
            <span className="text-sm text-gray-300 line-through mb-0.5">
              ${listing.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Savings + deal rating */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-semibold ${deal.labelColor}`}>
            {deal.label}
          </span>
          {result.savings && result.savings > 0 && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Save ~${result.savings}
            </span>
          )}
        </div>

        {/* Deal score bar */}
        {listing?.deal_score !== null && listing?.deal_score !== undefined && (
          <div className="mb-4">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${deal.barColor}`}
                style={{ width: `${(listing.deal_score / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={listing?.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-4 rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            View offer
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            className="p-2.5 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors"
            title="Set price alert"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
