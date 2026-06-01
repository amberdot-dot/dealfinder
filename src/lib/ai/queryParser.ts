import OpenAI from 'openai'
import type { ParsedSearch } from '@/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function parseSearchQuery(query: string): Promise<ParsedSearch> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
    return fallbackParse(query)
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a NZ shopping search parser. Extract structured search parameters from natural language queries. All prices in NZD. Categories: whiteware, washing-machines, dryers, fridges, dishwashers, ovens, rangehoods, electronics, tvs, laptops, phones, tablets, cameras, audio, gaming, cars, cars-under-10k, cars-10k-20k, cars-20k-40k, cars-40k-plus, electric-vehicles, furniture, outdoor, tools, vacuum-cleaners, air-conditioning, heat-pumps, water-heating, all. The summary field should be a one-sentence plain English description of what the user wants.`,
        },
        { role: 'user', content: query },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'parsed_search',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              keywords: { type: 'array', items: { type: 'string' } },
              max_price: { type: ['number', 'null'] },
              min_price: { type: 'number' },
              features: { type: 'array', items: { type: 'string' } },
              finance_required: { type: 'boolean' },
              delivery_required: { type: 'boolean' },
              brands_preferred: { type: 'array', items: { type: 'string' } },
              brands_excluded: { type: 'array', items: { type: 'string' } },
              condition: { type: 'string', enum: ['new'] },
              summary: { type: 'string' },
            },
            required: [
              'category', 'keywords', 'max_price', 'min_price', 'features',
              'finance_required', 'delivery_required', 'brands_preferred',
              'brands_excluded', 'condition', 'summary',
            ],
            additionalProperties: false,
          },
        },
      },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) return fallbackParse(query)
    return JSON.parse(content) as ParsedSearch
  } catch (err) {
    console.error('Query parse error:', err)
    return fallbackParse(query)
  }
}

function fallbackParse(query: string): ParsedSearch {
  const lower = query.toLowerCase()

  let category = 'all'
  if (lower.includes('washing machine') || lower.includes('front loader') || lower.includes('top loader')) category = 'washing-machines'
  else if (lower.includes('dryer') || lower.includes('tumble dry')) category = 'dryers'
  else if (lower.includes('fridge') || lower.includes('refrigerator') || lower.includes('freezer') || lower.includes('french door')) category = 'fridges'
  else if (lower.includes('dishwasher')) category = 'dishwashers'
  else if (lower.includes('oven') || lower.includes('cooktop') || lower.includes('stove') || lower.includes('rangehood')) category = 'ovens'
  else if (lower.match(/\btv\b/) || lower.includes('television') || lower.includes('oled') || lower.includes('qled')) category = 'tvs'
  else if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('notebook')) category = 'laptops'
  else if (lower.includes('iphone') || lower.includes('galaxy') || lower.includes('pixel') || (lower.includes('phone') && !lower.includes('headphone'))) category = 'phones'
  else if (lower.includes('heat pump')) category = 'heat-pumps'
  else if (lower.includes('vacuum') || lower.includes('dyson')) category = 'vacuum-cleaners'
  else if (lower.includes('car') || lower.includes('ute') || lower.includes('suv') || lower.includes('toyota') || lower.includes('honda') || lower.includes('rav4') || lower.includes('hilux')) category = 'cars'
  else if (lower.includes('sofa') || lower.includes('couch') || lower.includes('bed') || lower.includes('table') || lower.includes('chair')) category = 'furniture'

  const priceMatch = query.match(/\$?([\d,]+)k?\s*(?:or less|max|maximum|under|beneath)/i)
    || query.match(/under\s*\$?([\d,]+)k?/i)
    || query.match(/less than\s*\$?([\d,]+)k?/i)
  let max_price: number | null = null
  if (priceMatch) {
    let val = parseInt(priceMatch[1].replace(/,/g, ''))
    if (/k/i.test(priceMatch[0]) && val < 1000) val *= 1000
    max_price = val
  }

  const financeRequired = /interest.?free|finance|payment plan|no interest/i.test(query)
  const deliveryRequired = /deliver|shipping|ship to/i.test(query)

  const knownBrands = ['Samsung', 'LG', 'Fisher & Paykel', 'Bosch', 'Electrolux', 'Haier', 'Panasonic', 'Miele', 'Whirlpool', 'Westinghouse', 'Apple', 'Sony', 'Toyota', 'Honda', 'Mitsubishi', 'Dyson', 'Dyson']
  const brands_preferred = knownBrands.filter((b) => lower.includes(b.toLowerCase()))

  return {
    category,
    keywords: query.split(/\s+/).filter((w) => w.length > 2),
    max_price,
    min_price: 200,
    features: [],
    finance_required: financeRequired,
    delivery_required: deliveryRequired,
    brands_preferred,
    brands_excluded: [],
    condition: 'new',
    summary: query,
  }
}
