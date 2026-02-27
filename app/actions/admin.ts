'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ─── AUTH CHECK ─────────────────────────────────────────────
async function requireAdmin() {
    try {
        console.log('[requireAdmin] Starting check...');

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('[requireAdmin] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables');
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[requireAdmin] Auth error or no user:', authError);
            throw new Error('Unauthorized');
        }

        console.log('[requireAdmin] User authenticated:', user.email, 'ID:', user.id);

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('[requireAdmin] Profile fetch error:', profileError);
            // If the table is missing, this will fail. If the user is missing, it will be 406/PGRST116
            throw new Error(`Profile check failed: ${profileError.message}`);
        }

        if (!profile) {
            console.error('[requireAdmin] No profile found for user ID:', user.id);
            throw new Error('Forbidden: No profile record found in database');
        }

        console.log('[requireAdmin] Profile found. Role:', profile.role);

        if (profile.role !== 'admin') {
            console.error('[requireAdmin] Access denied. User role:', profile.role);
            throw new Error('Forbidden: Admin access only');
        }

        console.log('[requireAdmin] Success: Admin access granted');
        return user;
    } catch (e) {
        console.error('[requireAdmin] Exception:', e);
        throw e;
    }
}

// ─── AUDIT LOG ──────────────────────────────────────────────
async function logAdminAction(adminId: string, action: string, resource: string, details?: any) {
    try {
        await supabaseAdmin.from('audit_logs').insert({
            admin_id: adminId,
            action,
            resource,
            details,
        });
    } catch (e) {
        console.warn('Could not log admin action:', e);
    }
}

// ─── REVISION TRACKING ─────────────────────────────────────
async function saveRevision(tableName: string, recordId: string, snapshot: any, changedBy: string, changeType: string = 'update') {
    try {
        await supabaseAdmin.from('content_revisions').insert({
            table_name: tableName,
            record_id: recordId,
            content_snapshot: snapshot,
            changed_by: changedBy,
            change_type: changeType,
        });
    } catch (e) {
        console.warn('Could not save revision:', e);
    }
}

// ─── DASHBOARD STATS ────────────────────────────────────────
export async function getDashboardStats() {
    await requireAdmin();

    const [
        { count: totalUsers },
        { count: paidUsers },
        { data: payments }
    ] = await Promise.all([
        supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('paid', true),
        supabaseAdmin.from('payments').select('amount, created_at').order('created_at', { ascending: false }).limit(1000)
    ]);

    const totalRevenue = payments?.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) || 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayRevenue = payments
        ?.filter((p: any) => new Date(p.created_at) >= startOfDay)
        .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) || 0;

    return {
        totalUsers: totalUsers || 0,
        paidUsers: paidUsers || 0,
        totalRevenue,
        todayRevenue
    };
}

export async function getRecentTransactions() {
    await requireAdmin();
    const { data: payments } = await supabaseAdmin
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
    return payments;
}

