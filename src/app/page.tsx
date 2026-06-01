import Link from 'next/link'
import { SearchBar } from '@/components/search/SearchBar'
import { ShieldCheck, Users, Clock, TrendingDown } from 'lucide-react'

const CATEGORIES = [
  { label: 'Whiteware', slug: 'whiteware', icon: '○' },
  { label: 'Electronics', slug: 'electronics', icon: '○' },
  { label: 'Cars', slug: 'cars', icon: '○' },
  { label: 'Property', slug: 'property', icon: '○' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell us what you want',
    description: 'Search for what you need. Most people already know what they are looking for. We find who can deliver it best.',
  },
  {
    step: '02',
    title: 'Retailers compete for your business',
    description: 'We pull offers from across the market. Sellers present their best price, finance rate, delivery terms, and bonus deals.',
  },
  {
    step: '03',
    title: 'Accept, decline, or hold',
    description: 'Review your offers and decide. You can hold an offer for 24 hours while you consider. No pressure, no pushy salespeople.',
  },
  {
    step: '04',
    title: 'Deal done independently',
    description: 'Once introduced, you deal directly. We are not part of the transaction, the payment, or the finance. Clean and simple.',
  },
]

const FEATURES = [
  {
    icon: TrendingDown,
    title: 'The best possible deal, not just the price',
    description: 'We factor in delivery, finance rates, bonus points, airpoints, and special offers. The full picture, not just the sticker price.',
  },
  {
    icon: Users,
    title: 'Retailers compete for you',
    description: 'Instead of you shopping around, sellers come to you with their best offer. That is how you get a better deal.',
  },
  {
    icon: ShieldCheck,
    title: 'Completely independent',
    description: 'We do not collect commission, harvest your data, or push deals from certain sellers. Our only income is your membership. That is it.',
  },
  {
    icon: Clock,
    title: 'Saves you time and travel',
    description: 'No driving between stores. No spending hours comparing websites. One place, multiple offers, fast decision.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-medium text-sky-400 tracking-widest uppercase mb-5">
            Membership platform
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Finding the best deal<br />
            <span className="text-sky-400">for consumers.</span>
          </h1>
          <p className="text-lg text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            We make retailers compete for your business. Whiteware, electronics, cars, and more. Tell us what you want and we find who can deliver the best possible deal.
          </p>
          <p className="text-sm text-gray-500 mb-10">
            Not just price. Delivery, finance rates, bonus points, airpoints, and special offers.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar size="large" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Browse by category</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/search?category=${cat.slug}`}
                className="border border-gray-200 rounded-xl p-5 text-center hover:border-sky-400 hover:bg-sky-50 transition-all group"
              >
                <span className="block text-sm font-semibold text-gray-700 group-hover:text-sky-700">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">How it works</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-10">A new way of buying.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="relative">
              <p className="text-4xl font-black text-gray-100 mb-3">{step.step}</p>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 border-t border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Why this works</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-10">The way we buy things needs to change.</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Membership</p>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          One flat membership. No commission. No catches.
        </h2>
        <p className="text-gray-500 mb-3 max-w-xl mx-auto">
          Like Costco or Amazon Prime. You pay for access to the platform. We never take a cut from sellers or share your data. Our interests are fully aligned with yours.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Once you are introduced to a seller, the transaction is entirely between you. We are not part of the deal, the payment, or the finance arrangements.
        </p>
        <Link
          href="/auth"
          className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm tracking-wide"
        >
          Join the membership
        </Link>
      </section>
    </>
  )
}
