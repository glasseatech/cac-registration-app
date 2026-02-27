-- ============================================================
-- DB REPAIR SCRIPT V2 (Fixes Relationships & Cache)
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Fix audit_logs relationship to profiles
-- Pointing to profiles(id) allows PostgREST to join admin info automatically
ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_admin_id_fkey;
ALTER TABLE public.audit_logs 
  ADD CONSTRAINT audit_logs_admin_id_fkey 
  FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Ensure updated_by exists in site_sections and points to profiles
ALTER TABLE public.site_sections DROP CONSTRAINT IF EXISTS site_sections_updated_by_fkey;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_sections' AND column_name = 'updated_by') THEN
        ALTER TABLE public.site_sections ADD COLUMN updated_by UUID;
    END IF;
END $$;

ALTER TABLE public.site_sections
  ADD CONSTRAINT site_sections_updated_by_fkey 
  FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Fix content_revisions relationship
ALTER TABLE public.content_revisions DROP CONSTRAINT IF EXISTS content_revisions_changed_by_fkey;
ALTER TABLE public.content_revisions
  ADD CONSTRAINT content_revisions_changed_by_fkey 
  FOREIGN KEY (changed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 4. Reload schema cache
NOTIFY pgrst, 'reload schema';
