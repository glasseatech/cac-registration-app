import { getLandingContent } from '@/app/actions/admin';
import ContentEditor from '@/components/admin/ContentEditor';

export const revalidate = 0;

export default async function LandingCMSPage() {
    const content = await getLandingContent();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Homepage Content</h2>
                <p className="text-gray-500">Edit the content of your landing page.</p>
            </div>

            <ContentEditor
                title="Hero Section"
                section="hero"
                initialData={content['hero']?.content || {
                    headline: "Register Your Business with CAC",
                    subheadline: "Step-by-step guide to protect your business name.",
                    ctaText: "Get Started"
                }}
                fields={[
                    { key: 'headline', label: 'Main Headline', type: 'text' },
                    { key: 'subheadline', label: 'Sub Headline', type: 'textarea' },
                    { key: 'ctaText', label: 'Button Text', type: 'text' },
                ]}
            />

            <ContentEditor
                title="Pricing & Promo"
                section="pricing"
                initialData={content['pricing']?.content || {
                    price: 1000,
                    originalPrice: 3000,
                    promoActive: true,
                    countdownEnd: ""
                }}
                fields={[
                    { key: 'price', label: 'Current Price (NGN)', type: 'number' },
                    { key: 'originalPrice', label: 'Original/Crossed-out Price (NGN)', type: 'number' },
                    { key: 'promoActive', label: 'Promo Active', type: 'boolean', help: 'Show the countdown and discount badge' },
                    { key: 'countdownEnd', label: 'Countdown Date (Timestamp Ms)', type: 'number', help: 'Epoch timestamp for countdown end. Leave 0 to auto-reset every 24h.' },
                ]}
            />

            <ContentEditor
                title="Contact Info"
                section="contact"
                initialData={content['contact']?.content || {
                    whatsapp: "2348000000000",
                    email: "support@example.com"
                }}
                fields={[
                    { key: 'whatsapp', label: 'WhatsApp Number (International format)', type: 'text' },
                    { key: 'email', label: 'Support Email', type: 'text' },
                ]}
            />

            <ContentEditor
                title="How It Works"
                section="how"
                initialData={content['how']?.content || {
                    title: "How it works (3 simple steps)",
                    subtitle: "Everything is structured so you can move from zero to submitted registration without confusion.",
                    steps: [
                        { title: "Enroll for ₦1000 promo access", description: "Make a secure payment via Paystack and receive your access link immediately.", kicker: "Step 1 • Enroll" },
                        { title: "Use the step-by-step checklist", description: "See what to prepare, what to enter, and what to double-check to avoid rejections/delays.", kicker: "Step 2 • Follow guide" },
                        { title: "Apply using the SMEDAN pathway", description: "The course explains the SMEDAN-supported process where CAC fees are covered.", kicker: "Step 3 • Register via SMEDAN" }
                    ]
                }}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'steps',
                        label: 'Steps List',
                        type: 'list',
                        subFields: [
                            { key: 'kicker', label: 'Badge/Kicker', type: 'text' },
                            { key: 'title', label: 'Step Title', type: 'text' },
                            { key: 'description', label: 'Description', type: 'textarea' },
                        ]
                    },
                ]}
            />

            <ContentEditor
                title="What You Get (Inside)"
                section="what"
                initialData={content['what']?.content || {
                    title: "What you get inside",
                    subtitle: "Built for clarity, speed, and confidence — with support when you need it.",
                    features: [
                        { title: "Step-by-step guide page", description: "Simple flow, screenshots, and checklists so you don’t miss anything." },
                        { title: "WhatsApp support", description: "Ask questions and get guided on common blockers and corrections." },
                        { title: "Lifetime access", description: "Revisit the guide anytime — no expiring login drama." },
                        { title: "Updated instructions", description: "When forms/links change, the guide is refreshed so you stay current." }
                    ],
                    sideCardTitle: "Designed to feel official and reliable",
                    sideCardText: "The layout mirrors the way institutional processes work: requirements → steps → submission → follow-up. No noise, no hype.",
                    chips: ["Beginner-friendly", "Clear checklists", "Fast support", "Secure checkout"]
                }}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'features',
                        label: 'Features List',
                        type: 'list',
                        subFields: [
                            { key: 'title', label: 'Feature Title', type: 'text' },
                            { key: 'description', label: 'Feature Description', type: 'textarea' },
                        ]
                    },
                    { key: 'sideCardTitle', label: 'Side Card Title', type: 'text' },
                    { key: 'sideCardText', label: 'Side Card Content', type: 'textarea' },
                ]}
            />

            <ContentEditor
                title="Proof, Trust & Testimonials"
                section="proof"
                initialData={content['proof']?.content || {
                    title: "Proof & trust",
                    subtitle: "Social proof, sample screenshots space, and a secure payment flow your customers recognize.",
                    testimonials: [
                        { name: "Amaka • Lagos", text: "I didn’t know where to start. The checklist and screenshots made everything straightforward, and support replied fast.", quote: "Clear steps, no confusion.", stars: 5 },
                        { name: "Mustapha • Abuja", text: "I avoided common mistakes that cause delays. The guide is structured like an official process.", quote: "Saved me time.", stars: 5 },
                        { name: "Ifeoma • Enugu", text: "For ₦1000 promo it’s a no-brainer. The updates also help because links and steps change.", quote: "Worth it even at ₦3000.", stars: 5 }
                    ],
                    trustNoticeTitle: "Secure Payment via Paystack",
                    trustNoticeText: "Cards, bank transfer, USSD (options depend on Paystack settings)",
                    disclaimer: "This is an educational guide + support to help you complete your SMEDAN/CAC process correctly. We are not a government agency and do not issue certificates ourselves."
                }}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'testimonials',
                        label: 'Testimonials',
                        type: 'list',
                        subFields: [
                            { key: 'name', label: 'User Name/Location', type: 'text' },
                            { key: 'quote', label: 'Quote Headline', type: 'text' },
                            { key: 'text', label: 'Full Review Text', type: 'textarea' },
                            { key: 'stars', label: 'Stars (1-5)', type: 'number' },
                        ]
                    },
                    { key: 'trustNoticeTitle', label: 'Trust Notice Title', type: 'text' },
                    { key: 'trustNoticeText', label: 'Trust Notice Text', type: 'textarea' },
                    { key: 'disclaimer', label: 'Footer Disclaimer', type: 'textarea' },
                ]}
            />

            <ContentEditor
                title="FAQ Section"
                section="faq"
                initialData={content['faq']?.content || {
                    title: "FAQ",
                    subtitle: "Transparent answers to reduce hesitation and increase trust.",
                    questions: [
                        { q: "Is CAC registration really free through SMEDAN?", a: "SMEDAN-supported programs may cover CAC registration fees for eligible applicants and while program slots/funding are available. The course explains how to follow that pathway correctly." },
                        { q: "What am I paying ₦1000 for?", a: "You’ll receive your access link by email after payment. WhatsApp support included." }
                    ]
                }}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'questions',
                        label: 'Questions & Answers',
                        type: 'list',
                        subFields: [
                            { key: 'q', label: 'Question', type: 'text' },
                            { key: 'a', label: 'Answer', type: 'textarea' },
                        ]
                    },
                ]}
            />
        </div>
    );
}
