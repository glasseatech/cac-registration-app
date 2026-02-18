'use client';

import React, { useState } from 'react';

interface GuideContentProps {
    cmsContent?: Record<string, any>;
}

export default function GuideContent({ cmsContent = {} }: GuideContentProps) {
    const [activeStage, setActiveStage] = useState(1);

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20">
            {/* Header */}
            <header className="bg-gradient-to-br from-[#0B5E2E] to-[#1E8449] text-white py-12 px-6 text-center shadow-xl">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Welcome to CROWGLO HUB</h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                        We are a diversified enterprise specialised in educational services and technology, helping small businesses thrive in Nigeria.
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 mt-[-40px]">
                {/* Intro Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 mb-10 border border-white/40 backdrop-blur-sm">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        To fulfill our mission, we hope to guide as many businesses as possible to get registered freely. Nigeria's economy requires wisdom to operate, and registering your business gives you a bold navigation amongst many uncertainties.
                    </p>
                    <div className="bg-green-50 border-l-4 border-[#0B5E2E] p-6 rounded-r-xl">
                        <p className="font-semibold text-[#0B5E2E] text-lg">
                            Kindly follow the guides below carefully and put your business in the face of the world for high profitability.
                        </p>
                    </div>
                </div>

                {/* Stages Navigation */}
                <div className="flex flex-wrap gap-4 mb-10">
                    {[1, 2, 3].map((stage) => (
                        <button
                            key={stage}
                            onClick={() => setActiveStage(stage)}
                            className={`flex-1 min-w-[120px] py-4 rounded-xl font-bold transition-all duration-300 text-sm uppercase tracking-wider shadow-md ${activeStage === stage
                                    ? 'bg-[#0B5E2E] text-white scale-105 shadow-[#0B5E2E]/20'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            Stage {stage}
                        </button>
                    ))}
                </div>

                {/* Stage Content */}
                <div className="space-y-8">
                    {activeStage === 1 && (
                        <section className="animate-fadeIn">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="bg-[#0B5E2E]/5 p-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-[#0B5E2E]">Stage 1: Initial Registration</h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Visit the Portal</h3>
                                            <p className="text-gray-600 mb-4">Click the link below to access the official SMEDAN portal.</p>
                                            <a href="https://smedan.org" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#0B5E2E] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1E8449] transition-colors shadow-lg">smedan.org</a>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Follow Registration Steps</h3>
                                            <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                                                <p className="font-medium">Complete the form as follows:</p>
                                                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                                    <li>Enter your primary business info</li>
                                                    <li>Provide accurate personal details</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Verification</h3>
                                            <p className="text-gray-600">Complete your verification through the automated system.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">4</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Download Certificate</h3>
                                            <p className="text-gray-600">Download your Smedan Certificate of Registration once approved.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeStage === 2 && (
                        <section className="animate-fadeIn">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="bg-[#0B5E2E]/5 p-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-[#0B5E2E]">Stage 2: Dashboard & Business Registration</h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">5</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Register Business on Dashboard</h3>
                                            <p className="text-gray-600">Glide to "Register Business" on your SMEDAN dashboard.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">6</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Operational Details</h3>
                                            <p className="text-gray-600">Follow the instructions to fill your most suitable operations.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">8</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
                                            <p className="text-gray-600">Fill in your necessary documents carefully.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">9</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Submit for Review</h3>
                                            <p className="text-gray-600 mb-4">Go back to your Dashboard and submit. Your Registration will be on review.</p>
                                            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-start gap-3">
                                                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <p className="text-sm">Keep an eye on the Gmail you used for the registration because that's where you will receive your Registered CAC document in not more than 30 days of review.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeStage === 3 && (
                        <section className="animate-fadeIn">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="bg-[#0B5E2E]/5 p-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-[#0B5E2E]">Stage 3: After Receiving CAC Email</h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Download from Gmail</h3>
                                            <p className="text-gray-600">Head over to your Gmail and download your certificate.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Verify on CAC Portal</h3>
                                            <p className="text-gray-600 mb-4">Paste this link in your browser:</p>
                                            <a href="https://cac-businessregistration.gov.ng" target="_blank" rel="noopener noreferrer" className="text-[#0B5E2E] font-bold hover:underline">cac-businessregistration.gov.ng</a>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">Search Business</h3>
                                            <p className="text-gray-600">Click "search business" and type your RC (Registration Code e.g 1234567).</p>
                                            <div className="mt-4 bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm italic">
                                                Note: You might see that your status report is not ready initially.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">6</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Get TIN</h3>
                                            <p className="text-gray-600">Click get TIN (Though it should be on your CAC Certificate).</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-full bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xl shrink-0">✓</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Final Report</h3>
                                            <p className="text-gray-600">Wait for another 72 hours and you will receive your status report. After this, you can open your Corporate Account.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Achievement Summary */}
                <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-[#0B5E2E]/10">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-3xl">🎉</span> What You've Achieved
                    </h2>
                    <ul className="space-y-4">
                        {[
                            "SMEDAN Certificate (Useable tentatively legally)",
                            "Business Registration under review",
                            "Ready for a Microfinance Business Account"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700">
                                <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-8 text-center font-bold text-[#0B5E2E]">Thanks for allowing us to help your business grow! We are glad to guide you.</p>
                </div>

                {/* Upsells Section */}
                <div className="mt-20 pt-10 border-t-2 border-dashed border-gray-200">
                    <h2 className="text-3xl font-bold text-center mb-12">Level Up Your Business</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Webinar */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Live Webinar</h3>
                            <p className="text-gray-600 mb-6 flex-grow">Join our live webinar to ask questions, see a live sample business registration, and network.</p>
                            <div className="text-2xl font-bold text-[#0B5E2E] mb-6">#2,500</div>
                            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg transition-colors">Register for Webinar</button>
                        </div>

                        {/* E-Book */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4">DIY E-Book</h3>
                            <p className="text-gray-600 mb-6 flex-grow">Prefer reading? Access the e-book version that guides you to register your business name for free.</p>
                            <div className="text-2xl font-bold text-[#0B5E2E] mb-6">#2,500</div>
                            <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 shadow-lg transition-colors">Get the E-Book</button>
                        </div>
                    </div>

                    {/* One on One */}
                    <div className="mt-8 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0B5E2E] blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white/10">
                                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-3xl font-bold mb-4">One-on-One Session</h3>
                                <p className="text-gray-400 text-lg mb-8">We will guide you personally until your business is fully registered and you're bold to express yourself without limitations.</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                    <div className="text-4xl font-bold text-white">#5,000</div>
                                    <button className="bg-white text-black font-bold px-10 py-4 rounded-2xl hover:bg-gray-200 transition-colors shadow-xl">Book Your Spot</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
