import Link from 'next/link'
import { SearchBar } from '@/components/search/SearchBar'
import { ArrowRight, ShieldCheck, Zap, Clock, TrendingDown } from 'lucide-react'

const CATEGORIES = [
  {
    label: 'Whiteware',
    slug: 'whiteware',
    description: 'Washing machines, fridges, dryers and more',
    gradient: 'from-blue-50 to-sky-100',
    accent: 'text-blue-600',
    count: '1,200+ deals',
  },
  {
    label: 'Electronics',
    slug: 'electronics',
    description: 'TVs, laptops, phones, cameras',
    gradient: 'from-violet-50 to-purple-100',
    accent: 'text-violet-600',
    count: '3,400+ deals',
  },
  {
    label: 'Cars',
    slug: 'cars',
    description: 'New and near-new from dealers',
    gradient: 'from-clay-50 to-orange-100',
    accent: 'text-clay-600',
    count: '800+ deals',
  },
  {
    label: 'Furniture',
    slug: 'furniture',
    description: 'Sofas, beds, dining and storage',
    gradient: 'from-amber-50 to-yellow-100',
    accent: 'text-amber-600',
    count: '900+ deals',
  },
  {
    label: 'Outdoor',
    slug: 'outdoor',
    description: 'BBQs, garden, patio furniture',
    gradient: 'from-sage-50 to-green-100',
    accent: 'text-sage-600',
    count: '600+ deals',
  },
  {
    label: 'Tools',
    slug: 'tools',
    description: 'Power tools, hand tools, hardware',
    gradient: 'from-slate-50 to-gray-100',
    accent: 'text-slate-600',
    count: '700+ deals',
  },
]

const TRENDING = [
  { label: 'Samsung 8kg front loader', price: '$1,149', retailer: 'Harvey Norman', deal: 'great', saving: '$200' },
  { label: 'LG 65" OLED TV', price: '$2,299', retailer: 'Noel Leeming', deal: 'good', saving: '$400' },
  { label: 'Fisher & Paykel 519L fridge', price: '$1,899', retailer: 'Bond & Bond', deal: 'great', saving: '$300' },
  { label: 'Bosch 9kg heat pump dryer', price: '$1,549', retailer: 'Harvey Norman', deal: 'good', saving: '$150' },
  { label: 'Toyota RAV4 Hybrid 2023', price: '$49,990', retailer: 'Toyota NZ', deal: 'fair', saving: null },
  { label: 'MacBook Air M3 15"', price: '$2,699', retailer: 'PB Tech', deal: 'great', saving: '$200' },
]

const DEAL_COLORS: Record<string, string> = {
  great: 'bg-sage-50 text-sage-700 border-sage-200',
  good: 'bg-blue-50 text-blue-700 border-blue-200',
  fair: 'bg-amber-50 text-amber-700 border-amber-200',
}

const DEAL_LABELS: Record<string, string> = {
  great: 'Great deal',
  good: 'Good deal',
  fair: 'Fair price',
}

