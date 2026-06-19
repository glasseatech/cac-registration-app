import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

export async function POST(request: Request) {
    try {
        const { email, fullName } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // We use a universal dummy password to simulate "seamless" login while still satisfying Supabase's need for a credential.
        const dummyPassword = 'SeamlessLogin123!@#';

        // 1. Try to find the user
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
            console.error('Error listing users:', listError);
            return NextResponse.json({ error: 'Failed to verify user.' }, { status: 500 });
        }

        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            // User exists, update their password to the dummy password just in case they were created via magic link
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                password: dummyPassword,
                email_confirm: true
            });

            if (updateError) {
                console.error('Error updating user password:', updateError);
                return NextResponse.json({ error: 'Failed to prepare user session.' }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'User provisioned for seamless login.' });
        } else {
            // User doesn't exist, create them
            const { error: createError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password: dummyPassword,
                email_confirm: true,
                user_metadata: {
                    full_name: fullName || ''
                }
            });

            if (createError) {
                console.error('Error creating user:', createError);
                return NextResponse.json({ error: createError.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'User created and provisioned for seamless login.' });
        }
    } catch (error: any) {
        console.error('Seamless auth error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
