'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
    userEmail: string;
}

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
                md:relative md:translate-x-0 md:block flex-shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-gray-800 hidden md:block">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        CAC Guide <span className="text-[#F4B400]">Admin</span>
                    </h1>
                </div>

                <nav className="p-4 space-y-2 mt-4 md:mt-0">
                    <NavLink href="/admin" active={pathname === '/admin'} onClick={closeSidebar}>Dashboard</NavLink>
                    <NavLink href="/admin/content/landing" active={pathname === '/admin/content/landing'} onClick={closeSidebar}>Homepage CMS</NavLink>
                    <NavLink href="/admin/content/course" active={pathname === '/admin/content/course'} onClick={closeSidebar}>Course CMS</NavLink>
                    <NavLink href="/admin/users" active={pathname === '/admin/users'} onClick={closeSidebar}>Users</NavLink>
                    <NavLink href="/admin/payments" active={pathname === '/admin/payments'} onClick={closeSidebar}>Payments</NavLink>
                </nav>

                <div className="p-4 absolute bottom-0 w-64 border-t border-gray-800">
                    <form action="/auth/signout" method="post">
                        <div className="text-sm text-gray-400 mb-2 truncate px-4">{userEmail}</div>
                        <button type="submit" className="w-full text-left px-4 py-2 text-sm text-white hover:text-[#F4B400] transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}

function NavLink({ href, children, active, onClick }: { href: string; children: React.ReactNode; active: boolean; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                block px-4 py-3 rounded-lg transition-colors font-medium
                ${active ? 'bg-[#F4B400] text-[#0F1C2E]' : 'text-gray-300 hover:bg-[#1a2c42] hover:text-white'}
            `}
        >
            {children}
        </Link>
    );
}
