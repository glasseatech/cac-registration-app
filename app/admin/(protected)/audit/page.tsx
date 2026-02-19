import { getAuditLogs } from '@/app/actions/admin';

export const revalidate = 0;

export default async function AuditLogPage() {
    const logs = await getAuditLogs(100);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Audit Log</h2>
                <p className="text-gray-500 font-medium">Track admin actions and content changes</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">When</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Admin</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Action</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Resource</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString('en-NG', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {log.profiles?.email || log.admin_id?.slice(0, 8) || 'System'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <ActionBadge action={log.action} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                                            {log.resource || '—'}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                                        {log.details ? JSON.stringify(log.details).slice(0, 80) : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            No audit logs yet. Admin actions will appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ActionBadge({ action }: { action: string }) {
    const colors: Record<string, string> = {
        create: 'bg-green-100 text-green-700',
        update: 'bg-blue-100 text-blue-700',
        delete: 'bg-red-100 text-red-700',
        upload: 'bg-purple-100 text-purple-700',
    };

    const actionType = action?.includes('delete') ? 'delete'
        : action?.includes('create') ? 'create'
            : action?.includes('upload') ? 'upload'
                : 'update';

    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${colors[actionType] || 'bg-gray-100 text-gray-600'}`}>
            {action?.replace(/_/g, ' ') || 'unknown'}
        </span>
    );
}
