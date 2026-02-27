'use client';

import React, { useState } from 'react';
import { HeartButton } from '@/components/ui/DesignSystem';

interface GuideMobileNavProps {
    modules: any[];
    activeModuleId: string | null;
    onSelectModule: (id: string) => void;
}

export default function GuideMobileNav({ modules, activeModuleId, onSelectModule }: GuideMobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeModule = modules.find(m => m.id === activeModuleId);

    return (
        <>
            {/* Sticky Mobile Header */}
            <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#0B5E2E] text-white flex items-center justify-center font-bold text-xs">
                        {modules.indexOf(activeModule) + 1}
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 line-clamp-1">{activeModule?.title || 'Course Guide'}</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Module {modules.indexOf(activeModule) + 1} of {modules.length}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </button>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden" onClick={() => setIsOpen(false)} />
            )}

            {/* Drawer */}
            <div className={`
                fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Course Modules</h3>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4">
                        {modules.map((m, idx) => (
                            <button
                                key={m.id}
                                onClick={() => {
                                    onSelectModule(m.id);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full text-left p-4 rounded-2xl border-2 transition-all duration-300
                                    ${activeModuleId === m.id
                                        ? 'border-[#0B5E2E] bg-green-50 shadow-md shadow-[#0B5E2E]/5'
                                        : 'border-transparent bg-gray-50 text-gray-600'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs
                                        ${activeModuleId === m.id ? 'bg-[#0B5E2E] text-white' : 'bg-white text-gray-400'}
                                    `}>
                                        {idx + 1}
                                    </div>
                                    <span className="font-bold text-sm">{m.title}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs text-center text-gray-400 font-medium">CROWGLO HUB • Course Guide</p>
                    </div>
                </div>
            </div>
        </>
    );
}
