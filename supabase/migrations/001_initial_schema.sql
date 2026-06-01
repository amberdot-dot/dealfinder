-- Products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  model text not null,
  category text not null,
  image_url text,
  description text,
  created_at timestamptz default now()
);

-- Price listings table
create table public.price_listings (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  source text not null,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  currency text default 'NZD',
  url text not null,
  in_stock boolean default true,
  condition text default 'new',
  seller_name text,
  listing_title text not null,
  deal_score numeric(3,1),
  deal_rating text,
  fetched_at timestamptz default now()
);

-- Price alerts table
create table public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  target_price numeric(10,2) not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Saved searches table
create table public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  query text not null,
  category text,
  created_at timestamptz default now()
);

-- Search cache table (reduces API calls)
create table public.search_cache (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  category text,
  results jsonb not null,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '2 hours')
);

-- Indexes
create index on public.price_listings(product_id);
create index on public.price_listings(source);
create index on public.price_listings(fetched_at);
create index on public.price_alerts(user_id);
create index on public.products(category);
create index on public.search_cache(query, category);

-- Row Level Security
alter table public.price_alerts enable row level security;
alter table public.saved_searches enable row level security;

create policy "Users manage own alerts" on public.price_alerts
  for all using (auth.uid() = user_id);

create policy "Users manage own searches" on public.saved_searches
  for all using (auth.uid() = user_id);

-- Public read access to products and listings
alter table public.products enable row level security;
alter table public.price_listings enable row level security;

create policy "Public read products" on public.products for select using (true);
create policy "Public read listings" on public.price_listings for select using (true);
