import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Ticket, Calendar, MapPin, Music2, ArrowRight, DollarSign, Star } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

const SEAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Regular: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  VIP: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  VVIP: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
};

export function MyTicketsPage() {
  const { getUserTickets, getConcert } = useData();
  const { currentUser } = useAuth();

  const tickets = currentUser ? getUserTickets(currentUser.id) : [];
  const ticketsWithConcerts = tickets
    .map((t) => ({ ticket: t, concert: getConcert(t.concertId) }))
    .filter((x) => x.concert !== undefined);

  const totalSpent = tickets.reduce((sum, t) => sum + t.totalPrice, 0);
  const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0);

  const stats = [
    { label: "Bookings", value: tickets.length, icon: Ticket, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Tickets", value: totalTickets, icon: Star, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-slate-900 font-extrabold text-3xl tracking-tight mb-1">My Tickets</h1>
          <p className="text-slate-500 text-sm font-medium">Your complete concert booking history</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors shadow-sm"
        >
          <Music2 className="w-4 h-4" />
          Browse Events
        </Link>
      </div>

      {/* Stats */}
      {tickets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">{label}</p>
                <p className="font-extrabold text-2xl text-slate-900 leading-none">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ticket list */}
      <div className="flex-1">
        {ticketsWithConcerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100">
              <Ticket className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-slate-900 font-bold text-xl mb-2">No tickets found</h2>
            <p className="text-slate-500 text-sm mb-8">You haven't booked any concerts yet.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-primary text-sm font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-95"
            >
              Discover Concerts
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {ticketsWithConcerts.map(({ ticket, concert }, i) => {
              const seatStyle = SEAT_COLORS[ticket.seatCategory] ?? SEAT_COLORS.Regular;
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="group block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Concert image */}
                      <div className="w-full sm:w-40 h-32 sm:h-auto flex-shrink-0 relative overflow-hidden bg-slate-100">
                        <img
                          src={concert!.image}
                          alt={concert!.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <StatusBadge status={ticket.status} />
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${seatStyle.bg} ${seatStyle.text} ${seatStyle.border}`}>
                              {ticket.seatCategory}
                            </span>
                          </div>
                          <h3 className="text-slate-900 font-bold text-lg truncate mb-1">{concert!.title}</h3>
                          <p className="text-primary text-xs font-semibold uppercase tracking-wider truncate mb-3">{concert!.artist}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <InfoChip icon={<Calendar className="w-3.5 h-3.5" />} text={concert!.date} />
                            <InfoChip icon={<MapPin className="w-3.5 h-3.5" />} text={concert!.city} />
                            <InfoChip icon={<Ticket className="w-3.5 h-3.5" />} text={`${ticket.quantity} Ticket${ticket.quantity > 1 ? "s" : ""}`} />
                          </div>
                        </div>

                        <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-3 sm:mt-0">
                          <div>
                            <p className="text-slate-900 font-extrabold text-xl">${ticket.totalPrice.toFixed(2)}</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Booked {ticket.bookingDate}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold group-hover:gap-2 transition-all">
                            Details <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stub footer (Potongan Tiket) */}
                    <div className="relative border-t border-dashed border-slate-200 px-6 py-2.5 bg-slate-50 flex items-center justify-between">
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-slate-200 shadow-inner" />
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-slate-200 shadow-inner" />
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">ORDER #{ticket.id.toUpperCase()}</span>
                      <span className="text-[11px] text-slate-500 font-medium">${(ticket.totalPrice / ticket.quantity).toFixed(2)} / ticket</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function InfoChip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
      <span className="text-slate-400">{icon}</span>
      {text}
    </div>
  );
}