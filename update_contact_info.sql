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

-- 5. Update Guide Sidebar Support (WhatsApp Channel)
UPDATE public.site_sections
SET content_json = content_json || '{"whatsapp": "https://www.whatsapp.com/channel/0029Vb74uVzHgZWmEyfHH83U"}'::jsonb
WHERE page = 'guide' AND section_key = 'settings';

-- 6. INTEGRATE IMAGES INTO EXISTING GUIDE FLOW (WITH FULL DESCRIPTIONS)
-- First, clean up the separate module if it still exists
DELETE FROM public.guide_lessons WHERE module_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM public.guide_modules WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Now update existing lessons with their full descriptions AND images as requested

-- Step 1
UPDATE public.guide_lessons 
SET content = '<p>Click the link below to visit the SMEDAN portal:</p><p><a href="https://smedan.gov.ng" target="_blank" class="text-[#0B5E2E] font-bold">smedan.gov.ng</a></p><p class="mt-4 text-gray-500 italic">Reference Image:</p><img src="/assets/guide-smedan-step1.png" alt="Step 1" class="rounded-xl shadow-lg mt-2 w-full" />'
WHERE title = 'Step 1: SMEDAN Website';

-- Step 2
UPDATE public.guide_lessons 
SET content = '<p>Follow these steps to register:</p><ol><li>Enter your business details accurately.</li><li>Select your business type from the options provided.</li></ol><p class="mt-4 text-gray-500 italic">Reference Images:</p><img src="/assets/guide-smedan-step2a.png" alt="Step 2a" class="rounded-xl shadow-lg mt-2 w-full" /><img src="/assets/guide-smedan-step2b.png" alt="Step 2b" class="rounded-xl shadow-lg mt-4 w-full" />'
WHERE title = 'Step 2: Registration Process';

-- Step 3 (Updated to Search Business as per request)
UPDATE public.guide_lessons 
SET title = 'Step 3: Search Business',
    content = '<p>Search for your business to proceed with the verification process. Follow the prompts provided on the portal.</p><p class="mt-4 text-gray-500 italic">Reference Image:</p><img src="/assets/guide-smedan-step3.png" alt="Step 3" class="rounded-xl shadow-lg mt-2 w-full" />'
WHERE title = 'Step 3: Verification' OR title = 'Step 3: Search Business';

-- Step 4
UPDATE public.guide_lessons 
SET content = '<p>Once you have completed the registration and verification, you can download your SMEDAN Certificate of Registration directly from the portal.</p><p class="mt-4 text-gray-500 italic">Reference Image:</p><img src="/assets/guide-smedan-step4.png" alt="Step 4" class="rounded-xl shadow-lg mt-2 w-full" />'
WHERE title = 'Step 4: Download Certificate';

-- Step 5
UPDATE public.guide_lessons 
SET content = '<p>Login to your SMEDAN Dashboard and navigate to the "Register Business" section to begin the formal CAC registration process.</p><p class="mt-4 text-gray-500 italic">Reference Image:</p><img src="/assets/guide-smedan-step5.png" alt="Step 5" class="rounded-xl shadow-lg mt-2 w-full" />'
WHERE title = 'Step 5: Dashboard Navigation';

-- Step 6
UPDATE public.guide_lessons 
SET content = '<p>Carefully follow the instructions to fill in your most suitable business operations. This helps in scoping your business correctly for CAC.</p><p class="mt-4 text-gray-500 italic">Reference Image:</p><img src="/assets/guide-smedan-step6.png" alt="Step 6" class="rounded-xl shadow-lg mt-2 w-full" />'
WHERE title = 'Step 6: Operation Scoping';
