import { TrendingUp, Music2, Ticket, Users2, Calendar, Activity } from "lucide-react";
import { motion } from "motion/react";

// Definisikan Variant untuk Stagger
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Di AdminDashboard.tsx
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function AdminDashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Header (Animasi Slide Down Lembut) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-1 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            {today}
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">System Live</span>
        </div>
      </motion.div>

      {/* Stats Grid - Terapkan Container Variants */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard title="Gross Revenue" value="$124,500.00" trend="+12%" icon={TrendingUp} color="emerald" />
        <StatCard title="Total Concerts" value="48" trend="+2" icon={Music2} color="primary" />
        <StatCard title="Tickets Sold" value="12,402" trend="+840" icon={Ticket} color="violet" />
        <StatCard title="Total Users" value="8,920" trend="+124" icon={Users2} color="blue" />
      </motion.div>

      {/* Area Chart - Muncul Paling Akhir */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Sales Activity</h2>
          <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">VIEW REPORT</button>
        </div>
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
          <Activity className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-slate-400 text-sm font-medium italic">Sales visualization component goes here...</p>
        </div>
      </motion.div>
    </div>
  );
}

// Komponen Card diupdate untuk menggunakan variant "item"
function StatCard({ title, value, trend, icon: Icon, color }: any) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-primary shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg">
          {trend}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">{value}</p>
    </motion.div>
  );
}