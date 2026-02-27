-- ============================================================
-- CMS SEED DATA
-- Run AFTER supabase_schema_cms.sql
-- Inserts all current hardcoded content as default data
-- ============================================================

-- ============================================================
-- COPY_STRINGS — UI Microcopy (Key/Value)
-- ============================================================

INSERT INTO public.copy_strings (key, value, category, description) VALUES

-- NAVBAR
('navbar.brand_name', 'CAC via SMEDAN Guide', 'navbar', 'Brand name in header'),
('navbar.tagline', 'Limited promo • ₦5000 access', 'navbar', 'Tagline below brand name'),
('navbar.link_how', 'How it works', 'navbar', 'Nav menu link'),
('navbar.link_what', 'What you get', 'navbar', 'Nav menu link'),
('navbar.link_trust', 'Trust', 'navbar', 'Nav menu link'),
('navbar.link_pricing', 'Pricing', 'navbar', 'Nav menu link'),
('navbar.link_faq', 'FAQ', 'navbar', 'Nav menu link'),
('navbar.pill_secure', 'Secure payment via Paystack', 'navbar', 'Security pill text'),
('navbar.btn_get_access', 'Get Access', 'navbar', 'CTA button when not paid'),
('navbar.btn_course_access', 'Course Access', 'navbar', 'CTA button when paid'),
('navbar.btn_login_title', 'Already paid? Login', 'navbar', 'Login button title'),

-- FOOTER
('footer.brand_title', 'CAC via SMEDAN Guide', 'footer', 'Footer brand'),
('footer.brand_desc', 'A practical course to help Nigerian entrepreneurs navigate the SMEDAN-supported CAC registration pathway with clarity and confidence.', 'footer', 'Footer description'),
('footer.pill_promo', 'Promo: ₦5000', 'footer', 'Footer pill'),
('footer.pill_secure', 'Secure Paystack checkout', 'footer', 'Footer pill'),
('footer.contact_title', 'Contact', 'footer', 'Column heading'),
('footer.email_label', 'Email:', 'footer', 'Label'),
('footer.email', 'crowglogroup@gmail.com', 'footer', 'Email address'),
('footer.whatsapp_label', 'WhatsApp:', 'footer', 'Label'),
('footer.whatsapp_number', '+234 916 184 9691', 'footer', 'Display number'),
('footer.whatsapp_link', '2349161849691', 'footer', 'WhatsApp link number'),
('footer.hours', 'Hours: Mon–Sat, 9am–6pm', 'footer', 'Business hours'),
('footer.disclaimer_title', 'Disclaimer', 'footer', 'Column heading'),
('footer.disclaimer_text', 'This is an educational product and support service. We are not affiliated with CAC or SMEDAN, and we do not guarantee program availability/approval. Official decisions and issuance remain with the respective institutions.', 'footer', 'Disclaimer body'),
('footer.link_faq', 'FAQ', 'footer', 'Footer link'),
('footer.link_pricing', 'Pricing', 'footer', 'Footer link'),
('footer.link_top', 'Back to top', 'footer', 'Footer link'),
('footer.copyright', 'CAC via SMEDAN Guide. All rights reserved.', 'footer', 'Copyright text'),
('footer.tagline', 'Built for trust • Mobile-first • Secure checkout', 'footer', 'Footer tagline'),

-- TOAST / SYSTEM MESSAGES
('toast.email_required_title', 'Email required', 'global', 'Validation toast'),
('toast.email_required_msg', 'Please enter a valid email to receive your access link.', 'global', 'Validation msg'),
('toast.phone_required_title', 'Phone required', 'global', 'Validation toast'),
('toast.phone_required_msg', 'Please enter a valid phone number for support.', 'global', 'Validation msg'),
('toast.initializing_title', 'Initializing...', 'global', 'Loading toast'),
('toast.initializing_msg', 'Please wait while we set up the secure checkout.', 'global', 'Loading msg'),
('toast.processing_title', 'Processing...', 'global', 'Payment toast'),
('toast.processing_msg', 'Verifying payment...', 'global', 'Payment msg'),
('toast.closed_title', 'Checkout closed', 'global', 'Closed toast'),
('toast.closed_msg', 'You can resume anytime.', 'global', 'Closed msg'),
('toast.error_title', 'Error', 'global', 'Error toast'),
('toast.error_msg', 'Could not initialize payment. Please try again.', 'global', 'Error msg'),

