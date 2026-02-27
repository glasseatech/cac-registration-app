import { supabaseAdmin } from '@/lib/supabase/server';

// Fetch all published CMS content for a page type
export async function getPublicCMSContent(type: 'landing' | 'course') {
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

// Fetch all copy strings as a key → value map
export async function getAllCopyStrings(): Promise<Record<string, string>> {
    const { data } = await supabaseAdmin
        .from('copy_strings')
        .select('key, value');

    const map: Record<string, string> = {};
    data?.forEach((item: any) => {
        map[item.key] = item.value;
    });
    return map;
}

// Fetch copy strings for a specific category
export async function getCopyStringsByCategory(category: string): Promise<Record<string, string>> {
    const { data } = await supabaseAdmin
        .from('copy_strings')
        .select('key, value')
        .eq('category', category);

    const map: Record<string, string> = {};
    data?.forEach((item: any) => {
        map[item.key] = item.value;
    });
    return map;
}

// Fetch published content blocks for a page
export async function getPublicContentBlocks(page: string, section?: string) {
    let query = supabaseAdmin
        .from('content_blocks')
        .select('*')
        .eq('page', page)
        .eq('is_published', true)
        .order('sort_order');

    if (section) query = query.eq('section', section);

    const { data } = await query;
    return data || [];
}

// Combined fetch: all content for a public page
export async function getFullPageContent(page: 'homepage' | 'guide') {
    const mapPage = page === 'homepage' ? 'landing' : 'guide';

    const [cmsContent, copyStrings, contentBlocks, siteSections] = await Promise.all([
        getPublicCMSContent(mapPage === 'landing' ? 'landing' : 'course'),
        getAllCopyStrings(),
        getPublicContentBlocks(page),
        getSiteSectionsPublic(mapPage),
    ]);

    return {
        cms: cmsContent,
        copy: copyStrings,
        blocks: contentBlocks,
        sections: siteSections,
    };
}

// Fetch site_sections as a structured map
async function getSiteSectionsPublic(page: string) {
    const { data } = await supabaseAdmin
        .from('site_sections')
        .select('*')
        .eq('page', page);

    const sectionMap: Record<string, any> = {};
    data?.forEach((item: any) => {
        sectionMap[item.section_key] = {
            ...item.content_json,
            title: item.title,
            subtitle: item.subtitle,
        };
    });
    return sectionMap;
}
