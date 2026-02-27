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

-- 6. INTEGRATE IMAGES INTO EXISTING GUIDE FLOW
-- First, clean up the separate module we created by mistake
DELETE FROM public.guide_lessons WHERE module_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM public.guide_modules WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Now update existing lessons with their respective images
-- Step 1
UPDATE public.guide_lessons 
SET content = '<p>Click the link below to visit the SMEDAN portal <a href="https://smedan.gov.ng" target="_blank">smedan.gov.ng</a>.</p><img src="/assets/guide-smedan-step1.png" alt="Step 1" class="rounded-xl shadow-lg mt-4 w-full" />'
WHERE title = 'Step 1: SMEDAN Website';

-- Step 2
UPDATE public.guide_lessons 
SET content = '<p>Follow these steps to register:</p><ol><li>Enter your business details.</li><li>Select your business type.</li></ol><img src="/assets/guide-smedan-step2a.png" alt="Step 2a" class="rounded-xl shadow-lg mt-4 w-full" /><img src="/assets/guide-smedan-step2b.png" alt="Step 2b" class="rounded-xl shadow-lg mt-4 w-full" />'
WHERE title = 'Step 2: Registration Process';

-- Step 3 (Updating title and content to match user's Search Business step)
UPDATE public.guide_lessons 
SET title = 'Step 3: Search Business',
    content = '<p>Click on Search Business to proceed with your verification.</p><img src="/assets/guide-smedan-step3.png" alt="Step 3" class="rounded-xl shadow-lg mt-4 w-full" />'
WHERE title = 'Step 3: Verification';

-- Step 4
UPDATE public.guide_lessons 
SET content = '<p>Download your SMEDAN Certificate of Registration once completed.</p><img src="/assets/guide-smedan-step4.png" alt="Step 4" class="rounded-xl shadow-lg mt-4 w-full" />'
WHERE title = 'Step 4: Download Certificate';

-- Step 5
UPDATE public.guide_lessons 
SET content = '<p>Glide to "Register Business" on your SMEDAN Dashboard.</p><img src="/assets/guide-smedan-step5.png" alt="Step 5" class="rounded-xl shadow-lg mt-4 w-full" />'
WHERE title = 'Step 5: Dashboard Navigation';

-- Step 6
UPDATE public.guide_lessons 
SET content = '<p>Follow the instructions to fill your most suitable operations.</p><img src="/assets/guide-smedan-step6.png" alt="Step 6" class="rounded-xl shadow-lg mt-4 w-full" />'
WHERE title = 'Step 6: Operation Scoping';
