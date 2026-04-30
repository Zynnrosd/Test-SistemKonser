import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, MapPin, CreditCard, ShieldCheck, Plus, Minus, Wallet, Building2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

type SeatCategory = "Regular" | "VIP" | "VVIP";
type PaymentMethod = "Credit Card" | "Debit Card" | "GoPay" | "OVO" | "Dana" | "Bank Transfer";

interface CategoryOption {
  id: SeatCategory;
  label: string;
  priceMultiplier: number;
  desc: string;
  color: string;
  bg: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: "Regular", label: "Regular Seat", priceMultiplier: 1, desc: "Standard viewing experience.", color: "text-slate-600", bg: "bg-slate-50" },
  { id: "VIP", label: "VIP Access", priceMultiplier: 1.5, desc: "Premium view with dedicated entrance.", color: "text-primary", bg: "bg-primary/5" },
  { id: "VVIP", label: "VVIP Lounge", priceMultiplier: 2.5, desc: "Front row, lounge access & merch.", color: "text-fuchsia-500", bg: "bg-fuchsia-500/5" },
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: any; desc: string }[] = [
  { id: "Credit Card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, JCB" },
  { id: "Bank Transfer", label: "Virtual Account", icon: Building2, desc: "Instant confirmation" },
  { id: "GoPay", label: "E-Wallet", icon: Wallet, desc: "GoPay, OVO, Dana" },
];

export function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getConcert, bookTicket } = useData();
  const { currentUser } = useAuth();

  const concert = getConcert(id || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [category, setCategory] = useState<CategoryOption>(CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Credit Card");

  if (!concert) return null;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      setQuantity(val);
    } else if (e.target.value === "") {
      setQuantity(0);
    }
  };

  const safeQuantity = quantity || 1;
  const unitPrice = concert.price * category.priceMultiplier;
  const subtotal = unitPrice * safeQuantity;
  const fees = subtotal * 0.05;
  const total = subtotal + fees;

  const handleBooking = async () => {
    if (!currentUser) return;
    try {
      const result = await bookTicket(
        concert.id,
        category.id,
        safeQuantity,
        paymentMethod
      );
      if (result.success) {
        navigate(`/payment/${result.ticketId}`);
      }
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <PageTransition className="relative min-h-screen bg-slate-50 pb-32 font-sans text-slate-900 selection:bg-primary/20 overflow-x-hidden">

      {/* 1. AURA BACKGROUND (DENGAN GRADASI PENUTUP ATAS & BAWAH) */}
      <div className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none z-0 overflow-hidden">
        {/* Lingkaran Aura */}
        <div className="absolute top-[-5%] left-[-5%] w-[50vw] h-[50vw] bg-fuchsia-500/10 blur-[120px] rounded-full mix-blend-multiply opacity-80" />
        <div className="absolute top-[-5%] right-[-5%] w-[50vw] h-[50vw] bg-cyan-400/10 blur-[120px] rounded-full mix-blend-multiply opacity-80" />
        <div className="absolute top-[20%] left-[25%] w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full mix-blend-multiply opacity-60" />

        {/* MASKING ATAS: Memudarkan potongan kasar di ujung atas browser */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-slate-50 to-transparent" />

        {/* MASKING BAWAH: Memudarkan aura agar menyatu halus ke warna polos halaman di bagian bawah */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-b from-transparent to-slate-50" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full w-fit border border-white shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Complete Your Order</h1>
              <p className="text-slate-500 font-medium">Secure your spot in 3 simple steps.</p>
            </motion.div>

            {/* Kategori */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200/60 pb-2">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md">1</div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Select Category</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => {
                  const isSelected = category.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat)}
                      className={`relative p-5 rounded-[1.5rem] text-left transition-all duration-300 border-2 overflow-hidden ${isSelected ? "border-slate-900 bg-white shadow-lg scale-[1.02]" : "border-white bg-white/60 backdrop-blur-xl hover:bg-white hover:border-slate-200"}`}
                    >
                      <AnimatePresence>
                        {isSelected && <motion.div layoutId="category-bg" className={`absolute inset-0 ${cat.bg} z-0`} transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                      </AnimatePresence>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3">
                          <p className={`font-black uppercase tracking-widest text-[10px] ${isSelected ? cat.color : "text-slate-400"}`}>{cat.label}</p>
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-4 h-4 rounded-full flex items-center justify-center text-white bg-slate-900`}>
                              <Check className="w-2.5 h-2.5" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-2xl font-black text-slate-900 mb-1.5">${(concert.price * cat.priceMultiplier).toFixed(2)}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Kuantitas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200/60 pb-2">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md">2</div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Number of Tickets</h2>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[1.5rem] p-4 shadow-sm inline-flex items-center gap-6">
                <button onClick={handleDecrement} className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"><Minus className="w-4 h-4" /></button>
                <div className="flex flex-col items-center min-w-[60px]">
                  <input type="number" value={quantity === 0 ? "" : quantity} onChange={handleQuantityChange} className="w-16 text-center text-3xl font-black text-slate-900 bg-transparent outline-none focus:ring-0" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Seats</span>
                </div>
                <button onClick={handleIncrement} className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-95"><Plus className="w-4 h-4" /></button>
              </div>
            </motion.div>

            {/* Metode Pembayaran */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200/60 pb-2">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md">3</div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative flex flex-col items-start p-5 rounded-[1.5rem] border-2 transition-all duration-300 overflow-hidden ${isSelected ? "border-slate-900 bg-white shadow-lg scale-[1.02]" : "border-white bg-white/60 backdrop-blur-xl hover:bg-white hover:border-slate-200 shadow-sm"}`}
                    >
                      <AnimatePresence>
                        {isSelected && <motion.div layoutId="payment-bg" className="absolute inset-0 bg-slate-50 z-0" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                      </AnimatePresence>
                      <div className="relative z-10 w-full">
                        <div className="flex items-center justify-between mb-3 w-full">
                          <div className={`p-2.5 rounded-xl ${isSelected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}><method.icon className="w-5 h-5" /></div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-slate-900" : "border-slate-300"}`}>
                            {isSelected && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
                          </div>
                        </div>
                        <p className={`font-black text-sm mb-0.5 ${isSelected ? "text-slate-900" : "text-slate-700"}`}>{method.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{method.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-5 xl:col-span-4 relative">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="sticky top-24 bg-white/90 backdrop-blur-3xl rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="relative h-40 w-full">
                <img src={concert.image} alt="Concert" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{concert.artist}</p>
                  <h3 className="text-xl font-bold text-white leading-tight truncate">{concert.title}</h3>
                </div>
              </div>
              <div className="p-7 space-y-5 bg-white/50">
                <div className="flex items-start gap-3 pb-5 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">{concert.venue}, {concert.city}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-600 font-medium">
                  <span>{category.label} <span className="font-bold text-slate-900">× {safeQuantity}</span></span>
                  <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                  <span>Taxes & Fees (5%)</span>
                  <span>${fees.toFixed(2)}</span>
                </div>
                <div className="pt-5 border-t border-slate-100">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Due</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="p-7 pt-0 bg-white/50">
                <button onClick={handleBooking} className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-black rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 text-sm group">
                  <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" /> Confirm & Pay
                </button>
                <p className="text-center text-[9px] text-slate-400 font-bold mt-4 flex items-center justify-center gap-1.5 uppercase tracking-widest">Secure Enterprise Checkout</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}