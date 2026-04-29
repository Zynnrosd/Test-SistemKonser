import { ShieldAlert, User, Database, Clock, RefreshCw, Lock, Activity } from "lucide-react";
import { motion } from "motion/react";

export function DataTablePage() {
  const auditLogs = [
    { id: "LOG-01", event: "Admin Login", user: "John Admin", ip: "192.168.1.1", time: "2 mins ago", severity: "low" },
    { id: "LOG-02", event: "Ticket Price Modified", user: "John Admin", ip: "192.168.1.1", time: "15 mins ago", severity: "medium" },
    { id: "LOG-03", event: "Unauthorized Access Attempt", user: "Unknown", ip: "103.44.12.9", time: "1 hour ago", severity: "high" },
    { id: "LOG-04", event: "Database Backup Completed", user: "System", ip: "Internal", time: "3 hours ago", severity: "low" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Security Audit</h1>
          <p className="text-slate-500 font-medium text-sm">Monitoring real-time system integrity and user access logs.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-600">
          <Activity className="w-3.5 h-3.5 text-emerald-500" /> System Active
        </div>
      </div>

      {/* Konten Log yang Lebih Informatif */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> Recent Security Events
          </h2>
          <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Clear All Logs</button>
        </div>
        <div className="divide-y divide-slate-50">
          {auditLogs.map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${log.severity === 'high' ? 'bg-rose-500' : log.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                <div>
                  <p className="text-sm font-bold text-slate-900">{log.event}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">User: {log.user} • IP: {log.ip}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5 justify-end uppercase">
                  <Clock className="w-3 h-3" /> {log.time}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">ID: {log.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}