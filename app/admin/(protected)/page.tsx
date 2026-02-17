import { getDashboardStats, getRecentTransactions } from '@/app/actions/admin';
import Link from 'next/link';
import { Suspense } from 'react';

export const revalidate = 0; // Dynamic

export default async function AdminPage() {
    const stats = await getDashboardStats();
    const recentPayments = await getRecentTransactions();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h2>
                    <p className="text-gray-500 mt-1">Overview of your CAC Registration business.</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                    Server Time: {new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' })} (WAT)
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Revenue"
                    value={`₦${stats.totalRevenue.toLocaleString()}`}
                    icon="₦"
                    color="yellow"
                    trend="+12% vs last month"
                />
                <StatCard
                    label="Today's Revenue"
                    value={`₦${stats.todayRevenue.toLocaleString()}`}
                    icon="today"
                    color="green"
                />
                <StatCard
                    label="Paid Users"
                    value={stats.paidUsers}
                    icon="users"
                    color="blue"
                />
                <StatCard
                    label="Total Signups"
                    value={stats.totalUsers}
                    icon="all"
                    color="gray"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickAction
                    title="Edit Homepage"
                    desc="Manage hero text, prices, and testimonials."
                    href="/admin/content/landing"
                    icon="Home"
                />
                <QuickAction
                    title="Edit Course"
                    desc="Update guide steps and modules."
                    href="/admin/content/course"
                    icon="Book"
                />
                <QuickAction
                    title="Manage Users"
                    desc="View users and manually grant access."
                    href="/admin/users"
                    icon="Users"
                />
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Recent Payments</h3>
                    <Link href="/admin/payments" className="text-sm text-[#0B5E2E] hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {recentPayments?.map((payment: any) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.user_email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₦{payment.amount?.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{payment.reference}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {!recentPayments?.length && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No payments found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color, trend }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        yellow: "bg-yellow-50 text-yellow-600",
        gray: "bg-gray-50 text-gray-600",
    };

    const icons: any = {
        "₦": <span className="text-xl">₦</span>,
        "users": <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        "today": <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        "all": <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-sm text-gray-500 font-medium">{label}</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
                </div>
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    {icons[icon] || icon}
                </div>
            </div>
            {trend && <div className="text-xs text-green-600 font-medium bg-green-50 inline-block px-2 py-1 rounded w-max">{trend}</div>}
        </div>
    );
}

function QuickAction({ title, desc, href, icon }: any) {
    return (
        <Link href={href} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    {/* Generic Icon */}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-sm text-gray-500">{desc}</p>
        </Link>
    );
}
