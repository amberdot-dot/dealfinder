'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Bell, User, Menu, X } from 'lucide-react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-white text-lg tracking-tight">DealFind</span>
            <span className="text-sky-400 text-xs font-medium">NZ</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link href="/alerts" className="text-sm text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <Bell className="w-4 h-4" />
              My Alerts
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <User className="w-4 h-4" />
              Account
            </Link>
            <Link
              href="/auth"
              className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Join membership
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-300"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-4 space-y-3">
          <Link href="/search" className="block text-sm text-gray-300 py-2">Search</Link>
          <Link href="/alerts" className="block text-sm text-gray-300 py-2">My Alerts</Link>
          <Link href="/dashboard" className="block text-sm text-gray-300 py-2">Account</Link>
          <Link href="/auth" className="block bg-sky-500 text-white text-sm font-medium px-4 py-2 rounded-lg text-center">Join membership</Link>
        </div>
      )}
    </nav>
  )
}
