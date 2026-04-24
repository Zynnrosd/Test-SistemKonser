import { useState, ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Ticket,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

export function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const { getConcert, bookTicket } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const concert = getConcert(id!);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");

  if (!concert) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Concert not found.</p>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-indigo-600 text-sm hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const total = concert.price * quantity;
  const serviceFee = total * 0.05;
  const grandTotal = total + serviceFee;

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= 1 && next <= Math.min(8, concert.availableSeats)) {
      setQuantity(next);
    }
  };

  const handleBook = async () => {
    if (!currentUser) return;
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const result = bookTicket(currentUser.id, concert.id, quantity);
    setLoading(false);
    if (result.success) {
      setBooked(true);
    } else {
      setError(result.message);
    }
  };

  if (booked) {
    return (
      <PageTransition className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>
        <h2 className="text-gray-900 mb-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
          Booking Confirmed!
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          You've successfully booked <span style={{ fontWeight: 600 }}>{quantity} ticket{quantity > 1 ? "s" : ""}</span> for
        </p>
        <p className="text-indigo-600 mb-6" style={{ fontWeight: 600 }}>
          {concert.title}
        </p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left mb-6">
          <div className="space-y-2.5">
            <ConfirmRow label="Event" value={concert.title} />
            <ConfirmRow label="Artist" value={concert.artist} />
            <ConfirmRow label="Date" value={concert.date} />
            <ConfirmRow label="Venue" value={concert.venue} />
            <ConfirmRow label="Tickets" value={`${quantity}x`} />
            <div className="pt-2.5 border-t border-gray-100">
              <ConfirmRow label="Total Paid" value={`$${grandTotal.toFixed(2)}`} highlight />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/my-tickets"
            className="flex-1 py-3 text-center text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all shadow-sm text-sm"
            style={{ fontWeight: 600 }}
          >
            View My Tickets
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 py-3 text-center text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm"
            style={{ fontWeight: 500 }}
          >
            Back to Concerts
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to={`/concerts/${concert.id}`} className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          {concert.title}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600">Book Tickets</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Concert summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative h-44">
              <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-5">
              <h2 className="text-gray-900 mb-1" style={{ fontWeight: 600, fontSize: "1rem" }}>
                {concert.title}
              </h2>
              <p className="text-indigo-500 text-sm mb-4" style={{ fontWeight: 500 }}>
                {concert.artist}
              </p>
              <div className="space-y-2">
                <SummaryRow icon={<Calendar className="w-3.5 h-3.5" />} text={concert.date} />
                <SummaryRow icon={<Clock className="w-3.5 h-3.5" />} text={concert.time} />
                <SummaryRow icon={<MapPin className="w-3.5 h-3.5" />} text={`${concert.venue}, ${concert.city}`} />
                <SummaryRow icon={<Ticket className="w-3.5 h-3.5" />} text={`${concert.availableSeats} seats remaining`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking form */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-gray-900 mb-5" style={{ fontWeight: 600, fontSize: "1.05rem" }}>
              Select Tickets
            </h2>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-5">
              <div>
                <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>General Admission</p>
                <p className="text-xs text-gray-400">${concert.price.toFixed(2)} per ticket</p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </motion.button>
                <motion.span
                  key={quantity}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-8 text-center text-gray-900"
                  style={{ fontWeight: 700, fontSize: "1.1rem" }}
                >
                  {quantity}
                </motion.span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= Math.min(8, concert.availableSeats)}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-5 text-center">
              Maximum 8 tickets per transaction
            </p>

            {/* Price breakdown */}
            <div className="space-y-2 p-4 bg-gray-50 rounded-2xl">
              <PriceRow label={`Tickets (${quantity}×)`} value={total} />
              <PriceRow label="Service fee (5%)" value={serviceFee} />
              <div className="pt-2 border-t border-gray-200">
                <PriceRow label="Total" value={grandTotal} bold />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.button
              onClick={handleBook}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-70"
              style={{ fontWeight: 600 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Confirming booking...
                </span>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  Confirm Booking · ${grandTotal.toFixed(2)}
                </>
              )}
            </motion.button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By booking, you agree to our terms & conditions. All sales are final.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function SummaryRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs">{text}</span>
    </div>
  );
}

function PriceRow({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-gray-900" : "text-gray-500"}`}>
      <span className="text-sm" style={{ fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span className="text-sm" style={{ fontWeight: bold ? 700 : 400 }}>${value.toFixed(2)}</span>
    </div>
  );
}

function ConfirmRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm ${highlight ? "text-indigo-600" : "text-gray-800"}`}
        style={{ fontWeight: highlight ? 700 : 500 }}
      >
        {value}
      </span>
    </div>
  );
}