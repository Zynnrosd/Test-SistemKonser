import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, CreditCard, TrendingUp, DollarSign, Users,
  Trash2, AlertTriangle, X, ChevronDown,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { USERS } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

type FilterStatus = "all" | "booked" | "attended" | "cancelled" | "pending";

const STATUS_COLORS: Record<string, string> = {
  all: "text-gray-600",
  booked: "text-indigo-600",
  attended: "text-emerald-600",
  cancelled: "text-red-500",
  pending: "text-amber-600",
};

export function AdminTransactionsPage() {
  const { tickets, concerts, clearTransactions } = useData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);

  const enriched = tickets.map((ticket) => {
    const user = USERS.find((u) => u.id === ticket.userId);
    const concert = concerts.find((c) => c.id === ticket.concertId);
    return { ticket, user, concert };
  });

  const filtered = enriched.filter(({ ticket, user, concert }) => {
    const matchStatus = filter === "all" || ticket.status === filter;
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      user?.name?.toLowerCase().includes(query) ||
      user?.email?.toLowerCase().includes(query) ||
      concert?.title?.toLowerCase().includes(query) ||
      ticket.id.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  const totalRevenue = enriched
    .filter(({ ticket }) => ticket.status === "booked" || ticket.status === "attended")
    .reduce((s, { ticket }) => s + ticket.totalPrice, 0);
  const totalTickets = enriched
    .filter(({ ticket }) => ticket.status === "booked" || ticket.status === "attended")
    .reduce((s, { ticket }) => s + ticket.quantity, 0);
  const uniqueUsers = new Set(enriched.map(({ ticket }) => ticket.userId)).size;

  const stats = [
    {
      label: "Transactions",
      value: tickets.length,
      icon: CreditCard,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Tickets Sold",
      value: totalTickets,
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
    {
      label: "Customers",
      value: uniqueUsers,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
  ];

  const handleClear = () => {
    clearTransactions();
    setShowClearConfirm(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <PageTransition className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground font-black text-3xl mb-1 tracking-tight">Ticket Transactions</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">All booking records across users and concerts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 text-sm font-black transition-all shadow-sm shadow-rose-500/10"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </motion.button>
      </div>

      {/* Cleared toast */}
      <AnimatePresence>
        {cleared && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Transaction history cleared successfully.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-border p-10 max-w-sm w-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center shadow-sm border border-rose-100">
                  <AlertTriangle className="w-7 h-7 text-rose-500" />
                </div>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl text-muted-foreground hover:bg-accent transition-all border border-border shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-foreground font-black text-xl mb-2 tracking-tight">Clear transaction history?</h3>
              <p className="text-muted-foreground text-sm mb-8 font-medium leading-relaxed">
                This will permanently remove all booked, attended, and cancelled records. Pending tickets will be preserved.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 rounded-2xl border border-border text-muted-foreground text-sm font-bold hover:bg-accent transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 py-3 rounded-2xl bg-rose-500 text-white text-sm font-black hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-[2rem] border border-border shadow-sm p-8 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-6 border border-border shadow-sm relative z-10`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <p className={`text-3xl font-black ${color} mb-1 tracking-tighter relative z-10`}>{value}</p>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest relative z-10">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm p-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, concert, booking ID..."
            className="w-full pl-12 pr-5 py-3 rounded-2xl border border-border bg-accent text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-bold"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter as pill tabs */}
        <div className="flex gap-1 bg-accent rounded-2xl p-1.5 border border-border flex-wrap">
          {(["all", "booked", "pending", "attended", "cancelled"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all capitalize uppercase tracking-widest ${
                filter === f
                  ? `bg-white shadow-sm ring-1 ring-border ${STATUS_COLORS[f]}`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                {["Booking ID", "Customer", "Concert", "Date", "Qty", "Total", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-[10px] text-muted-foreground uppercase tracking-widest font-black"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="w-6 h-6 text-gray-200" />
                    </div>
                    <p className="text-sm text-gray-400">No transactions found</p>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="mt-2 text-xs text-indigo-500 hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {filtered.map(({ ticket, user, concert }, i) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-gray-50/60 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] text-primary font-black bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10">
                      {ticket.id.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-black shadow-sm">
                        {user?.name?.charAt(0) ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground font-black truncate max-w-[150px] tracking-tight">
                          {user?.name ?? "Unknown"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold truncate max-w-[150px] uppercase tracking-wider">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground font-black truncate max-w-[200px] tracking-tight">
                        {concert?.title ?? "—"}
                      </p>
                      <p className="text-xs text-primary font-bold">{concert?.artist}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground font-bold">{ticket.bookingDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground font-black tracking-tight">×{ticket.quantity}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-base text-foreground font-black tracking-tighter">
                      ${ticket.totalPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-accent/30 font-bold">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
              <ChevronDown className="w-4 h-4" />
              Showing <span className="text-foreground">{filtered.length}</span> of{" "}
              <span className="text-foreground">{tickets.length}</span> records
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Total Revenue: <span className="text-emerald-600 text-lg font-black tracking-tighter ml-2">${totalRevenue.toFixed(2)}</span>
            </span>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
