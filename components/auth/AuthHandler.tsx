'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        const tokenHash = searchParams.get('token_hash');

        // If we land on a page with a code but NOT on the callback route, 
        // redirect to the callback route manually.
        if ((code || tokenHash) && !window.location.pathname.includes('/auth/callback')) {
            console.log('[AuthHandler] Detected auth params on non-callback route. Redirecting...');

            const next = searchParams.get('next') || '/';
            const type = searchParams.get('type') || 'magiclink';

            const newUrl = new URL('/auth/callback', window.location.origin);
            if (code) newUrl.searchParams.set('code', code);
            if (tokenHash) newUrl.searchParams.set('token_hash', tokenHash);
            newUrl.searchParams.set('next', next);
            newUrl.searchParams.set('type', type);

            router.replace(newUrl.pathname + newUrl.search);
        }
    }, [searchParams, router]);

    return null;
}
