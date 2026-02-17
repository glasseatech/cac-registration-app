import { createClient } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';

// Re-export for backward compatibility
export const supabase = createClient();
export { supabaseAdmin };
