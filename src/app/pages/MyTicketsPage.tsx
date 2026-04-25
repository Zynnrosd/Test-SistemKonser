import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Ticket, Calendar, MapPin, Music2, ArrowRight, DollarSign, Star } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

const SEAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Regular: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  VIP: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  VVIP: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 font-bold text-2xl mb-0.5">My Tickets</h1>
          <p className="text-gray-400 text-sm">Your concert booking history</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all"
        >
          <Music2 className="w-4 h-4" />
          Browse
        </Link>
      </div>

      {/* Stats */}
      {tickets.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center"
            >
              <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-gray-900 font-bold text-lg">{value}</p>
              <p className="text-gray-400 text-xs">{label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ticket list */}
      {ticketsWithConcerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-indigo-200" />
          </div>
          <h2 className="text-gray-700 font-semibold mb-1">No tickets yet</h2>
          <p className="text-sm text-gray-400 mb-5">You haven't booked any concerts yet.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold shadow-sm"
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
                  className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all overflow-hidden"
                >
                  <div className="flex">
                    {/* Concert image */}
                    <div className="w-28 h-24 flex-shrink-0 overflow-hidden">
                      <img
                        src={concert!.image}
                        alt={concert!.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-4 py-3 flex items-center justify-between gap-3 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <StatusBadge status={ticket.status} />
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${seatStyle.bg} ${seatStyle.text} ${seatStyle.border}`}>
                            {ticket.seatCategory}
                          </span>
                        </div>
                        <p className="text-gray-900 font-semibold text-sm truncate">{concert!.title}</p>
                        <p className="text-indigo-500 text-xs font-medium truncate mb-1.5">{concert!.artist}</p>
                        <div className="flex items-center gap-3">
                          <InfoChip icon={<Calendar className="w-3 h-3" />} text={concert!.date} />
                          <InfoChip icon={<MapPin className="w-3 h-3" />} text={concert!.city} />
                          <InfoChip icon={<Ticket className="w-3 h-3" />} text={`${ticket.quantity}×`} />
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-gray-900 font-bold">${ticket.totalPrice.toFixed(2)}</p>
                        <p className="text-gray-400 text-xs mb-2">Booked {ticket.bookingDate}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-indigo-500 font-medium group-hover:gap-2 transition-all">
                          Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stub footer */}
                  <div className="relative border-t border-dashed border-gray-100 px-4 py-2 bg-gray-50/60 flex items-center justify-between">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f8f7ff] border border-gray-100" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f8f7ff] border border-gray-100" />
                    <span className="text-xs text-gray-400 font-mono">#{ticket.id.toUpperCase()}</span>
                    <span className="text-xs text-gray-400">${(ticket.totalPrice / ticket.quantity).toFixed(2)} / ticket</span>
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
    <div className="flex items-center gap-1 text-xs text-gray-400">
      <span className="text-gray-300">{icon}</span>
      {text}
    </div>
  );
}