-- ADMIN & CMS SCHEMA

-- 1. CMS CONTENT TABLE
-- Stores content for Landing Page, Course Guide, etc.
create table if not exists public.cms_content (
  id uuid default uuid_generate_v4() primary key,
  type text not null, -- 'landing' or 'course'
  section text not null, -- e.g. 'hero', 'pricing', 'module_1'
  content jsonb not null default '{}'::jsonb,
  is_published boolean default false,
  version integer default 1,
  updated_by uuid references auth.users(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(type, section, is_published) -- Enforce one published version per section
);

-- RLS for CMS Content
alter table public.cms_content enable row level security;

-- Public can VIEW published content
create policy "Public can view published content"
  on public.cms_content for select
  using ( is_published = true );

-- Admins can VIEW ALL content (drafts included)
create policy "Admins can view all content"
  on public.cms_content for select
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- Admins can INSERT/UPDATE/DELETE content
create policy "Admins can manage content"
  on public.cms_content for all
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );


-- 2. AUDIT LOGS TABLE
-- Tracks important admin actions
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references auth.users(id),
  action text not null, -- 'update_content', 'mark_paid', 'login'
  resource text, -- 'landing_hero', 'user_123'
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Audit Logs
alter table public.audit_logs enable row level security;

-- Admins can VIEW logs
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- Server-side only inserts (usually), but allow Admins to insert regarding their actions if done from client
create policy "Admins can insert audit logs"
  on public.audit_logs for insert
  with check ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );


-- 3. SETTINGS TABLE
-- Global app settings
create table if not exists public.settings (
  key text primary key, -- 'site_title', 'promo_end_date', 'contact_email'
  value jsonb not null,
  updated_by uuid references auth.users(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Settings
alter table public.settings enable row level security;

-- Public can VIEW settings (usually, unless secrets)
-- For now, allow public read. If secrets needed, use a separate table or server functions.
create policy "Public can view settings"
  on public.settings for select
  using ( true );

-- Admins can MANAGE settings
create policy "Admins can manage settings"
  on public.settings for all
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- 4. INSERT DEFAULT SETTINGS
insert into public.settings (key, value) values 
('promo', '{"isActive": true, "price": 1000, "originalPrice": 3000, "endDate": null}'::jsonb),
('contact', '{"whatsapp": "2349161849691", "email": "crowglogroup@gmail.com"}'::jsonb)
on conflict (key) do nothing;
