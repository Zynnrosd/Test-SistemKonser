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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`group relative rounded-[1.5rem] overflow-hidden transition-all duration-300 ${countdown.expired
        ? "bg-rose-50/50 border border-rose-100 opacity-75 grayscale-[50%]"
        : urgency
          ? "bg-white/90 backdrop-blur-xl border border-amber-200 shadow-xl shadow-amber-500/10 hover:-translate-y-1"
          : "bg-white/80 backdrop-blur-xl border border-white shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1"
        }`}
    >
      <div className="flex flex-col sm:flex-row pl-1.5">
        {/* Gambar Thumbnail */}
        <div className="w-full sm:w-36 h-36 flex-shrink-0 relative overflow-hidden bg-slate-100 m-3 rounded-xl">
          <img
            src={concert.image}
            alt={concert.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
        </div>

        {/* Konten */}
        <div className="flex-1 p-4 sm:p-5 sm:pl-2 flex flex-col justify-between">

          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <h3 className="text-slate-900 font-black text-lg truncate mb-0.5">{concert.title}</h3>
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.15em] truncate">{concert.artist}</p>
            </div>

            {/* Badge Kategori Kursi */}
            <span className={`text-[8px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest flex-shrink-0 shadow-sm ${ticket.seatCategory === "VVIP" ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" :
              ticket.seatCategory === "VIP" ? "bg-primary/10 text-primary border-primary/20" :
                "bg-slate-50 text-slate-600 border-slate-200"
              }`}>
              {ticket.seatCategory}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 font-bold mb-4">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />{concert.date}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{concert.city}</span>
            <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 text-slate-400" />{ticket.quantity} Ticket{ticket.quantity > 1 ? "s" : ""}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-auto">
            {/* Countdown Badge */}
            {countdown.expired ? (
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-rose-500 font-black">
                <AlertTriangle className="w-3.5 h-3.5" /> Booking expired
              </span>
            ) : (
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Remaining</p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black tabular-nums shadow-sm border ${urgency ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-white text-slate-700 border-slate-200"
                  }`}>
                  <Clock className="w-3.5 h-3.5" />
                  {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")}
                </div>
              </div>
            )}

            {/* Price & Action */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                <p className="text-slate-900 font-black text-2xl tracking-tighter leading-none">${ticket.totalPrice.toFixed(2)}</p>
              </div>
              {!countdown.expired && (
                <button
                  onClick={() => navigate(`/payment/${ticket.id}`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 group/btn"
                >
                  <CreditCard className="w-4 h-4 text-slate-400 group-hover/btn:text-white transition-colors" /> Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strip Bawah - Informasi Order */}
      <div className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-between border-t border-dashed ${countdown.expired ? "bg-rose-100/30 border-rose-200 text-rose-500" :
        urgency ? "bg-amber-50/50 border-amber-200 text-amber-600" :
          "bg-slate-50/50 border-slate-200 text-slate-400"
        }`}>
        <span>ORDER #{ticket.id.toUpperCase()}</span>
        <span className="flex items-center gap-1.5">
          {countdown.expired ? <><Trash2 className="w-3 h-3" /> Expired</> :
            urgency ? <><AlertTriangle className="w-3 h-3" /> Expiring soon</> :
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
    <PageTransition className="relative min-h-screen bg-slate-50 selection:bg-primary/20 overflow-x-hidden flex flex-col">

      {/* BACKGROUND AURA */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[140px] rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/5 blur-[140px] rounded-full mix-blend-multiply opacity-50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-slate-900 font-black text-3xl md:text-4xl tracking-tight">Your Cart</h1>
              {cartItems.length > 0 && (
                <span className="text-[10px] font-black bg-slate-900 text-white px-2.5 py-1 rounded-md shadow-sm">
                  {cartItems.length}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm font-medium">Complete payment within 24 hours to secure tickets</p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-xl border border-white text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-sm font-bold transition-all shadow-sm group"
          >
            <Music2 className="w-4 h-4" /> Browse More
          </Link>
        </div>

        <div className="flex-1">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-28 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl shadow-slate-200/30"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                <ShoppingCart className="w-8 h-8 text-slate-300" />
              </div>
              <h2 className="text-slate-900 font-black text-2xl mb-2">Your cart is empty</h2>
              <p className="text-slate-500 text-sm font-medium mb-8">Browse concerts and book tickets to get started.</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white bg-slate-900 text-sm font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 group"
              >
                Discover Concerts
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-5">
              <AnimatePresence>
                {cartItems.map(({ ticket, concert }) => (
                  <CartItem key={ticket.id} ticket={ticket} concert={concert} />
                ))}
              </AnimatePresence>

              {/* Total Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-slate-900 rounded-[1.5rem] shadow-xl shadow-slate-900/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Latar Belakang untuk Kotak Total */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-fuchsia-500/10 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 text-center sm:text-left">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Amount Due</p>
                  <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">${total.toFixed(2)}</p>
                </div>

                <div className="relative z-10 w-full sm:w-auto text-center sm:text-right">
                  <p className="text-xs text-slate-400 font-medium mb-3">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} pending</p>
                  <Link
                    to="/my-tickets"
                    className="inline-flex items-center justify-center sm:justify-end gap-1.5 text-sm text-white font-bold hover:text-primary transition-colors w-full sm:w-auto group"
                  >
                    View paid tickets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}