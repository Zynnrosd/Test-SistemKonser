import { TrendingUp, Music2, Ticket, Users2, Calendar } from "lucide-react";
import { motion } from "motion/react";

export function AdminDashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Internal Page Header (Pengganti Navbar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-1 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            {today}
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">System Live</span>
        </div>
      </div>

      {/* Stats Grid - Diperkecil & Lebih Rapi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Revenue" value="$124,500.00" trend="+12%" icon={TrendingUp} color="emerald" />
        <StatCard title="Total Concerts" value="48" trend="+2" icon={Music2} color="primary" />
        <StatCard title="Tickets Sold" value="12,402" trend="+840" icon={Ticket} color="violet" />
        <StatCard title="Total Users" value="8,920" trend="+124" icon={Users2} color="blue" />
      </div>

      {/* Area Konten Tambahan (Contoh Chart/Table) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Sales Activity</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
          <p className="text-slate-400 text-sm font-medium italic">Sales visualization component goes here...</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-slate-50 text-primary`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">
          {trend}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{value}</p>
    </motion.div>
  );
}