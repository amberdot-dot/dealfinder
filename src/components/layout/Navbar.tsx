'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Heart, User, Menu, X, ChevronDown } from 'lucide-react'

const CATEGORIES = [
  { label: 'Whiteware', slug: 'whiteware' },
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Cars', slug: 'cars' },
  { label: 'Furniture', slug: 'furniture' },
  { label: 'Outdoor', slug: 'outdoor' },
  { label: 'Tools', slug: 'tools' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-soft border-b border-ink-100' : 'border-b border-ink-100'}`}>
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-ink-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">D</span>
            </div>
            <span className="font-bold text-ink-900 text-base tracking-tight">DealFind</span>
            <span className="text-clay-500 text-xs font-semibold">NZ</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {/* Categories dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-50 transition-colors"
              >
                Browse
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {categoryOpen && (
                <div
                  onMouseEnter={() => setCategoryOpen(true)}
                  onMouseLeave={() => setCategoryOpen(false)}
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-ink-100 rounded-2xl shadow-card-hover p-2 animate-scale-in"
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/search?category=${cat.slug}`}
                      className="block px-3 py-2 text-sm text-ink-600 hover:text-ink-900 hover:bg-ink-50 rounded-xl transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/membership" className="px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-50 transition-colors">
              Membership
            </Link>

            <Link href="/search" className="px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-50 transition-colors flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Search
            </Link>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-50 transition-colors">
              <Heart className="w-4 h-4" />
              Watchlist
            </Link>
            <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-50 transition-colors">
              <User className="w-4 h-4" />
              Account
            </Link>
            <Link href="/auth" className="btn-primary ml-2">
              Join free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-ink-500 rounded-lg hover:bg-ink-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink-100 bg-white px-6 py-4 space-y-1">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/search?category=${cat.slug}`} className="block px-3 py-2.5 text-sm text-ink-600 rounded-xl hover:bg-ink-50">
              {cat.label}
            </Link>
          ))}
          <div className="border-t border-ink-100 my-2 pt-2">
            <Link href="/dashboard" className="block px-3 py-2.5 text-sm text-ink-600 rounded-xl hover:bg-ink-50">Watchlist</Link>
            <Link href="/dashboard" className="block px-3 py-2.5 text-sm text-ink-600 rounded-xl hover:bg-ink-50">Account</Link>
            <Link href="/membership" className="block px-3 py-2.5 text-sm text-ink-600 rounded-xl hover:bg-ink-50">Membership</Link>
            <Link href="/auth" className="block mt-2 btn-primary text-center">Join free</Link>
          </div>
        </div>
      )}
    </header>
  )
}
