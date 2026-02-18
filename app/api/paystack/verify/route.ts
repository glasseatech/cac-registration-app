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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a202c; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #0B5E2E 0%, #08401f 100%); padding: 32px 20px; text-align: center; color: white; }
            .content { padding: 40px 30px; background: white; }
            .footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
            .button { display: inline-block; padding: 16px 32px; background: #FFB400; color: #1a1a1a !important; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px; margin: 24px 0; box-shadow: 0 4px 12px rgba(255,180,0,0.25); }
            .badge { display: inline-block; padding: 6px 12px; background: #f0fdf4; color: #166534; font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 999px; margin-bottom: 16px; }
            h2 { margin: 0 0 16px; font-size: 24px; color: #0f172a; letter-spacing: -0.02em; }
            p { margin: 0 0 16px; font-size: 16px; }
            .steps { background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0; }
            .step-item { display: flex; align-items: flex-start; margin-bottom: 12px; }
            .step-icon { margin-right: 12px; color: #16a34a; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">CAC Guide via SMEDAN</div>
              <div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">Premium Business Registration Guide</div>
            </div>
            <div class="content">
              <span class="badge">Payment Confirmed</span>
              <h2>Hello ${fullName || 'Success Seekers'},</h2>
              <p>Your payment of <strong>₦${amount}</strong> was successful! You now have lifetime access to the registration guide.</p>
              
              <div style="text-align: center;">
                <a href="${accessLink}" class="button">Access the Guide Now</a>
              </div>

              <div class="steps">
                <p style="margin-bottom: 12px; font-size: 15px; font-weight: 700; color: #334155;">Next Steps:</p>
                <div class="step-item">
                  <span class="step-icon">✓</span>
                  <span style="font-size: 14px;"><strong>Download the Checklist:</strong> Follow the step-by-step document prep.</span>
                </div>
                <div class="step-item">
                  <span class="step-icon">✓</span>
                  <span style="font-size: 14px;"><strong>Start Registration:</strong> Use the direct institucional links provided.</span>
                </div>
                <div class="step-item">
                   <span class="step-icon">✓</span>
                   <span style="font-size: 14px;"><strong>WhatsApp Support:</strong> Reply to this mail or <a href="${whatsappLink}" style="color: #16a34a; font-weight: 700;">Chat here</a> for help.</span>
                </div>
              </div>

              <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
                <em>Login Tip:</em> If prompted for login, use your payment email: <strong>${email}</strong>
              </p>
            </div>
            <div class="footer">
              <p style="margin-bottom: 8px;">© ${new Date().getFullYear()} CAC via SMEDAN Guide. All rights reserved.</p>
              <p>Built to help you grow your business professionally.</p>
            </div>
          </div>
        </body>
        </html>
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
