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
        className="text-lg font-black text-foreground tabular-nums w-8 text-center"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{label}</span>
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
      className={`bg-white rounded-[2rem] border overflow-hidden transition-all ${
        countdown.expired
          ? "border-red-200 opacity-60"
          : urgency
          ? "border-amber-200 shadow-lg shadow-amber-500/5"
          : "border-border shadow-sm"
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
              <p className="text-foreground font-black text-lg truncate tracking-tight">{concert.title}</p>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">{concert.artist}</p>
            </div>
            {/* Seat badge */}
            <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl flex-shrink-0 uppercase tracking-widest border ${
              ticket.seatCategory === "VVIP"
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : ticket.seatCategory === "VIP"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-accent text-muted-foreground border-border"
            }`}>
              {ticket.seatCategory}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{concert.date}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{concert.city}</span>
            <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5" />{ticket.quantity}× ticket</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Countdown */}
            {countdown.expired ? (
              <span className="flex items-center gap-1.5 text-xs text-red-500 font-black uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" />
                Booking expired
              </span>
            ) : (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${urgency ? "bg-amber-100 border border-amber-200" : "bg-accent border border-border"}`}>
                <Clock className={`w-4 h-4 flex-shrink-0 ${urgency ? "text-amber-600" : "text-muted-foreground"}`} />
                <div className="flex items-center gap-1.5">
                  <CountdownBlock value={countdown.hours} label="hr" />
                  <span className="text-border font-black text-sm mb-1">:</span>
                  <CountdownBlock value={countdown.minutes} label="min" />
                  <span className="text-border font-black text-sm mb-1">:</span>
                  <CountdownBlock value={countdown.seconds} label="sec" />
                </div>
              </div>
            )}

            {/* Price + Pay */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <p className="text-foreground font-black text-xl tracking-tighter">${ticket.totalPrice.toFixed(2)}</p>
              {!countdown.expired && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/payment/${ticket.id}`)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-t flex items-center justify-between ${countdown.expired ? "bg-red-50 border-red-100 text-red-400" : urgency ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-accent border-border text-muted-foreground"}`}>
        <span>#{ticket.id.toUpperCase()}</span>
        <span className="flex items-center gap-1.5">
          {countdown.expired ? (
            <><Trash2 className="w-3.5 h-3.5" /> Expired</>
          ) : urgency ? (
            <><AlertTriangle className="w-3.5 h-3.5" /> Expiring soon!</>
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-[1.25rem] flex items-center justify-center border border-primary/20 shadow-sm">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-foreground font-black text-3xl tracking-tight">Your Cart</h1>
            {cartItems.length > 0 && (
              <span className="text-[10px] font-black bg-primary text-white px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md shadow-primary/20">
                {cartItems.length}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest ml-1">Complete payment within 24 hours</p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border text-foreground hover:bg-accent text-sm font-black transition-all shadow-sm"
        >
          <Music2 className="w-5 h-5" />
          Explore
        </Link>
      </div>

      {/* Empty state */}
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32"
        >
          <div className="w-24 h-24 bg-accent rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-foreground font-black text-2xl mb-2 tracking-tight">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm mb-10 font-medium">Browse concerts and book tickets to get started</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white bg-primary text-base font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
          >
            Discover Concerts
            <ArrowRight className="w-5 h-5" />
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
            className="bg-white rounded-[2rem] border border-border shadow-2xl shadow-primary/5 p-8 flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] text-muted-foreground mb-1 font-black uppercase tracking-widest">Total pending</p>
              <p className="text-4xl font-black text-foreground tracking-tighter">${total.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-3 font-bold uppercase tracking-widest">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart</p>
              <Link
                to="/my-tickets"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-black transition-all"
              >
                View confirmed tickets <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
