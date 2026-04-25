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
          <h1 className="text-gray-900 font-bold text-2xl mb-1">Ticket Transactions</h1>
          <p className="text-gray-400 text-sm">All booking records across users and concerts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 text-sm font-medium transition-all"
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 12 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-gray-900 font-semibold text-base mb-1">Clear transaction history?</h3>
              <p className="text-gray-400 text-sm mb-5">
                This will permanently remove all booked, attended, and cancelled records. Pending tickets will be preserved.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 py-2 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-white rounded-2xl border ${border} shadow-sm p-5`}
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color} mb-0.5`}>{value}</p>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, concert, booking ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all"
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
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
          {(["all", "booked", "pending", "attended", "cancelled"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f
                  ? `bg-white shadow-sm ${STATUS_COLORS[f]}`
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Booking ID", "Customer", "Concert", "Date", "Qty", "Total", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs text-gray-400 uppercase tracking-wider font-semibold"
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
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      {ticket.id.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                        {user?.name?.charAt(0) ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 font-medium truncate max-w-[120px]">
                          {user?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 font-medium truncate max-w-[180px]">
                        {concert?.title ?? "—"}
                      </p>
                      <p className="text-xs text-indigo-400">{concert?.artist}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-500">{ticket.bookingDate}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-700 font-semibold">×{ticket.quantity}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-900 font-bold">
                      ${ticket.totalPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={ticket.status} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/40">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <ChevronDown className="w-3 h-3" />
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
              <span className="font-semibold text-gray-600">{tickets.length}</span> records
            </div>
            <span className="text-xs font-semibold text-gray-700">
              Revenue: <span className="text-emerald-600">${totalRevenue.toFixed(2)}</span>
            </span>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
