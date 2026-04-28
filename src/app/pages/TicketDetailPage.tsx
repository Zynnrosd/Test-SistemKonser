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
    bg: "bg-accent",
    text: "text-muted-foreground",
    border: "border-border",
    description: "Standard seating area with good sightlines",
  },
  VIP: {
    label: "VIP",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    description: "Premium section with enhanced views & lounge access",
  },
  VVIP: {
    label: "VVIP",
    bg: "bg-amber-100",
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-medium">
        <Link to="/my-tickets" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          My Tickets
        </Link>
        <ChevronRight className="w-4 h-4 text-border" />
        <span className="text-foreground font-black truncate">Ticket #{ticket.id.toUpperCase()}</span>
      </div>

      {/* Main ticket card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden"
      >
        {/* Concert image header */}
        <div className="relative h-56 overflow-hidden">
          <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <StatusBadge status={ticket.status} size="md" />
            {ticket.status === "booked" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-xl text-[10px] text-white font-black uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Purchased
              </span>
            )}
          </div>

          {/* Seat category badge */}
          <div className="absolute top-6 right-6">
            <span className={`px-4 py-2 rounded-xl text-[10px] font-black shadow-lg backdrop-blur-md uppercase tracking-widest ${seatMeta.bg} ${seatMeta.text} border ${seatMeta.border}`}>
              {seatMeta.label}
            </span>
          </div>

          <div className="absolute bottom-6 left-6">
            <h1 className="text-white font-black text-2xl leading-tight tracking-tight mb-1">{concert.title}</h1>
            <p className="text-primary text-sm font-black uppercase tracking-widest">{concert.artist}</p>
          </div>
        </div>

        {/* Ticket body */}
        <div className="p-8 space-y-8">
          {/* Seat category detail */}
          <div className={`flex items-center gap-4 p-5 rounded-2xl border ${seatMeta.bg} ${seatMeta.border} shadow-sm`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${seatMeta.bg} border ${seatMeta.border} shadow-sm`}>
              <Ticket className={`w-6 h-6 ${seatMeta.text}`} />
            </div>
            <div>
              <p className={`text-base font-black tracking-tight ${seatMeta.text}`}>{seatMeta.label} Seat</p>
              <p className="text-xs text-muted-foreground font-medium">{seatMeta.description}</p>
            </div>
          </div>

          {/* Event info */}
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Event Info</p>
            <div className="space-y-4">
              <InfoRow icon={<Calendar className="w-5 h-5 text-primary/60" />} label="Date" value={concert.date} />
              <InfoRow icon={<Clock className="w-5 h-5 text-primary/60" />} label="Time" value={concert.time} />
              <InfoRow icon={<MapPin className="w-5 h-5 text-primary/60" />} label="Venue" value={concert.venue} />
              <InfoRow icon={<MapPin className="w-5 h-5 text-primary/40" />} label="City" value={concert.city} />
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Booking info */}
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Booking Info</p>
            <div className="space-y-4">
              <InfoRow icon={<Hash className="w-5 h-5 text-muted-foreground/40" />} label="Booking Ref" value={`#${ticket.id.toUpperCase()}`} mono />
              <InfoRow icon={<User className="w-5 h-5 text-muted-foreground/40" />} label="Booked by" value={currentUser?.name ?? "—"} />
              <InfoRow icon={<Calendar className="w-5 h-5 text-muted-foreground/40" />} label="Booking Date" value={ticket.bookingDate} />
              <InfoRow icon={<Ticket className="w-5 h-5 text-muted-foreground/40" />} label="Quantity" value={`${ticket.quantity} ticket${ticket.quantity > 1 ? "s" : ""}`} />
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Pricing */}
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Payment Summary</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted-foreground uppercase tracking-widest text-[10px]">{ticket.seatCategory} × {ticket.quantity}</span>
                <span className="text-foreground">${ticket.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Per ticket</span>
                <span className="text-foreground">${pricePerTicket.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-5 border-t border-border">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Amount Paid</span>
                <span className="text-3xl font-black text-primary tracking-tighter">${ticket.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket stub */}
        <div className="relative border-t border-dashed border-border px-8 py-5 bg-accent/40 flex items-center justify-between font-black uppercase tracking-widest">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border border-border shadow-[inset_0_0_4px_rgba(0,0,0,0.05)]" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border border-border shadow-[inset_0_0_4px_rgba(0,0,0,0.05)]" />
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-primary/40" />
            <span className="text-[10px] text-primary">#{ticket.id.toUpperCase()}</span>
          </div>
          <span className={`text-[10px] px-3 py-1.5 rounded-xl border ${seatMeta.bg} ${seatMeta.text} ${seatMeta.border} shadow-sm`}>
            {ticket.seatCategory}
          </span>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <Link
          to="/my-tickets"
          className="flex-1 py-4 text-center text-foreground rounded-2xl border border-border hover:bg-accent text-sm font-black transition-all shadow-sm"
        >
          Back to Tickets
        </Link>
        {concert.status === "active" && (
          <Link
            to={`/concerts/${concert.id}`}
            className="flex-1 py-4 text-center text-white rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 text-sm font-black transition-all"
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
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest w-28 flex-shrink-0">{label}</span>
      <span className={`text-[15px] text-foreground font-bold flex-1 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
