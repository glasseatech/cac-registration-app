DO $$
DECLARE
  v_intro_id UUID;
  v_stage1_id UUID;
  v_stage2_id UUID;
  v_stage3_id UUID;
  v_footer_id UUID;
BEGIN
  -- Clear existing content to avoid duplicates
  DELETE FROM public.guide_lessons;
  DELETE FROM public.guide_modules;

  -- Insert Modules and capture their IDs
  INSERT INTO public.guide_modules (title, "order") 
  VALUES ('Welcome to CROWGLO HUB', 1) 
  RETURNING id INTO v_intro_id;

  INSERT INTO public.guide_modules (title, "order") 
  VALUES ('Stage 1: SMEDAN Registration', 2) 
  RETURNING id INTO v_stage1_id;

  INSERT INTO public.guide_modules (title, "order") 
  VALUES ('Stage 2: CAC Dashboard & Documentation', 3) 
  RETURNING id INTO v_stage2_id;

  INSERT INTO public.guide_modules (title, "order") 
  VALUES ('Stage 3: Post-Registration & TIN', 4) 
  RETURNING id INTO v_stage3_id;

  INSERT INTO public.guide_modules (title, "order") 
  VALUES ('Next Steps & Support', 5) 
  RETURNING id INTO v_footer_id;

  -- Insert Lessons for Welcome
  INSERT INTO public.guide_lessons (module_id, title, content, "order") VALUES
  (v_intro_id, 'Our Mission', '<p>Welcome to CROWGLO HUB. We are a diversified enterprise specialised in educational services and technology. One of our missions is to help small businesses thrive in this kind of strategic economic of our dear country.</p><p>To fulfill this mission, we hope to guide as many as possible business get registered freely and those of their loved ones. Nigeria economy we believe is not bad though strategic, it requires wisdom to operate. Amidst the many uncertainties, registering your business gives you a bold navigation.</p>', 1),
  (v_intro_id, 'Getting Started', '<p>Kindly follow the guide by clicking the top-right menu icon, and position your business for global visibility and greater profitability by completing your registration in just a few simple steps:</p>', 2);

  -- Insert Lessons for Stage 1
  INSERT INTO public.guide_lessons (module_id, title, content, "order") VALUES
  (v_stage1_id, 'Step 1: SMEDAN Website', '<p>Click the link below to visit the SMEDAN portal:</p><p><a href="https://smedan.gov.ng" target="_blank" class="text-[#0B5E2E] font-bold">smedan.gov.ng</a></p>', 1),
  (v_stage1_id, 'Step 2: Registration Process', '<p>Follow these steps to register:</p><ol><li>Enter your business details.</li><li>Select your business type.</li></ol>', 2),
  (v_stage1_id, 'Step 3: Verification', '<p>Complete your verification through the prompts provided on the portal.</p>', 3),
  (v_stage1_id, 'Step 4: Download Certificate', '<p>Download your SMEDAN Certificate of Registration once completed.</p>', 4);

  -- Insert Lessons for Stage 2
  INSERT INTO public.guide_lessons (module_id, title, content, "order") VALUES
  (v_stage2_id, 'Step 5: Dashboard Navigation', '<p>Glide to "Register Business" on your SMEDAN Dashboard.</p>', 1),
  (v_stage2_id, 'Step 6: Operation Scoping', '<p>Follow the instructions to fill your most suitable operations.</p>', 2),
  (v_stage2_id, 'Step 8: Upload Documents', '<p>Fill in your necessary documents as requested by the system.</p>', 3),
  (v_stage2_id, 'Step 9: Submission & Review', '<p>Go back to your Dashboard. Your Registration will be under review.</p><p><strong>Note:</strong> Keep an eye on the Gmail you used for the registration because that''s where you will receive your Registered CAC document in not more than 30 days of review.</p>', 4);

  -- Insert Lessons for Stage 3
  INSERT INTO public.guide_lessons (module_id, title, content, "order") VALUES
  (v_stage3_id, 'Step 1: Check Email', '<p>Head over to your Gmail and download your CAC document once received.</p>', 1),
  (v_stage3_id, 'Step 2: CAC Search', '<p>Paste this link in your browser: <a href="https://search.cac.gov.ng" target="_blank" class="text-[#0B5E2E] font-bold">search.cac.gov.ng</a></p>', 2),
  (v_stage3_id, 'Step 3: Search Business', '<p>Click on "Search Business".</p>', 3),
  (v_stage3_id, 'Step 4: RC Number', '<p>Type your RC (Registration Code) e.g. 1234567.</p>', 4),
  (v_stage3_id, 'Step 5: Status Report', '<p>You would see that your status report is not ready yet.</p>', 5),
  (v_stage3_id, 'Step 6: Get TIN', '<p>Click "Get TIN" (Though it should already be on your CAC Certificate).</p>', 6),
  (v_stage3_id, 'Step 7: Final Report', '<p>Wait for another 72 hours and you will receive your status report.</p><p>After this, you can head over to the bank to open your <strong>Corporate Account</strong>.</p>', 7),
  (v_stage3_id, 'Note on Banking', '<p>With your CAC Certificate, while you await the Status report, you can go ahead to upgrade your Moniepoint, Opay and other confirmed Microfinance banks to bear your Business name.</p>', 8);

  -- Insert Lessons for Footer/Outro
  INSERT INTO public.guide_lessons (module_id, title, content, "order") VALUES
  (v_footer_id, 'Summary of Achievements', '<p>If you follow these steps very well, you would have:</p><ul><li>Downloaded your SMEDAN Certificate.</li><li>Submitted your Business Registration for review.</li><li>Prepared for your Corporate Banking.</li></ul><p>Thanks for allowing us to help your business grow! We are glad to guide you up to this stage.</p>', 1),
  (v_footer_id, 'Live Webinar (#2,500)', '<p>However, we''d love to guide you further: We encourage you to join our live webinar so you can ask questions, see a live sample business registration and network with others. Register for just #2,500.</p><p><a href="/api/paystack/initialize?type=webinar" class="text-[#0B5E2E] font-bold">Register for Webinar</a></p>', 2),
  (v_footer_id, 'DIY E-book (#2,500)', '<p>If you prefer reading, access the DO-IT-YOURSELF e-book that guides you to register your own business name for free for just #2,500.</p><p><a href="/api/paystack/initialize?type=ebook" class="text-[#0B5E2E] font-bold">Access E-book</a></p>', 3),
  (v_footer_id, 'One-on-One Session (#5,000)', '<p>Click the link below to secure a spot for a one-on-one session with our team for just #5,000.</p><p><a href="/api/paystack/initialize?type=one_on_one" class="text-[#0B5E2E] font-bold">Secure a Spot</a></p>', 4);
END $$;
