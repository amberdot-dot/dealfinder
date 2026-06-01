'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Truck, CreditCard, Shield, TrendingDown, ArrowLeft, ExternalLink, Sparkles, Heart } from 'lucide-react'
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

const DEAL_CONFIG: Record<DealRating, { label: string; bg: string; text: string; bar: string }> = {
  great: { label: 'Great deal', bg: 'bg-sage-50 border-sage-200', text: 'text-sage-700', bar: 'bg-sage-500' },
  good: { label: 'Good deal', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', bar: 'bg-blue-500' },
  fair: { label: 'Fair price', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', bar: 'bg-amber-400' },
  poor: { label: 'Below average', bg: 'bg-red-50 border-red-200', text: 'text-red-600', bar: 'bg-red-400' },
}

interface SearchResponse {
  results: SearchResult[]
  ai_summary: string
  total: number
  query: string
}

export default function ProductPage() {
  const params = useParams()
  const productName = decodeURIComponent(String(params.id || ''))

  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productName) return
    fetch(`/api/search?q=${encodeURIComponent(productName)}`)
      .then((r) => r.json())
      .then((json) => { setData(json); setLoading(false) })
      .catch(() => { setError('Failed to load offers.'); setLoading(false) })
  }, [productName])

  const results = data?.results ?? []
  const best = results[0]

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Back nav */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link href="/search" className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to results
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-clay-500" />
            <span className="text-ink-400">Loading offers...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
        )}

        {data && (
          <>
            {/* Header */}
            <div className="mb-8">
              <p className="text-2xs font-bold text-ink-400 uppercase tracking-widest mb-2">All offers</p>
              <h1 className="text-2xl font-black text-ink-900 leading-tight mb-2">{productName}</h1>
              <p className="text-sm text-ink-400">{results.length} retailers found · ranked by full deal score</p>
            </div>

            {/* AI Summary */}
            {data.ai_summary && (
              <div className="bg-white border border-ink-100 rounded-2xl p-5 mb-8 flex gap-3 shadow-soft">
                <Sparkles className="w-4 h-4 text-clay-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-2xs font-bold text-clay-500 uppercase tracking-widest mb-1">AI verdict</p>
                  <p className="text-sm text-ink-700 leading-relaxed">{data.ai_summary}</p>
                </div>
              </div>
            )}

            {/* Best deal highlight */}
            {best && (
              <div className="bg-ink-900 rounded-2xl p-6 mb-6 text-white">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-2xs font-bold text-clay-400 uppercase tracking-widest mb-1">Best full deal</p>
                    <p className="font-bold text-white text-lg">{SOURCE_LABELS[best.best_source] || best.best_source}</p>
                    <p className="text-white/60 text-sm mt-0.5 line-clamp-1">{best.listings[0]?.listing_title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-black text-white">${best.best_price.toLocaleString()}</p>
                    <p className="text-white/40 text-xs">NZD</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {best.listings[0]?.finance_available && best.listings[0].finance_rate && (
                    <span className="text-xs bg-white/10 text-white/80 border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {best.listings[0].finance_rate}
                    </span>
                  )}
                  {best.listings[0]?.delivery_available && best.listings[0].delivery_cost === 0 && (
                    <span className="text-xs bg-white/10 text-white/80 border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Free delivery
                    </span>
                  )}
                  {(best.listings[0]?.bonus_offers ?? []).map((offer) => (
                    <span key={offer} className="text-xs bg-white/10 text-white/80 border border-white/20 px-2.5 py-1 rounded-full">
                      {offer}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 mt-5">
                  <a
                    href={best.listings[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent text-sm py-2.5"
                  >
                    View at {SOURCE_LABELS[best.best_source] || best.best_source}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2.5 rounded-xl transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* All offers comparison table */}
            <div>
              <h2 className="text-lg font-black text-ink-900 mb-4">All {results.length} offers compared</h2>
              <div className="space-y-3">
                {results.map((result, i) => {
                  const listing = result.listings[0]
                  const deal = DEAL_CONFIG[result.deal_rating] ?? DEAL_CONFIG.fair
                  const isBest = i === 0

                  return (
                    <div
                      key={result.product.id}
                      className={`bg-white rounded-2xl border p-5 transition-all ${
                        isBest ? 'border-sage-300 shadow-soft' : 'border-ink-100 hover:border-ink-200'
                      }`}
                    >
                      <div className="flex items-start gap-4 flex-wrap">
                        {/* Rank + retailer */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${isBest ? 'bg-sage-500 text-white' : 'bg-ink-100 text-ink-500'}`}>
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-bold text-ink-900 text-sm">{SOURCE_LABELS[result.best_source] || result.best_source}</p>
                            <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${deal.bg} ${deal.text}`}>
                              {deal.label}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0">
                          <p className="text-2xl font-black text-ink-900">${result.best_price.toLocaleString()}</p>
                          {listing?.original_price && listing.original_price > result.best_price && (
                            <p className="text-xs text-ink-300 line-through">${listing.original_price.toLocaleString()}</p>
                          )}
                          {result.savings && result.savings > 0 && (
                            <p className="text-xs text-sage-600 font-semibold flex items-center gap-0.5">
                              <TrendingDown className="w-3 h-3" />
                              Save ${result.savings}
                            </p>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 flex-1 items-start">
                          {listing?.finance_available && listing.finance_rate && (
                            <span className="text-2xs font-medium text-purple-700 bg-purple-50 border border-purple-100 px-2 py-1 rounded-full flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              {listing.finance_rate}
                            </span>
                          )}
                          {listing?.delivery_available && listing.delivery_cost === 0 && (
                            <span className="text-2xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              Free delivery
                            </span>
                          )}
                          {listing?.warranty_months && (
                            <span className="text-2xs font-medium text-ink-500 bg-ink-50 border border-ink-100 px-2 py-1 rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {listing.warranty_months}mo warranty
                            </span>
                          )}
                          {(listing?.bonus_offers ?? []).map((offer) => (
                            <span key={offer} className="text-2xs font-medium text-sage-700 bg-sage-50 border border-sage-100 px-2 py-1 rounded-full">
                              {offer}
                            </span>
                          ))}
                        </div>

                        {/* Deal score + CTA */}
                        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                          {listing?.deal_score != null && (
                            <div className="text-center">
                              <p className="text-lg font-black text-ink-900">{listing.deal_score}</p>
                              <p className="text-2xs text-ink-400">/ 10</p>
                            </div>
                          )}
                          <a
                            href={listing?.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                              isBest
                                ? 'bg-clay-500 hover:bg-clay-600 text-white'
                                : 'bg-ink-900 hover:bg-ink-800 text-white'
                            }`}
                          >
                            View deal
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Deal reason */}
                      {result.deal_reason && (
                        <p className="text-xs text-ink-400 mt-3 pt-3 border-t border-ink-50">{result.deal_reason}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