-- GUIDE PAGE MICROCOPY
('guide.sidebar_title', 'Registration Journey', 'guide', 'Sidebar title'),
('guide.help_title', 'Need Support?', 'guide', 'Help card title'),
('guide.help_subtitle', 'Our team is here to guide you through any blockers.', 'guide', 'Help subtitle fallback'),
('guide.help_btn', 'Chat with Support', 'guide', 'Help CTA'),
('guide.empty_title', 'No modules yet', 'guide', 'Empty state title'),
('guide.empty_subtitle', 'Get started by creating your first module in the CMS.', 'guide', 'Empty subtitle fallback'),
('guide.module_label', 'Module', 'guide', 'Module badge prefix'),
('guide.modules_total', 'Modules Total', 'guide', 'Module count label'),
('guide.access_resource', 'Access Resource', 'guide', 'Button text'),
('guide.empty_lesson', 'This lesson has no content yet.', 'guide', 'Empty lesson msg'),
('guide.upsell_webinar_title', 'Live Webinar', 'guide', 'Upsell card'),
('guide.upsell_webinar_desc', 'Ask questions live, see a sample registration, and network with others.', 'guide', 'Upsell desc'),
('guide.upsell_webinar_price', '₦2,500', 'guide', 'Upsell price'),
('guide.upsell_webinar_btn', 'Launching soon', 'guide', 'Upsell CTA'),
('guide.upsell_ebook_title', 'DIY E-Book', 'guide', 'Upsell card'),
('guide.upsell_ebook_desc', 'A complete guide you can keep and revisit anytime for your business name.', 'guide', 'Upsell desc'),
('guide.upsell_ebook_price', '₦2,500', 'guide', 'Upsell price'),
('guide.upsell_ebook_btn', 'Launching soon', 'guide', 'Upsell CTA'),
('guide.upsell_session_title', 'One-on-One Session', 'guide', 'Upsell card'),
('guide.upsell_session_desc', 'Get dedicated personal guidance from our team until your business is fully registered. No limitations, just bold results.', 'guide', 'Upsell desc'),
('guide.upsell_session_price', '₦5,000', 'guide', 'Upsell price'),
('guide.upsell_session_btn', 'Launching soon', 'guide', 'Upsell CTA'),

-- SKIP LINK
('a11y.skip_to_content', 'Skip to content', 'global', 'Accessibility skip link')

ON CONFLICT (key) DO NOTHING;


-- ============================================================
-- SITE_SECTIONS — Structured Homepage Content
-- ============================================================

