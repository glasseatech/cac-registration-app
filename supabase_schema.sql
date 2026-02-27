-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  paid boolean default false,
  access_token text unique,
  created_at timestamp with time zone default now()
);

-- Payments Table
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null references public.users(email),
  amount integer not null,
  currency text default 'NGN',
  reference text unique not null,
  status text not null, -- 'success', 'failed', 'abandoned'
  paid_at timestamp with time zone,
  raw_payload jsonb,
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_users_email on public.users(email);
create index idx_users_token on public.users(access_token);
create index idx_payments_reference on public.payments(reference);

-- RLS Policies (Optional but recommended)
alter table public.users enable row level security;
alter table public.payments enable row level security;

-- Allow Service Role (Backend) full access
create policy "Service role full access users" on public.users
  for all using (true) with check (true);
  
create policy "Service role full access payments" on public.payments
  for all using (true) with check (true);
