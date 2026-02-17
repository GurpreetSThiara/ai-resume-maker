-- Create portfolios table
create table public.portfolios (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id uuid null references public.resumes (id) on delete set null,
  slug text not null,
  title text not null default 'My Portfolio'::text,
  data jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint portfolios_pkey primary key (id),
  constraint portfolios_slug_key unique (slug)
);

-- Enable RLS
alter table public.portfolios enable row level security;

-- Policies
create policy "Users can view their own portfolios" on public.portfolios
  for select using (auth.uid() = user_id);

create policy "Users can insert their own portfolios" on public.portfolios
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own portfolios" on public.portfolios
  for update using (auth.uid() = user_id);

create policy "Users can delete their own portfolios" on public.portfolios
  for delete using (auth.uid() = user_id);

create policy "Public portfolios are viewable by everyone" on public.portfolios
  for select using (is_public = true);
