import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!).update(body).digest('hex');

        if (hash !== req.headers.get('x-paystack-signature')) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);
        if (event.event !== 'charge.success') {
            return NextResponse.json({ status: 'ignored' });
        }

        const data = event.data;
        const reference = data.reference;
        const email = data.customer.email.toLowerCase();
        const amount = data.amount / 100;
        const metadata = data.metadata || {};
        const fullName = metadata.custom_fields?.find((f: any) => f.variable_name === 'full_name')?.value || metadata.full_name || '';
        const phone = metadata.custom_fields?.find((f: any) => f.variable_name === 'phone')?.value || metadata.phone || '';

        // 1. Check Idempotency
        const { data: existing } = await supabaseAdmin
            .from('payments')
            .select('id')
            .eq('reference', reference)
            .single();

        if (existing) return NextResponse.json({ status: 'already_processed' });

        // 2. Auth & Profile
        let userId: string | null = null;
        try {
            const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
            const existingUser = userData?.users?.find(u => u.email?.toLowerCase() === email);

            if (existingUser) {
                userId = existingUser.id;
            } else {
                const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
                    email,
                    email_confirm: true,
                    user_metadata: { full_name: fullName, phone: phone }
                });
                userId = newUser?.user?.id || null;
            }
        } catch (e) { console.error('Webhook Auth Error:', e); }

        if (userId) {
            await supabaseAdmin.from('profiles').upsert({
                id: userId,
                email,
                full_name: fullName,
                phone,
                paid: true,
                updated_at: new Date().toISOString()
            });
        }

        // 3. Record Payment
        const paymentData: any = {
            user_email: email,
            amount,
            reference,
            status: 'success',
            paid_at: data.paid_at,
            raw_payload: data,
            metadata
        };
        if (userId) paymentData.user_id = userId;

        const { error: pErr } = await supabaseAdmin.from('payments').insert(paymentData);
        if (pErr) throw pErr;

        // 4. Send Email
        const accessLink = `${process.env.NEXT_PUBLIC_SITE_URL}/guide`;
        try {
            await sendEmail({
                to: email,
                subject: 'Payment Successful - CAC Guide Access',
                html: `<p>Success! Access your guide here: <a href="${accessLink}">${accessLink}</a></p>`
            });
        } catch (e) { console.error('Webhook Email Error:', e); }

        return NextResponse.json({ status: 'success' });
    } catch (err: any) {
        console.error('Webhook Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
