import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
        return NextResponse.json({ error: 'No reference provided' }, { status: 400 });
    }

    try {
        // 1. Verify with Paystack
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) throw new Error('Paystack secret key missing');

        const verifyRes = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                },
            }
        );

        const data = verifyRes.data.data;

        if (data.status !== 'success') {
            return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
        }

        // 2. Check if already processed
        const { data: existingPayment } = await supabaseAdmin
            .from('payments')
            .select('id')
            .eq('reference', reference)
            .single();

        if (existingPayment) {
            return NextResponse.redirect(new URL('/guide', req.url));
        }

        const email = data.customer.email.toLowerCase();
        const amount = data.amount / 100; // Convert kobo to NGN
        const paidAt = data.paid_at;
        // Paystack metadata is often nested in data.metadata
        const metadata = data.metadata || {};
        const customFields = metadata.custom_fields || [];
        const fullName = customFields.find((f: any) => f.variable_name === 'full_name')?.value || metadata.full_name;
        const phone = customFields.find((f: any) => f.variable_name === 'phone')?.value || metadata.phone;

        // 3. Record User Profile (Supabase Auth aware)
        // Check if user exists in auth.users (via email) or profiles
        // Note: We cannot create an auth user via Admin API easily without sending an invite, 
        // so we just ensure a profile exists linked to the email if we can find the ID, 
        // OR we create a "shadow" profile if the user hasn't signed up yet.
        // STRATEGY: Create a profile entry. If the ID matches an existing auth user, great. 
        // If not, we store it by email. But profiles PKey is UUID.
        // So, we first look up if an auth user exists.

        let userId: string | null = null;

        // Try to find user by email
        const { data: authUser } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = authUser.users.find(u => u.email?.toLowerCase() === email);

        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Create a new Auth user (Silent Provisioning)
            // We create a user with a random password so they can claim it via Magic Link later
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                email_confirm: true,
                user_metadata: { full_name: fullName, phone: phone }
            });
            if (newUser.user) {
                userId = newUser.user.id;
            } else {
                console.error("Failed to create auth user:", createError);
                // Fallback: Proceed without linking to auth (should not happen usually)
            }
        }

        if (userId) {
            // Update Profile
            await supabaseAdmin.from('profiles').upsert({
                id: userId,
                email: email,
                full_name: fullName,
                phone: phone,
                paid: true,
                updated_at: new Date().toISOString()
            });
        }

        // 4. Record Payment
        const { error: paymentError } = await supabaseAdmin.from('payments').insert({
            user_id: userId, // Link if we have it
            user_email: email,
            amount,
            reference,
            status: data.status,
            paid_at: paidAt,
            raw_payload: data,
            metadata: metadata,
        });

        if (paymentError) throw paymentError;

        // 5. Send Welcome Email
        const accessLink = `${process.env.NEXT_PUBLIC_SITE_URL}/guide`; // Direct link now
        const whatsappLink = "https://wa.me/2348000000000";

        const emailRes = await sendEmail({
            to: email,
            subject: 'Welcome! Your CAC Registration Guide Access',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${fullName || 'there'},</h2>
          <p>We confirm your payment of ₦${amount} was successful.</p>
          <p>You now have full access to the <strong>CAC Registration via SMEDAN Guide</strong>.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
            <p style="margin:0;"><strong>Your Access Link:</strong></p>
            <a href="${accessLink}" style="display:block; margin-top:5px; color: #15803d; font-weight:bold;">${accessLink}</a>
            <p style="font-size:12px; color: #666; margin-top:5px;">(Click to view the guide)</p>
            <p style="font-size:12px; color: #666; margin-top:5px;"><em>If asked to sign in, use your email: ${email}</em></p>
          </div>

          <p><strong>What you get:</strong></p>
          <ul>
            <li>Step-by-step registration checklist</li>
            <li>Document preparation guide</li>
            <li><a href="${whatsappLink}">WhatsApp Support</a> (Direct chat)</li>
          </ul>

          <p>We’re happy to help you succeed.</p>
          <hr style="border:0; border-top:1px solid #eee; margin: 20px 0;">
          <p style="font-size:12px; color: #888;">If you have issues, reply to this email.</p>
        </div>
      `,
        });

        // Log Email
        await supabaseAdmin.from('email_logs').insert({
            user_email: email,
            type: 'welcome',
            status: emailRes.success ? 'sent' : 'failed',
            provider_response: emailRes.data || emailRes.error
        });

        // 6. Redirect to Guide
        const guideUrl = new URL('/guide', req.url);
        // We cannot set session cookie here for the user easily because this is a server-to-server call (webhook) 
        // OR a redirect from Paystack where we are the server.
        // If it's a redirect, we can try to set a session if we had the refresh token, but we don't.
        // The user will have to "Sign In" via Magic Link if they are not already.
        // However, we can append a flag `?payment=success` to show a toast on the frontend.
        guideUrl.searchParams.set('payment', 'success');

        return NextResponse.redirect(guideUrl);

    } catch (error: any) {
        console.error('Verification Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
