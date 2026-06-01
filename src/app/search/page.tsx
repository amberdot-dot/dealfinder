'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { DealCard } from '@/components/product/DealCard'
import { Loader2, Sparkles, AlertCircle, Search, ArrowRight } from 'lucide-react'
import type { SearchResult } from '@/types'

const EXAMPLE_CHIPS = [
  'Front loader washing machine under $1200',
  '65 inch TV with good picture quality',
  'Toyota RAV4 under $35,000',
  'Heat pump for a two-bedroom house',
  'Laptop for university under $1500',
  'French door fridge with water dispenser',
]

interface SearchResponse {
  results: SearchResult[]
  ai_summary: string
  total: number
  query: string
  parsed_query: { summary: string; finance_required: boolean; category: string } | null
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [inputValue, setInputValue] = useState(initialQuery)
  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialQuery) {
      setInputValue(initialQuery)
      fetchResults(initialQuery)
    }
  }, [initialQuery])

  async function fetchResults(q: string) {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      if (!res.ok) throw new Error('Search failed')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(q?: string) {
    const query = (q ?? inputValue).trim()
    if (!query) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
    if (query === initialQuery) fetchResults(query)
  }

  const isEmpty = !loading && !data && !error && !initialQuery

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Search header */}
      <div className={`bg-ink-900 transition-all ${isEmpty ? 'py-24' : 'py-8'}`}>
        <div className="max-w-3xl mx-auto px-6">
          {isEmpty && (
            <div className="text-center mb-8">
              <p className="text-2xs font-bold text-clay-400 uppercase tracking-widest mb-4">AI-powered search</p>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                Tell us what<br />you want.
              </h1>
              <p className="text-white/50 text-base">
                Plain English. We find the best full deal across every major NZ retailer.
              </p>
            </div>
          )}

          <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-xl">
            <Search className="ml-4 w-5 h-5 text-ink-300 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="I need a front loader washing machine, quiet, under $1200..."
              className="flex-1 px-4 py-4 text-sm text-ink-900 placeholder-ink-300 outline-none"
              autoFocus={isEmpty}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !inputValue.trim()}
              className="flex items-center gap-2 bg-clay-500 hover:bg-clay-600 disabled:bg-ink-200 text-white font-semibold px-5 py-4 transition-colors flex-shrink-0 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Searching...' : 'Find Deals'}
            </button>
          </div>

          {isEmpty && (
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {EXAMPLE_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setInputValue(chip); handleSubmit(chip) }}
                  className="text-xs text-white/40 border border-white/10 hover:border-clay-400/50 hover:text-clay-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-clay-500" />
            <div className="text-center">
              <p className="text-ink-700 font-semibold">Finding the best deals...</p>
              <p className="text-ink-400 text-sm mt-1">Checking Harvey Norman, Noel Leeming, PB Tech and more</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm max-w-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {data?.ai_summary && (
          <div className="bg-white border border-ink-100 rounded-2xl p-5 mb-6 flex gap-3 max-w-4xl shadow-soft">
            <Sparkles className="w-4 h-4 text-clay-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-2xs font-bold text-clay-500 uppercase tracking-widest mb-1">Deal summary</p>
              <p className="text-sm text-ink-700 leading-relaxed">{data.ai_summary}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-ink-500">
              <span className="font-bold text-ink-900">{data.total}</span> results for{' '}
              <span className="font-bold text-ink-900">"{data.query}"</span>
              {data.parsed_query?.finance_required && (
                <span className="ml-2 text-2xs font-bold bg-sage-50 text-sage-700 border border-sage-200 px-2 py-0.5 rounded-full">Finance eligible</span>
              )}
            </p>
            <p className="text-xs text-ink-400">Ranked by full deal score</p>
          </div>
        )}

        {data && data.results.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.results.map((result, i) => (
              <DealCard key={result.product.id} result={result} rank={i + 1} />
            ))}
          </div>
        )}

        {data && data.results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-ink-500 font-semibold">No results found for "{data.query}"</p>
            <p className="text-sm text-ink-400 mt-2">Try different search terms or browse a category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
