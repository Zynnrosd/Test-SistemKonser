import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Ticket, Calendar, MapPin, Music2, ArrowRight, DollarSign, Star } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

const SEAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Regular: { bg: "bg-accent", text: "text-muted-foreground", border: "border-border" },
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
    { label: "Tickets", value: totalTickets, icon: Star, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <PageTransition className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-foreground font-black text-3xl mb-1 tracking-tight">My Tickets</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Your concert booking history</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border text-foreground hover:bg-accent text-sm font-black transition-all shadow-sm"
        >
          <Music2 className="w-5 h-5" />
          Browse
        </Link>
      </div>

      {/* Stats */}
      {tickets.length > 0 && (
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-[2rem] border border-border shadow-sm p-6 text-center group hover:border-primary/20 transition-all"
            >
              <div className={`w-10 h-10 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-3 border border-border shadow-sm`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className={`font-black text-2xl tracking-tighter ${color}`}>{value}</p>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ticket list */}
      {ticketsWithConcerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32"
        >
          <div className="w-24 h-24 bg-accent rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-border shadow-sm">
            <Ticket className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-foreground font-black text-2xl mb-2 tracking-tight">No tickets yet</h2>
          <p className="text-muted-foreground text-sm mb-10 font-medium">You haven't booked any concerts yet.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white bg-primary text-base font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
          >
            Discover Concerts
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {ticketsWithConcerts.map(({ ticket, concert }, i) => {
            const seatStyle = SEAT_COLORS[ticket.seatCategory] ?? SEAT_COLORS.Regular;
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/tickets/${ticket.id}`}
                  className="group block bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all overflow-hidden"
                >
                  <div className="flex">
                    {/* Concert image */}
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden relative">
                      <img
                        src={concert!.image}
                        alt={concert!.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-6 py-4 flex items-center justify-between gap-4 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <StatusBadge status={ticket.status} />
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border uppercase tracking-widest shadow-sm ${seatStyle.bg} ${seatStyle.text} ${seatStyle.border}`}>
                            {ticket.seatCategory}
                          </span>
                        </div>
                        <p className="text-foreground font-black text-lg truncate tracking-tight mb-0.5">{concert!.title}</p>
                        <p className="text-primary text-xs font-bold uppercase tracking-widest truncate mb-3">{concert!.artist}</p>
                        <div className="flex items-center gap-4">
                          <InfoChip icon={<Calendar className="w-3.5 h-3.5" />} text={concert!.date} />
                          <InfoChip icon={<MapPin className="w-3.5 h-3.5" />} text={concert!.city} />
                          <InfoChip icon={<Ticket className="w-3.5 h-3.5" />} text={`${ticket.quantity}× ticket${ticket.quantity > 1 ? "s" : ""}`} />
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-foreground font-black text-2xl tracking-tighter">${ticket.totalPrice.toFixed(2)}</p>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-3">Booked {ticket.bookingDate}</p>
                        <span className="inline-flex items-center gap-2 text-sm text-primary font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                          Details <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stub footer */}
                  <div className="relative border-t border-dashed border-border px-8 py-3 bg-accent/40 flex items-center justify-between font-bold">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border border-border shadow-[inset_0_0_4px_rgba(0,0,0,0.05)]" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border border-border shadow-[inset_0_0_4px_rgba(0,0,0,0.05)]" />
                    <span className="text-[10px] text-primary font-black uppercase tracking-widest">#{ticket.id.toUpperCase()}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">${(ticket.totalPrice / ticket.quantity).toFixed(2)} / ticket</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}

function InfoChip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wide">
      <span className="text-primary/40">{icon}</span>
      {text}
    </div>
  );
}