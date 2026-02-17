'use client';

import React, { useState, useEffect } from 'react';

interface GuideContentProps {
    cmsContent?: Record<string, any>;
}

export default function GuideContent({ cmsContent = {} }: GuideContentProps) {
    const [activeAccordions, setActiveAccordions] = useState<Record<string, boolean>>({
        step1Content: true, // Default open as per original script
    });

    const [activeFaqs, setActiveFaqs] = useState<Record<string, boolean>>({});

    // Step completion state
    const [steps, setSteps] = useState<Record<string, boolean>>({
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
    });

    const toggleAccordion = (id: string) => {
        setActiveAccordions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleFAQ = (id: string) => {
        setActiveFaqs(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const updateStep = (id: string) => {
        setSteps(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const completedCount = Object.values(steps).filter(Boolean).length;
    const totalSteps = Object.keys(steps).length;
    const progressPercent = Math.round((completedCount / totalSteps) * 100);

    // Helper for safe list access with fallbacks
    const getList = (list: any[] | undefined, fallback: any[]) => {
        return (list && list.length > 0) ? list : fallback;
    };

    // Scroll to completion section when done
    useEffect(() => {
        if (completedCount === totalSteps) {
            const el = document.getElementById('completionSection');
            if (el) {
                el.style.display = 'block';
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [completedCount, totalSteps]);

    return (
        <div className="min-h-screen bg-[#F8F9FA]" style={{ backgroundImage: 'linear-gradient(135deg, rgba(11, 94, 46, 0.05) 0%, rgba(15, 28, 46, 0.05) 100%)' }}>
            {/* Header Bar */}
            <header className="bg-gradient-to-br from-[#009463] to-[#0b8b3c] text-white py-4 px-3 sm:px-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    {/* Left: title + badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                            {cmsContent.course_intro?.title || "CAC Registration Guide (SMEDAN Method)"}
                        </h1>
                        <span className="inline-flex w-fit bg-yellow-400 text-[#0F1C2E] text-xs font-semibold px-2 py-1 rounded-full">
                            {cmsContent.course_intro?.badge || "Member Access"}
                        </span>
                    </div>

                    {/* Right: WhatsApp */}
                    <a href={`https://wa.me/${cmsContent.contact?.whatsapp || '2348000000000'}`} target="_blank" rel="noopener noreferrer"
                        className="bg-gradient-to-br from-[#F4B400] to-[#F9A825] text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-105 transition-transform shadow-md">
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                        </svg>
                        <span className="whitespace-nowrap">WhatsApp Support</span>
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Progress Indicator */}
                <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Your Progress</h2>
                        <span className="text-sm font-medium text-gray-600">{progressPercent}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-[#0B5E2E] to-[#1E8449] h-3 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Complete each step to track your progress</p>
                </div>

                {/* Step 1 */}
                <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="shrink-0 pt-0.5">
                                <input type="checkbox" checked={steps.step1} onChange={() => updateStep('step1')}
                                    className={`w-5 h-5 text-green-600 rounded focus:ring-green-500 ${steps.step1 ? 'animate-[checkmark_0.3s_ease-in-out]' : ''}`} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                    {cmsContent.step1?.title || "Step 1: Understand the SMEDAN Opportunity"}
                                </h3>

                                <div className={`overflow-hidden transition-all duration-350 ease-in-out ${activeAccordions.step1Content ? 'max-h-[1800px]' : 'max-h-0'}`}>
                                    <div className="mt-4 space-y-4">
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                            {cmsContent.step1?.text || "The Small and Medium Enterprises Development Agency of Nigeria (SMEDAN) has partnered with the Corporate Affairs Commission (CAC) to offer free business registration for eligible entrepreneurs."}
                                        </p>

                                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                            <h4 className="font-semibold text-green-800 mb-2">{cmsContent.step1?.notesTitle || "Important Notes:"}</h4>
                                            <ul className="text-sm text-green-700 space-y-1">
                                                {getList(cmsContent.step1?.notes, [
                                                    { item: "This program covers the full CAC registration fee (normally ₦10,000+)" },
                                                    { item: "Limited to one business per individual" },
                                                    { item: "Must be a Nigerian citizen or legal resident" }
                                                ]).map((note: any, idx: number) => (
                                                    <li key={idx}>• {note.item || note}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                            <h4 className="font-semibold text-yellow-800 mb-2">{cmsContent.step1?.eligibilityTitle || "Eligibility Reminders:"}</h4>
                                            <ul className="text-sm text-yellow-700 space-y-1">
                                                {getList(cmsContent.step1?.eligibility, [
                                                    { item: "Business must be micro, small, or medium enterprise" },
                                                    { item: "Annual turnover not exceeding ₦100 million" },
                                                    { item: "Must not have previously registered with CAC" }
                                                ]).map((item: any, idx: number) => (
                                                    <li key={idx}>• {item.item || item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => toggleAccordion('step1Content')} className="self-end sm:self-auto text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className={`w-5 h-5 transform transition-transform ${activeAccordions.step1Content ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="shrink-0 pt-0.5">
                                <input type="checkbox" checked={steps.step2} onChange={() => updateStep('step2')}
                                    className={`w-5 h-5 text-green-600 rounded focus:ring-green-500 ${steps.step2 ? 'animate-[checkmark_0.3s_ease-in-out]' : ''}`} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                    {cmsContent.step2?.title || "Step 2: Prepare Required Information"}
                                </h3>

                                <div className={`overflow-hidden transition-all duration-350 ease-in-out ${activeAccordions.step2Content ? 'max-h-[1800px]' : 'max-h-0'}`}>
                                    <div className="mt-4 space-y-4">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-800 mb-3">Business Name Ideas (Prepare 3 options):</h4>

                                            <div className="space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <input type="text" placeholder="First choice"
                                                        className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                                                    <span className="text-xs sm:text-sm text-gray-500">Available?</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <input type="text" placeholder="Second choice"
                                                        className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                                                    <span className="text-xs sm:text-sm text-gray-500">Available?</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <input type="text" placeholder="Third choice"
                                                        className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                                                    <span className="text-xs sm:text-sm text-gray-500">Available?</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">{cmsContent.step2?.detailsTitle || "Personal Details Needed:"}</h4>
                                            <ul className="space-y-2 text-sm text-gray-700">
                                                {getList(cmsContent.step2?.details, [
                                                    { item: "Valid National ID Card (NIN, Voter's Card, or International Passport)" },
                                                    { item: "Active Email Address and Phone Number" },
                                                    { item: "Residential Address (with proof)" },
                                                    { item: "Business Description and Activities" }
                                                ]).map((item: any, idx: number) => (
                                                    <li key={idx} className="flex items-start">
                                                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span>{item.item || item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => toggleAccordion('step2Content')} className="self-end sm:self-auto text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className={`w-5 h-5 transform transition-transform ${activeAccordions.step2Content ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="shrink-0 pt-0.5">
                                <input type="checkbox" checked={steps.step3} onChange={() => updateStep('step3')}
                                    className={`w-5 h-5 text-green-600 rounded focus:ring-green-500 ${steps.step3 ? 'animate-[checkmark_0.3s_ease-in-out]' : ''}`} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                    {cmsContent.step3?.title || "Step 3: Create SMEDAN Account"}
                                </h3>

                                <div className={`overflow-hidden transition-all duration-350 ease-in-out ${activeAccordions.step3Content ? 'max-h-[1800px]' : 'max-h-0'}`}>
                                    <div className="mt-4 space-y-4">
                                        <ol className="space-y-3 text-sm text-gray-700">
                                            {getList(cmsContent.step3?.instructions, [
                                                { item: "Visit the official SMEDAN portal: smedan.gov.ng" },
                                                { item: "Click on 'Register' or 'Create Account' button" },
                                                { item: "Fill in your personal details accurately" },
                                                { item: "Verify your email address through the link sent to your inbox" },
                                                { item: "Complete your profile by uploading required documents" }
                                            ]).map((step: any, idx: number) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">{idx + 1}</span>
                                                    <span>{step.item || step}</span>
                                                </li>
                                            ))}
                                        </ol>

                                        <div className="bg-gray-100 rounded-lg p-4 mt-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">Screenshot Guide:</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">Registration Page</span>
                                                </div>
                                                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">Profile Setup</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => toggleAccordion('step3Content')} className="self-end sm:self-auto text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className={`w-5 h-5 transform transition-transform ${activeAccordions.step3Content ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="shrink-0 pt-0.5">
                                <input type="checkbox" checked={steps.step4} onChange={() => updateStep('step4')}
                                    className={`w-5 h-5 text-green-600 rounded focus:ring-green-500 ${steps.step4 ? 'animate-[checkmark_0.3s_ease-in-out]' : ''}`} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                    {cmsContent.step4?.title || "Step 4: Submit CAC Registration Through SMEDAN"}
                                </h3>

                                <div className={`overflow-hidden transition-all duration-350 ease-in-out ${activeAccordions.step4Content ? 'max-h-[1800px]' : 'max-h-0'}`}>
                                    <div className="mt-4 space-y-4">
                                        <ol className="space-y-3 text-sm text-gray-700">
                                            {getList(cmsContent.step4?.instructions, [
                                                { item: "Log in to your SMEDAN account" },
                                                { item: "Navigate to \"Services\" > \"CAC Registration\"" },
                                                { item: "Select \"Business Name Registration\" option" },
                                                { item: "Enter your preferred business names from Step 2" },
                                                { item: "Fill in all required business details" },
                                                { item: "Review all information carefully before submission" },
                                                { item: "Submit and note your application reference number" }
                                            ]).map((step: any, idx: number) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">{idx + 1}</span>
                                                    <span>{step.item || step}</span>
                                                </li>
                                            ))}
                                        </ol>

                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                            <h4 className="font-semibold text-red-800 mb-2">{cmsContent.step4?.warningsTitle || "⚠️ Important Warnings:"}</h4>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                {getList(cmsContent.step4?.warnings, [
                                                    { item: "Double-check all information before submission - errors may require reapplication" },
                                                    { item: "Do not pay anyone for this free service" },
                                                    { item: "Save your application reference number safely" }
                                                ]).map((item: any, idx: number) => (
                                                    <li key={idx}>• {item.item || item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                            <h4 className="font-semibold text-yellow-800 mb-2">{cmsContent.step4?.mistakesTitle || "Common Mistakes to Avoid:"}</h4>
                                            <ul className="text-sm text-yellow-700 space-y-1">
                                                {getList(cmsContent.step4?.mistakes, [
                                                    { item: "Using restricted words in business name without approval" },
                                                    { item: "Providing incorrect personal details" },
                                                    { item: "Not checking business name availability first" },
                                                    { item: "Uploading unclear or invalid documents" }
                                                ]).map((item: any, idx: number) => (
                                                    <li key={idx}>• {item.item || item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <button onClick={() => toggleAccordion('step4Content')} className="self-end sm:self-auto text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className={`w-5 h-5 transform transition-transform ${activeAccordions.step4Content ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="shrink-0 pt-0.5">
                                <input type="checkbox" checked={steps.step5} onChange={() => updateStep('step5')}
                                    className={`w-5 h-5 text-green-600 rounded focus:ring-green-500 ${steps.step5 ? 'animate-[checkmark_0.3s_ease-in-out]' : ''}`} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                    {cmsContent.step5?.title || "Step 5: Track Approval & Download Certificate"}
                                </h3>

                                <div className={`overflow-hidden transition-all duration-350 ease-in-out ${activeAccordions.step5Content ? 'max-h-[1800px]' : 'max-h-0'}`}>
                                    <div className="mt-4 space-y-4">

                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-800 mb-3">{cmsContent.step5?.trackTitle || "How to Check Status:"}</h4>
                                            <ol className="space-y-2 text-sm text-blue-700">
                                                {getList(cmsContent.step5?.trackSteps, [
                                                    { item: "Log in to your SMEDAN account dashboard" },
                                                    { item: "Go to \"My Applications\" section" },
                                                    { item: "Find your CAC registration application" },
                                                    { item: "Check the status (Pending, Approved, or Rejected)" }
                                                ]).map((step: any, idx: number) => (
                                                    <li key={idx} className="flex items-start">
                                                        <span className="shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">{idx + 1}</span>
                                                        <span>{step.item || step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-800 mb-3">{cmsContent.step5?.approvedTitle || "If Approved:"}</h4>
                                            <ul className="space-y-2 text-sm text-green-700">
                                                {getList(cmsContent.step5?.approvedSteps, [
                                                    { item: "Download your CAC registration certificate" },
                                                    { item: "Save multiple copies (digital and print)" },
                                                    { item: "Proceed with business operations" }
                                                ]).map((item: any, idx: number) => (
                                                    <li key={idx} className="flex items-start">
                                                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span>{item.item || item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-orange-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-orange-800 mb-3">{cmsContent.step5?.delayedTitle || "If Delayed Beyond 2 Weeks:"}</h4>
                                            <ul className="space-y-2 text-sm text-orange-700">
                                                {getList(cmsContent.step5?.delayedSteps, [
                                                    { item: "Contact SMEDAN support through their portal" },
                                                    { item: "Visit nearest SMEDAN office with reference number" },
                                                    { item: "Reach out to our WhatsApp support for assistance" }
                                                ]).map((item: any, idx: number) => (
                                                    <li key={idx} className="flex items-start">
                                                        <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        <span>{item.item || item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <button onClick={() => toggleAccordion('step5Content')} className="self-end sm:self-auto text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className={`w-5 h-5 transform transition-transform ${activeAccordions.step5Content ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Important Notes Section */}
                <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 text-yellow-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        Important Notes
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                        <p className="bg-yellow-50 p-4 rounded-lg">
                            <strong>Disclaimer:</strong> This is a comprehensive guide to help you navigate the SMEDAN-CAC free registration process. While we strive to provide accurate and up-to-date information, government processes may change.
                        </p>
                        <p className="bg-green-50 p-4 rounded-lg">
                            <strong>CAC Fees:</strong> All CAC registration fees are covered through the SMEDAN program for eligible applicants. You should not pay any fees for this service.
                        </p>
                        <p className="bg-blue-50 p-4 rounded-lg">
                            <strong>Not a Government Portal:</strong> This is a private educational platform providing guidance. For official government services, please visit the SMEDAN or CAC websites directly.
                        </p>
                    </div>
                </div>

                {/* Support & FAQ Section */}
                <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Support & FAQ</h3>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <a href={`https://wa.me/${cmsContent.contact?.whatsapp || '2348000000000'}`} target="_blank" rel="noopener noreferrer"
                            className="bg-gradient-to-br from-[#F4B400] to-[#F9A825] text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto hover:scale-105 transition-transform">
                            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                            </svg>
                            <span className="text-center">Chat with Support on WhatsApp</span>
                        </a>
                    </div>

                    <div className="space-y-3">
                        {getList(cmsContent.course_faq?.questions, [
                            { q: "How long does the CAC registration process take?", a: "Typically, the CAC registration through SMEDAN takes 1-2 weeks for approval. However, processing times may vary depending on application volume and completeness of documentation." },
                            { q: "Can I register multiple businesses for free?", a: "No, the SMEDAN free registration program is limited to one business per individual to ensure more entrepreneurs can benefit from the initiative." },
                            { q: "What if my application is rejected?", a: "If your application is rejected, you'll receive a reason for the rejection. You can correct the issues and reapply. Contact our support team for assistance with reapplication." }
                        ]).map((item: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded-lg">
                                <button onClick={() => toggleFAQ(`faq${idx}`)}
                                    className="w-full px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-start gap-3">
                                    <span className="min-w-0 flex-1">{item.q}</span>
                                    <svg className={`w-5 h-5 text-gray-500 transform transition-transform shrink-0 mt-0.5 ${activeFaqs[`faq${idx}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div className={`overflow-hidden transition-all duration-350 ease-in-out ${activeFaqs[`faq${idx}`] ? 'max-h-[500px] px-4 pb-3' : 'max-h-0'}`}>
                                    <p className="text-sm text-gray-600">{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Completion Section */}
                <div id="completionSection" className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6 sm:p-8 text-center" style={{ display: 'none' }}>
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                            {cmsContent.completion?.title || "Congratulations!"}
                        </h3>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                            {cmsContent.completion?.message || "You've completed all the steps to register your business with CAC for free through SMEDAN. Your journey to official business ownership is well underway!"}
                        </p>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 sm:p-6 mb-6 border border-white/60">
                            <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                                {cmsContent.completion?.promoTitle || "Need Professional Assistance?"}
                            </h4>

                            <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                                {cmsContent.completion?.promoText || "If you prefer to focus on your business while experts handle the registration, our Done-For-You service includes everything from document preparation to certificate delivery. We manage the process end-to-end with accuracy, speed, and clear communication."}
                            </p>

                            <button className="bg-gradient-to-br from-[#F4B400] to-[#F9A825] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-shadow w-full sm:w-auto">
                                {cmsContent.completion?.promoButton || "Let Us Handle It For You"}
                            </button>

                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                                <span className="px-3 py-1 rounded-full bg-white/60 border border-white/20">100% Success Rate</span>
                                <span className="hidden sm:inline text-gray-400">|</span>
                                <span className="px-3 py-1 rounded-full bg-white/60 border border-white/20">24/7 Support</span>
                                <span className="hidden sm:inline text-gray-400">|</span>
                                <span className="px-3 py-1 rounded-full bg-white/60 border border-white/20">Certificate Delivery Included</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
