import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.redirect(new URL('/?error=no_reference', req.url));
  }

  console.log(`[Verify] Starting verification for reference: ${reference}`);

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
    if (!data || data.status !== 'success') {
      console.error('[Verify] Paystack Verification Failed:', data);
      return NextResponse.redirect(new URL('/?error=verification_failed', req.url));
    }

    const email = data.customer.email.toLowerCase();
    const amountNGN = Math.floor(data.amount / 100);
    const metadata = data.metadata || {};
    const fullName = metadata.custom_fields?.find((f: any) => f.variable_name === 'full_name')?.value || metadata.full_name || '';
    const phone = metadata.custom_fields?.find((f: any) => f.variable_name === 'phone')?.value || metadata.phone || '';

    console.log(`[Verify] Payment verified for ${email}. Amount: ₦${amountNGN}`);

    // 2. Idempotency Check
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('reference', reference)
      .single();

    if (existingPayment) {
      console.log(`[Verify] Reference ${reference} already processed. Redirecting.`);
      return NextResponse.redirect(new URL('/guide', req.url));
    }

    // 3. User Lookup/Creation
    let userId: string | null = null;

    // Check profiles first
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (profile) {
      userId = profile.id;
      console.log(`[Verify] Found existing profile ID: ${userId}`);
    } else {
      console.log(`[Verify] No profile found for ${email}. Checking auth...`);
      // Check auth users directly to avoid profile creation failure if auth user already exists
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuth = authUsers.users.find(u => u.email?.toLowerCase() === email);

      if (existingAuth) {
        userId = existingAuth.id;
        console.log(`[Verify] Found existing auth user ID: ${userId}`);
      } else {
        // Provision new user
        console.log(`[Verify] Provisioning new auth user for ${email}`);
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          email_confirm: true,
          user_metadata: { full_name: fullName, phone: phone }
        });

        if (newUser?.user) {
          userId = newUser.user.id;
          console.log(`[Verify] Created new auth user ID: ${userId}`);
        } else {
          console.error('[Verify] Auth User Creation Failed:', createError);
        }
      }
    }

    // 4. Record Payment (CRITICAL)
    const paymentRecord: any = {
      user_email: email,
      amount: amountNGN,
      reference: reference,
      status: 'success',
      paid_at: data.paid_at,
      raw_payload: data,
      metadata: metadata,
      currency: data.currency || 'NGN'
    };

    if (userId) paymentRecord.user_id = userId;

    const { error: pError } = await supabaseAdmin
      .from('payments')
      .insert(paymentRecord);

    if (pError) {
      console.error('[Verify] DATABASE INSERT ERROR (PAYMENTS):', pError);
      // We throw here but catch later to redirect with the specific DB error
      throw new Error(`DB_INSERT_FAILED: ${pError.message}`);
    }
    console.log('[Verify] Payment record saved successfully.');

    // 5. Update Profile (Bypass RLS via Admin Client)
    if (userId) {
      const { error: profUpdateError } = await supabaseAdmin.from('profiles').upsert({
        id: userId,
        email: email,
        full_name: fullName,
        phone: phone,
        paid: true,
        updated_at: new Date().toISOString()
      });
      if (profUpdateError) console.error('[Verify] Profile update failed:', profUpdateError);
      else console.log('[Verify] Profile marked as paid.');
    }

    // 6. Background Actions (Email)
    try {
      const accessLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://' + req.headers.get('host')}/guide`;
      const whatsappNumber = "2349161849691";

      await sendEmail({
        to: email,
        subject: 'Welcome! Your CAC Guide Access',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #0B5E2E; text-align: center;">Payment Confirmed!</h2>
            <p>Hi ${fullName || 'there'},</p>
            <p>Your payment for the <strong>CAC Registration Guide</strong> has been received. You now have lifetime access.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${accessLink}" style="background: #FFB400; color: #000; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access your Guide Now</a>
            </div>
            <p>If you need help, feel free to contact us on WhatsApp: <a href="https://wa.me/${whatsappNumber}">+${whatsappNumber}</a></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">© CAC Registration Guide via SMEDAN</p>
          </div>
        `
      });

      await supabaseAdmin.from('email_logs').insert({
        user_email: email,
        type: 'welcome',
        status: 'sent',
        created_at: new Date().toISOString()
      });
      console.log('[Verify] Success email triggered.');
    } catch (e) {
      console.error('[Verify] Background email failed:', e);
    }

    // 7. Success Redirect
    const successUrl = new URL('/guide', req.url);
    successUrl.searchParams.set('payment', 'success');
    return NextResponse.redirect(successUrl);

  } catch (error: any) {
    console.error('[Verify] FATAL EXCEPTION:', error);
    const errorMsg = error.message || 'verification_error';
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(errorMsg)}`, req.url));
  }
}
