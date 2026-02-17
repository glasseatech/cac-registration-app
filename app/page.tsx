import MainPage from '@/components/MainPage';
import { cookies } from 'next/headers';
import { supabaseAdmin, createClient } from '@/lib/supabase/server';
import { getPublicCMSContent } from '@/app/actions/cms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
    const supabase = await createClient(); // Server client with cookies
    const { data: { user } } = await supabase.auth.getUser();

    let isPaid = false;

    if (user) {
        // Check profile for paid status
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('paid')
            .eq('id', user.id)
            .single();

        if (profile?.paid) isPaid = true;
    } else {
        // Fallback to cookie check for guest purchases (legacy support)
        const cookieStore = await cookies();
        const token = cookieStore.get('cac_access_token')?.value;
        if (token) {
            const { data: legacyUser } = await supabaseAdmin
                .from('users')
                .select('paid')
                .eq('access_token', token)
                .single();
            if (legacyUser?.paid) isPaid = true;
        }
    }

    const cmsContent = await getPublicCMSContent('landing');

    return <MainPage isPaid={isPaid} user={user} cmsContent={cmsContent} />;
}
