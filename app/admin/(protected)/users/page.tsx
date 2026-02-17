import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function AdminUsersPage() {
    const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    async function markAsPaid(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await supabaseAdmin.from('profiles').update({ paid: true }).eq('id', id);
        // Also optional: Log this action using the server action we created
        // await logAdminAction(..., 'mark_paid', id);
        revalidatePath('/admin/users');
    }

    async function revokeAccess(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await supabaseAdmin.from('profiles').update({ paid: false }).eq('id', id);
        revalidatePath('/admin/users');
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <p className="text-gray-500">Manage access and view user details.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {profiles?.map((profile: any) => (
                                <tr key={profile.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{profile.full_name || '—'}</div>
                                        <div className="text-sm text-gray-500">{profile.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {profile.phone || '—'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {profile.paid ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Paid Access
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                                        {profile.role || 'user'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(profile.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {!profile.paid ? (
                                            <form action={markAsPaid} className="inline-block">
                                                <input type="hidden" name="id" value={profile.id} />
                                                <button type="submit" className="text-green-600 hover:text-green-900 font-medium">Grant Access</button>
                                            </form>
                                        ) : (
                                            <form action={revokeAccess} className="inline-block">
                                                <input type="hidden" name="id" value={profile.id} />
                                                <button type="submit" className="text-red-600 hover:text-red-900 ml-4">Revoke</button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {profiles?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
