import AdminSidebar from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // console.log('[AdminLayout] User:', user?.email);

    if (!user) {
        redirect('/admin/login');
    }

    // Check if user is admin via profiles
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error || profile?.role !== 'admin') {
        console.warn(`[AdminLayout] ACCESS DENIED for ${user.email}. Redirecting.`);
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <AdminSidebar userEmail={user.email || ''} />

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
