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

-- 3. Update Testimonials (Names, Quotes, and Images)
UPDATE public.site_sections
SET content_json = '{"testimonials": [{"name": "Fulfilment • Lagos", "text": "I didn''t know where to start. The checklist and screenshots made everything straightforward, and support replied fast.", "quote": "Clear steps, no confusion.", "stars": 5, "initial": "F"}, {"name": "Adeleke Favour • Osun", "text": "I avoided common mistakes that cause delays. The guide is structured like an official process.", "quote": "Saved me time.", "stars": 5, "initial": "AF", "image": "/assets/Testifier-favour.png"}, {"name": "Faith • Ilesha", "text": "For ₦5000 promo it''s a no-brainer. The updates also help because links and steps change.", "quote": "Worth it even at ₦7500.", "stars": 5, "initial": "F", "image": "/assets/Testifier-faith.png"}], "trustNoticeTitle": "Secure Payment via Paystack", "trustNoticeText": "Cards, bank transfer, USSD (options depend on Paystack settings)", "disclaimer": "This is an educational guide + support to help you complete your SMEDAN/CAC process correctly. We are not a government agency and do not issue certificates ourselves."}'::jsonb
WHERE page = 'landing' AND section_key = 'proof';

-- 4. Update Copy Strings (Global fallbacks)
UPDATE public.copy_strings
SET value = '2349161849691'
WHERE key = 'footer.whatsapp_link';

UPDATE public.copy_strings
SET value = '+234 916 184 9691'
WHERE key = 'footer.whatsapp_number';

-- 5. Update Guide Sidebar Support
UPDATE public.site_sections
SET content_json = content_json || '{"whatsapp": "2349161849691"}'::jsonb
WHERE page = 'guide' AND section_key = 'settings';
