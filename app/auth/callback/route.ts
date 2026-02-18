import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('Auth Callback Hit:', {
        hasCode: !!code,
        next,
        error: errorParam,
        description: errorDescription,
        url: request.url
    });

    if (errorParam) {
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${errorParam}&error_description=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('Auth Callback Exchange Error:', error);
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error.code || 'exchange_error'}&error_description=${encodeURIComponent(error.message)}`);
        }
    }

    // No code and no error param means the link might be malformed or something stripped the params
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code&error_description=${encodeURIComponent('The authentication code is missing from the URL. Please ensure the link was not modified.')}`);
}
