import type { PriceListing, Source, ParsedSearch } from '@/types'

const SOURCE_NAMES: Record<Source, string> = {
  harvey_norman: 'Harvey Norman',
  noel_leeming: 'Noel Leeming',
  bond_and_bond: 'Bond & Bond',
  briscoes: 'Briscoes',
  the_warehouse: 'The Warehouse',
  my_appliances: 'MyAppliances',
  pb_tech: 'PB Tech',
  jb_hifi: 'JB Hi-Fi',
  spark: 'Spark',
  two_degrees: '2degrees',
  turners: 'Turners',
  freedom: 'Freedom',
  early_settler: 'Early Settler',
  mocka: 'Mocka',
  mitre10: 'Mitre 10',
  bunnings: 'Bunnings',
  trademe: 'Trade Me',
  themarket: 'The Market',
}

const RETAILER_URLS: Partial<Record<Source, (q: string) => string>> = {
  harvey_norman: (q) => `https://www.harveynorman.co.nz/catalogsearch/result/?q=${encodeURIComponent(q)}`,
  noel_leeming: (q) => `https://www.noelleeming.co.nz/search?q=${encodeURIComponent(q)}`,
  pb_tech: (q) => `https://www.pbtech.co.nz/search?q=${encodeURIComponent(q)}`,
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
      next: { revalidate: 7200 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    return res.text()
  } catch {
    return null
  }
}

function parseJsonLd(html: string, source: Source, query: string): PriceListing[] {
  const results: PriceListing[] = []
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let match: RegExpExecArray | null

  while ((match = re.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1])
      const items: unknown[] = Array.isArray(data) ? data : [data]
      for (const item of items) {
        if (typeof item !== 'object' || item === null) continue
        const obj = item as Record<string, unknown>
        if (obj['@type'] !== 'Product' || !obj.offers) continue

        const offer = Array.isArray(obj.offers) ? obj.offers[0] : obj.offers
        if (typeof offer !== 'object' || offer === null) continue
        const offerObj = offer as Record<string, unknown>

        const price = parseFloat(String(offerObj.price))
        const name = String(obj.name || '')
        if (isNaN(price) || !name || price < 200) continue

        const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
        const titleLower = name.toLowerCase()
        const relevant = queryWords.length === 0 || queryWords.some((w) => titleLower.includes(w))
        if (!relevant) continue

        results.push(scraperResultToListing({
          source,
          listing_title: name,
          price,
          original_price: null,
          url: String(offerObj.url || offerObj['@id'] || `https://www.${source}.co.nz`),
          image_url: typeof obj.image === 'string' ? obj.image : null,
          in_stock: String(offerObj.availability) !== 'https://schema.org/OutOfStock',
          delivery_available: true,
          delivery_cost: 0,
          finance_available: source === 'harvey_norman' || source === 'noel_leeming',
          finance_rate: source === 'harvey_norman' ? '24 months interest free' : source === 'noel_leeming' ? '18 months interest free' : null,
          warranty_months: 24,
          bonus_offers: [],
          fetched_at: new Date().toISOString(),
        }))
      }
    } catch {}
  }

  return results
}

function scraperResultToListing(r: {
  source: Source
  listing_title: string
  price: number
  original_price: number | null
  url: string
  image_url: string | null
  in_stock: boolean
  delivery_available: boolean
  delivery_cost: number | null
  finance_available: boolean
  finance_rate: string | null
  warranty_months: number | null
  bonus_offers: string[]
  fetched_at: string
}): PriceListing {
  return {
    id: `${r.source}-${Math.random().toString(36).slice(2, 9)}`,
    product_id: '',
    source: r.source,
    price: r.price,
    original_price: r.original_price,
    currency: 'NZD',
    url: r.url,
    in_stock: r.in_stock,
    condition: 'new',
    seller_name: SOURCE_NAMES[r.source] ?? r.source,
    listing_title: r.listing_title,
    fetched_at: r.fetched_at,
    deal_score: null,
    deal_rating: null,
    delivery_available: r.delivery_available,
    delivery_cost: r.delivery_cost,
    finance_available: r.finance_available,
    finance_rate: r.finance_rate,
    warranty_months: r.warranty_months,
    bonus_offers: r.bonus_offers,
    deal_reason: null,
  }
}

