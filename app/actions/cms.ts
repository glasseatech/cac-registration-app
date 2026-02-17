import { supabaseAdmin } from '@/lib/supabase/server';

export async function getPublicCMSContent(type: 'landing' | 'course') {
    // We use supabaseAdmin here to ensure we get the data regardless of RLS 
    // (though ideally RLS allows public reading of is_published=true)
    const { data } = await supabaseAdmin
        .from('cms_content')
        .select('section, content')
        .eq('type', type)
        .eq('is_published', true);

    const contentMap: Record<string, any> = {};
    data?.forEach((item: any) => {
        contentMap[item.section] = item.content;
    });

    return contentMap;
}
