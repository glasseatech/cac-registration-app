-- 1. SITE SECTIONS (For Homepage Content)
CREATE TABLE IF NOT EXISTS public.site_sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page TEXT NOT NULL, -- 'landing'
    section_key TEXT NOT NULL, -- 'hero', 'pricing', 'faq'
    title TEXT,
    subtitle TEXT,
    content_json JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(page, section_key)
);

-- 2. GUIDE MODULES (For Course Structure)
CREATE TABLE IF NOT EXISTS public.guide_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GUIDE LESSONS (For Course Content)
CREATE TABLE IF NOT EXISTS public.guide_lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES public.guide_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'text', -- 'text', 'video', 'download', 'link'
    content TEXT, -- Markdown or HTML
    url TEXT, -- For video links or downloads
    duration TEXT, -- e.g., '10 mins'
    "order" INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Select
CREATE POLICY "Public can view active site sections" ON site_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published modules" ON guide_modules FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published lessons" ON guide_lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);

-- Admin CRUD (using profiles role check)
CREATE POLICY "Admins can manage site sections" ON site_sections 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage guide modules" ON guide_modules 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage guide lessons" ON guide_lessons 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage site settings" ON site_settings 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
