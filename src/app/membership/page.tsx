import Link from 'next/link'
import { Check, ArrowRight, ShieldCheck } from 'lucide-react'

const FEATURES = [
  'Search across 14 NZ retailers at once',
  'AI-powered deal scoring and summaries',
  'Watchlist with price drop alerts',
  'Hold offers for 24 hours',
  'Finance, delivery and bonus deal comparison',
  'Cars, whiteware, electronics and more',
  'No commission taken from retailers',
  'No sponsored results, ever',
  'Cancel any time',
]

const FAQS = [
  {
    q: 'How is this different from Google Shopping or PriceMe?',
    a: 'We go beyond price. We score the full deal including delivery, finance rates, warranty, and bonus offers like airpoints. We also never take commission from retailers or promote paid listings, so results are purely ranked on value for you.',
  },
  {
    q: 'Do retailers know I am searching?',
    a: 'No. You browse anonymously until you choose to act on an offer. At that point we introduce you to the retailer directly and step back completely.',
  },
  {
    q: 'What happens after I am introduced to a retailer?',
    a: 'The transaction, payment, and any finance arrangements are entirely between you and the retailer. We are not part of the deal and take no cut.',
  },
  {
    q: 'Can I cancel my membership?',
    a: 'Yes, any time. No lock-in, no cancellation fee. Your access continues until the end of the billing period.',
  },
  {
    q: 'What categories are covered?',
    a: 'Whiteware, electronics, cars, furniture, outdoor, tools and appliances. Any new item over $200 from a registered NZ retailer.',
  },
]

export default function MembershipPage() {
  return (
    <div className="bg-[#FAFAF8]">

      {/* Hero */}
      <section className="bg-ink-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="label text-white/40 mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            One membership.<br />
            <span className="text-clay-400">Unlimited access.</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Like Costco. You pay for access. We never take a cut from retailers. Our only incentive is to find you the best possible deal.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 mb-16">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Monthly */}
          <div className="card p-8">
            <p className="label mb-3">Monthly</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-black text-ink-900">$19</span>
              <span className="text-ink-400 text-sm">.99 / month</span>
            </div>
            <p className="text-sm text-ink-400 mb-6">Cancel any time</p>
            <Link href="/auth" className="btn-primary w-full mb-6">
              Start 14-day free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <ul className="space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <Check className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Annual */}
          <div className="card p-8 border-clay-300 ring-1 ring-clay-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-clay-500 text-white text-2xs font-bold px-2.5 py-1 rounded-full">
              SAVE 25%
            </div>
            <p className="label mb-3">Annual</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-black text-ink-900">$179</span>
              <span className="text-ink-400 text-sm">/ year</span>
            </div>
            <p className="text-sm text-ink-400 mb-6">Just $14.92 per month</p>
            <Link href="/auth" className="btn-accent w-full mb-6">
              Start 14-day free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <ul className="space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <Check className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-ink-400">
          <ShieldCheck className="w-4 h-4 text-sage-500" />
          14-day free trial. No credit card required to start.
        </div>
      </section>

      {/* What makes us different */}
      <section className="bg-white border-t border-b border-ink-100 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="label text-center mb-3">Our promise</p>
          <h2 className="text-2xl font-black text-ink-900 text-center mb-10">What you will never see on DealFind</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'No sponsored results', body: 'Retailers cannot pay to appear higher in results. Rankings are 100% based on deal quality.' },
              { title: 'No commission', body: 'We do not take a cut from retailers when you buy. Our only revenue is your membership fee.' },
              { title: 'No data harvesting', body: 'We do not sell your search history or purchasing behaviour to retailers or advertisers.' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-10 h-10 bg-sage-50 border border-sage-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-sage-600" />
                </div>
                <h3 className="font-bold text-ink-900 text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-ink-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="label text-center mb-3">FAQ</p>
        <h2 className="text-2xl font-black text-ink-900 text-center mb-10">Common questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border-b border-ink-100 pb-6">
              <h3 className="font-semibold text-ink-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-16 rounded-3xl bg-ink-900 text-white text-center py-14 px-6">
        <h2 className="text-2xl font-black mb-3">Ready to stop overpaying?</h2>
        <p className="text-white/60 mb-6 text-sm">Start your 14-day free trial. No credit card needed.</p>
        <Link href="/auth" className="btn-accent">
          Get started free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
