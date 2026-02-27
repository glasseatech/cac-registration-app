-- ============================================================
-- REPAIR DATABASE SCRIPT (v2)
-- Run this in Supabase SQL Editor to fix guide tables schema
-- ============================================================

-- 1. Fix guide_modules
ALTER TABLE public.guide_modules DROP CONSTRAINT IF EXISTS guide_modules_updated_by_fkey;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_modules' AND column_name = 'updated_by') THEN
        ALTER TABLE public.guide_modules ADD COLUMN updated_by UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_modules' AND column_name = 'updated_at') THEN
        ALTER TABLE public.guide_modules ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

ALTER TABLE public.guide_modules
  ADD CONSTRAINT guide_modules_updated_by_fkey 
  FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Fix guide_lessons
ALTER TABLE public.guide_lessons DROP CONSTRAINT IF EXISTS guide_lessons_updated_by_fkey;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_lessons' AND column_name = 'updated_by') THEN
        ALTER TABLE public.guide_lessons ADD COLUMN updated_by UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_lessons' AND column_name = 'updated_at') THEN
        ALTER TABLE public.guide_lessons ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

ALTER TABLE public.guide_lessons
  ADD CONSTRAINT guide_lessons_updated_by_fkey 
  FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
