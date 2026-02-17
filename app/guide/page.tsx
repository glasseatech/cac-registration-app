import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { supabaseAdmin, createClient } from '@/lib/supabase/server';
import { getPublicCMSContent } from '@/app/actions/cms';
import GuideContent from '@/components/GuideContent';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GuidePage({ searchParams }: PageProps) {
    // 1. Check Auth User
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: profile } = await supabaseAdmin.from('profiles').select('paid').eq('id', user.id).single();
        if (profile?.paid) {
            const cmsContent = await getPublicCMSContent('course');
            return <GuideContent cmsContent={cmsContent} />;
        }
    }

    // 2. Fallback: Check Token (Legacy / URL)
    const resolvedSearchParams = await searchParams;
    const tokenFromUrl = resolvedSearchParams.token as string | undefined;
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('cac_access_token')?.value;
    const token = tokenFromUrl || tokenFromCookie;

    if (token) {
        const { data: legacyUser } = await supabaseAdmin
            .from('users')
            .select('paid')
            .eq('access_token', token)
            .single();

        if (legacyUser?.paid) {
            const cmsContent = await getPublicCMSContent('course');
            return <GuideContent cmsContent={cmsContent} />;
        }
    }

    // 3. Not Authorized
    return redirect('/');
}
