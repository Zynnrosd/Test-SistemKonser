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
  VVIP: { bg: "bg-fuchsia-100", text: "text-fuchsia-700", border: "border-fuchsia-200" },
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
    { label: "Total Bookings", value: tickets.length, icon: Ticket, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Seats Secured", value: totalTickets, icon: Star, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Total Value", value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <PageTransition className="relative min-h-screen bg-slate-50 selection:bg-primary/20 overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[140px] rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/5 blur-[140px] rounded-full mix-blend-multiply opacity-50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col min-h-[80vh]">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-slate-900 font-black text-3xl md:text-4xl tracking-tight mb-1.5">My Tickets</motion.h1>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-slate-500 text-sm font-medium">Your complete live event history</motion.p>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-xl border border-white text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-sm font-bold transition-all shadow-sm group"
            >
              <Music2 className="w-4 h-4" /> Browse Events
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        {tickets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-[1.25rem] border border-white shadow-lg shadow-slate-200/30 p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner border border-white`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="font-black text-2xl text-slate-900 tracking-tighter leading-none">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Ticket list */}
        <div className="flex-1">
          {ticketsWithConcerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-xl shadow-slate-200/30"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100 shadow-inner">
                <Ticket className="w-8 h-8 text-slate-300" />
              </div>
              <h2 className="text-slate-900 font-black text-xl mb-2">No tickets found</h2>
              <p className="text-slate-500 text-sm font-medium mb-6">Looks like you haven't booked any concerts yet.</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-slate-900 text-sm font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 group"
              >
                Discover Concerts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {ticketsWithConcerts.map(({ ticket, concert }, i) => {
                const seatStyle = SEAT_COLORS[ticket.seatCategory] ?? SEAT_COLORS.Regular;
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="group block bg-white rounded-[1.5rem] border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                    >
                      {/* Ribbon Kiri */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-primary transition-colors" />

                      <div className="flex flex-col sm:flex-row pl-1.5">
                        {/* Concert image */}
                        <div className="w-full sm:w-36 h-36 flex-shrink-0 relative overflow-hidden bg-slate-100 m-3 rounded-xl">
                          <img
                            src={concert!.image}
                            alt={concert!.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                          <div className="absolute bottom-2 left-2 text-white">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-80">{concert!.date}</p>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 sm:p-5 sm:pl-2 flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
                            <div className="min-w-0 flex flex-col justify-start">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <StatusBadge status={ticket.status} />
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest shadow-sm ${seatStyle.bg} ${seatStyle.text} ${seatStyle.border}`}>
                                  {ticket.seatCategory}
                                </span>
                              </div>
                              <h3 className="text-slate-900 font-black text-lg truncate mb-0.5 pr-2">{concert!.title}</h3>
                              <p className="text-primary text-xs font-bold uppercase tracking-wider truncate mb-3">{concert!.artist}</p>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                                <InfoChip icon={<MapPin className="w-3.5 h-3.5" />} text={concert!.city} />
                                <InfoChip icon={<Ticket className="w-3.5 h-3.5" />} text={`${ticket.quantity} Ticket${ticket.quantity > 1 ? "s" : ""}`} />
                              </div>
                            </div>

                            <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0 min-w-[100px]">
                              <div className="text-left sm:text-right mb-0 sm:mb-3">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Total Value</p>
                                <p className="text-slate-900 font-black text-xl tracking-tighter">${ticket.totalPrice.toFixed(2)}</p>
                              </div>
                              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 font-bold group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                Details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stub footer */}
                      <div className="relative border-t-2 border-dashed border-slate-100 px-5 py-2.5 bg-slate-50/50 flex items-center justify-between">
                        <div className="absolute -left-2.5 top-0 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border-b border-r border-slate-100 shadow-inner" />
                        <div className="absolute -right-2.5 top-0 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border-b border-l border-slate-100 shadow-inner" />

                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">ORDER #{ticket.id.toUpperCase()}</span>
                        <span className="text-[10px] text-slate-500 font-bold">${(ticket.totalPrice / ticket.quantity).toFixed(2)} / ticket</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function InfoChip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
      <span className="text-slate-400">{icon}</span>
      {text}
    </div>
  );
}