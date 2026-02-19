'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
    userEmail: string;
}

const navGroups = [
    {
        label: 'OVERVIEW',
        items: [
            { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        ]
    },
    {
        label: 'CONTENT EDITORS',
        items: [
            { href: '/admin/content/landing', label: 'Homepage', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
            { href: '/admin/content/course', label: 'Course Guide', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        ]
    },
    {
        label: 'SITE SETTINGS',
        items: [
            { href: '/admin/content/ui-copy', label: 'Global Text & Labels', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
            { href: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { href: '/admin/payments', label: 'Payments', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
            { href: '/admin/audit', label: 'Audit Log', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        ]
    }
];

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden bg-[#0F1C2E] text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-50">
                <h1 className="text-lg font-bold">CAC Admin</h1>
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-800 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-[#0F1C2E] text-white z-50 transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:block flex-shrink-0 flex flex-col h-full
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Brand Logo Section */}
                <div className="p-6 border-b border-gray-800 hidden md:block flex-shrink-0">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        CAC Guide <span className="text-[#F4B400]">Admin</span>
                    </h1>
                    <p className="text-gray-500 text-xs mt-1">Management Portal</p>
                </div>

                {/* Navigation - Scrolls Independently */}
                <nav className="flex-1 p-3 mt-4 space-y-6 md:mt-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-800">
                    {navGroups.map((group) => (
                        <div key={group.label} className="space-y-1">
                            <h3 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                                {group.label}
                            </h3>
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.href}
                                    href={item.href}
                                    active={pathname === item.href}
                                    onClick={closeSidebar}
                                    icon={item.icon}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Admin User Section at the bottom */}
                <div className="p-4 border-t border-gray-800 flex-shrink-0 bg-[#0F1C2E]">
                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0">
                            {userEmail.substring(0, 2)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-medium text-white truncate">{userEmail}</p>
                            <p className="text-[10px] text-gray-400">Administrator</p>
                        </div>
                    </div>

                    <form action="/auth/signout" method="post">
                        <button type="submit" className="w-full text-left px-2 py-2 text-xs text-gray-400 hover:text-[#F4B400] transition-colors flex items-center gap-2 group">
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}

function NavLink({ href, children, active, onClick, icon }: { href: string; children: React.ReactNode; active: boolean; onClick: () => void; icon: string }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
                ${active ? 'bg-[#F4B400] text-[#0F1C2E]' : 'text-gray-300 hover:bg-[#1a2c42] hover:text-white'}
            `}
        >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={icon} />
            </svg>
            {children}
        </Link>
    );
}