export default function HomePage() {
  return (
    <div className="bg-[#FAFAF8]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 opacity-90" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(224,114,72,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(107,164,132,0.1) 0%, transparent 40%)'
        }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white/80 mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-pulse" />
              Membership platform. New items only. $200 minimum.
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              The best deal,<br />
              <span className="text-clay-400">every time.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed max-w-xl">
              Tell us what you want. We make retailers compete for your business across whiteware, electronics, cars and more.
            </p>

            <div className="max-w-2xl">
              <SearchBar size="large" />
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {['Samsung washing machine', 'LG 65 inch TV', 'Heat pump under $3000', 'Toyota RAV4'].map((s) => (
                <a
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="text-xs text-white/50 hover:text-white/80 transition-colors bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {[
              { value: '6,500+', label: 'Active deals' },
              { value: '14', label: 'Retailers' },
              { value: '$0', label: 'Commission ever' },
              { value: '24h', label: 'Offer hold time' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-black text-ink-900">{stat.value}</p>
                <p className="text-xs text-ink-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="label mb-1">Browse</p>
            <h2 className="text-2xl font-black text-ink-900">What are you looking for?</h2>
          </div>
          <Link href="/search" className="text-sm font-semibold text-clay-500 hover:text-clay-600 flex items-center gap-1 transition-colors">
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} p-6 border border-white hover:shadow-card-hover transition-all duration-300`}
            >
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${cat.accent} opacity-60`}>
                {cat.count}
              </p>
              <h3 className="text-lg font-black text-ink-900 mb-1">{cat.label}</h3>
              <p className="text-sm text-ink-500 leading-snug">{cat.description}</p>
              <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Browse deals
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending deals */}
      <section className="bg-white border-t border-b border-ink-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label mb-1">Right now</p>
              <h2 className="text-2xl font-black text-ink-900">Trending deals</h2>
            </div>
            <Link href="/search" className="text-sm font-semibold text-clay-500 hover:text-clay-600 flex items-center gap-1 transition-colors">
              See all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRENDING.map((item, i) => (
              <Link
                key={i}
                href={`/search?q=${encodeURIComponent(item.label)}`}
                className="card group p-5 flex flex-col gap-3 cursor-pointer"
              >
                {/* Category color strip */}
                <div className={`h-1 w-12 rounded-full ${i % 3 === 0 ? 'bg-clay-400' : i % 3 === 1 ? 'bg-violet-400' : 'bg-sage-400'}`} />

                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-ink-900 leading-snug group-hover:text-clay-600 transition-colors line-clamp-2">
                    {item.label}
                  </h3>
                  <span className={`flex-shrink-0 text-2xs font-bold px-2 py-0.5 rounded-full border ${DEAL_COLORS[item.deal]}`}>
                    {DEAL_LABELS[item.deal]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-black text-ink-900">{item.price}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{item.retailer}</p>
                  </div>
                  {item.saving && (
                    <div className="text-right">
                      <p className="text-xs font-semibold text-sage-600 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Save {item.saving}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="label mb-2">The process</p>
          <h2 className="text-3xl font-black text-ink-900">A smarter way to buy.</h2>
          <p className="text-ink-400 mt-3 max-w-xl mx-auto">
            Stop spending weekends comparing prices. Tell us what you want and let retailers come to you.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Zap, step: '01', title: 'Tell us what you want', body: 'Search in plain English. Our AI understands exactly what you are looking for, even if you are not sure of the brand or model.' },
            { icon: TrendingDown, step: '02', title: 'We find the best offers', body: 'We pull live prices and deals from 14 NZ retailers. Not just the cheapest price, the best full deal including finance, delivery, and extras.' },
            { icon: Clock, step: '03', title: 'Hold for 24 hours', body: 'Not ready to decide? Hold any offer for 24 hours while you think it over. No pressure, no pushy calls.' },
            { icon: ShieldCheck, step: '04', title: 'Deal done your way', body: 'Once introduced, you deal directly with the retailer. We step back completely. No commission, no tracking, no middleman cut.' },
          ].map((step) => (
            <div key={step.step} className="relative">
              <div className="w-10 h-10 bg-ink-900 rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-4xl font-black text-ink-100 absolute top-0 right-0">{step.step}</p>
              <h3 className="font-bold text-ink-900 mb-2">{step.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership CTA */}
      <section className="mx-6 mb-16 rounded-3xl bg-ink-900 overflow-hidden relative">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(224,114,72,0.2) 0%, transparent 60%)'
        }} />
        <div className="relative max-w-4xl mx-auto px-8 py-16 text-center">
          <p className="label text-white/40 mb-3">Membership</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            One flat fee.<br />
            <span className="text-clay-400">Unlimited access.</span>
          </h2>
          <p className="text-white/60 mb-3 max-w-lg mx-auto">
            Like Costco. You pay for the membership. We never take commission from sellers or push sponsored results. Ever.
          </p>
          <p className="text-white/40 text-sm mb-8">
            14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth" className="btn-accent">
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/membership" className="btn-secondary bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/40">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
