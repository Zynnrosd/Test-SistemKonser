import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
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
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {icon && (
        <span className="mt-0.5 text-indigo-300 flex-shrink-0">{icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export function PaymentConfirmPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { getTicket, getConcert, payTicket } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const ticket = getTicket(ticketId!);
  const concert = ticket ? getConcert(ticket.concertId) : undefined;

  if (!ticket || !concert || !currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Ticket not found.</p>
        <Link to="/cart" className="mt-4 inline-block text-indigo-600 text-sm hover:underline">
          Back to Cart
        </Link>
      </div>
    );
  }

  if (ticket.status !== "pending" && !confirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">This ticket has already been processed.</p>
        <Link to="/my-tickets" className="mt-4 inline-block text-indigo-600 text-sm hover:underline">
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
          className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-gray-900 font-bold text-2xl mb-2">Payment Confirmed!</h1>
          <p className="text-gray-400 text-sm mb-8">
            Your ticket for <span className="text-gray-700 font-medium">{concert.title}</span> has been confirmed.
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Booking Summary</p>
            <div className="space-y-0">
              <InfoRow icon={<Music2 className="w-4 h-4" />} label="Concert" value={concert.title} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Booked by" value={currentUser.name} />
              <InfoRow icon={<Ticket className="w-4 h-4" />} label="Seat Category" value={`${ticket.seatCategory} × ${ticket.quantity}`} />
              <InfoRow icon={<CreditCard className="w-4 h-4" />} label="Payment Method" value={ticket.paymentMethod} />
              <InfoRow label="Total Paid" value={`$${ticket.totalPrice.toFixed(2)}`} />
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to={`/tickets/${ticket.id}`}
              className="flex-1 py-2.5 text-center text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-sm text-sm font-semibold"
            >
              View Ticket
            </Link>
            <Link
              to="/my-tickets"
              className="flex-1 py-2.5 text-center text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium"
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
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/cart" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Cart
        </Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Payment Confirmation</span>
      </div>

      <div className="mb-6">
        <h1 className="text-gray-900 font-bold text-2xl mb-1">Confirm Payment</h1>
        <p className="text-gray-400 text-sm">Review your order details before completing payment</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Left: Buyer info */}
        <div className="lg:col-span-3 space-y-4">
          {/* Buyer details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-indigo-50 rounded-xl flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <h2 className="text-gray-900 font-semibold text-sm">Buyer Information</h2>
            </div>

            <InfoRow icon={<User className="w-4 h-4" />} label="Full Name" value={currentUser.name} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={currentUser.email} />
            {currentUser.phone && (
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={currentUser.phone} />
            )}
            {currentUser.address && (
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={currentUser.address} />
            )}
            {!currentUser.phone && !currentUser.address && (
              <p className="text-xs text-gray-400 mt-2 italic">
                Complete your profile to see full details.{" "}
                <Link to="/profile" className="text-indigo-500 hover:underline">Edit profile</Link>
              </p>
            )}
          </motion.div>

          {/* Ticket details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="relative h-36 overflow-hidden">
              <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-white font-bold text-base">{concert.title}</p>
                <p className="text-white/70 text-xs">{concert.artist}</p>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-violet-50 rounded-xl flex items-center justify-center">
                  <Ticket className="w-3.5 h-3.5 text-violet-600" />
                </div>
                <h2 className="text-gray-900 font-semibold text-sm">Ticket Details</h2>
              </div>

              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date & Time" value={`${concert.date} · ${concert.time}`} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Venue" value={`${concert.venue}, ${concert.city}`} />
              <InfoRow icon={<Ticket className="w-4 h-4" />} label="Seat Category" value={ticket.seatCategory} />
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
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24"
          >
            <h2 className="text-gray-900 font-semibold text-sm mb-4">Payment Summary</h2>

            {/* Payment method */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
              <span className="text-indigo-500">{PAYMENT_ICONS[ticket.paymentMethod] ?? <CreditCard className="w-4 h-4" />}</span>
              <div>
                <p className="text-xs text-gray-400">Payment method</p>
                <p className="text-sm font-semibold text-gray-800">{ticket.paymentMethod}</p>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{ticket.seatCategory} × {ticket.quantity}</span>
                <span className="text-gray-700">${(ticket.totalPrice / 1.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Service fee (5%)</span>
                <span className="text-gray-700">${(ticket.totalPrice - ticket.totalPrice / 1.05).toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-semibold text-gray-800">Total</span>
                <span className="text-sm font-bold text-gray-900">${ticket.totalPrice.toFixed(2)}</span>
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-indigo-200/50 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Confirm Payment · ${ticket.totalPrice.toFixed(2)}
                </>
              )}
            </motion.button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Secure checkout · All sales are final
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
