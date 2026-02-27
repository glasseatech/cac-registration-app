import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { supabaseAdmin, createClient } from '@/lib/supabase/server';
import { getAllCopyStrings } from '@/app/actions/cms';
import { getGuideStructure, getSiteSections } from '@/app/actions/admin';
import GuideContent from '@/components/GuideContent';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GuidePage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAuthorized = false;

    if (user) {
        const { data: profile } = await supabaseAdmin.from('profiles').select('paid').eq('id', user.id).single();
        if (profile?.paid) isAuthorized = true;
    }

    if (!isAuthorized) {
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

            if (legacyUser?.paid) isAuthorized = true;
        }
    }

    if (isAuthorized) {
        const [cmsContent, modules, copy] = await Promise.all([
            getSiteSections('guide'),
            getGuideStructure(),
            getAllCopyStrings(),
        ]);

        return <GuideContent cmsContent={cmsContent} modules={modules} copy={copy} />;
    }

    return redirect('/');
}
