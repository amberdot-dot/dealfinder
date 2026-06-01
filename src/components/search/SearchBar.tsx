'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'

const SUGGESTIONS = [
  'Samsung washing machine',
  'Fisher & Paykel fridge',
  'LG dishwasher',
  'Bosch dryer',
  'Toyota Corolla',
  'iPhone 15',
  'MacBook Air',
  'Miele washing machine',
  'Honda CRV',
  'Haier freezer',
  'Sony TV 65 inch',
  'Toyota RAV4',
]

interface SearchBarProps {
  initialQuery?: string
  size?: 'default' | 'large'
}

export function SearchBar({ initialQuery = '', size = 'default' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase()) && s !== query)

  function handleSubmit(q = query) {
    if (!q.trim()) return
    setLoading(true)
    setShowSuggestions(false)
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const isLarge = size === 'large'

  return (
    <div className="relative w-full">
      <div className={`flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-brand-500 ${isLarge ? 'shadow-lg' : 'shadow-sm'}`}>
        <Search className={`ml-4 text-gray-400 flex-shrink-0 ${isLarge ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Search washing machines, fridges, dryers..."
          className={`flex-1 outline-none text-gray-900 placeholder-gray-400 ${isLarge ? 'px-4 py-4 text-lg' : 'px-3 py-3 text-sm'}`}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={loading || !query.trim()}
          className={`flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-medium transition-colors flex-shrink-0 ${isLarge ? 'px-6 py-4 text-base' : 'px-4 py-3 text-sm'}`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isLarge ? 'Find Deals' : 'Search'}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && query.length > 1 && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
          {filtered.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              onMouseDown={() => { setQuery(suggestion); handleSubmit(suggestion) }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <Search className="w-3.5 h-3.5 text-gray-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