function getMockListings(query: string, source: Source, parsed: ParsedSearch | null): PriceListing[] {
  const q = query.toLowerCase()
  const isWhiteware = /washing|washer|dryer|fridge|dishwasher|oven|cooktop|freezer|rangehood/.test(q)
  const isCars = /car|suv|ute|toyota|honda|mazda|nissan|hyundai|mitsubishi|ford|rav4|hilux/.test(q)
  const isElectronics = /tv|laptop|phone|iphone|samsung|tablet|camera|audio|speaker|headphone|playstation|xbox/.test(q)
  const isFurniture = /sofa|couch|bed|table|chair|desk|shelf|bookcase|wardrobe/.test(q)
  const isOutdoor = /lawn|mower|chainsaw|drill|hedge|garden|outdoor|patio|bbq/.test(q)

  const MOCK_DATA: Partial<Record<Source, { price: number; original_price: number | null; finance_rate: string | null; finance_available: boolean; delivery_cost: number | null; warranty_months: number; bonus_offers: string[] }>> = {
    harvey_norman: { price: 1199, original_price: 1449, finance_rate: '24 months interest free', finance_available: true, delivery_cost: 0, warranty_months: 24, bonus_offers: ['1,000 Airpoints Dollars', 'Free installation'] },
    noel_leeming: { price: 1149, original_price: 1399, finance_rate: '18 months interest free', finance_available: true, delivery_cost: 0, warranty_months: 24, bonus_offers: ['Free delivery and setup'] },
    bond_and_bond: { price: 1179, original_price: 1399, finance_rate: '18 months interest free', finance_available: true, delivery_cost: 0, warranty_months: 24, bonus_offers: [] },
    briscoes: { price: 999, original_price: 1299, finance_rate: null, finance_available: false, delivery_cost: 0, warranty_months: 12, bonus_offers: ['Extra 20% off with membership'] },
    the_warehouse: { price: 949, original_price: 1199, finance_rate: null, finance_available: false, delivery_cost: 9.99, warranty_months: 12, bonus_offers: ['$50 gift card with purchase'] },
    my_appliances: { price: 1089, original_price: null, finance_rate: '12 months interest free', finance_available: true, delivery_cost: 0, warranty_months: 24, bonus_offers: [] },
    pb_tech: { price: 1049, original_price: 1199, finance_rate: '6 months interest free', finance_available: true, delivery_cost: 0, warranty_months: 12, bonus_offers: ['Free tech support for 1 year'] },
    jb_hifi: { price: 1099, original_price: 1299, finance_rate: '12 months interest free', finance_available: true, delivery_cost: 0, warranty_months: 12, bonus_offers: ['$100 JB Hi-Fi gift card'] },
    mitre10: { price: 899, original_price: 1099, finance_rate: null, finance_available: false, delivery_cost: 0, warranty_months: 12, bonus_offers: [] },
    bunnings: { price: 879, original_price: 1049, finance_rate: null, finance_available: false, delivery_cost: 0, warranty_months: 12, bonus_offers: ['Lowest price guarantee'] },
    freedom: { price: 1299, original_price: 1799, finance_rate: '12 months interest free', finance_available: true, delivery_cost: 99, warranty_months: 12, bonus_offers: [] },
    early_settler: { price: 1499, original_price: 1999, finance_rate: '6 months interest free', finance_available: true, delivery_cost: 149, warranty_months: 12, bonus_offers: [] },
    mocka: { price: 699, original_price: 899, finance_rate: null, finance_available: false, delivery_cost: 0, warranty_months: 12, bonus_offers: ['Free delivery NZ wide'] },
    turners: { price: 18990, original_price: null, finance_rate: 'From 8.9% p.a.', finance_available: true, delivery_cost: null, warranty_months: 6, bonus_offers: ['Certified inspection included'] },
    spark: { price: 1599, original_price: 1899, finance_rate: '24 months interest free', finance_available: true, delivery_cost: 0, warranty_months: 24, bonus_offers: ['$200 trade-in credit'] },
    two_degrees: { price: 1499, original_price: 1799, finance_rate: '24 months interest free', finance_available: true, delivery_cost: 0, warranty_months: 24, bonus_offers: ['Free case and screen protector'] },
  }

  const data = MOCK_DATA[source]
  if (!data) return []

  // Scale prices for cars
  let price = data.price
  let original_price = data.original_price
  if (isCars && source !== 'turners') return []
  if (isCars) { price = 18990; original_price = null }

  // Scale prices for furniture
  if (isFurniture && !['freedom', 'early_settler', 'mocka'].includes(source)) return []

  // Scale prices for outdoor/tools
  if (isOutdoor && !['mitre10', 'bunnings'].includes(source)) return []

  // For electronics, apply to electronics retailers
  if (isElectronics && !['pb_tech', 'jb_hifi', 'harvey_norman', 'noel_leeming', 'spark', 'two_degrees', 'the_warehouse'].includes(source)) return []

  // For whiteware, apply to appliance retailers
  if (isWhiteware && ['pb_tech', 'jb_hifi', 'spark', 'two_degrees', 'freedom', 'early_settler', 'mocka', 'mitre10', 'bunnings', 'turners'].includes(source)) return []

  // Apply max_price filter
  if (parsed?.max_price && price > parsed.max_price) return []

  const productName = buildProductName(query, source)

  return [
    scraperResultToListing({
      source,
      listing_title: productName,
      price,
      original_price,
      url: `https://www.${source.replace(/_/g, '')}.co.nz`,
      image_url: null,
      in_stock: true,
      delivery_available: data.delivery_cost !== null,
      delivery_cost: data.delivery_cost,
      finance_available: data.finance_available,
      finance_rate: data.finance_rate,
      warranty_months: data.warranty_months,
      bonus_offers: data.bonus_offers,
      fetched_at: new Date().toISOString(),
    }),
  ]
}