-- Hero section
INSERT INTO public.site_sections (page, section_key, title, subtitle, content_json) VALUES
('landing', 'hero', 'Register Your Business with CAC',
 'A practical, step-by-step guide to help you register your business independently with the Corporate Affairs Commission (CAC). Save time, save money, and get it right the first time.',
 '{"ctaText": "Get the Guide Now", "badges": [], "headline": "Register Your Business with CAC", "subheadline": "A practical, step-by-step guide to help you register your business independently with the Corporate Affairs Commission (CAC). Save time, save money, and get it right the first time."}'::jsonb
),
('landing', 'how', 'How it works (3 simple steps)',
 'Everything is structured so you can move from zero to submitted registration without confusion.',
 '{"steps": [{"title": "Enroll for ₦5000 promo access", "description": "Make a secure payment via Paystack and receive your access link immediately.", "kicker": "Step 1 • Enroll", "icon": "M4 7h16M4 12h16M4 17h10"}, {"title": "Use the step-by-step checklist", "description": "See what to prepare, what to enter, and what to double-check to avoid rejections/delays.", "kicker": "Step 2 • Follow guide", "icon": "M4 4h16v16H4z M7 9h10M7 13h7"}, {"title": "Apply using the SMEDAN pathway", "description": "The course explains the SMEDAN-supported process where CAC fees are covered (when eligible and slots are available).", "kicker": "Step 3 • Register via SMEDAN", "icon": "M12 2l9 5-9 5-9-5 9-5Z M3 10v7l9 5 9-5v-7"}]}'::jsonb
),
('landing', 'what', 'What you get inside',
 'Built for clarity, speed, and confidence — with support when you need it.',
 '{"features": [{"title": "Step-by-step guide page", "description": "Simple flow, screenshots, and checklists so you don''t miss anything."}, {"title": "WhatsApp support", "description": "Ask questions and get guided on common blockers and corrections."}, {"title": "Lifetime access", "description": "Revisit the guide anytime — no expiring login drama."}, {"title": "Updated instructions", "description": "When forms/links change, the guide is refreshed so you stay current."}], "sideCardTitle": "Designed to feel official and reliable", "sideCardText": "The layout mirrors the way institutional processes work: requirements → steps → submission → follow-up. No noise, no hype.", "chips": ["Beginner-friendly", "Clear checklists", "Fast support", "Secure checkout"]}'::jsonb
),
('landing', 'proof', 'Proof & trust',
 'Social proof, sample screenshots space, and a secure payment flow your customers recognize.',
 '{"testimonials": [{"name": "Fulfilment • Lagos", "text": "I didn''t know where to start. The checklist and screenshots made everything straightforward, and support replied fast.", "quote": "Clear steps, no confusion.", "stars": 5, "initial": "F"}, {"name": "Adeleke Favour • Osun", "text": "I avoided common mistakes that cause delays. The guide is structured like an official process.", "quote": "Saved me time.", "stars": 5, "initial": "AF", "image": "/assets/Testifier-favour.png"}, {"name": "Faith • Ilesha", "text": "For ₦5000 promo it''s a no-brainer. The updates also help because links and steps change.", "quote": "Worth it even at ₦7500.", "stars": 5, "initial": "F", "image": "/assets/Testifier-faith.png"}], "trustNoticeTitle": "Secure Payment via Paystack", "trustNoticeText": "Cards, bank transfer, USSD (options depend on Paystack settings)", "disclaimer": "This is an educational guide + support to help you complete your SMEDAN/CAC process correctly. We are not a government agency and do not issue certificates ourselves."}'::jsonb
),
('landing', 'pricing', NULL, NULL,
 '{"price": 5000, "originalPrice": 7500}'::jsonb
),
('landing', 'faq', 'FAQ',
 'Transparent answers to reduce hesitation and increase trust.',
 '{"questions": [{"q": "Is CAC registration really free through SMEDAN?", "a": "SMEDAN-supported programs may cover CAC registration fees for eligible applicants and while program slots/funding are available. The course explains how to follow that pathway correctly."}, {"q": "What am I paying ₦5000 for?", "a": "You''ll receive your access link by email after payment. WhatsApp support included."}, {"q": "Do you issue CAC certificates?", "a": "No. CAC certificates and approvals are issued by the official institutions. We provide guidance and support to help you complete the process properly."}]}'::jsonb
),
('landing', 'contact', NULL, NULL,
 '{"email": "crowglogroup@gmail.com", "whatsapp": "2349161849691"}'::jsonb
),
-- Guide page sections
('guide', 'course_intro', 'Welcome to CROWGLO HUB',
 'We are specialized in educational services and technology, helping small businesses thrive in Nigeria.',
 '{}'::jsonb
),
('guide', 'upsell', 'Maximize Your Success',
 'We want to guide you further until your business is fully established and ready for the world.',
 '{"items": [{"type": "webinar", "title": "Live Webinar", "description": "Ask questions live, see a sample registration, and network with others.", "price": "₦2,500", "btnText": "Launching soon", "color": "blue"}, {"type": "ebook", "title": "DIY E-Book", "description": "A complete guide you can keep and revisit anytime for your business name.", "price": "₦2,500", "btnText": "Launching soon", "color": "orange"}, {"type": "session", "title": "One-on-One Session", "description": "Get dedicated personal guidance from our team until your business is fully registered. No limitations, just bold results.", "price": "₦5,000", "btnText": "Launching soon", "color": "dark"}]}'::jsonb
)
ON CONFLICT (page, section_key) DO NOTHING;
