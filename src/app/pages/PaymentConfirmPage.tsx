import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CreditCard, CheckCircle2, MapPin, Calendar, Ticket, AlertCircle, Smartphone, Building2, Wallet, Clock, ReceiptText, Lock, ShieldCheck, User, ArrowRight, ChevronDown, Check } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

type PaymentMethod = "Credit Card" | "Debit Card" | "GoPay" | "OVO" | "Dana" | "Bank Transfer";

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: any; desc: string }[] = [
  { id: "Credit Card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, JCB" },
  { id: "Bank Transfer", label: "Virtual Account", icon: Building2, desc: "Instant confirmation" },
  { id: "GoPay", label: "E-Wallet", icon: Wallet, desc: "GoPay, OVO, Dana" },
];

function InfoBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm hover:bg-white transition-colors">
      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shrink-0"><div className="scale-90">{icon}</div></div>
      <div className="overflow-hidden">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );
}

export function PaymentConfirmPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { getTicket, getConcert, payTicket } = useData();
  const { currentUser } = useAuth();

  const ticket = getTicket(ticketId!);
  const concert = ticket ? getConcert(ticket.concertId) : undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // STATE: 24-Hour Timer & Expiration
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  // STATE: Untuk mengontrol Dropdown Payment
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    (ticket?.paymentMethod as PaymentMethod) || "Credit Card"
  );

  // LOGIC: Hitung mundur 24 Jam berdasarkan waktu booking tiket
  useEffect(() => {
    if (!ticket) return;

    const deadline = new Date(ticket.bookingTimestamp).getTime() + 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const diff = Math.floor((deadline - Date.now()) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
      } else {
        setTimeLeft(diff);
        setIsExpired(false);
      }
    };

    updateTimer(); // Initial call
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [ticket]);

  // FORMAT: Mengubah detik ke format HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!ticket || !concert || !currentUser) return null;

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    const result = payTicket(ticket.id);
    setLoading(false);
    if (result.success) setConfirmed(true);
    else setError(result.message);
  };

  const currentMethodDetails = PAYMENT_METHODS.find(m => m.id === selectedPayment) || PAYMENT_METHODS[0];

  // SUCCESS STATE
  if (confirmed) {
    return (
      <PageTransition className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50 selection:bg-primary/20 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-emerald-500/15 blur-[150px] rounded-full opacity-60 pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-primary/15 blur-[150px] rounded-full opacity-60 pointer-events-none" />

        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-3xl rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 md:p-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }} className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20"><CheckCircle2 className="w-10 h-10" /></motion.div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Payment Successful!</h1>
            <p className="text-slate-500 font-medium mb-8 text-sm">Your seats are secured. Ready for the show?</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left mb-8 shadow-inner">
              <div className="flex items-center gap-2 mb-5 text-slate-400"><ReceiptText className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Transaction Receipt</span></div>
              <div className="space-y-1">
                <div className="flex justify-between py-2 border-b border-slate-100/60"><span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order ID</span><span className="text-sm font-black text-slate-900">#{ticket.id.toUpperCase()}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-100/60"><span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Concert</span><span className="text-sm font-black text-slate-900 truncate max-w-[160px] text-right">{concert.title}</span></div>
                <div className="flex justify-between py-2"><span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Paid</span><span className="text-sm font-black text-primary">${ticket.totalPrice.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/my-tickets" className="py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm text-center hover:bg-slate-200 hover:text-slate-900 transition-all">My Tickets</Link>
              <Link to={`/tickets/${ticket.id}`} className="py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm text-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group">View E-Ticket <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </div>
          </div>
        </motion.div>
      </PageTransition>
    );
  }

  // CONFIRMATION PAGE (CHECKOUT)
  return (
    <PageTransition className="relative min-h-screen bg-slate-50 pb-24 font-sans text-slate-900 selection:bg-primary/20 overflow-x-hidden flex flex-col">

      {/* AURA BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] bg-primary/20 blur-[160px] rounded-full mix-blend-multiply opacity-60" />
        <div className="absolute top-[-5%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-500/20 blur-[160px] rounded-full mix-blend-multiply opacity-60" />
        <div className="absolute top-[20%] left-[25%] w-[50vw] h-[50vw] bg-cyan-400/15 blur-[160px] rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-slate-50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-b from-transparent to-slate-50" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-8">

        {/* Top Navigation & 24h Timer */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white rounded-full text-slate-600 text-sm font-bold hover:text-primary shadow-sm transition-all hover:bg-white">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          <div className={`flex items-center gap-2 bg-white/60 backdrop-blur-xl border ${isExpired ? "border-rose-200 bg-rose-50/80" : "border-white"} px-4 py-2 rounded-full shadow-sm transition-colors`}>
            {isExpired ? (
              <>
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-black tracking-widest text-rose-500 uppercase">Expired</span>
              </>
            ) : (
              <>
                <Clock className={`w-4 h-4 ${timeLeft < 3600 ? 'text-amber-500 animate-pulse' : 'text-primary'}`} />
                <span className="text-sm font-mono font-black tracking-widest text-slate-700">{formatTime(timeLeft)}</span>
              </>
            )}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="bg-white/90 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden flex flex-col mb-12">
          <div className="relative h-48 md:h-56 w-full shrink-0">
            <img src={concert.image} alt={concert.title} className={`w-full h-full object-cover ${isExpired ? "grayscale" : ""}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <span className={`px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[9px] font-black uppercase tracking-widest rounded-md mb-2 inline-block ${isExpired ? "bg-rose-500/50 border-rose-500/50 text-rose-100" : ""}`}>
                  {isExpired ? "Booking Expired" : "Checkout"}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight truncate">{concert.title}</h1>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 flex-grow bg-gradient-to-b from-transparent to-white/50">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <InfoBox icon={<Calendar className="w-4 h-4" />} label="Date & Time" value={`${concert.date} · ${concert.time}`} />
              <InfoBox icon={<MapPin className="w-4 h-4" />} label="Venue" value={concert.venue} />
              <InfoBox icon={<Ticket className="w-4 h-4" />} label="Ticket Details" value={`${ticket.quantity}x ${ticket.seatCategory}`} />
              <InfoBox icon={<User className="w-4 h-4" />} label="Billed To" value={currentUser.name} />
            </div>

            {/* --- PEMILIHAN METODE PEMBAYARAN INTERAKTIF --- */}
            <div className={`bg-slate-50 border border-slate-100 rounded-[1.5rem] p-1.5 mb-8 shadow-inner flex flex-col transition-all ${isExpired ? "opacity-50 pointer-events-none" : ""}`}>
              <div
                className="flex items-center justify-between p-3.5 cursor-pointer rounded-xl hover:bg-slate-100 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 text-slate-700">
                    <currentMethodDetails.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Payment Method</p>
                    <p className="text-sm font-bold text-slate-900">{currentMethodDetails.label}</p>
                  </div>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 shadow-sm">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </div>
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-2 border-t border-slate-200/60 mt-1 flex flex-col gap-1">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => {
                            setSelectedPayment(method.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex items-center gap-4 p-3.5 rounded-xl transition-all ${selectedPayment === method.id
                              ? "bg-white shadow-sm border border-slate-200"
                              : "hover:bg-slate-200/50 border border-transparent"
                            }`}
                        >
                          <div className={`${selectedPayment === method.id ? "text-primary" : "text-slate-500"}`}>
                            <method.icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className={`text-sm font-bold ${selectedPayment === method.id ? "text-slate-900" : "text-slate-600"}`}>
                              {method.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {method.desc}
                            </span>
                          </div>
                          {selectedPayment === method.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500"><span>Subtotal</span><span className="text-slate-900">${(ticket.totalPrice / 1.05).toFixed(2)}</span></div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500"><span>Taxes & Fees (5%)</span><span className="text-slate-900">${(ticket.totalPrice - ticket.totalPrice / 1.05).toFixed(2)}</span></div>
              <div className="pt-5 border-t border-slate-200/60 flex justify-between items-end"><span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Due</span><span className="text-4xl font-black text-slate-900 tracking-tighter">${ticket.totalPrice.toFixed(2)}</span></div>
            </div>

            {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-xs font-bold flex items-center gap-2 mb-6"><AlertCircle className="w-4 h-4 shrink-0" /> {error}</div>}

            <button
              onClick={handleConfirm}
              disabled={loading || isExpired}
              className={`relative w-full py-4 text-white rounded-xl font-black text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden ${isExpired ? "bg-slate-300 shadow-none cursor-not-allowed text-slate-500" : "bg-slate-900 shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 active:scale-95"
                }`}
            >
              {!isExpired && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />}
              {loading ? (
                <span className="flex items-center gap-2 relative z-10">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Processing...
                </span>
              ) : isExpired ? (
                <span className="flex items-center gap-2 relative z-10"><AlertCircle className="w-4 h-4" /> Order Expired</span>
              ) : (
                <span className="flex items-center gap-2 relative z-10"><Lock className="w-4 h-4" /> Pay ${ticket.totalPrice.toFixed(2)}</span>
              )}
            </button>
            <p className="text-center text-[9px] text-slate-400 font-bold mt-5 uppercase tracking-widest flex items-center justify-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secured by ConcertHub Enterprise</p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}