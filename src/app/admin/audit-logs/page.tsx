import { FileText, Clock, UserCheck } from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 0;

export default function AdminAuditLogsPage() {
  const logs = db.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#EDE3D5] pb-4">
        <h1 className="font-serif text-2xl font-bold text-[#641C24]">Administrative Audit Logs</h1>
        <p className="text-xs text-[#686058] mt-0.5">Immutable record of privileged operations, stock changes, and status transitions</p>
      </div>

      <div className="bg-white rounded-xl border border-[#EDE3D5] shadow-festive-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF3E7] border-b border-[#EDE3D5] text-[#686058] uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">Administrator</th>
                <th className="py-3 px-4 font-bold">Action</th>
                <th className="py-3 px-4 font-bold">Target Entity</th>
                <th className="py-3 px-4 font-bold">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE3D5]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FFF9F0] transition-colors">
                  <td className="py-3 px-4 text-[#686058] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#641C24]">{log.adminEmail}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#292521]">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-[#686058]">
                    {log.entityType} ({log.entityId || 'N/A'})
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#443E38] font-mono max-w-xs truncate">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
