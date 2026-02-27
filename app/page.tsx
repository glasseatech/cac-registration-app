import MainPage from '@/components/MainPage';
import { cookies } from 'next/headers';
import { supabaseAdmin, createClient } from '@/lib/supabase/server';
import { getFullPageContent } from '@/app/actions/cms';
import { getSiteSections } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isPaid = false;

    if (user) {
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('paid')
            .eq('id', user.id)
            .single();

        if (profile?.paid) isPaid = true;
    } else {
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

    // Fetch all CMS content: site sections + copy strings
    const [cmsContent, { copy }] = await Promise.all([
        getSiteSections('landing'),
        getFullPageContent('homepage'),
    ]);

    return <MainPage isPaid={isPaid} user={user} cmsContent={cmsContent} copy={copy} />;
}
