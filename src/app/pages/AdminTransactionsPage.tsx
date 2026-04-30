import { useState, useMemo } from "react";
import {
  Search, Filter, Download, ArrowUpRight, DollarSign,
  CreditCard, CheckCircle2, History
} from "lucide-react";
import { useData } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { motion } from "motion/react";

export function AdminTransactionsPage() {
  const { tickets, concerts } = useData();
  const [filterConcert, setFilterConcert] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // LOGIKA FILTER & SEARCH
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchConcert = filterConcert === "all" || t.concertId === filterConcert;
      const matchSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchConcert && matchSearch;
    });
  }, [tickets, filterConcert, searchQuery]);

  // LOGIKA STATISTIK
  const stats = useMemo(() => {
    const totalRev = filteredTickets.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const successful = filteredTickets.filter(t => t.status === 'booked').length;
    return { totalRev, successful, total: filteredTickets.length };
  }, [filteredTickets]);

  // FUNGSI EXPORT CSV
  const handleExportCSV = () => {
    if (filteredTickets.length === 0) return alert("No data to export!");
    const headers = ["Order ID", "User ID", "Concert ID", "Amount", "Status"];
    const csvRows = filteredTickets.map(t => [
      `#${t.id}`,
      t.userId,
      t.concertId,
      t.totalPrice.toFixed(2),
      t.status
    ].join(","));
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Transactions_${new Date().getTime()}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">Transactions</h1>
          <p className="text-slate-500 text-sm mb-3 max-w-lg">
            Monitor financial health, track ticket sales across all events, and manage order fulfillment.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge count={stats.total} label="TOTAL ORDERS" color="bg-slate-100 text-slate-600" />
            <Badge count={stats.successful} label="BOOKED" color="bg-emerald-50 text-emerald-600" />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white bg-slate-900 shadow-lg shadow-slate-900/10 hover:bg-primary transition-all font-bold text-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </motion.button>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatMiniCard title="Revenue" value={`$${stats.totalRev.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} color="text-emerald-500" />
        <StatMiniCard title="Sales Volume" value={stats.total} icon={<CreditCard className="w-5 h-5" />} color="text-blue-500" />
        <StatMiniCard title="Success Rate" value={`${((stats.successful / stats.total) * 100 || 0).toFixed(1)}%`} icon={<CheckCircle2 className="w-5 h-5" />} color="text-violet-500" />
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-none bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>

        <div className="relative w-full md:w-auto">
          <select
            value={filterConcert}
            onChange={(e) => setFilterConcert(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          >
            <option value="all">ALL CONCERTS</option>
            {concerts.map(c => (
              <option key={c.id} value={c.id}>{c.title.toUpperCase()}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTickets.map((ticket, i) => {
                const concert = concerts.find(c => c.id === ticket.concertId);

                return (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    key={ticket.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        #{ticket.id.toUpperCase().slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">User_{ticket.userId.slice(0, 5)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{concert?.title || "Unknown Event"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-extrabold text-slate-900">${ticket.totalPrice.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filteredTickets.length === 0 && (
            <div className="py-16 text-center">
              <History className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-bold">No transactions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// COMPONENTS
function Badge({ count, label, color }: { count: number, label: string, color: string }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/10 ${color}`}>
      <span className="text-xs font-bold">{count}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</span>
    </div>
  );
}

function StatMiniCard({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${color} border border-slate-100`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{title}</p>
        <p className="text-xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}