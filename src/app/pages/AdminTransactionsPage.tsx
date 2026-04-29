import { Search, Filter, Download, ArrowUpRight } from "lucide-react";
import { useData } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { motion } from "motion/react";
import { useState } from "react";

export function AdminTransactionsPage() {
  const { tickets, concerts } = useData();
  const [filterConcert, setFilterConcert] = useState("all");

  // Logika Filter
  const filteredTickets = filterConcert === "all"
    ? tickets
    : tickets.filter(t => t.concertId === filterConcert);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sales Transactions</h1>
          <p className="text-slate-500 font-medium text-sm">Monitor and manage all financial records.</p>
        </div>

        {/* Tombol Export Saja */}
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        {/* Dropdown Filter Per Konser */}
        <div className="relative">
          <select
            value={filterConcert}
            onChange={(e) => setFilterConcert(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer shadow-sm"
          >
            <option value="all">All Concerts</option>
            {concerts.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Event</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTickets.map((ticket, i) => {
                const concert = concerts.find(c => c.id === ticket.concertId);

                return (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={ticket.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-400">#{ticket.id.toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">User {ticket.userId}</p>
                      <p className="text-[10px] text-slate-400 font-medium">ID: {ticket.userId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{concert?.title || "Unknown Event"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-extrabold text-slate-900">${ticket.totalPrice.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}