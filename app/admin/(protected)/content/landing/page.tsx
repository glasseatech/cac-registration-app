import { getSiteSections } from '@/app/actions/admin';
import ContentEditor from '@/components/admin/ContentEditor';

export const revalidate = 0;

export default async function LandingCMSPage() {
    const sections = await getSiteSections('landing');

    const getInitial = (key: string, defaults: any) => sections[key] || defaults;

    return (
        <div className="space-y-12 pb-20">
            <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Homepage CMS</h2>
                <p className="text-gray-500 font-medium">Manage every piece of content on your landing page.</p>
            </div>

            {/* ───── HERO SECTION ───── */}
            <ContentEditor
                title="🎯 Hero Section"
                section="hero"
                page="landing"
                saveAction="saveSiteSection"
                initialData={getInitial('hero', {
                    headline: "Register Your Business with CAC",
                    subheadline: "A practical, step-by-step guide to help you register your business independently with the Corporate Affairs Commission (CAC).",
                    ctaText: "Get the Guide Now"
                })}
                fields={[
                    { key: 'headline', label: 'Main Headline', type: 'text' },
                    { key: 'subheadline', label: 'Sub Headline', type: 'textarea' },
                    { key: 'ctaText', label: 'Button Text', type: 'text' },
                ]}
            />

            {/* ───── HOW IT WORKS ───── */}
            <ContentEditor
                title="🔢 How It Works"
                section="how"
                page="landing"
                saveAction="saveSiteSection"
                initialData={getInitial('how', {
                    title: "How it works (3 simple steps)",
                    subtitle: "Everything is structured so you can move from zero to submitted registration without confusion.",
                    steps: []
                })}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'steps', label: 'Steps', type: 'list',
                        subFields: [
                            { key: 'kicker', label: 'Kicker (e.g. Step 1 • Enroll)', type: 'text' },
                            { key: 'title', label: 'Step Title', type: 'text' },
                            { key: 'description', label: 'Description', type: 'textarea' },
                            { key: 'icon', label: 'SVG Path (optional)', type: 'text' },
                        ]
                    },
                ]}
            />

            {/* ───── WHAT YOU GET ───── */}
            <ContentEditor
                title="📦 What You Get"
                section="what"
                page="landing"
                saveAction="saveSiteSection"
                initialData={getInitial('what', {
                    title: "What you get inside",
                    subtitle: "Built for clarity, speed, and confidence.",
                    features: [],
                    sideCardTitle: "Designed to feel official and reliable",
                    sideCardText: "The layout mirrors the way institutional processes work.",
                    chips: []
                })}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'features', label: 'Features', type: 'list',
                        subFields: [
                            { key: 'title', label: 'Feature Title', type: 'text' },
                            { key: 'description', label: 'Description', type: 'textarea' },
                        ]
                    },
                    { key: 'sideCardTitle', label: 'Side Card Title', type: 'text' },
                    { key: 'sideCardText', label: 'Side Card Text', type: 'textarea' },
                    {
                        key: 'chips', label: 'Chips / Tags', type: 'list',
                        subFields: [
                            { key: 'label', label: 'Chip Label', type: 'text' },
                        ]
                    },
                ]}
            />

            {/* ───── PROOF & TRUST ───── */}
            <ContentEditor
                title="🛡️ Proof & Trust"
                section="proof"
                page="landing"
                saveAction="saveSiteSection"
                initialData={getInitial('proof', {
                    title: "Proof & trust",
                    subtitle: "Social proof, sample screenshots space, and a secure payment flow.",
                    testimonials: [],
                    trustNoticeTitle: "Secure Payment via Paystack",
                    trustNoticeText: "Cards, bank transfer, USSD",
                    disclaimer: "This is an educational guide + support."
                })}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'testimonials', label: 'Testimonials', type: 'list',
                        subFields: [
                            { key: 'name', label: 'Name & Location', type: 'text' },
                            { key: 'quote', label: 'Short Quote', type: 'text' },
                            { key: 'text', label: 'Full Text', type: 'textarea' },
                            { key: 'stars', label: 'Stars (1-5)', type: 'number' },
                        ]
                    },
                    { key: 'trustNoticeTitle', label: 'Trust Notice Title', type: 'text' },
                    { key: 'trustNoticeText', label: 'Trust Notice Text', type: 'textarea' },
                    { key: 'disclaimer', label: 'Disclaimer Text', type: 'textarea' },
                ]}
            />

            {/* ───── ABOUT ───── */}
            <ContentEditor
                title="ℹ️ About This Course"
                section="about"
                page="landing"
                saveAction="saveSiteSection"
                initialData={getInitial('about', {
                    title: "About this course",
                    subtitle: "Built from real registration experiences.",
                    cards: []
                })}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'cards', label: 'About Cards', type: 'list',
                        subFields: [
                            { key: 'kicker', label: 'Kicker', type: 'text' },
                            { key: 'title', label: 'Card Title', type: 'text' },
                            { key: 'text', label: 'Card Text', type: 'textarea' },
                        ]
                    },
                ]}
            />

            {/* ───── PRICING ───── */}
            <ContentEditor
                title="💰 Pricing & Promo"
                section="pricing"
                page="landing"
                saveAction="saveSiteSection"
                initialData={getInitial('pricing', {
                    price: 5000,
                    originalPrice: 7500,
                    promoActive: true,
                    countdownEnd: "",
                    planTitle: "CAC Registration via SMEDAN (FREE) — Course Access",
                    planDesc: "Includes step-by-step guide, updates, and WhatsApp support.",
                    features: [],
                })}
                fields={[
                    { key: 'price', label: 'Current Price (NGN)', type: 'number' },
                    { key: 'originalPrice', label: 'Original Price (NGN)', type: 'number' },
                    { key: 'promoActive', label: 'Promo Active', type: 'boolean' },
                    { key: 'countdownEnd', label: 'Countdown End Date (ISO)', type: 'text', help: 'e.g. 2026-03-01T00:00:00Z' },
                    { key: 'planTitle', label: 'Plan Title', type: 'text' },
                    { key: 'planDesc', label: 'Plan Description', type: 'textarea' },
                    {
                        key: 'features', label: 'Pricing Features', type: 'list',
                        subFields: [
                            { key: 'title', label: 'Feature Title', type: 'text' },
                            { key: 'included', label: 'Included', type: 'boolean' },
                        ]
                    },
                ]}
            />

            {/* ───── FAQ ───── */}
            <ContentEditor
                title="❓ FAQ"
                section="faq"
                page="landing"
                saveAction="saveSiteSection"
                initialData={getInitial('faq', {
                    title: "FAQ",
                    subtitle: "Transparent answers to reduce hesitation.",
                    questions: []
                })}
                fields={[
                    { key: 'title', label: 'Section Title', type: 'text' },
                    { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
                    {
                        key: 'questions', label: 'Questions', type: 'list',
                        subFields: [
                            { key: 'q', label: 'Question', type: 'text' },
                            { key: 'a', label: 'Answer', type: 'textarea' },
                        ]
                    },
                ]}
            />

            {/* ───── CONTACT ───── */}
            <ContentEditor
                title="📞 Contact Info"
                section="contact"
                page="landing"
                saveAction="saveSiteSection"
                initialData={getInitial('contact', {
                    whatsapp: "2349161849691",
                    email: "crowglogroup@gmail.com"
                })}
                fields={[
                    { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
                    { key: 'email', label: 'Support Email', type: 'text' },
                ]}
            />
        </div>
    );
}
