export const getURL = () => {
    let url = '';

    // 1. Prioritize browser origin for client-side calls
    if (typeof window !== 'undefined') {
        url = window.location.origin;
    } else {
        // 2. Server-side: use environment variables
        url = process?.env?.NEXT_PUBLIC_SITE_URL ??
            process?.env?.NEXT_PUBLIC_VERCEL_URL ??
            'http://localhost:3000';
    }

    // Ensure http(s)
    url = url.includes('http') ? url : `https://${url}`;
    // Remove ALL trailing slashes
    url = url.replace(/\/+$/, '');

    // Debugging (Remove in production if needed)
    // console.log('[getURL] Generated Base URL:', url);

    return url;
};
