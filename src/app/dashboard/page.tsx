'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Search, LogOut, Loader2, Plus, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { PriceAlert } from '@/types'

interface Offer {
  id: string
  title: string
  seller: string
  price: number
  extras: string[]
  status: 'pending' | 'accepted' | 'declined' | 'held'
  expires_at: string | null
}

// Mock offers for UI demonstration
const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Samsung 8kg Front Loader Washing Machine',
    seller: 'Harvey Norman',
    price: 1149,
    extras: ['Free delivery', '12 months interest free', '1000 Airpoints'],
    status: 'pending',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'LG 519L French Door Fridge',
    seller: 'Noel Leeming',
    price: 2299,
    extras: ['Free delivery and installation', 'Trade-in accepted'],
    status: 'held',
    expires_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
  },
]

const STATUS_CONFIG = {
  pending: { label: 'Awaiting response', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  held: { label: 'Held for 24 hours', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
  declined: { label: 'Declined', color: 'bg-gray-50 text-gray-500 border-gray-200', icon: XCircle },
}

function timeRemaining(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${mins}m remaining`
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'offers' | 'alerts' | 'searches'>('offers')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/auth'
        return
      }
      setUser({ email: data.user.email || '' })
    })
    fetchAlerts()
  }, [])

  async function fetchAlerts() {
    const res = await fetch('/api/alerts')
    if (res.ok) {
      const { alerts } = await res.json()
      setAlerts(alerts || [])
    }
    setLoading(false)
  }

  async function deleteAlert(id: string) {
    await fetch(`/api/alerts?id=${id}`, { method: 'DELETE' })
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  function updateOfferStatus(id: string, status: Offer['status']) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const pendingOffers = offers.filter((o) => o.status === 'pending' || o.status === 'held')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          {user && <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>}
          <p className="text-xs text-sky-600 font-medium mt-1 bg-sky-50 border border-sky-100 rounded-full px-2.5 py-0.5 inline-block">
            Active member
          </p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{pendingOffers.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Active offers</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Price alerts</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-xs text-gray-500 mt-0.5">Deals done</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {(['offers', 'alerts', 'searches'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Offers tab */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          {offers.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No offers yet"
              description="Search for something you want to buy and we will find the best offers for you."
              action={{ label: 'Start searching', href: '/search' }}
            />
          ) : (
            offers.map((offer) => {
              const status = STATUS_CONFIG[offer.status]
              const StatusIcon = status.icon
              return (
                <div key={offer.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{offer.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">from {offer.seller}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 flex-shrink-0 ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    ${offer.price.toLocaleString()} <span className="text-sm font-normal text-gray-400">NZD</span>
                  </p>

                  {offer.extras.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {offer.extras.map((extra) => (
                        <span key={extra} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
                          {extra}
                        </span>
                      ))}
                    </div>
                  )}

                  {offer.expires_at && (offer.status === 'pending' || offer.status === 'held') && (
                    <p className="text-xs text-amber-600 mb-4 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeRemaining(offer.expires_at)}
                    </p>
                  )}

                  {(offer.status === 'pending' || offer.status === 'held') && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOfferStatus(offer.id, 'accepted')}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                      >
                        Accept
                      </button>
                      {offer.status === 'pending' && (
                        <button
                          onClick={() => updateOfferStatus(offer.id, 'held')}
                          className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Hold 24h
                        </button>
                      )}
                      <button
                        onClick={() => updateOfferStatus(offer.id, 'declined')}
                        className="px-4 border border-gray-200 text-gray-400 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}

          <Link
            href="/search"
            className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-xl py-4 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Search for something new
          </Link>
        </div>
      )}

      {/* Alerts tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 py-8 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No price alerts"
              description="Search for a product and tap the bell icon to get notified when the price drops."
              action={{ label: 'Browse deals', href: '/search' }}
            />
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.product?.name || 'Product'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Alert when below <span className="font-semibold text-gray-700">${alert.target_price} NZD</span>
                  </p>
                </div>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-100 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Searches tab */}
      {activeTab === 'searches' && (
        <EmptyState
          icon={Search}
          title="No saved searches"
          description="Your recent searches will appear here."
          action={{ label: 'Start searching', href: '/search' }}
        />
      )}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description: string
  action: { label: string; href: string }
}) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
      <Icon className="w-8 h-8 text-gray-200 mx-auto mb-3" />
      <p className="font-semibold text-gray-700 text-sm mb-1">{title}</p>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <Link href={action.href} className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium">
        {action.label}
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
