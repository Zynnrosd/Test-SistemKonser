import { useState } from "react";
import { motion } from "motion/react";
import { Search, CreditCard, TrendingUp, DollarSign, Users } from "lucide-react";
import { useData } from "../context/DataContext";
import { USERS } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

type FilterStatus = "all" | "booked" | "attended" | "cancelled";

export function AdminTransactionsPage() {
  const { tickets, concerts } = useData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

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

  const totalRevenue = filtered.reduce((s, { ticket }) => s + ticket.totalPrice, 0);
  const totalTickets = filtered.reduce((s, { ticket }) => s + ticket.quantity, 0);
  const uniqueUsers = new Set(filtered.map(({ ticket }) => ticket.userId)).size;

  const stats = [
    { label: "Transactions", value: filtered.length, icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Tickets Sold", value: totalTickets, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Unique Customers", value: uniqueUsers, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <PageTransition className="space-y-5">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.75rem" }}>
          Ticket Transactions
        </h1>
        <p className="text-gray-500 text-sm">All booking records across users and concerts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-gray-900 mb-0.5" style={{ fontWeight: 700, fontSize: "1.3rem" }}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, concert, booking ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["all", "booked", "attended", "cancelled"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm transition-all capitalize ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontWeight: filter === f ? 500 : 400 }}
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
              <tr className="border-b border-gray-100">
                {["Booking ID", "Customer", "Concert", "Date", "Qty", "Total", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs text-gray-400 uppercase tracking-wider"
                    style={{ fontWeight: 600 }}
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
                    <CreditCard className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No transactions found</p>
                  </td>
                </tr>
              )}
              {filtered.map(({ ticket, user, concert }, i) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      {ticket.id.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs" style={{ fontWeight: 700 }}>
                          {user?.name?.charAt(0) ?? "?"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 truncate max-w-[120px]" style={{ fontWeight: 500 }}>
                          {user?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 truncate max-w-[180px]" style={{ fontWeight: 500 }}>
                        {concert?.title ?? "—"}
                      </p>
                      <p className="text-xs text-indigo-500">{concert?.artist}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{ticket.bookingDate}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
                      ×{ticket.quantity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                      ${ticket.totalPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-xs text-gray-400">
              Showing {filtered.length} of {tickets.length} records
            </span>
            <span className="text-xs text-gray-600" style={{ fontWeight: 600 }}>
              Total: ${totalRevenue.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
