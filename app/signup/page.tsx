'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // 1. Provision user via API
            const provisionRes = await fetch('/api/auth/seamless', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, fullName }),
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

            // 3. Check profile for role/paid status to redirect
            if (authData.user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role, paid')
                    .eq('id', authData.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                }

                if (profile?.role === 'admin') {
                    router.push('/admin');
                } else if (profile?.paid) {
                    router.push('/guide'); // Replace with actual guide URL if different
                } else {
                    router.push('/dashboard'); // or payment page
                }
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Sign In / Sign Up</h1>
                    <p className="text-gray-500 mt-2">Enter your email to access your account</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name (Optional)</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5E2E] focus:border-[#0B5E2E] outline-none transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5E2E] focus:border-[#0B5E2E] outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0B5E2E] hover:bg-[#094a24] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
