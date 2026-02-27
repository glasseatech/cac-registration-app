-- ============================================================
-- CONTACT INFO UPDATE SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO FORCE UPDATE THE WHATSAPP NUMBER
-- ============================================================

-- 1. Update Site Settings (General Contact)
UPDATE public.site_settings 
SET value = '{"whatsapp": "2349161849691", "email": "crowglogroup@gmail.com"}'::jsonb
WHERE key = 'contact';

-- 2. Update CMS Content (Homepage Contact Section)
UPDATE public.site_sections
SET content_json = content_json || '{"whatsapp": "2349161849691"}'::jsonb
WHERE page = 'landing' AND section_key = 'contact';

-- 3. Update Copy Strings (Global fallbacks)
UPDATE public.copy_strings
SET value = '2349161849691'
WHERE key = 'footer.whatsapp_link';

UPDATE public.copy_strings
SET value = '+234 916 184 9691'
WHERE key = 'footer.whatsapp_number';

-- 4. Update Guide Sidebar Support
UPDATE public.site_sections
SET content_json = content_json || '{"whatsapp": "2349161849691"}'::jsonb
WHERE page = 'guide' AND section_key = 'settings';
