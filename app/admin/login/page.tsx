'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Provision user via API
            const provisionRes = await fetch('/api/auth/seamless', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const provisionData = await provisionRes.json();

            if (!provisionRes.ok) {
                throw new Error(provisionData.error || 'Failed to initialize session');
            }

            // 2. Sign in seamlessly with the dummy password
            const supabase = createClient();
            const dummyPassword = 'SeamlessLogin123!@#';
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password: dummyPassword,
            });

            if (signInError) throw signInError;

            // 3. Check profile for admin role
            if (authData.user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', authData.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                }

                if (profile?.role === 'admin') {
                    router.push('/admin');
                } else {
                    // Not an admin
                    await supabase.auth.signOut();
                    setError('Unauthorized: You do not have admin privileges.');
                }
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in with your admin email
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0B5E2E] focus:border-[#0B5E2E] sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Login failed</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0B5E2E] hover:bg-[#094a24] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B5E2E] disabled:opacity-70 transition-colors"
                            >
                                {loading ? 'Logging in...' : 'Sign in to Admin'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
