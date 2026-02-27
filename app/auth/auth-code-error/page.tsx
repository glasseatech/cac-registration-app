'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h1>

                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-6 text-left">
                    <p><strong>Code:</strong> {error || 'Unknown'}</p>
                    <p><strong>Details:</strong> {error_description || 'An unexpected error occurred during sign in.'}</p>
                </div>

                <p className="text-gray-600 mb-6 text-sm">
                    This often happens if the link has expired or has already been used.
                </p>

                <Link
                    href="/signup"
                    className="inline-block w-full bg-[#0B5E2E] hover:bg-[#094a24] text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                    Try Again
                </Link>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div>Loading error...</div>}>
            <ErrorContent />
        </Suspense>
    );
}