// ─── COPY STRINGS (Key/Value UI Microcopy) ──────────────────
export async function getCopyStrings(category?: string) {
    let query = supabaseAdmin.from('copy_strings').select('*').order('key');
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export async function saveCopyString(key: string, value: string, category: string, description?: string) {
    const user = await requireAdmin();

    // Sanitize
    const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '_');
    const cleanValue = value.trim();
    if (!cleanKey) throw new Error('Key is required');

    const { error } = await supabaseAdmin
        .from('copy_strings')
        .upsert({
            key: cleanKey,
            value: cleanValue,
            category: category.trim() || 'global',
            description: description?.trim() || null,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

    if (error) throw error;

    await Promise.all([
        saveRevision('copy_strings', cleanKey, { value: cleanValue, category }, user.id, 'update'),
        logAdminAction(user.id, 'update_copy_string', cleanKey, { value: cleanValue }),
    ]);

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function deleteCopyString(key: string) {
    const user = await requireAdmin();

    const { error } = await supabaseAdmin.from('copy_strings').delete().eq('key', key);
    if (error) throw error;

    await Promise.all([
        saveRevision('copy_strings', key, { deleted: true }, user.id, 'delete'),
        logAdminAction(user.id, 'delete_copy_string', key),
    ]);

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function bulkSaveCopyStrings(strings: { key: string; value: string; category: string; description?: string }[]) {
    const user = await requireAdmin();

    const cleaned = strings.map(s => ({
        key: s.key.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '_'),
        value: s.value.trim(),
        category: s.category.trim() || 'global',
        description: s.description?.trim() || null,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
    }));

    const { error } = await supabaseAdmin.from('copy_strings').upsert(cleaned, { onConflict: 'key' });
    if (error) throw error;

    await logAdminAction(user.id, 'bulk_update_copy_strings', 'copy_strings', { count: cleaned.length });
    revalidatePath('/', 'layout');
    return { success: true };
}

// ─── CONTENT BLOCKS (Flexible Sections) ─────────────────────
export async function getContentBlocks(page: string, section?: string) {
    let query = supabaseAdmin.from('content_blocks').select('*').eq('page', page).order('sort_order');
    if (section) query = query.eq('section', section);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export async function saveContentBlock(data: {
    id?: string;
    page: string;
    section: string;
    block_type?: string;
    content: any;
    sort_order?: number;
    is_published?: boolean;
}) {
    const user = await requireAdmin();

    const record: any = {
        page: data.page,
        section: data.section,
        block_type: data.block_type || 'text',
        content: data.content,
        sort_order: data.sort_order ?? 0,
        is_published: data.is_published ?? true,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
    };

    if (data.id) record.id = data.id;

    const { data: block, error } = await supabaseAdmin
        .from('content_blocks')
        .upsert(record)
        .select()
        .single();

    if (error) throw error;

    await Promise.all([
        saveRevision('content_blocks', block.id, record, user.id, data.id ? 'update' : 'create'),
        logAdminAction(user.id, data.id ? 'update_content_block' : 'create_content_block', `${data.page}/${data.section}`, { block_id: block.id }),
    ]);

    revalidatePath('/', 'layout');
    return block;
}

export async function deleteContentBlock(id: string) {
    const user = await requireAdmin();

    const { error } = await supabaseAdmin.from('content_blocks').delete().eq('id', id);
    if (error) throw error;

    await Promise.all([
        saveRevision('content_blocks', id, { deleted: true }, user.id, 'delete'),
        logAdminAction(user.id, 'delete_content_block', id),
    ]);

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function reorderContentBlocks(orderedIds: string[]) {
    const user = await requireAdmin();

    const updates = orderedIds.map((id, index) =>
        supabaseAdmin.from('content_blocks').update({ sort_order: index, updated_at: new Date().toISOString() }).eq('id', id)
    );

    await Promise.all(updates);
    await logAdminAction(user.id, 'reorder_content_blocks', 'content_blocks', { ids: orderedIds });

    revalidatePath('/', 'layout');
    return { success: true };
}

// ─── SITE SECTIONS (Structured Content) ─────────────────────
export async function getSiteSections(page: string) {
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

export async function saveSiteSection(page: string, section_key: string, data: { title?: string; subtitle?: string; content_json?: any }) {
    try {
        console.log(`[saveSiteSection] Saving section "${section_key}" for page "${page}"`);
        const user = await requireAdmin();

        const record = {
            page,
            section_key,
            title: data.title || null,
            subtitle: data.subtitle || null,
            content_json: data.content_json || {},
            updated_by: user.id,
            updated_at: new Date().toISOString()
        };

        console.log('[saveSiteSection] Upserting record:', JSON.stringify(record, null, 2));

        const { data: upsertData, error } = await supabaseAdmin
            .from('site_sections')
            .upsert(record, { onConflict: 'page, section_key' })
            .select();

        if (error) {
            console.error('[saveSiteSection] Database error during upsert:', error);
            throw error;
        }

        console.log('[saveSiteSection] Upsert successful:', JSON.stringify(upsertData, null, 2));

        // Try these but don't crash if they fail
        console.log('[saveSiteSection] Saving revision and logging action...');
        await Promise.allSettled([
            saveRevision('site_sections', `${page}/${section_key}`, data, user.id),
            logAdminAction(user.id, 'update_site_section', `${page}/${section_key}`, data),
        ]);

        console.log('[saveSiteSection] Revalidating path and returning success');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (e) {
        console.error('[saveSiteSection] Caught error:', e);
        throw e;
    }
}

// Legacy compatibility wrappers
export async function saveLandingContent(section: string, content: any, isPublished: boolean = true) {
    return saveSiteSection('landing', section, { content_json: content });
}

export async function saveCourseContent(section: string, content: any, isPublished: boolean = true) {
    return saveSiteSection('guide', section, { content_json: content });
}

// ─── GUIDE MODULES & LESSONS ────────────────────────────────
export async function getGuideStructure() {
    try {
        console.log('[getGuideStructure] Fetching modules...');
        const { data: modules, error: modError } = await supabaseAdmin
            .from('guide_modules')
            .select('*')
            .order('order', { ascending: true });

        if (modError) {
            console.error('[getGuideStructure] Error fetching modules:', modError);
            throw modError;
        }

        console.log(`[getGuideStructure] Found ${modules?.length || 0} modules. Fetching lessons...`);
        const { data: lessons, error: lessonError } = await supabaseAdmin
            .from('guide_lessons')
            .select('*')
            .order('order', { ascending: true });

        if (lessonError) {
            console.error('[getGuideStructure] Error fetching lessons:', lessonError);
            throw lessonError;
        }

        const result = (modules || []).map(m => ({
            ...m,
            lessons: (lessons || []).filter(l => l.module_id === m.id)
        }));

        console.log('[getGuideStructure] Success building structure');
        return result;
    } catch (e) {
        console.error('[getGuideStructure] Exception:', e);
        throw e;
    }
}

export async function saveGuideModule(data: any) {
    try {
        console.log(`[saveGuideModule] Upserting module...`, data.id || 'NEW');
        const user = await requireAdmin();

        // Clean data: only include valid DB columns
        const record = {
            id: data.id || undefined,
            title: data.title,
            description: data.description || null,
            order: data.order ?? 0,
            is_published: data.is_published ?? true,
            updated_by: user.id,
            updated_at: new Date().toISOString()
        };

        const { data: module, error } = await supabaseAdmin
            .from('guide_modules')
            .upsert(record)
            .select()
            .single();

        if (error) {
            console.error('[saveGuideModule] Database error:', error);
            throw error;
        }

        console.log('[saveGuideModule] Success. Saving revision/log...');
        await Promise.allSettled([
            saveRevision('guide_modules', module.id, record, user.id, data.id ? 'update' : 'create'),
            logAdminAction(user.id, data.id ? 'update_module' : 'create_module', module.id, { title: data.title }),
        ]);

        revalidatePath('/guide');
        return module;
    } catch (e) {
        console.error('[saveGuideModule] Exception:', e);
        throw e;
    }
}

export async function deleteGuideModule(id: string) {
    try {
        console.log(`[deleteGuideModule] Deleting module ${id}...`);
        const user = await requireAdmin();
        const { error } = await supabaseAdmin.from('guide_modules').delete().eq('id', id);
        if (error) {
            console.error('[deleteGuideModule] Database error:', error);
            throw error;
        }

        await Promise.allSettled([
            saveRevision('guide_modules', id, { deleted: true }, user.id, 'delete'),
            logAdminAction(user.id, 'delete_module', id),
        ]);

        revalidatePath('/guide');
        return { success: true };
    } catch (e) {
        console.error('[deleteGuideModule] Exception:', e);
        throw e;
    }
}

export async function saveGuideLesson(data: any) {
    try {
        console.log(`[saveGuideLesson] Upserting lesson...`, data.id || 'NEW');
        const user = await requireAdmin();

        // Clean data: only include valid DB columns
        const record = {
            id: data.id || undefined,
            module_id: data.module_id,
            title: data.title,
            content: data.content || null,
            url: data.url || null,
            type: data.type || 'text',
            order: data.order ?? 0,
            is_published: data.is_published ?? true,
            updated_by: user.id,
            updated_at: new Date().toISOString()
        };

        const { data: lesson, error } = await supabaseAdmin
            .from('guide_lessons')
            .upsert(record)
            .select()
            .single();

        if (error) {
            console.error('[saveGuideLesson] Database error:', error);
            throw error;
        }

        console.log('[saveGuideLesson] Success. Saving revision/log...');
        await Promise.allSettled([
            saveRevision('guide_lessons', lesson.id, record, user.id, data.id ? 'update' : 'create'),
            logAdminAction(user.id, data.id ? 'update_lesson' : 'create_lesson', lesson.id, { title: data.title }),
        ]);

        revalidatePath('/guide');
        return lesson;
    } catch (e) {
        console.error('[saveGuideLesson] Exception:', e);
        throw e;
    }
}

export async function deleteGuideLesson(id: string) {
    const user = await requireAdmin();
    const { error } = await supabaseAdmin.from('guide_lessons').delete().eq('id', id);
    if (error) throw error;

    await Promise.all([
        saveRevision('guide_lessons', id, { deleted: true }, user.id, 'delete'),
        logAdminAction(user.id, 'delete_lesson', id),
    ]);

    revalidatePath('/guide');
    return { success: true };
}

export async function reorderGuideModules(orderedIds: string[]) {
    const user = await requireAdmin();
    const updates = orderedIds.map((id, index) =>
        supabaseAdmin.from('guide_modules').update({ order: index, updated_at: new Date().toISOString() }).eq('id', id)
    );
    await Promise.all(updates);
    await logAdminAction(user.id, 'reorder_modules', 'guide_modules', { ids: orderedIds });
    revalidatePath('/guide');
    return { success: true };
}

export async function reorderGuideLessons(moduleId: string, orderedIds: string[]) {
    const user = await requireAdmin();
    const updates = orderedIds.map((id, index) =>
        supabaseAdmin.from('guide_lessons').update({ order: index, updated_at: new Date().toISOString() }).eq('id', id)
    );
    await Promise.all(updates);
    await logAdminAction(user.id, 'reorder_lessons', moduleId, { ids: orderedIds });
    revalidatePath('/guide');
    return { success: true };
}

// ─── MEDIA HANDLING ─────────────────────────────────────────
export async function uploadMedia(formData: FormData) {
    const user = await requireAdmin();

    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabaseAdmin.storage
        .from('content-assets')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
        .from('content-assets')
        .getPublicUrl(filePath);

    await logAdminAction(user.id, 'upload_media', filePath, { originalName: file.name, size: file.size });

    return { url: publicUrl, path: filePath };
}

export async function deleteMedia(path: string) {
    const user = await requireAdmin();

    const { error } = await supabaseAdmin.storage
        .from('content-assets')
        .remove([path]);

    if (error) throw error;

    await logAdminAction(user.id, 'delete_media', path);
    return { success: true };
}

// ─── AUDIT LOGS ─────────────────────────────────────────────
export async function getAuditLogs(limit: number = 50) {
    try {
        await requireAdmin();
        const { data, error } = await supabaseAdmin
            .from('audit_logs')
            .select(`
                *,
                profiles (
                    email,
                    full_name
                )
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[getAuditLogs] Database error:', error);
            return []; // Return empty instead of throwing to prevent landing page crash
        }
        return data || [];
    } catch (e) {
        console.error('[getAuditLogs] Exception:', e);
        return [];
    }
}

// ─── CONTENT REVISIONS ─────────────────────────────────────
export async function getContentRevisions(tableName: string, recordId: string, limit: number = 20) {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
        .from('content_revisions')
        .select('*, profiles:changed_by(email, full_name)')
        .eq('table_name', tableName)
        .eq('record_id', recordId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}
