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
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.75rem" }}>
          Relational Data View
        </h1>
        <p className="text-gray-500 text-sm">
          Full JOIN across <span className="text-indigo-600" style={{ fontWeight: 500 }}>users</span>{" "}
          ·{" "}
          <span className="text-violet-600" style={{ fontWeight: 500 }}>concerts</span>{" "}
          ·{" "}
          <span className="text-emerald-600" style={{ fontWeight: 500 }}>tickets</span>{" "}
          tables
        </p>
      </div>

      {/* Schema diagram */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-indigo-500" />
          <h2 className="text-gray-700" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
            Database Schema & Relationships
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2">
          <SchemaTable
            name="users"
            color="bg-indigo-50 border-indigo-200 text-indigo-700"
            dot="bg-indigo-500"
            fields={["id (PK)", "name", "email", "role"]}
          />
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xs hidden sm:block">1..N</span>
            <div className="hidden sm:flex items-center gap-1">
              <div className="w-8 h-px bg-gray-300" />
              <Link2 className="w-3.5 h-3.5" />
              <div className="w-8 h-px bg-gray-300" />
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">user_id FK</span>
          </div>
          <SchemaTable
            name="tickets"
            color="bg-emerald-50 border-emerald-200 text-emerald-700"
            dot="bg-emerald-500"
            fields={["id (PK)", "user_id (FK)", "concert_id (FK)", "quantity", "total_price", "status"]}
          />
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xs hidden sm:block">N..1</span>
            <div className="hidden sm:flex items-center gap-1">
              <div className="w-8 h-px bg-gray-300" />
              <Link2 className="w-3.5 h-3.5" />
              <div className="w-8 h-px bg-gray-300" />
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">concert_id FK</span>
          </div>
          <SchemaTable
            name="concerts"
            color="bg-violet-50 border-violet-200 text-violet-700"
            dot="bg-violet-500"
            fields={["id (PK)", "title", "artist", "venue", "date", "price", "status"]}
          />
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 font-mono leading-relaxed">
            <span className="text-indigo-600">SELECT</span> t.id, t.quantity, t.total_price, t.status,{" "}
            <br className="hidden sm:block" />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;u.name, u.email, c.title, c.artist, c.venue, c.date
            <br />
            <span className="text-indigo-600">FROM</span> tickets t
            <br />
            <span className="text-indigo-600">JOIN</span> users u <span className="text-indigo-600">ON</span> t.user_id = u.id
            <br />
            <span className="text-indigo-600">JOIN</span> concerts c <span className="text-indigo-600">ON</span> t.concert_id = c.id
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, concert, artist, or ticket ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="text-gray-900" style={{ fontWeight: 600 }}>{filtered.length}</span> of{" "}
          <span className="text-gray-900" style={{ fontWeight: 600 }}>{data.length}</span> records
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Database className="w-3.5 h-3.5" />
          3-table JOIN
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {/* Ticket columns */}
                <ColumnHeader label="Ticket ID" color="text-emerald-600" prefix="tickets." />
                <ColumnHeader label="Booking Date" color="text-emerald-600" prefix="tickets." />
                <ColumnHeader label="Qty" color="text-emerald-600" prefix="tickets." />
                <ColumnHeader label="Total" color="text-emerald-600" prefix="tickets." />
                <ColumnHeader label="Status" color="text-emerald-600" prefix="tickets." />
                {/* User columns */}
                <ColumnHeader label="User Name" color="text-indigo-600" prefix="users." />
                <ColumnHeader label="Email" color="text-indigo-600" prefix="users." />
                {/* Concert columns */}
                <ColumnHeader label="Concert" color="text-violet-600" prefix="concerts." />
                <ColumnHeader label="Artist" color="text-violet-600" prefix="concerts." />
                <ColumnHeader label="Venue" color="text-violet-600" prefix="concerts." />
                <ColumnHeader label="Date" color="text-violet-600" prefix="concerts." />
                <ColumnHeader label="Price" color="text-violet-600" prefix="concerts." />
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
  prefix,
}: {
  label: string;
  color: string;
  prefix: string;
}) {
  return (
    <th className="px-4 py-3.5 text-left whitespace-nowrap">
      <div>
        <span className={`text-xs ${color} opacity-60`} style={{ fontWeight: 500, fontSize: "0.65rem" }}>
          {prefix}
        </span>
        <br />
        <span className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
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
