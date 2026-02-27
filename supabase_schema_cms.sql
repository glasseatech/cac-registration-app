-- ============================================================
-- CMS SCHEMA MIGRATION
-- Run this in Supabase SQL Editor after existing schema
-- ============================================================

-- Ensure UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. COPY_STRINGS TABLE (Key/Value UI Microcopy)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.copy_strings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'global', -- 'navbar','footer','guide','global','homepage'
  description TEXT, -- Optional context for admin
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.copy_strings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read copy_strings" ON public.copy_strings;
  DROP POLICY IF EXISTS "Admins can insert copy_strings" ON public.copy_strings;
  DROP POLICY IF EXISTS "Admins can update copy_strings" ON public.copy_strings;
  DROP POLICY IF EXISTS "Admins can delete copy_strings" ON public.copy_strings;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public can read copy_strings"
  ON public.copy_strings FOR SELECT USING (true);

CREATE POLICY "Admins can insert copy_strings"
  ON public.copy_strings FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update copy_strings"
  ON public.copy_strings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete copy_strings"
  ON public.copy_strings FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX idx_copy_strings_category ON public.copy_strings(category);

-- ============================================================
-- 2. CONTENT_BLOCKS TABLE (Flexible Sections)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page TEXT NOT NULL,           -- 'homepage', 'guide'
  section TEXT NOT NULL,        -- 'navbar', 'hero', 'about', 'footer', etc.
  block_type TEXT NOT NULL DEFAULT 'text', -- 'text','list','card','testimonial','faq','upsell'
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read published content_blocks" ON public.content_blocks;
  DROP POLICY IF EXISTS "Admins can read all content_blocks" ON public.content_blocks;
  DROP POLICY IF EXISTS "Admins can insert content_blocks" ON public.content_blocks;
  DROP POLICY IF EXISTS "Admins can update content_blocks" ON public.content_blocks;
  DROP POLICY IF EXISTS "Admins can delete content_blocks" ON public.content_blocks;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public can read published content_blocks"
  ON public.content_blocks FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can read all content_blocks"
  ON public.content_blocks FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert content_blocks"
  ON public.content_blocks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update content_blocks"
  ON public.content_blocks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete content_blocks"
  ON public.content_blocks FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX idx_content_blocks_page_section ON public.content_blocks(page, section);
CREATE INDEX idx_content_blocks_sort ON public.content_blocks(page, section, sort_order);

-- ============================================================
-- 3. CONTENT_REVISIONS TABLE (Version History)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.content_revisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_name TEXT NOT NULL,     -- 'copy_strings','content_blocks','site_sections','guide_modules','guide_lessons'
  record_id TEXT NOT NULL,      -- PK of the changed record
  content_snapshot JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_type TEXT NOT NULL DEFAULT 'update', -- 'create','update','delete'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can read content_revisions" ON public.content_revisions;
  DROP POLICY IF EXISTS "Admins can insert content_revisions" ON public.content_revisions;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Admins can read content_revisions"
  ON public.content_revisions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert content_revisions"
  ON public.content_revisions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX idx_content_revisions_record ON public.content_revisions(table_name, record_id);
CREATE INDEX idx_content_revisions_date ON public.content_revisions(created_at DESC);

-- ============================================================
--- 3.5 AUDIT_LOGS TABLE (Action tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit_logs"
  ON public.audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert audit_logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX idx_audit_logs_admin ON public.audit_logs(admin_id);
CREATE INDEX idx_audit_logs_date ON public.audit_logs(created_at DESC);

-- ============================================================
-- 4. ENSURE SITE_SECTIONS TABLE EXISTS (may already exist)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  content_json JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT TRUE,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(page, section_key)
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read site_sections" ON public.site_sections;
  DROP POLICY IF EXISTS "Admins can manage site_sections" ON public.site_sections;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public can read site_sections"
  ON public.site_sections FOR SELECT USING (true);

CREATE POLICY "Admins can manage site_sections"
  ON public.site_sections FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- 5. ENSURE GUIDE TABLES EXIST
-- ============================================================
CREATE TABLE IF NOT EXISTS public.guide_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "order" INT NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.guide_modules ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read guide_modules" ON public.guide_modules;
  DROP POLICY IF EXISTS "Admins can manage guide_modules" ON public.guide_modules;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Public can read guide_modules"
  ON public.guide_modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage guide_modules"
  ON public.guide_modules FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS public.guide_lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES public.guide_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- HTML content
  url TEXT,     -- Resource URL
  type TEXT DEFAULT 'text',
  duration TEXT,
  category TEXT,
  tags TEXT[],
  "order" INT NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.guide_lessons ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read guide_lessons" ON public.guide_lessons;
  DROP POLICY IF EXISTS "Admins can manage guide_lessons" ON public.guide_lessons;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Public can read guide_lessons"
  ON public.guide_lessons FOR SELECT USING (true);
CREATE POLICY "Admins can manage guide_lessons"
  ON public.guide_lessons FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- 6. STORAGE BUCKET FOR CONTENT ASSETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-assets', 'content-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read content-assets" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload content-assets" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can update content-assets" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete content-assets" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public can read content-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-assets');

CREATE POLICY "Admins can upload content-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'content-assets' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update content-assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'content-assets' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete content-assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'content-assets' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
