import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Email not sent.');
        return { success: false, error: 'Missing API Key' };
    }

    try {
        const fromEmail = process.env.EMAIL_FROM || 'CAC via SMEDAN Guide <onboarding@resend.dev>';
        const data = await resend.emails.send({
            from: fromEmail,
            to,
            subject,
            html,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
};
