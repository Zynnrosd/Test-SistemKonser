import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, CreditCard, CheckCircle2, User, MapPin,
  Calendar, Ticket, Music2, Phone, Mail, AlertCircle,
  Smartphone, Building2, Wallet,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  "Credit Card": <CreditCard className="w-4 h-4" />,
  "Debit Card": <CreditCard className="w-4 h-4" />,
  "GoPay": <Smartphone className="w-4 h-4" />,
  "OVO": <Smartphone className="w-4 h-4" />,
  "Dana": <Wallet className="w-4 h-4" />,
  "Bank Transfer": <Building2 className="w-4 h-4" />,
};

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-border last:border-0">
      {icon && (
        <span className="mt-0.5 text-primary/50 flex-shrink-0">{icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground mb-1 font-black uppercase tracking-widest">{label}</p>
        <p className="text-[15px] font-bold text-foreground truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export function PaymentConfirmPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { getTicket, getConcert, payTicket } = useData();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const ticket = getTicket(ticketId!);
  const concert = ticket ? getConcert(ticket.concertId) : undefined;

  if (!ticket || !concert || !currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border shadow-sm">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-2xl font-black text-foreground mb-2">Ticket not found.</p>
        <Link to="/cart" className="mt-4 inline-block text-primary text-sm font-black hover:underline uppercase tracking-widest">
          Back to Cart
        </Link>
      </div>
    );
  }

  if (ticket.status !== "pending" && !confirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <p className="text-2xl font-black text-foreground mb-2">This ticket has already been processed.</p>
        <Link to="/my-tickets" className="mt-4 inline-block text-primary text-sm font-black hover:underline uppercase tracking-widest">
          View My Tickets
        </Link>
      </div>
    );
  }

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const result = payTicket(ticket.id);
    setLoading(false);
    if (result.success) {
      setConfirmed(true);
    } else {
      setError(result.message);
    }
  };

  // ── Success state ──
  if (confirmed) {
    return (
      <PageTransition className="max-w-lg mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-200 shadow-xl shadow-emerald-500/10"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-foreground font-black text-4xl mb-3 tracking-tight">Payment Confirmed!</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-10">
            Your ticket for <span className="text-foreground">{concert.title}</span> is ready.
          </p>

          <div className="bg-white rounded-[2rem] border border-border shadow-2xl shadow-primary/5 p-8 text-left mb-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Booking Summary</p>
            <div className="space-y-0">
              <InfoRow icon={<Music2 className="w-5 h-5" />} label="Concert" value={concert.title} />
              <InfoRow icon={<User className="w-5 h-5" />} label="Booked by" value={currentUser.name} />
              <InfoRow icon={<Ticket className="w-5 h-5" />} label="Seat Category" value={`${ticket.seatCategory} × ${ticket.quantity}`} />
              <InfoRow icon={<CreditCard className="w-5 h-5" />} label="Payment Method" value={ticket.paymentMethod} />
              <InfoRow label="Total Paid" value={`$${ticket.totalPrice.toFixed(2)}`} />
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              to={`/tickets/${ticket.id}`}
              className="flex-1 py-4 text-center text-white rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all text-sm font-black"
            >
              View Ticket
            </Link>
            <Link
              to="/my-tickets"
              className="flex-1 py-4 text-center text-foreground rounded-2xl border border-border hover:bg-accent transition-all text-sm font-black"
            >
              My Tickets
            </Link>
          </div>
        </motion.div>
      </PageTransition>
    );
  }

  // ── Confirmation page ──
  return (
    <PageTransition className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-medium">
        <Link to="/cart" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Cart
        </Link>
        <span className="text-border">/</span>
        <span className="text-foreground font-black">Payment Confirmation</span>
      </div>

      <div className="mb-8">
        <h1 className="text-foreground font-black text-3xl mb-1 tracking-tight">Confirm Payment</h1>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Review your order details before completing payment</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Left: Buyer info */}
        <div className="lg:col-span-3 space-y-4">
          {/* Buyer details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-[2rem] border border-border shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-foreground font-black text-lg tracking-tight">Buyer Information</h2>
            </div>

            <InfoRow icon={<User className="w-4 h-4" />} label="Full Name" value={currentUser.name} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={currentUser.email} />
            {currentUser.phone && (
              <InfoRow icon={<Phone className="w-5 h-5" />} label="Phone" value={currentUser.phone} />
            )}
            {currentUser.address && (
              <InfoRow icon={<MapPin className="w-5 h-5" />} label="Address" value={currentUser.address} />
            )}
            {!currentUser.phone && !currentUser.address && (
              <p className="text-xs text-muted-foreground mt-4 font-bold italic uppercase tracking-widest">
                Complete your profile to see full details.{" "}
                <Link to="/profile" className="text-primary hover:underline">Edit profile</Link>
              </p>
            )}
          </motion.div>

          {/* Ticket details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden"
          >
            <div className="relative h-44 overflow-hidden">
              <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-white font-black text-2xl tracking-tight mb-1">{concert.title}</p>
                <p className="text-white/80 text-sm font-bold uppercase tracking-widest">{concert.artist}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-foreground font-black text-lg tracking-tight">Ticket Details</h2>
              </div>

              <InfoRow icon={<Calendar className="w-5 h-5" />} label="Date & Time" value={`${concert.date} · ${concert.time}`} />
              <InfoRow icon={<MapPin className="w-5 h-5" />} label="Venue" value={`${concert.venue}, ${concert.city}`} />
              <InfoRow icon={<Ticket className="w-5 h-5" />} label="Seat Category" value={ticket.seatCategory} />
              <InfoRow label="Quantity" value={`${ticket.quantity} ticket${ticket.quantity > 1 ? "s" : ""}`} />
            </div>
          </motion.div>
        </div>

        {/* Right: Payment summary */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[2rem] border border-border shadow-2xl shadow-primary/5 p-8 sticky top-24"
          >
            <h2 className="text-foreground font-black text-lg mb-6 tracking-tight">Payment Summary</h2>

            {/* Payment method */}
            <div className="flex items-center gap-4 p-4 bg-accent border border-border rounded-2xl mb-6 shadow-sm">
              <span className="text-primary">{PAYMENT_ICONS[ticket.paymentMethod] ?? <CreditCard className="w-5 h-5" />}</span>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Payment method</p>
                <p className="text-[15px] font-bold text-foreground">{ticket.paymentMethod}</p>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">{ticket.seatCategory} × {ticket.quantity}</span>
                <span className="text-foreground font-bold">${(ticket.totalPrice / 1.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Service fee (5%)</span>
                <span className="text-foreground font-bold">${(ticket.totalPrice - ticket.totalPrice / 1.05).toFixed(2)}</span>
              </div>
              <div className="pt-5 border-t border-border flex justify-between items-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Amount</span>
                <span className="text-2xl font-black text-primary tracking-tighter">${ticket.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 mb-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm button */}
            <motion.button
              onClick={handleConfirm}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-black bg-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Confirm Payment
                </>
              )}
            </motion.button>

            <p className="text-center text-[10px] text-muted-foreground mt-4 font-black uppercase tracking-widest">
              Secure checkout · All sales are final
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
