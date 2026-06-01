# DealFind NZ — Setup Guide

AI-powered whiteware price comparison for New Zealand.

## What this is

A SaaS web app that compares prices across Trade Me, Harvey Norman, and Noel Leeming, then uses AI to score each deal and tell buyers whether they're getting a good price.

## Tech stack

- **Frontend + API**: Next.js 14 (App Router)
- **Database + Auth**: Supabase
- **AI**: OpenAI GPT-4o-mini
- **Price sources**: Trade Me API, Harvey Norman scraper, Noel Leeming JSON-LD
- **Styling**: Tailwind CSS

## Getting started

### 1. Install dependencies

```bash
cd dealfind
npm install
```

### 2. Set up Supabase

1. Create a project at https://supabase.com
2. Go to SQL Editor and run the migration: `supabase/migrations/001_initial_schema.sql`
3. Copy your project URL and anon key

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from your Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase API settings
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase API settings
- `OPENAI_API_KEY` — from https://platform.openai.com
- `TRADEME_CONSUMER_KEY` / `TRADEME_CONSUMER_SECRET` — from https://developer.trademe.co.nz

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Project structure

```
src/
  app/                  # Next.js pages and API routes
    page.tsx            # Homepage
    search/             # Search results page
    auth/               # Login / signup
    dashboard/          # User account and alerts
    api/
      search/           # Main search endpoint
      alerts/           # Price alert CRUD
  components/
    layout/Navbar.tsx
    search/SearchBar.tsx
    product/DealCard.tsx
  lib/
    supabase/           # Supabase client (browser + server)
    scrapers/           # Trade Me + retailer price fetching
    ai/                 # Deal scoring and OpenAI integration
  types/                # TypeScript types
supabase/
  migrations/           # Database schema
```

## API endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/search?q=samsung+washing+machine` | GET | Search all sources |
| `/api/alerts` | GET | Get user's price alerts |
| `/api/alerts` | POST | Create a price alert |
| `/api/alerts?id=xxx` | DELETE | Delete a price alert |

## Deploying to production

1. Push to GitHub
2. Connect repo to Vercel
3. Add all env vars in Vercel dashboard
4. Deploy

## Next features to build

- Email notifications when price drops hit target
- Price history charts
- Browser extension for instant deal scoring while shopping
- Affiliate link integration for revenue
- More retailers: PB Tech, The Market, Warehouse Stationery
