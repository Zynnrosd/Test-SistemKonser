import { ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Calendar, MapPin, Clock, Ticket,
  CheckCircle2, ChevronRight, User, Hash, CreditCard,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

const SEAT_META: Record<string, { label: string; bg: string; text: string; border: string; description: string }> = {
  Regular: {
    label: "Regular",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    description: "Standard seating area with good sightlines",
  },
  VIP: {
    label: "VIP",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    description: "Premium section with enhanced views & lounge access",
  },
  VVIP: {
    label: "VVIP",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    description: "Front row experience with exclusive backstage perks",
  },
};

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getTicket, getConcert } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const ticket = getTicket(id!);
  const concert = ticket ? getConcert(ticket.concertId) : undefined;

  if (!ticket || !concert) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Ticket not found.</p>
        <button onClick={() => navigate("/my-tickets")} className="text-indigo-600 text-sm hover:underline">
          Back to My Tickets
        </button>
      </div>
    );
  }

  // Guard: only owner can view
  if (ticket.userId !== currentUser?.id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">You don't have access to this ticket.</p>
        <button onClick={() => navigate("/my-tickets")} className="text-indigo-600 text-sm hover:underline">
          Back to My Tickets
        </button>
      </div>
    );
  }

  const seatMeta = SEAT_META[ticket.seatCategory] ?? SEAT_META.Regular;
  const pricePerTicket = ticket.totalPrice / ticket.quantity;

  return (
    <PageTransition className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/my-tickets" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          My Tickets
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 truncate">Ticket #{ticket.id.toUpperCase()}</span>
      </div>

      {/* Main ticket card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
      >
        {/* Concert image header */}
        <div className="relative h-48 overflow-hidden">
          <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <StatusBadge status={ticket.status} size="md" />
            {ticket.status === "booked" && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-xs text-white font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Purchased
              </span>
            )}
          </div>

          {/* Seat category badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm backdrop-blur-sm ${seatMeta.bg} ${seatMeta.text} border ${seatMeta.border}`}>
              {seatMeta.label}
            </span>
          </div>

          <div className="absolute bottom-4 left-4">
            <h1 className="text-white font-bold text-xl leading-tight">{concert.title}</h1>
            <p className="text-indigo-300 text-sm font-medium">{concert.artist}</p>
          </div>
        </div>

        {/* Ticket body */}
        <div className="p-6 space-y-5">
          {/* Seat category detail */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${seatMeta.bg} ${seatMeta.border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${seatMeta.bg} border ${seatMeta.border}`}>
              <Ticket className={`w-5 h-5 ${seatMeta.text}`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${seatMeta.text}`}>{seatMeta.label} Seat</p>
              <p className="text-xs text-gray-400">{seatMeta.description}</p>
            </div>
          </div>

          {/* Event info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Event Info</p>
            <div className="space-y-2.5">
              <InfoRow icon={<Calendar className="w-4 h-4 text-indigo-400" />} label="Date" value={concert.date} />
              <InfoRow icon={<Clock className="w-4 h-4 text-indigo-400" />} label="Time" value={concert.time} />
              <InfoRow icon={<MapPin className="w-4 h-4 text-indigo-400" />} label="Venue" value={concert.venue} />
              <InfoRow icon={<MapPin className="w-4 h-4 text-violet-400" />} label="City" value={concert.city} />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Booking info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Booking Info</p>
            <div className="space-y-2.5">
              <InfoRow icon={<Hash className="w-4 h-4 text-gray-400" />} label="Booking Ref" value={`#${ticket.id.toUpperCase()}`} mono />
              <InfoRow icon={<User className="w-4 h-4 text-gray-400" />} label="Booked by" value={currentUser?.name ?? "—"} />
              <InfoRow icon={<Calendar className="w-4 h-4 text-gray-400" />} label="Booking Date" value={ticket.bookingDate} />
              <InfoRow icon={<Ticket className="w-4 h-4 text-gray-400" />} label="Quantity" value={`${ticket.quantity} ticket${ticket.quantity > 1 ? "s" : ""}`} />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Pricing */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{ticket.seatCategory} × {ticket.quantity}</span>
                <span className="text-gray-700">${ticket.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Per ticket</span>
                <span className="text-gray-700">${pricePerTicket.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Total Paid</span>
                <span className="text-sm font-bold text-gray-900">${ticket.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket stub */}
        <div className="relative border-t border-dashed border-gray-200 px-6 py-4 bg-gray-50/70 flex items-center justify-between">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f8f7ff] border border-gray-100" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f8f7ff] border border-gray-100" />
          <div className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-xs text-gray-400 font-mono">{ticket.id.toUpperCase()}</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${seatMeta.bg} ${seatMeta.text}`}>
            {ticket.seatCategory}
          </span>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <Link
          to="/my-tickets"
          className="flex-1 py-2.5 text-center text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-all"
        >
          Back to Tickets
        </Link>
        {concert.status === "active" && (
          <Link
            to={`/concerts/${concert.id}`}
            className="flex-1 py-2.5 text-center text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-sm font-semibold transition-all shadow-sm"
          >
            View Concert
          </Link>
        )}
      </div>
    </PageTransition>
  );
}

function InfoRow({ icon, label, value, mono = false }: { icon: ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm text-gray-400 w-24 flex-shrink-0">{label}</span>
      <span className={`text-sm text-gray-700 font-medium flex-1 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
