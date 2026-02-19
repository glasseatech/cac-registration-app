import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getURL } from '@/lib/utils/helpers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, amount, metadata } = body;

        if (!email || !amount) {
            return NextResponse.json({ error: 'Email and amount are required' }, { status: 400 });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100, // Paystack expects kobo
                metadata,
                callback_url: `${getURL()}/api/paystack/verify`, // Important: Server-side verification
            },
            {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Paystack Init Error:', error.response?.data || error);
        return NextResponse.json(
            { error: 'Payment initialization failed' },
            { status: error.response?.status || 500 }
        );
    }
}
