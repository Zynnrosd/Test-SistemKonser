import { useState } from "react";
import { motion } from "motion/react";
import { Database, Search, Info, Link2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

export function DataTablePage() {
  const { getJoinedData } = useData();
  const [search, setSearch] = useState("");

  const data = getJoinedData();

  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    return (
      !q ||
      row.userName.toLowerCase().includes(q) ||
      row.userEmail.toLowerCase().includes(q) ||
      row.concertTitle.toLowerCase().includes(q) ||
      row.concertArtist.toLowerCase().includes(q) ||
      row.ticketId.toLowerCase().includes(q)
    );
  });

  return (
    <PageTransition className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground tracking-tighter" style={{ fontWeight: 900, fontSize: "2.5rem" }}>
            Data Hub
          </h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">
            Joined records across the system
          </p>
        </div>
      </div>


      {/* Search */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, concert, artist, or ticket ID..."
            className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-border bg-accent text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all font-bold"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          Showing <span className="text-foreground">{filtered.length}</span> of{" "}
          <span className="text-foreground">{data.length}</span> entries
        </p>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {/* Ticket columns */}
                <ColumnHeader label="Ticket ID" color="text-primary" />
                <ColumnHeader label="Booking Date" color="text-primary" />
                <ColumnHeader label="Qty" color="text-primary" />
                <ColumnHeader label="Total" color="text-primary" />
                <ColumnHeader label="Status" color="text-primary" />
                {/* User columns */}
                <ColumnHeader label="User Name" color="text-primary" />
                <ColumnHeader label="Email" color="text-primary" />
                {/* Concert columns */}
                <ColumnHeader label="Concert" color="text-primary" />
                <ColumnHeader label="Artist" color="text-primary" />
                <ColumnHeader label="Venue" color="text-primary" />
                <ColumnHeader label="Date" color="text-primary" />
                <ColumnHeader label="Price" color="text-primary" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-5 py-16 text-center">
                    <Database className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No records match your search</p>
                  </td>
                </tr>
              )}
              {filtered.map((row, i) => (
                <motion.tr
                  key={row.ticketId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Ticket */}
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gray-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {row.ticketId.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{row.bookingDate}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-gray-800" style={{ fontWeight: 600 }}>×{row.quantity}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-900" style={{ fontWeight: 700 }}>${row.totalPrice.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={row.ticketStatus} />
                  </td>
                  {/* User */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs" style={{ fontWeight: 700 }}>
                          {row.userName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-800 whitespace-nowrap" style={{ fontWeight: 500 }}>{row.userName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{row.userEmail}</td>
                  {/* Concert */}
                  <td className="px-4 py-3.5">
                    <span className="text-gray-800 whitespace-nowrap" style={{ fontWeight: 500 }}>{row.concertTitle}</span>
                  </td>
                  <td className="px-4 py-3.5 text-indigo-500 whitespace-nowrap">{row.concertArtist}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[180px] truncate">{row.concertVenue}</td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{row.concertDate}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-900 whitespace-nowrap" style={{ fontWeight: 600 }}>${row.concertPrice.toFixed(2)}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between">
            <span className="text-xs text-gray-400">
              {filtered.length} records · 3 tables joined · 12 columns
            </span>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-gray-400">tickets table</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-gray-400">users table</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
                <span className="text-gray-400">concerts table</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function ColumnHeader({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <th className="px-6 py-4 text-left whitespace-nowrap bg-accent/30 border-b border-border">
      <div>
        <span className={`text-[10px] ${color} uppercase tracking-widest font-black`}>
          {label}
        </span>
      </div>
    </th>
  );
}

function SchemaTable({
  name,
  color,
  dot,
  fields,
}: {
  name: string;
  color: string;
  dot: string;
  fields: string[];
}) {
  return (
    <div className={`border rounded-xl p-3 min-w-[140px] ${color}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-xs" style={{ fontWeight: 700 }}>
          {name}
        </span>
      </div>
      <div className="space-y-0.5">
        {fields.map((f) => (
          <p key={f} className="text-xs opacity-80 font-mono">
            {f}
          </p>
        ))}
      </div>
    </div>
  );
}
