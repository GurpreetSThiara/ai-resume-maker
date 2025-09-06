-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp" with schema extensions;

-- Create cover_letter_templates table
create table if not exists public.cover_letter_templates (
  id text primary key,
  name text not null,
  thumbnail_url text,
  structure jsonb not null,
  is_premium boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create cover_letters table
create table if not exists public.cover_letters (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content jsonb not null,
  template_id text references public.cover_letter_templates(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.cover_letters enable row level security;

-- Create policies for secure access
create policy "Users can view their own cover letters"
  on public.cover_letters for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cover letters"
  on public.cover_letters for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cover letters"
  on public.cover_letters for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cover letters"
  on public.cover_letters for delete
  using (auth.uid() = user_id);

-- Create index for better performance
create index idx_cover_letters_user_id on public.cover_letters(user_id);
create index idx_cover_letters_updated_at on public.cover_letters(updated_at);
