import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Suspense } from 'react';
import AuthHandler from '@/components/auth/AuthHandler';
import FacebookPixel from '@/components/FacebookPixel';

export const metadata: Metadata = {
    title: 'CAC Registration via SMEDAN (FREE) — ₦5000 Promo Course',
    description: 'Get a step-by-step guide to register your business with CAC through SMEDAN for free. Limited-time promo: ₦5000.',
    verification: {
        google: "hqfisMNAQd7SOmeLWkyGvfNkF65N5qMTPErvkzVrt8U",
    },
};

export const viewport: Viewport = {
    themeColor: '#0B5E2E',
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
                <script src="https://js.paystack.co/v1/inline.js" async></script>
            </head>
            <body style={{ fontFamily: "'Inter', sans-serif" }}>
                <Suspense fallback={null}>
                    <AuthHandler />
                    <FacebookPixel />
                </Suspense>
                {children}
            </body>
        </html>
    );
}
