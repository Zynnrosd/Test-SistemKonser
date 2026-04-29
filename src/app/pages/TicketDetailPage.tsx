import { ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Calendar, MapPin, Clock, Ticket,
  CheckCircle2, ChevronRight, User, Hash, CreditCard, Music2, ShieldCheck
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

const SEAT_META: Record<string, { label: string; bg: string; text: string; border: string; description: string }> = {
  Regular: {
    label: "Regular",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
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
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-700",
    border: "border-fuchsia-200",
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
        <p className="text-slate-500 font-bold mb-4">Ticket not found.</p>
        <button onClick={() => navigate("/my-tickets")} className="text-primary text-sm font-bold hover:underline">
          Back to My Tickets
        </button>
      </div>
    );
  }

  // Guard: only owner can view
  if (ticket.userId !== currentUser?.id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 font-bold mb-4">You don't have access to this ticket.</p>
        <button onClick={() => navigate("/my-tickets")} className="text-primary text-sm font-bold hover:underline">
          Back to My Tickets
        </button>
      </div>
    );
  }

  const seatMeta = SEAT_META[ticket.seatCategory] ?? SEAT_META.Regular;
  const pricePerTicket = ticket.totalPrice / ticket.quantity;

  return (
    <PageTransition className="relative min-h-screen bg-slate-50 selection:bg-primary/20 overflow-x-hidden flex flex-col">

      {/* 1. COLORFUL AURA BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/10 blur-[140px] rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-400/10 blur-[140px] rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-primary/10 blur-[140px] rounded-full mix-blend-multiply opacity-30" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full px-4 sm:px-6 pt-10 pb-20">

        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
            <Link to="/my-tickets" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> My Tickets
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-800 truncate">Ticket #{ticket.id.toUpperCase()}</span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white rounded-full text-slate-700 text-xs font-bold shadow-sm self-start sm:self-auto cursor-default">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Pass
          </button>
        </div>

        {/* --- MAIN TICKET CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/90 backdrop-blur-3xl rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col relative"
        >
          {/* Latar Belakang Holografik Tipis di dalam Tiket */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10 pointer-events-none" />

          {/* Concert Image Header (Lebih Ramping) */}
          <div className="relative h-48 sm:h-56 w-full shrink-0">
            <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <StatusBadge status={ticket.status} size="sm" />
              {ticket.status === "booked" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md rounded-md text-[9px] text-white font-black uppercase tracking-widest shadow-sm">
                  <CheckCircle2 className="w-3 h-3" /> Purchased
                </span>
              )}
            </div>

            {/* Seat Badge Kanan Atas */}
            <div className="absolute top-5 right-5">
              <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border ${seatMeta.bg} ${seatMeta.text} ${seatMeta.border}`}>
                {seatMeta.label}
              </span>
            </div>

            <div className="absolute bottom-5 left-6 right-6">
              <h1 className="text-white font-black text-2xl sm:text-3xl leading-tight tracking-tight mb-1 truncate drop-shadow-md">{concert.title}</h1>
              <p className="text-primary text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] truncate">{concert.artist}</p>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-8 bg-gradient-to-b from-transparent to-white/50 relative z-10">

            {/* Seat Category Detail */}
            <div className={`flex items-center gap-4 p-4 rounded-2xl border bg-white/60 backdrop-blur-md ${seatMeta.border} shadow-sm`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${seatMeta.bg} border ${seatMeta.border}`}>
                <Ticket className={`w-5 h-5 ${seatMeta.text}`} />
              </div>
              <div className="overflow-hidden">
                <p className={`text-sm font-black tracking-tight ${seatMeta.text}`}>{seatMeta.label} Pass</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold truncate">{seatMeta.description}</p>
              </div>
            </div>

            {/* Grid Informasi (Event & Booking Digabung agar lebih compact) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

              {/* Event Info */}
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Event Details</p>
                <div className="space-y-3">
                  <InfoRow icon={<Calendar />} label="Date" value={concert.date} />
                  <InfoRow icon={<Clock />} label="Time" value={concert.time} />
                  <InfoRow icon={<MapPin />} label="Venue" value={concert.venue} />
                  <InfoRow icon={<MapPin />} label="City" value={concert.city} />
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Booking Details</p>
                <div className="space-y-3">
                  <InfoRow icon={<Hash />} label="Ref No." value={`#${ticket.id.toUpperCase()}`} mono />
                  <InfoRow icon={<User />} label="Booked by" value={currentUser?.name ?? "—"} />
                  <InfoRow icon={<Calendar />} label="Book Date" value={ticket.bookingDate} />
                  <InfoRow icon={<Ticket />} label="Quantity" value={`${ticket.quantity} Ticket${ticket.quantity > 1 ? "s" : ""}`} />
                </div>
              </div>

            </div>

            <div className="border-t border-slate-100" />

            {/* Pricing Summary */}
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Summary</p>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>{ticket.seatCategory} × {ticket.quantity}</span>
                  <span className="text-slate-900">${ticket.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Price per ticket</span>
                  <span className="text-slate-900">${pricePerTicket.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-slate-100/60 mt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">${ticket.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* --- TICKET STUB FOOTER (Potongan Tiket Bawah) --- */}
          <div className="relative border-t-2 border-dashed border-slate-200 px-6 sm:px-8 py-5 bg-slate-50/80 flex items-center justify-between font-black uppercase tracking-widest">
            {/* Lubang Kiri Kanan */}
            <div className="absolute -left-3 top-0 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border-b border-r border-slate-200 shadow-inner" />
            <div className="absolute -right-3 top-0 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border-b border-l border-slate-200 shadow-inner" />

            <div className="flex items-center gap-2.5 text-slate-400">
              <CreditCard className="w-4 h-4" />
              <span className="text-[9px]">PAID VIA {ticket.paymentMethod}</span>
            </div>

            {/* Barcode Mockup (Dekorasi) */}
            <div className="flex gap-0.5 opacity-30 mix-blend-multiply">
              <div className="w-1 h-6 bg-slate-900"></div><div className="w-0.5 h-6 bg-slate-900"></div><div className="w-1.5 h-6 bg-slate-900"></div><div className="w-1 h-6 bg-slate-900"></div><div className="w-0.5 h-6 bg-slate-900"></div><div className="w-2 h-6 bg-slate-900"></div><div className="w-1 h-6 bg-slate-900"></div><div className="w-1.5 h-6 bg-slate-900"></div>
            </div>
          </div>
        </motion.div>

        {/* --- BOTTOM ACTIONS --- */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/my-tickets"
            className="flex-1 py-3.5 text-center text-slate-600 rounded-xl border border-slate-200 bg-white/60 backdrop-blur-md hover:bg-white hover:text-slate-900 text-sm font-bold transition-all shadow-sm"
          >
            Back to Tickets
          </Link>
          {concert.status === "active" && (
            <Link
              to={`/concerts/${concert.id}`}
              className="flex-1 py-3.5 text-center text-white rounded-xl bg-slate-900 shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all text-sm font-bold flex items-center justify-center gap-2 group"
            >
              View Concert Page <Music2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>
          )}
        </div>

      </div>
    </PageTransition>
  );
}

// Komponen InfoRow yang Diperkecil agar lebih Rapi
function InfoRow({ icon, label, value, mono = false }: { icon: ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-slate-400 bg-slate-100 rounded-md">
        {/* Render ulang icon dengan ukuran lebih kecil */}
        <div className="scale-75">{icon}</div>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
        <span className={`text-xs text-slate-900 font-bold truncate ${mono ? "font-mono tracking-widest text-primary" : ""}`}>{value}</span>
      </div>
    </div>
  );
}