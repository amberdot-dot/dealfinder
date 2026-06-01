import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'DealFind NZ | The best deal, every time.',
  description: 'A membership platform that makes retailers compete for your business. Find the best deal on anything over $200 across New Zealand.',
  keywords: 'best deal NZ, price comparison NZ, whiteware deals, buy car NZ, membership platform NZ',
  openGraph: {
    title: 'DealFind NZ',
    description: 'The best deal, every time.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-ink-100 bg-white mt-24">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-ink-900 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-black">D</span>
                  </div>
                  <span className="font-bold text-ink-900 text-base">DealFind</span>
                  <span className="text-clay-500 text-xs font-semibold">NZ</span>
                </div>
                <p className="text-sm text-ink-400 leading-relaxed">
                  Making retailers compete for your business since 2024.
                </p>
              </div>
              <div>
                <p className="label mb-3">Browse</p>
                <ul className="space-y-2 text-sm text-ink-500">
                  <li><a href="/search?category=whiteware" className="hover:text-ink-900 transition-colors">Whiteware</a></li>
                  <li><a href="/search?category=electronics" className="hover:text-ink-900 transition-colors">Electronics</a></li>
                  <li><a href="/search?category=cars" className="hover:text-ink-900 transition-colors">Cars</a></li>
                  <li><a href="/search?category=furniture" className="hover:text-ink-900 transition-colors">Furniture</a></li>
                </ul>
              </div>
              <div>
                <p className="label mb-3">Account</p>
                <ul className="space-y-2 text-sm text-ink-500">
                  <li><a href="/auth" className="hover:text-ink-900 transition-colors">Sign in</a></li>
                  <li><a href="/membership" className="hover:text-ink-900 transition-colors">Membership</a></li>
                  <li><a href="/dashboard" className="hover:text-ink-900 transition-colors">My watchlist</a></li>
                  <li><a href="/dashboard" className="hover:text-ink-900 transition-colors">My offers</a></li>
                </ul>
              </div>
              <div>
                <p className="label mb-3">Company</p>
                <ul className="space-y-2 text-sm text-ink-500">
                  <li><a href="#" className="hover:text-ink-900 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-ink-900 transition-colors">How it works</a></li>
                  <li><a href="#" className="hover:text-ink-900 transition-colors">For retailers</a></li>
                  <li><a href="#" className="hover:text-ink-900 transition-colors">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-ink-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ink-300">2024 DealFind NZ. Subscription-based. Independent. No commission.</p>
              <p className="text-xs text-ink-300">Prices sourced from Harvey Norman, Noel Leeming, Trade Me, PB Tech and more.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
