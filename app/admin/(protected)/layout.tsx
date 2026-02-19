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
        <div className="h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar remains its own size in the flex row */}
            <AdminSidebar userEmail={user.email || ''} />

            {/* Main Content scrolls independently */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
