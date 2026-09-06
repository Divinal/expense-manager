-- Schéma Supabase (Postgres) pour Expense Manager
-- À exécuter dans l'éditeur SQL de ton projet Supabase (Database > SQL Editor)

-- Extension nécessaire pour gen_random_uuid()
create extension if not exists "pgcrypto";

-- Table des transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('revenu', 'depense', 'epargne')),
  category text not null default 'Autre',
  date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_date_idx on public.transactions (date desc);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Table des paramètres utilisateur (une ligne par utilisateur)
create table if not exists public.user_settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  currency text not null default 'MAD',
  theme text not null default 'light' check (theme in ('light', 'dark')),
  categories jsonb not null default '["Salaire","Freelance","Alimentation","Transport","Logement","Loisirs","Santé","Épargne","Autre"]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
