'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- AUTH CHECK ---
async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') throw new Error('Forbidden: Admin access only');
    return user;
}

// --- DASHBOARD STATS ---
export async function getDashboardStats() {
    await requireAdmin();

    // Parallel fetching for performance
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

    // Calculate "Today" stats
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

// --- CMS: LANDING PAGE ---
export async function getLandingContent() {
    // Public access allowed for reading published content, requiring admin for draft
    // But here we want the "Edit" state, so we check admin
    await requireAdmin();

    // Fetch all sections
    const { data } = await supabaseAdmin
        .from('cms_content')
        .select('*')
        .eq('type', 'landing');

    // Transform into a cleaner object keyed by section
    const contentMap: Record<string, any> = {};
    data?.forEach((item: any) => {
        contentMap[item.section] = item;
    });

    return contentMap;
}

export async function saveLandingContent(section: string, content: any, isPublished = false) {
    const user = await requireAdmin();

    // Upsert content
    const { error } = await supabaseAdmin.from('cms_content').upsert({
        type: 'landing',
        section,
        content,
        is_published: isPublished,
        updated_by: user.id,
        updated_at: new Date().toISOString()
    }, { onConflict: 'type, section, is_published' });

    if (error) {
        console.error('Save Content Error', error);
        throw new Error('Failed to save content');
    }

    // Log Action
    await logAdminAction(user.id, 'update_content', `landing_${section}`, { isPublished });

    revalidatePath('/', 'layout'); // Revalidate homepage and layouts
    return { success: true };
}

// --- SETTINGS ---
export async function getSettings() {
    // Public read is allowed via RLS, but this is a helper
    const { data } = await supabaseAdmin.from('settings').select('*');
    const settingsMap: Record<string, any> = {};
    data?.forEach((item: any) => {
        settingsMap[item.key] = item.value;
    });
    return settingsMap;
}

export async function updateSetting(key: string, value: any) {
    const user = await requireAdmin();
    await supabaseAdmin.from('settings').upsert({
        key,
        value,
        updated_by: user.id,
        updated_at: new Date().toISOString()
    });
    revalidatePath('/');
    return { success: true };
}

// --- CMS: COURSE CONTENT ---
export async function getCourseContent() {
    await requireAdmin();
    const { data } = await supabaseAdmin
        .from('cms_content')
        .select('*')
        .eq('type', 'course');

    const contentMap: Record<string, any> = {};
    data?.forEach((item: any) => {
        contentMap[item.section] = item;
    });

    return contentMap;
}

export async function saveCourseContent(section: string, content: any, isPublished = false) {
    const user = await requireAdmin();

    const { error } = await supabaseAdmin.from('cms_content').upsert({
        type: 'course',
        section,
        content,
        is_published: isPublished,
        updated_by: user.id,
        updated_at: new Date().toISOString()
    }, { onConflict: 'type, section, is_published' });

    if (error) {
        console.error('Save Course Content Error', error);
        throw new Error('Failed to save course content');
    }

    await logAdminAction(user.id, 'update_content', `course_${section}`, { isPublished });

    revalidatePath('/guide');
    return { success: true };
}

// --- AUDIT LOGS ---
async function logAdminAction(adminId: string, action: string, resource: string, details?: any) {
    await supabaseAdmin.from('audit_logs').insert({
        admin_id: adminId,
        action,
        resource,
        details
    });
}
