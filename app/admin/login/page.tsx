'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { getURL } from '@/lib/utils/helpers';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const redirectTo = `${getURL()}/auth/callback?next=/admin`;
        console.log('[AdminLogin] Attempting sign-in with redirect:', redirectTo);
        console.log('[AdminLogin] Current Origin:', typeof window !== 'undefined' ? window.location.origin : 'server');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // Redirect back to admin dashboard after login
                emailRedirectTo: redirectTo,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSent(true);
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
                    Sign in to manage your application
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    {sent ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
                            <p className="text-gray-600 mb-6">
                                A secure sign-in link has been sent to <strong>{email}</strong> for Admin access.
                            </p>
                            <button
                                onClick={() => setSent(false)}
                                className="text-sm text-[#0B5E2E] hover:text-[#094a24] font-medium"
                            >
                                Use a different email
                            </button>
                        </div>
                    ) : (
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
                                    {loading ? 'Sending Link...' : 'Sign in'}
                                </button>
                            </div>

                            {/* Debug Section */}
                            {mounted && (
                                <div className="mt-8 pt-6 border-t border-gray-100 text-[10px] space-y-2 opacity-50 hover:opacity-100 transition-opacity">
                                    <p className="font-bold uppercase tracking-widest text-gray-400">Debug Info (Developer)</p>
                                    <div className="bg-gray-50 p-2 rounded border border-gray-200 font-mono break-all text-gray-700">
                                        <span className="text-gray-500">Redirecting to:</span><br />
                                        {getURL()}/auth/callback?next=/admin
                                    </div>
                                    <p className="leading-tight text-gray-500">
                                        Ensure this exact URL is in your **Supabase Auth {"->"} Redirect URLs** list.
                                    </p>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
