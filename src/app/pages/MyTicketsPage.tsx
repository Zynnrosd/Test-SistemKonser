import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Ticket, Calendar, MapPin, Music2, ExternalLink } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

export function MyTicketsPage() {
  const { getUserTickets, getConcert } = useData();
  const { currentUser } = useAuth();

  const tickets = currentUser ? getUserTickets(currentUser.id) : [];
  const ticketsWithConcerts = tickets
    .map((t) => ({ ticket: t, concert: getConcert(t.concertId) }))
    .filter((x) => x.concert !== undefined);

  const totalSpent = tickets.reduce((sum, t) => sum + t.totalPrice, 0);
  const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0);

  return (
    <PageTransition className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.75rem" }}>
            My Tickets
          </h1>
          <p className="text-gray-500 text-sm">Your concert booking history</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-sm"
          style={{ fontWeight: 500 }}
        >
          <Music2 className="w-4 h-4" />
          Browse Concerts
        </Link>
      </div>

      {/* Summary stats */}
      {tickets.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: tickets.length },
            { label: "Total Tickets", value: totalTickets },
            { label: "Total Spent", value: `$${totalSpent.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <p className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {ticketsWithConcerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-indigo-300" />
          </div>
          <h2 className="text-gray-700 mb-2" style={{ fontWeight: 600 }}>No tickets yet</h2>
          <p className="text-sm text-gray-400 mb-6">
            You haven't booked any concerts yet. Explore our lineup!
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all shadow-sm text-sm"
            style={{ fontWeight: 500 }}
          >
            Discover Concerts
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {ticketsWithConcerts.map(({ ticket, concert }, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Concert image */}
                <div className="w-full sm:w-36 h-32 sm:h-auto flex-shrink-0">
                  <img
                    src={concert!.image}
                    alt={concert!.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={ticket.status} />
                      <span className="text-xs text-gray-400 font-mono">#{ticket.id}</span>
                    </div>
                    <h3 className="text-gray-900 mb-0.5 truncate" style={{ fontWeight: 600, fontSize: "1rem" }}>
                      {concert!.title}
                    </h3>
                    <p className="text-indigo-500 text-sm mb-2" style={{ fontWeight: 500 }}>
                      {concert!.artist}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <InfoChip icon={<Calendar className="w-3 h-3" />} text={concert!.date} />
                      <InfoChip icon={<MapPin className="w-3 h-3" />} text={concert!.city} />
                      <InfoChip icon={<Ticket className="w-3 h-3" />} text={`${ticket.quantity} ticket${ticket.quantity > 1 ? "s" : ""}`} />
                    </div>
                  </div>

                  {/* Pricing & Action */}
                  <div className="sm:text-right flex-shrink-0">
                    <p className="text-xs text-gray-400 mb-1">Total paid</p>
                    <p className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                      ${ticket.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">Booked {ticket.bookingDate}</p>
                    {concert!.status === "active" && (
                      <Link
                        to={`/concerts/${concert!.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        View Event <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket stub decoration */}
              <div className="border-t border-dashed border-gray-100 px-5 py-2.5 bg-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">Booking ref: <span className="font-mono text-gray-500">{ticket.id.toUpperCase()}</span></span>
                <span className="text-xs text-gray-400">${(ticket.totalPrice / ticket.quantity).toFixed(2)}/ticket</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}

function InfoChip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <span className="text-gray-400">{icon}</span>
      {text}
    </div>
  );
}