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
  }, [bookingTimestamp]);

  return remaining;
}

function CartItem({ ticket, concert }: { ticket: any; concert: any }) {
  const navigate = useNavigate();
  const countdown = useCountdown(ticket.bookingTimestamp);
  const urgency = countdown.total > 0 && countdown.total < 2 * 60 * 60 * 1000; // Kurang dari 2 jam

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border overflow-hidden transition-all ${countdown.expired
          ? "border-red-200 opacity-60"
          : urgency
            ? "border-amber-200 shadow-md shadow-amber-500/5"
            : "border-slate-200 shadow-sm hover:shadow-md"
        }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Gambar */}
        <div className="w-full sm:w-32 h-24 sm:h-auto flex-shrink-0 relative overflow-hidden bg-slate-100">
          <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
        </div>

        {/* Konten */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-slate-900 font-bold text-lg truncate mb-1">{concert.title}</h3>
              <p className="text-primary text-xs font-semibold uppercase tracking-wider">{concert.artist}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider flex-shrink-0 ${ticket.seatCategory === "VVIP" ? "bg-amber-50 text-amber-700 border-amber-200" :
                ticket.seatCategory === "VIP" ? "bg-primary/10 text-primary border-primary/20" :
                  "bg-slate-50 text-slate-600 border-slate-200"
              }`}>
              {ticket.seatCategory}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />{concert.date}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{concert.city}</span>
            <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 text-slate-400" />{ticket.quantity} Ticket{ticket.quantity > 1 ? "s" : ""}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            {/* Countdown Badge Simple */}
            {countdown.expired ? (
              <span className="flex items-center gap-1.5 text-xs text-red-500 font-bold">
                <AlertTriangle className="w-4 h-4" /> Booking expired
              </span>
            ) : (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tabular-nums ${urgency ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-slate-50 text-slate-600 border border-slate-200"
                }`}>
                <Clock className="w-3.5 h-3.5" />
                {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")} left
              </div>
            )}

            {/* Price & Action */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <p className="text-slate-900 font-extrabold text-xl">${ticket.totalPrice.toFixed(2)}</p>
              {!countdown.expired && (
                <button
                  onClick={() => navigate(`/payment/${ticket.id}`)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-95"
                >
                  <CreditCard className="w-4 h-4" /> Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strip Bawah */}
      <div className={`px-5 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between border-t ${countdown.expired ? "bg-red-50/50 border-red-100 text-red-500" :
          urgency ? "bg-amber-50/50 border-amber-100 text-amber-600" :
            "bg-slate-50 border-slate-100 text-slate-400"
        }`}>
        <span>Order #{ticket.id.toUpperCase()}</span>
        <span className="flex items-center gap-1.5">
          {countdown.expired ? <><Trash2 className="w-3 h-3" /> Expired</> :
            urgency ? <><AlertTriangle className="w-3 h-3" /> Expiring soon!</> :
              "Pending Payment"}
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
    .filter((x) => x.concert !== undefined);

  const total = cartItems.reduce((sum, { ticket }) => sum + ticket.totalPrice, 0);

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-slate-900 font-extrabold text-3xl tracking-tight">Your Cart</h1>
            {cartItems.length > 0 && (
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                {cartItems.length}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm font-medium">Complete payment within 24 hours to secure tickets</p>
        </div>
        <Link
          to="/dashboard"
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors shadow-sm"
        >
          <Music2 className="w-4 h-4" />
          Browse More
        </Link>
      </div>

      <div className="flex-1">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100">
              <ShoppingCart className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-slate-900 font-bold text-xl mb-2">Your cart is empty</h2>
            <p className="text-slate-500 text-sm mb-8">Browse concerts and book tickets to get started.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-primary text-sm font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-95"
            >
              Discover Concerts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {cartItems.map(({ ticket, concert }) => (
                <CartItem key={ticket.id} ticket={ticket} concert={concert} />
              ))}
            </AnimatePresence>

            {/* Total Section Minimalist */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Amount Due</p>
                <p className="text-3xl font-extrabold text-slate-900 leading-none">${total.toFixed(2)}</p>
              </div>
              <div className="w-full sm:w-auto text-center sm:text-right">
                <p className="text-xs text-slate-500 font-medium mb-3">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} pending</p>
                <Link
                  to="/my-tickets"
                  className="inline-flex items-center justify-center sm:justify-end gap-1.5 text-sm text-primary font-semibold hover:text-primary/80 transition-colors w-full sm:w-auto"
                >
                  View paid tickets <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}