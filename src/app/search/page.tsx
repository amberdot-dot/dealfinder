'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/search/SearchBar'
import { DealCard } from '@/components/product/DealCard'
import { Loader2, Sparkles, AlertCircle, SlidersHorizontal } from 'lucide-react'
import type { SearchResult, Category, SortOption } from '@/types'

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Whiteware', value: 'whiteware' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Cars', value: 'cars' },
  { label: 'Property', value: 'property' },
  { label: 'Washing Machines', value: 'washing-machines' },
  { label: 'Fridges', value: 'fridges' },
  { label: 'Dryers', value: 'dryers' },
  { label: 'Dishwashers', value: 'dishwashers' },
]

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Best Deal', value: 'deal_rating' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
]

const CONDITION_OPTIONS = ['All', 'New', 'Used']

interface SearchResponse {
  results: SearchResult[]
  ai_summary: string
  total: number
  query: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const categoryParam = (searchParams.get('category') as Category) || 'all'

  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<Category>(categoryParam)
  const [sort, setSort] = useState<SortOption>('deal_rating')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [condition, setCondition] = useState('All')

  useEffect(() => {
    if (!query) return
    fetchResults()
  }, [query, category])

  async function fetchResults() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ q: query })
      if (category !== 'all') params.set('category', category)
      const res = await fetch(`/api/search?${params}`)
      if (!res.ok) throw new Error('Search failed')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sortedResults = [...(data?.results || [])]
    .filter((r) => {
      if (maxPrice !== '' && r.best_price > maxPrice) return false
      if (condition === 'New' && r.listings[0]?.condition !== 'new') return false
      if (condition === 'Used' && r.listings[0]?.condition !== 'used') return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.best_price - b.best_price
      if (sort === 'price_desc') return b.best_price - a.best_price
      if (sort === 'deal_rating') {
        const order = { great: 0, good: 1, fair: 2, poor: 3 }
        return order[a.deal_rating] - order[b.deal_rating]
      }
      return 0
    })

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-500 text-lg mb-2">What are you looking for?</p>
        <p className="text-gray-400 text-sm mb-8">Search for whiteware, electronics, cars, property and more.</p>
        <div className="max-w-xl mx-auto">
          <SearchBar size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar initialQuery={query} />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value as Category)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              category === cat.value
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20">
            <h3 className="font-semibold text-sm text-gray-900 mb-4 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Max Price (NZD)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 1000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Condition</label>
                <div className="space-y-1.5">
                  {CONDITION_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        condition === c ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Sort by</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* AI Summary */}
          {data?.ai_summary && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex gap-3">
              <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{data.ai_summary}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-400 text-sm">Finding the best deals...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Results header */}
          {!loading && data && (
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{sortedResults.length}</span> results for{' '}
                <span className="font-semibold text-gray-900">"{query}"</span>
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && sortedResults.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedResults.map((result) => (
                <DealCard key={result.product.id} result={result} />
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && data && sortedResults.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">No results found for "{query}".</p>
              <p className="text-sm text-gray-400 mt-2">Try different search terms or browse by category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
