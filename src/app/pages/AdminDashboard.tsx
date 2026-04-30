import { useMemo } from "react";
import { TrendingUp, Music2, Ticket, CheckCircle2, Calendar, Crown, BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function AdminDashboard() {
  const { concerts } = useData();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Kalkulasi data REAL-TIME dari database
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let ticketsSold = 0;
    let activeConcerts = 0;

    concerts.forEach(c => {
      if (c.status === 'active') activeConcerts++;

      const sold = c.capacity - c.availableSeats;
      ticketsSold += sold;
      totalRevenue += (sold * c.price);
    });

    return {
      totalConcerts: concerts.length,
      activeConcerts,
      ticketsSold,
      totalRevenue
    };
  }, [concerts]);

  // Format ke mata uang
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  // Mengambil 3 konser dengan penjualan tiket terbanyak untuk List
  const topConcerts = [...concerts]
    .sort((a, b) => (b.capacity - b.availableSeats) - (a.capacity - a.availableSeats))
    .slice(0, 3);

  // Mengambil 5 konser untuk Chart Analitik Pendapatan
  const chartData = useMemo(() => {
    const data = concerts
      .map(c => {
        const sold = c.capacity - c.availableSeats;
        return { ...c, revenue: sold * c.price };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const maxRev = Math.max(...data.map(d => d.revenue), 1);
    return { data, maxRev };
  }, [concerts]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">System Overview</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1 font-bold">
            <Calendar className="w-4 h-4" />
            {today}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Gross Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Total income from tickets"
          icon={TrendingUp}
          color="bg-emerald-50 text-emerald-600 border-emerald-200"
        />
        <StatCard
          title="Total Concerts"
          value={stats.totalConcerts}
          subtitle="Across all statuses"
          icon={Music2}
          color="bg-violet-50 text-violet-600 border-violet-200"
        />
        <StatCard
          title="Tickets Sold"
          value={stats.ticketsSold.toLocaleString()}
          subtitle="Total successful bookings"
          icon={Ticket}
          color="bg-blue-50 text-blue-600 border-blue-200"
        />
        <StatCard
          title="Active Events"
          value={stats.activeConcerts}
          subtitle="Currently selling tickets"
          icon={CheckCircle2}
          color="bg-amber-50 text-amber-600 border-amber-200"
        />
      </motion.div>

      {/* Konten Bawah */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Kolom Kiri: Top Selling Concerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-[2rem] border border-border p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">Top Selling Concerts</h2>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Based on ticket sales</p>
            </div>
            <Crown className="w-6 h-6 text-amber-400" />
          </div>

          <div className="space-y-6">
            {topConcerts.length === 0 && (
              <p className="text-center text-muted-foreground text-sm font-medium py-10">No concerts available yet.</p>
            )}

            {topConcerts.map((concert, idx) => {
              const sold = concert.capacity - concert.availableSeats;
              const percentage = Math.round((sold / concert.capacity) * 100) || 0;

              return (
                <div key={concert.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="text-2xl font-black text-slate-200 w-6">{idx + 1}</span>
                  <img src={concert.image} alt={concert.title} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm truncate">{concert.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{concert.artist}</p>

                    {/* Progress Bar Penjualan */}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-primary">{percentage}% Sold</span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block whitespace-nowrap">
                    <p className="text-sm font-black text-foreground">{sold.toLocaleString()} / {concert.capacity.toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tickets</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Kolom Kanan: Revenue Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[2rem] border border-border p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">Revenue Analytics</h2>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Top Grossing Events</p>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-3 h-48 pt-6 pb-2 border-b border-border/50">
            {chartData.data.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground font-bold">
                No revenue data
              </div>
            )}

            {chartData.data.map((item) => {
              const heightPercentage = Math.max((item.revenue / chartData.maxRev) * 100, 5);

              return (
                <div key={item.id} className="relative w-full h-full flex flex-col justify-end group cursor-pointer">
                  {/* Tooltip pada saat di-hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 whitespace-nowrap shadow-xl">
                    ${item.revenue.toLocaleString()}
                  </div>

                  {/* Bar Chart Element */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                    className="w-full bg-primary/20 group-hover:bg-primary transition-colors duration-300 rounded-t-xl"
                  />

                  {/* Label Nama Konser */}
                  <div className="mt-3 text-[10px] font-black uppercase text-muted-foreground group-hover:text-foreground transition-colors truncate text-center w-full">
                    {item.title.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-lg transition-all cursor-default relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl border ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-foreground tracking-tight mb-1">{value}</h3>
        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 mt-2">{subtitle}</p>
      </div>
    </motion.div>
  );
}