import { motion } from "motion/react";
import { Music2, Ticket, Users, TrendingUp, DollarSign, Activity } from "lucide-react";
import { useData } from "../context/DataContext";
import { USERS } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

export function AdminDashboard() {
  const { concerts, tickets } = useData();

  const activeConcerts = concerts.filter((c) => c.status === "active");
  const archivedConcerts = concerts.filter((c) => c.status === "archived");
  const totalRevenue = tickets.reduce((s, t) => s + t.totalPrice, 0);
  const avgTicketPrice = tickets.length > 0 ? totalRevenue / tickets.reduce((s, t) => s + t.quantity, 0) : 0;

  const stats = [
    {
      label: "Total Concerts",
      value: concerts.length,
      sub: `${activeConcerts.length} active · ${archivedConcerts.length} archived`,
      icon: Music2,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      gradient: "from-indigo-50 to-indigo-100/50",
    },
    {
      label: "Total Bookings",
      value: tickets.length,
      sub: `${tickets.filter(t => t.status === "booked").length} active bookings`,
      icon: Ticket,
      color: "text-violet-600",
      bg: "bg-violet-50",
      gradient: "from-violet-50 to-violet-100/50",
    },
    {
      label: "Registered Users",
      value: USERS.filter(u => u.role === "user").length,
      sub: "Customer accounts",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      gradient: "from-emerald-50 to-emerald-100/50",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      sub: `Avg $${avgTicketPrice.toFixed(2)}/ticket`,
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
      gradient: "from-amber-50 to-amber-100/50",
    },
  ];

  const recentTickets = [...tickets]
    .sort((a, b) => b.bookingDate.localeCompare(a.bookingDate))
    .slice(0, 5);

  return (
    <PageTransition className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1" style={{ fontWeight: 800, fontSize: "2.25rem", letterSpacing: "-0.025em" }}>
          Admin Overview
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Monitor your concert management system at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-primary/5`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <p className="text-foreground mb-0.5" style={{ fontWeight: 800, fontSize: "1.75rem" }}>{value}</p>
            <p className="text-sm text-muted-foreground mb-1 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-xs text-primary/60 font-medium">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Recent bookings */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-border shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-foreground" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                Recent Bookings
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-accent text-muted-foreground rounded-full border border-border">{tickets.length} total</span>
          </div>
          <div className="space-y-3">
            {recentTickets.map((ticket, i) => {
              const user = USERS.find((u) => u.id === ticket.userId);
              const concert = concerts.find((c) => c.id === ticket.concertId);
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-accent transition-all group"
                >
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                    <span className="text-white text-xs" style={{ fontWeight: 800 }}>
                      {user?.name?.charAt(0) ?? "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate font-bold" style={{ fontSize: "0.95rem" }}>
                      {user?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate font-medium">{concert?.title ?? "Unknown Concert"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-foreground font-black">
                      ${ticket.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{ticket.bookingDate}</p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Concert status */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status breakdown */}
          <div className="bg-white rounded-3xl border border-border shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-foreground" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                Concert Status
              </h2>
            </div>
            <div className="space-y-4">
              <StatusBar label="Active" count={activeConcerts.length} total={concerts.length} color="bg-primary shadow-lg shadow-primary/20" />
              <StatusBar label="Archived" count={archivedConcerts.length} total={concerts.length} color="bg-amber-400" />
              <StatusBar
                label="Sold Out"
                count={activeConcerts.filter(c => c.availableSeats === 0).length}
                total={concerts.length}
                color="bg-red-400"
              />
            </div>
          </div>

          {/* Top concerts by tickets */}
          <div className="bg-white rounded-3xl border border-border shadow-sm p-8">
            <h2 className="text-foreground mb-6" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
              Most Booked
            </h2>
            <div className="space-y-2.5">
              {concerts
                .map((c) => ({
                  concert: c,
                  bookings: tickets.filter((t) => t.concertId === c.id).length,
                }))
                .sort((a, b) => b.bookings - a.bookings)
                .slice(0, 4)
                .map(({ concert, bookings }) => (
                  <div key={concert.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-accent transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate font-bold">
                        {concert.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">{concert.artist}</p>
                    </div>
                    <span className="flex-shrink-0 text-[10px] px-2.5 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 font-bold uppercase">
                      {bookings} bookings
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-wider">
        <span>{label}</span>
        <span>{count} of {total}</span>
      </div>
      <div className="h-2 bg-accent rounded-full overflow-hidden border border-border/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
