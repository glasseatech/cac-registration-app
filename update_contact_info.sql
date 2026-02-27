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

-- 6. Add SMEDAN Visual Guide Module and Lessons
-- First, ensure the module exists (using a fixed UUID for consistency)
INSERT INTO public.guide_modules (id, title, description, "order", is_published)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'SMEDAN Registration Process (Visual Guide)', 'A step-by-step visual walkthrough of the SMEDAN portal registration.', 0, true)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

-- Insert the steps as lessons (with fixed IDs to prevent duplicates)
INSERT INTO public.guide_lessons (id, module_id, title, content, "order", is_published)
VALUES 
('d1a10001-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Step 1: Visit SMEDAN Portal', '<p>Click the link below to visit the SMEDAN portal <a href="https://smedan.gov.ng" target="_blank">smedan.gov.ng</a>.</p><img src="/assets/guide-smedan-step1.png" alt="Step 1" class="rounded-xl shadow-lg mt-4 w-full" />', 1, true),
('d1a10002-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Step 2: Enter Business Details', '<p>Enter your business details into the registration form as shown below.</p><img src="/assets/guide-smedan-step2a.png" alt="Step 2a" class="rounded-xl shadow-lg mt-4 w-full" />', 2, true),
('d1a10003-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Step 2 (cont): Select Business Type', '<p>Select your business type carefully from the dropdown menu.</p><img src="/assets/guide-smedan-step2b.png" alt="Step 2b" class="rounded-xl shadow-lg mt-4 w-full" />', 3, true),
('d1a10004-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Step 3: Search Business', '<p>Once you''ve filled the basic info, click on "Search Business" to proceed.</p><img src="/assets/guide-smedan-step3.png" alt="Step 3" class="rounded-xl shadow-lg mt-4 w-full" />', 4, true),
('d1a10005-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Step 4: Download Certificate', '<p>Download your SMEDAN Certificate of Registration once the process is completed.</p><img src="/assets/guide-smedan-step4.png" alt="Step 4" class="rounded-xl shadow-lg mt-4 w-full" />', 5, true),
('d1a10006-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Step 5: Dashboard Navigation', '<p>From your dashboard, navigate and click on "Register Business".</p><img src="/assets/guide-smedan-step5.png" alt="Step 5" class="rounded-xl shadow-lg mt-4 w-full" />', 6, true),
('d1a10007-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Step 6: Operation Scoping', '<p>Follow the instructions to fill in your most suitable business operations.</p><img src="/assets/guide-smedan-step6.png" alt="Step 6" class="rounded-xl shadow-lg mt-4 w-full" />', 7, true)
ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
