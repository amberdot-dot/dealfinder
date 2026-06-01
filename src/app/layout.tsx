import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DealFind NZ | Finding the Best Deal for Consumers',
  description: 'A membership platform that makes retailers compete for your business. The best deal on whiteware, electronics, cars and more across New Zealand.',
  keywords: 'best deal NZ, price comparison NZ, whiteware deals, buy car NZ, membership platform NZ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-white">{children}</main>
        <footer className="bg-gray-900 text-gray-400 py-10 mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p className="font-semibold text-white mb-1">DealFind NZ</p>
            <p>Finding the best deal for consumers. Subscription-based. Independent. No commission.</p>
            <p className="mt-3 text-gray-600 text-xs">Prices sourced from Trade Me, Harvey Norman, Noel Leeming, Facebook Marketplace and more.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
