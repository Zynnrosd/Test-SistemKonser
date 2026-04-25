import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart, Clock, Ticket, Calendar, MapPin,
  CreditCard, Music2, AlertTriangle, ArrowRight, Trash2,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

function useCountdown(bookingTimestamp: string) {
  const deadline = new Date(bookingTimestamp).getTime() + 24 * 60 * 60 * 1000;

  const getRemaining = () => {
    const diff = deadline - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true, total: 0 };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds, expired: false, total: diff };
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingTimestamp]);

  return remaining;
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-lg font-bold text-gray-800 tabular-nums w-8 text-center"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function CartItem({ ticket, concert }: { ticket: ReturnType<ReturnType<typeof useData>["getPendingTickets"]>[number]; concert: NonNullable<ReturnType<ReturnType<typeof useData>["getConcert"]>> }) {
  const navigate = useNavigate();
  const countdown = useCountdown(ticket.bookingTimestamp);
  const urgency = countdown.total > 0 && countdown.total < 2 * 60 * 60 * 1000; // < 2h

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white rounded-2xl border overflow-hidden transition-all ${
        countdown.expired
          ? "border-red-200 opacity-60"
          : urgency
          ? "border-orange-200"
          : "border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex">
        {/* Concert image */}
        <div className="w-28 h-full flex-shrink-0 relative overflow-hidden" style={{ minHeight: "96px" }}>
          <img
            src={concert.image}
            alt={concert.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 flex flex-col justify-between gap-2 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-gray-900 font-semibold text-sm truncate">{concert.title}</p>
              <p className="text-indigo-500 text-xs font-medium">{concert.artist}</p>
            </div>
            {/* Seat badge */}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${
              ticket.seatCategory === "VVIP"
                ? "bg-amber-50 text-amber-600"
                : ticket.seatCategory === "VIP"
                ? "bg-indigo-50 text-indigo-600"
                : "bg-gray-100 text-gray-600"
            }`}>
              {ticket.seatCategory}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{concert.date}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{concert.city}</span>
            <span className="flex items-center gap-1"><Ticket className="w-3 h-3" />{ticket.quantity}× ticket</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Countdown */}
            {countdown.expired ? (
              <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Booking expired
              </span>
            ) : (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${urgency ? "bg-orange-50" : "bg-gray-50"}`}>
                <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${urgency ? "text-orange-500" : "text-gray-400"}`} />
                <div className="flex items-center gap-1.5">
                  <CountdownBlock value={countdown.hours} label="hr" />
                  <span className="text-gray-400 font-bold text-sm mb-1">:</span>
                  <CountdownBlock value={countdown.minutes} label="min" />
                  <span className="text-gray-400 font-bold text-sm mb-1">:</span>
                  <CountdownBlock value={countdown.seconds} label="sec" />
                </div>
              </div>
            )}

            {/* Price + Pay */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <p className="text-gray-900 font-bold text-sm">${ticket.totalPrice.toFixed(2)}</p>
              {!countdown.expired && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/payment/${ticket.id}`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-200/50 transition-all hover:shadow-lg"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Pay Now
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className={`px-5 py-2 text-xs font-mono text-gray-400 border-t flex items-center justify-between ${countdown.expired ? "bg-red-50 border-red-100" : urgency ? "bg-orange-50 border-orange-100" : "bg-gray-50/60 border-gray-100"}`}>
        <span>#{ticket.id.toUpperCase()}</span>
        <span className={`flex items-center gap-1 font-medium ${countdown.expired ? "text-red-400" : urgency ? "text-orange-500" : "text-gray-400"}`}>
          {countdown.expired ? (
            <><Trash2 className="w-3 h-3" /> Expired</>
          ) : urgency ? (
            <><AlertTriangle className="w-3 h-3" /> Expiring soon!</>
          ) : (
            <>Pending payment</>
          )}
        </span>
      </div>
    </motion.div>
  );
}

export function CartPage() {
  const { getPendingTickets, getConcert } = useData();
  const { currentUser } = useAuth();

  const pendingTickets = currentUser ? getPendingTickets(currentUser.id) : [];
  const cartItems = pendingTickets
    .map((t) => ({ ticket: t, concert: getConcert(t.concertId) }))
    .filter((x) => x.concert !== undefined) as { ticket: typeof pendingTickets[0]; concert: NonNullable<ReturnType<typeof getConcert>> }[];

  const total = cartItems.reduce((sum, { ticket }) => sum + ticket.totalPrice, 0);

  return (
    <PageTransition className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <h1 className="text-gray-900 font-bold text-2xl">Cart</h1>
            {cartItems.length > 0 && (
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm ml-11">Complete payment within 24 hours to confirm your booking</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all"
        >
          <Music2 className="w-4 h-4" />
          Explore
        </Link>
      </div>

      {/* Empty state */}
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShoppingCart className="w-10 h-10 text-indigo-200" />
          </div>
          <h2 className="text-gray-700 font-semibold mb-1">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Browse concerts and book tickets to get started</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold shadow-md shadow-indigo-200/50"
          >
            Discover Concerts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {cartItems.map(({ ticket, concert }) => (
              <CartItem key={ticket.id} ticket={ticket} concert={concert} />
            ))}
          </AnimatePresence>

          {/* Total bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-400 mb-0.5">Total pending</p>
              <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-2">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart</p>
              <Link
                to="/my-tickets"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
              >
                View confirmed tickets <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
