-- 1. FIX PAYMENT ERROR
-- The error "violates foreign key constraint payments_user_email_fkey" happens because 
-- the payments table is still trying to link to the old 'users' table instead of just storing the email.
-- We verify this by dropping the constraint.
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_email_fkey;

-- 2. ENABLE ADMIN ACCESS
-- Replace 'your-email@example.com' with your actual login email to give yourself admin access.
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- 3. ENSURE PROFILES EXIST (Just in case)
-- If your user is missing from profiles for some reason, this ensures they are created from auth
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
SELECT id, email, raw_user_meta_data->>'full_name', created_at, created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;
