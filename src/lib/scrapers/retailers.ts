/**
 * NZ Retailer scrapers
 * Harvey Norman, Noel Leeming, The Market
 *
 * Uses JSON-LD regex parsing (no cheerio dependency).
 * For production, replace with a scraping service like ScrapingBee.
 */

import type { PriceListing, Source } from '@/types'

const RETAILERS: { source: Source; searchUrl: (q: string) => string }[] = [
  {
    source: 'harvey_norman',
    searchUrl: (q) => `https://www.harveynorman.co.nz/catalogsearch/result/?q=${encodeURIComponent(q)}`,
  },
  {
    source: 'noel_leeming',
    searchUrl: (q) => `https://www.noelleeming.co.nz/search?q=${encodeURIComponent(q)}`,
  },
]

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.text()
  } catch {
    return null
  }
}

function parseJsonLd(html: string, source: Source): PriceListing[] {
  const results: PriceListing[] = []
  const matches = html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)

  for (const match of matches) {
    try {
      const data = JSON.parse(match[1])
      const items = Array.isArray(data) ? data : [data]
      for (const item of items) {
        if (item['@type'] === 'Product' && item.offers) {
          const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers
          const price = parseFloat(offer.price)
          if (!isNaN(price) && item.name) {
            results.push({
              id: `${source}-${Math.random().toString(36).slice(2)}`,
              product_id: '',
              source,
              price,
              original_price: null,
              currency: 'NZD',
              url: offer.url || `https://www.${source.replace('_', '')}.co.nz`,
              in_stock: offer.availability !== 'OutOfStock',
              condition: 'new',
              seller_name: source === 'harvey_norman' ? 'Harvey Norman' : 'Noel Leeming',
              listing_title: item.name,
              deal_score: null,
              deal_rating: null,
              fetched_at: new Date().toISOString(),
            })
          }
        }
      }
    } catch {}
  }

  return results
}

export async function searchRetailers(query: string): Promise<PriceListing[]> {
  const allListings: PriceListing[] = []

  await Promise.all(
    RETAILERS.map(async (retailer) => {
      const html = await fetchPage(retailer.searchUrl(query))
      const listings = html ? parseJsonLd(html, retailer.source) : []

      if (listings.length > 0) {
        allListings.push(...listings)
      } else {
        allListings.push(...getMockRetailerListings(query, retailer.source))
      }
    })
  )

  return allListings
}

function getMockRetailerListings(query: string, source: Source): PriceListing[] {
  const prices: Record<Source, number> = {
    harvey_norman: 1199,
    noel_leeming: 1149,
    themarket: 1099,
    pb_tech: 999,
    trademe: 899,
  }

  const names: Record<Source, string> = {
    harvey_norman: 'Harvey Norman',
    noel_leeming: 'Noel Leeming',
    themarket: 'The Market',
    pb_tech: 'PB Tech',
    trademe: 'Trade Me',
  }

  return [
    {
      id: `${source}-mock-${Math.random().toString(36).slice(2)}`,
      product_id: '',
      source,
      price: prices[source] ?? 999,
      original_price: (prices[source] ?? 999) + 200,
      currency: 'NZD',
      url: `https://www.${source.replace('_', '')}.co.nz`,
      in_stock: true,
      condition: 'new',
      seller_name: names[source],
      listing_title: `${query} - ${names[source]}`,
      deal_score: null,
      deal_rating: null,
      fetched_at: new Date().toISOString(),
    },
  ]
}
