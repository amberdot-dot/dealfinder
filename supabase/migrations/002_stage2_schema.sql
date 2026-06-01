-- Stage 2: Memberships, Offers, Retailer Contacts

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan text default 'monthly' check (plan in ('monthly', 'annual')),
  status text default 'trialing' check (status in ('active', 'cancelled', 'trialing', 'past_due')),
  started_at timestamptz default now(),
  renews_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  search_query text not null,
  retailer_name text not null,
  price numeric(10,2) not null,
  extras jsonb default '[]',
  status text default 'pending' check (status in ('pending', 'held', 'accepted', 'declined', 'expired')),
  expires_at timestamptz default (now() + interval '24 hours'),
  created_at timestamptz default now()
);

create table if not exists public.retailer_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  categories text[] default '{}',
  website_url text,
  contact_email text,
  api_endpoint text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  query text not null,
  parsed_query jsonb,
  last_run_at timestamptz default now(),
  created_at timestamptz default now()
);

-- RLS policies
alter table public.memberships enable row level security;
alter table public.offers enable row level security;
alter table public.saved_searches enable row level security;

create policy "Users see own membership" on public.memberships for select using (auth.uid() = user_id);
create policy "Users see own offers" on public.offers for select using (auth.uid() = user_id);
create policy "Users update own offers" on public.offers for update using (auth.uid() = user_id);
create policy "Users see own searches" on public.saved_searches for select using (auth.uid() = user_id);
create policy "Users insert own searches" on public.saved_searches for insert with check (auth.uid() = user_id);

-- Seed retailer contacts
insert into public.retailer_contacts (name, slug, categories, website_url) values
  ('Harvey Norman', 'harvey_norman', array['whiteware', 'electronics', 'furniture'], 'https://www.harveynorman.co.nz'),
  ('Noel Leeming', 'noel_leeming', array['whiteware', 'electronics'], 'https://www.noelleeming.co.nz'),
  ('Bond & Bond', 'bond_and_bond', array['whiteware', 'electronics'], 'https://www.bondandbond.co.nz'),
  ('Briscoes', 'briscoes', array['whiteware', 'homewares'], 'https://www.briscoes.co.nz'),
  ('The Warehouse', 'the_warehouse', array['whiteware', 'electronics', 'homewares'], 'https://www.thewarehouse.co.nz'),
  ('PB Tech', 'pb_tech', array['electronics', 'computers'], 'https://www.pbtech.co.nz'),
  ('JB Hi-Fi', 'jb_hifi', array['electronics', 'audio'], 'https://www.jbhifi.co.nz'),
  ('Spark', 'spark', array['phones', 'electronics'], 'https://www.spark.co.nz'),
  ('2degrees', 'two_degrees', array['phones', 'electronics'], 'https://www.2degrees.nz'),
  ('Turners', 'turners', array['cars'], 'https://www.turners.co.nz'),
  ('Freedom', 'freedom', array['furniture', 'homewares'], 'https://www.freedom.co.nz'),
  ('Early Settler', 'early_settler', array['furniture'], 'https://www.earlysettler.co.nz'),
  ('Mocka', 'mocka', array['furniture'], 'https://www.mocka.co.nz'),
  ('Mitre 10', 'mitre10', array['tools', 'outdoor', 'hardware'], 'https://www.mitre10.co.nz'),
  ('Bunnings', 'bunnings', array['tools', 'outdoor', 'hardware'], 'https://www.bunnings.co.nz')
on conflict (slug) do nothing;