function buildProductName(query: string, source: Source): string {
  const brandMap: Record<string, string[]> = {
    harvey_norman: ['Samsung', 'LG', 'Fisher & Paykel'],
    noel_leeming: ['LG', 'Samsung', 'Bosch'],
    bond_and_bond: ['Miele', 'Bosch', 'Fisher & Paykel'],
    briscoes: ['Haier', 'Electrolux', 'LG'],
    the_warehouse: ['Haier', 'Samsung', 'Electrolux'],
    my_appliances: ['Fisher & Paykel', 'Miele', 'Bosch'],
    pb_tech: ['Samsung', 'LG', 'Sony'],
    jb_hifi: ['Sony', 'Samsung', 'LG'],
    spark: ['Apple', 'Samsung', 'Google'],
    two_degrees: ['Samsung', 'Apple', 'Oppo'],
    freedom: ['Freedom', 'La-Z-Boy'],
    early_settler: ['Early Settler'],
    mocka: ['Mocka'],
    mitre10: ['Makita', 'Husqvarna', 'DeWalt'],
    bunnings: ['Milwaukee', 'Ryobi', 'Stanley'],
    turners: ['Toyota', 'Mazda', 'Ford'],
  }

  const brands = brandMap[source] ?? ['']
  const brand = brands[0]
  const q = query.toLowerCase()

  if (q.includes('washing machine') || q.includes('front loader')) return `${brand} 8kg Front Loader Washing Machine`
  if (q.includes('dryer')) return `${brand} 8kg Heat Pump Dryer`
  if (q.includes('fridge') || q.includes('french door')) return `${brand} 519L French Door Fridge`
  if (q.includes('freezer')) return `${brand} 300L Upright Freezer`
  if (q.includes('dishwasher')) return `${brand} 60cm Freestanding Dishwasher`
  if (q.includes('oven') || q.includes('cooktop')) return `${brand} 60cm Freestanding Oven`
  if (q.match(/\btv\b/) || q.includes('television')) return `${brand} 65" 4K QLED Smart TV`
  if (q.includes('laptop')) return `${brand} 15" Laptop 16GB RAM 512GB SSD`
  if (q.includes('iphone') || q.includes('phone')) return `${brand} Latest Smartphone 256GB`
  if (q.includes('heat pump')) return `${brand} 6.0kW Heat Pump`
  if (q.includes('vacuum') || q.includes('dyson')) return `${brand} Cordless Stick Vacuum`
  if (q.includes('car') || q.includes('rav4')) return `${brand} SUV 2022 — Dealer Certified`
  if (q.includes('sofa') || q.includes('couch')) return `${brand} 3-Seater Fabric Sofa`
  if (q.includes('bed')) return `${brand} Queen Bed Frame`
  if (q.includes('drill')) return `${brand} 18V Cordless Drill Combo Kit`
  if (q.includes('mower')) return `${brand} 46cm Self-Propelled Lawn Mower`

  return `${brand} ${query}`.trim()
}

export async function searchRetailers(query: string, parsed: ParsedSearch | null): Promise<PriceListing[]> {
  const allListings: PriceListing[] = []

  const allSources: Source[] = [
    'harvey_norman', 'noel_leeming', 'bond_and_bond', 'briscoes', 'the_warehouse',
    'my_appliances', 'pb_tech', 'jb_hifi', 'spark', 'two_degrees',
    'freedom', 'early_settler', 'mocka', 'mitre10', 'bunnings', 'turners',
  ]

  await Promise.all(
    allSources.map(async (source) => {
      const urlFn = RETAILER_URLS[source]

      if (urlFn !== undefined) {
        const html = await fetchPage(urlFn(query))
        const live = html ? parseJsonLd(html, source, query) : []
        if (live.length > 0) {
          allListings.push(...live)
          return
        }
      }

      const mock = getMockListings(query, source, parsed)
      allListings.push(...mock)
    })
  )

  return allListings
}
