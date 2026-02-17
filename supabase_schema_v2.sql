-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  paid boolean default false,
  role text default 'user', -- 'user' or 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. EMAIL LOGS TABLE
create table if not exists public.email_logs (
  id uuid default uuid_generate_v4() primary key,
  user_email text not null,
  type text not null, -- 'welcome', 'broadcast', 'login'
  status text not null, -- 'sent', 'failed'
  provider_response jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Email Logs (Admin only visible usually, but let's keep simple for now)
alter table public.email_logs enable row level security;
create policy "Admins can view all email logs"
  on email_logs for select
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );


-- 3. CONTENT PAGES TABLE (For Admin CMS)
create table if not exists public.content_pages (
  slug text primary key, -- 'landing_hero', 'course_content', 'settings'
  content jsonb not null,
  updated_by uuid references auth.users(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Content Pages
alter table public.content_pages enable row level security;
create policy "Public can view content"
  on content_pages for select
  using ( true );

create policy "Admins can update content"
  on content_pages for update
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can insert content"
  on content_pages for insert
  with check ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );


-- 4. UPDATE PAYMENTS TABLE (If not already robust)
-- Ensure these columns exist (idempotent)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'payments' and column_name = 'user_id') then
    alter table public.payments add column user_id uuid references auth.users(id);
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'payments' and column_name = 'reference') then
    alter table public.payments add column reference text unique;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'payments' and column_name = 'metadata') then
    alter table public.payments add column metadata jsonb;
  end if;
end $$;

-- RLS for Payments
alter table public.payments enable row level security;
create policy "Users can view own payments"
  on payments for select
  using ( auth.uid() = user_id );

create policy "Admins can view all payments"
  on payments for select
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );


-- 5. STORAGE BUCKETS (Optional, for content images)
-- insert into storage.buckets (id, name) values ('content_assets', 'content_assets')
-- on conflict do nothing;
