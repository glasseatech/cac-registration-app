'use client';

import React, { useState, useEffect } from 'react';
import { HeartCard, HeartButton, HeartBadge } from '@/components/ui/DesignSystem';
import GuideMobileNav from '@/components/GuideMobileNav';

interface GuideContentProps {
    cmsContent?: any;
    modules: any[];
    copy?: Record<string, string>;
}

export default function GuideContent({ cmsContent = {}, modules = [], copy = {} }: GuideContentProps) {
    const [activeModuleId, setActiveModuleId] = useState<string | null>(
        modules.length > 0 ? modules[0].id : null
    );
    const [toast, setToast] = useState<{ show: boolean; title: string; msg: string }>({ show: false, title: '', msg: '' });

    const showToast = (title: string, msg: string) => {
        setToast({ show: true, title, msg });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    const activeModule = modules.find(m => m.id === activeModuleId);

    // Copy string helper
    const c = (key: string, fallback: string = '') => copy[key] || fallback;

    // Dynamic header
    const headerTitle = cmsContent?.course_intro?.title || c('guide.header_title', "Welcome to CROWGLO HUB");
    const headerSub = cmsContent?.course_intro?.subtitle || c('guide.header_subtitle', "We are specialized in educational services and technology, helping small businesses thrive in Nigeria.");

    // Upsell data from CMS or defaults
    const upsellTitle = cmsContent?.upsell?.title || c('guide.upsell_title', "Maximize Your Success");
    const upsellSubtitle = cmsContent?.upsell?.subtitle || c('guide.upsell_subtitle', "We want to guide you further until your business is fully established and ready for the world.");

    // Settings for Sidebar/Labels
    const settings = cmsContent?.settings || {};
    const badgeText = settings.badge || c('guide.badge', 'Member Access');
    const sidebarTitle = settings.sidebar_title || c('guide.sidebar_title', 'Registration Journey');
    const helpTitle = settings.help_title || c('guide.help_title', 'Need Help?');
    const helpSubtitle = settings.help_subtitle || c('guide.help_subtitle', 'Our team is available for WhatsApp support.');
    const whatsappLink = settings.whatsapp || cmsContent?.contact?.whatsapp || c('footer.whatsapp_link', '2348000000000');

    const upsellItems = (cmsContent?.upsell?.items && cmsContent.upsell.items.length > 0)
        ? cmsContent.upsell.items
        : [
            { type: 'webinar', title: c('guide.upsell_webinar_title', 'Live Webinar'), description: c('guide.upsell_webinar_desc', 'Ask questions live, see a sample registration, and network with others.'), price: c('guide.upsell_webinar_price', '₦2,500'), btnText: c('guide.upsell_webinar_btn', 'Launching soon'), color: 'blue' },
            { type: 'ebook', title: c('guide.upsell_ebook_title', 'DIY E-Book'), description: c('guide.upsell_ebook_desc', 'A complete guide you can keep and revisit anytime for your business name.'), price: c('guide.upsell_ebook_price', '₦2,500'), btnText: c('guide.upsell_ebook_btn', 'Launching soon'), color: 'orange' },
            { type: 'session', title: c('guide.upsell_session_title', 'One-on-One Session'), description: c('guide.upsell_session_desc', 'Get dedicated personal guidance from our team until your business is fully registered. No limitations, just bold results.'), price: c('guide.upsell_session_price', '₦5,000'), btnText: c('guide.upsell_session_btn', 'Launching soon'), color: 'dark' },
        ];

    const colorMap: Record<string, { icon: string; bg: string; ring: string; btn: string; btnHover: string; shadow: string }> = {
        blue: { icon: 'text-blue-600', bg: 'bg-blue-50/50', ring: 'ring-blue-100', btn: 'bg-blue-600', btnHover: 'hover:bg-blue-700', shadow: 'shadow-blue-600/20' },
        orange: { icon: 'text-orange-600', bg: 'bg-orange-50/50', ring: 'ring-orange-100', btn: 'bg-orange-600', btnHover: 'hover:bg-orange-700', shadow: 'shadow-orange-600/20' },
        dark: { icon: 'text-white', bg: 'bg-white/5', ring: 'ring-white/20', btn: 'bg-white', btnHover: 'hover:bg-gray-100', shadow: 'shadow-white/10' },
    };

    const iconPaths: Record<string, string> = {
        webinar: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
        ebook: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
        session: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    };

    // Separate dark upsells from card upsells
    const cardUpsells = upsellItems.filter((item: any) => item.color !== 'dark');
    const darkUpsell = upsellItems.find((item: any) => item.color === 'dark');

    return (
        <div className="min-h-screen bg-[#FAFBFC] pb-24">
            {/* Desktop Header */}
            <header className="hidden md:block bg-gradient-to-br from-[#0B5E2E] to-[#1E8449] text-white py-20 px-6 text-center shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <HeartBadge color="green" className="mb-4 bg-white/20 text-white">{badgeText}</HeartBadge>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{headerTitle}</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
                        {headerSub}
                    </p>
                </div>
            </header>

            {/* Mobile Nav */}
            <GuideMobileNav
                modules={modules}
                activeModuleId={activeModuleId}
                onSelectModule={setActiveModuleId}
            />

            <main className="max-w-7xl mx-auto px-4 mt-8 md:-mt-16 flex flex-col lg:flex-row gap-8 lg:gap-12 pb-20">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-80 shrink-0">
                    <div className="sticky top-24">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-green-900/5 border border-gray-100/50 flex flex-col gap-4">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-2">{sidebarTitle}</h3>
                            {modules.map((m, idx) => (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveModuleId(m.id)}
                                    className={`
                                        w-full text-left p-5 rounded-2xl transition-all duration-500 flex items-center gap-4 group
                                        ${activeModuleId === m.id
                                            ? 'bg-[#0B5E2E] text-white shadow-xl shadow-green-900/20 translate-x-1'
                                            : 'text-gray-500 hover:bg-gray-50 hover:translate-x-1'}
                                    `}
                                >
                                    <div className={`
                                        w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] transition-colors
                                        ${activeModuleId === m.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-green-50 group-hover:text-[#0B5E2E]'}
                                    `}>
                                        {idx + 1}
                                    </div>
                                    <span className="font-bold text-sm leading-tight">{m.title}</span>
                                </button>
                            ))}
                        </div>

                        {/* Quick Help Card */}
                        <div className="mt-8 bg-gradient-to-br from-[#0B5E2E] to-[#1E8449] rounded-[2.2rem] p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="relative z-10 text-center">
                                <h4 className="font-black text-lg mb-2">{helpTitle}</h4>
                                <p className="text-white/80 text-sm font-medium mb-6">{helpSubtitle}</p>
                                <a
                                    href={`https://wa.me/${whatsappLink}`}
                                    target="_blank"
                                    className="inline-flex w-full items-center justify-center gap-2 bg-white text-[#0B5E2E] py-4 rounded-2xl font-black text-sm hover:shadow-lg transition-all active:scale-95"
                                >
                                    {c('guide.help_btn', 'Chat with Support')}
                                </a>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-1 space-y-12">
                    {activeModule ? (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                            {/* Module Header Card */}
                            <HeartCard className="overflow-hidden !p-0 border-none shadow-2xl shadow-green-900/5 ring-1 ring-gray-100">
                                <div className="bg-gradient-to-r from-gray-50 to-white p-8 md:p-12 border-b border-gray-100 flex items-end justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <HeartBadge color="green" className="font-black">{c('guide.module_label', 'Module')} {modules.indexOf(activeModule) + 1}</HeartBadge>
                                            <div className="h-px w-8 bg-gray-200"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{modules.length} {c('guide.modules_total', 'Modules Total')}</span>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">{activeModule.title}</h2>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center text-[#0B5E2E] font-black text-3xl italic">
                                            {modules.indexOf(activeModule) + 1}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 md:p-16 space-y-20">
                                    {activeModule.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any) => (
                                        <div key={lesson.id} className="relative pl-12 md:pl-20 group">
                                            {/* Progress Line */}
                                            <div className="absolute left-[6px] top-4 bottom-[-80px] w-[2px] bg-gradient-to-b from-green-500/20 via-gray-100 to-transparent group-last:hidden"></div>

                                            {/* Step Marker */}
                                            <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-white ring-4 ring-green-500 shadow-lg shadow-green-500/20 z-10 transition-transform group-hover:scale-125 duration-300"></div>

                                            <div className="space-y-6">
                                                <h3 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight leading-tight">{lesson.title}</h3>

                                                <div className="prose prose-green prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                                                    {lesson.content ? (
                                                        <div
                                                            className="[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-4 [&_a]:text-[#0B5E2E] [&_a]:font-black [&_a]:no-underline hover:[&_a]:underline"
                                                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                                                        />
                                                    ) : (
                                                        <p className="italic text-gray-400">{c('guide.empty_lesson', 'Step-by-step instructions for this section will appear here.')}</p>
                                                    )}
                                                </div>

                                                {lesson.url && (
                                                    <div className="pt-4">
                                                        <HeartButton
                                                            onClick={() => window.open(lesson.url, '_blank')}
                                                            className="px-10 py-5 bg-[#0B5E2E] text-white rounded-2xl shadow-xl shadow-green-900/10"
                                                        >
                                                            <span>{c('guide.access_resource', 'Access Resource')}</span>
                                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 012-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </HeartButton>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </HeartCard>
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#0B5E2E]">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 mb-2">{c('guide.empty_title', 'Ready to Start?')}</h3>
                            <p className="text-gray-400 font-bold max-w-sm mx-auto px-6">{c('guide.empty_subtitle', 'Select a module from the journey sidebar to begin your registration.')}</p>
                        </div>
                    )}

                    {/* Upsell Sections (CMS-driven) */}
                    <div className="mt-24 pt-24 border-t-2 border-dashed border-gray-100 relative">
                        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-[#FAFBFC] px-8 py-2">
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="text-center mb-16 px-4">
                            <HeartBadge color="orange" className="mb-4">{c('guide.upsell_badge', 'Value Addition')}</HeartBadge>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">{upsellTitle}</h2>
                            <p className="text-gray-500 font-medium mt-4 max-w-2xl mx-auto text-lg leading-relaxed">{upsellSubtitle}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {cardUpsells.map((item: any, idx: number) => {
                                const theme = colorMap[item.color] || colorMap.blue;
                                const iconPath = iconPaths[item.type] || iconPaths.webinar;
                                return (
                                    <HeartCard key={idx} className="flex flex-col items-center text-center p-12 transition-transform hover:scale-[1.02] duration-500">
                                        <div className={`w-24 h-24 ${theme.bg} rounded-[2rem] flex items-center justify-center mb-10 ${idx % 2 === 0 ? 'rotate-3' : '-rotate-3'} transition-transform group-hover:rotate-0 ring-1 ${theme.ring}`}>
                                            <svg className={`w-12 h-12 ${theme.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={iconPath}></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-black mb-4 tracking-tight">{item.title}</h3>
                                        <p className="text-gray-500 font-medium mb-10 text-lg leading-relaxed">{item.description}</p>
                                        <div className="text-4xl font-black text-[#0B5E2E] mb-10 italic bg-green-50 px-8 py-3 rounded-2xl">{item.price}</div>
                                        <HeartButton
                                            onClick={() => showToast("Launching soon", "We are currently putting the final touches on this. Stay tuned!")}
                                            className={`w-full ${theme.btn} ${theme.btnHover} shadow-xl ${theme.shadow} py-5 rounded-2xl`}
                                        >
                                            {item.btnText}
                                        </HeartButton>
                                    </HeartCard>
                                );
                            })}
                        </div>

                        {/* Dark (One-on-One) Upsell */}
                        {darkUpsell && (
                            <div className="mt-12 bg-gradient-to-br from-gray-900 to-[#121212] rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group border border-white/5 ring-1 ring-white/10">
                                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0B5E2E] blur-[150px] opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
                                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                                    <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center shrink-0 backdrop-blur-md border border-white/10 ring-1 ring-white/20 shadow-2xl">
                                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d={iconPaths[darkUpsell.type] || iconPaths.session}></path>
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-center lg:text-left">
                                        <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight tracking-[-0.03em]">{darkUpsell.title}</h3>
                                        <p className="text-gray-400 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-3xl">{darkUpsell.description}</p>
                                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-12">
                                            <div className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">{darkUpsell.price}</div>
                                            <HeartButton
                                                variant="primary"
                                                onClick={() => showToast("Launching soon", "We are currently putting the final touches on this. Stay tuned!")}
                                                className="bg-white !text-black hover:bg-gray-100 shadow-white/10 px-12 py-6 rounded-[1.8rem] transition-all font-black text-lg"
                                            >
                                                {darkUpsell.btnText}
                                            </HeartButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast ${toast.show ? 'show' : ''} fixed bottom-8 right-8 z-[1000] max-w-md w-full bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 flex items-start gap-4 animate-in slide-in-from-bottom-4 duration-300`} role="status">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#0B5E2E] shrink-0 border border-green-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <strong className="block text-gray-900 font-black text-sm">{toast.title}</strong>
                        <p className="text-gray-500 font-medium text-xs mt-1 leading-relaxed">{toast.msg}</p>
                    </div>
                    <button
                        onClick={() => setToast(prev => ({ ...prev, show: false }))}
                        className="text-gray-300 hover:text-gray-500 p-1 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
