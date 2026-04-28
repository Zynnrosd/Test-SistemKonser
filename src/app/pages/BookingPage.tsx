import { useState, ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Ticket, ChevronRight, Plus, Minus,
  Calendar, MapPin, Clock, AlertCircle, Check,
  CreditCard, Smartphone, Building2, Wallet, ShoppingCart,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";
import { SeatCategory, PaymentMethod } from "../data/mockData";

const SEAT_CATEGORIES: {
  id: SeatCategory;
  label: string;
  description: string;
  multiplier: number;
  color: string;
  border: string;
  bg: string;
  dot: string;
}[] = [
    {
      id: "Regular",
      label: "Regular",
      description: "Standard seating area, great views",
      multiplier: 1.0,
      color: "text-gray-700",
      border: "border-gray-200",
      bg: "bg-gray-50",
      dot: "bg-gray-400",
    },
    {
      id: "VIP",
      label: "VIP",
      description: "Premium section with better views & lounge access",
      multiplier: 1.5,
      color: "text-indigo-700",
      border: "border-indigo-200",
      bg: "bg-indigo-50",
      dot: "bg-indigo-500",
    },
    {
      id: "VVIP",
      label: "VVIP",
      description: "Front row, exclusive perks & backstage pass",
      multiplier: 2.0,
      color: "text-amber-700",
      border: "border-amber-200",
      bg: "bg-amber-50",
      dot: "bg-amber-500",
    },
  ];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: ReactNode; type: string }[] = [
  { id: "Credit Card", label: "Credit Card", icon: <CreditCard className="w-4 h-4" />, type: "Card" },
  { id: "Debit Card", label: "Debit Card", icon: <CreditCard className="w-4 h-4" />, type: "Card" },
  { id: "GoPay", label: "GoPay", icon: <Smartphone className="w-4 h-4" />, type: "E-Wallet" },
  { id: "OVO", label: "OVO", icon: <Smartphone className="w-4 h-4" />, type: "E-Wallet" },
  { id: "Dana", label: "Dana", icon: <Wallet className="w-4 h-4" />, type: "E-Wallet" },
  { id: "Bank Transfer", label: "Bank Transfer", icon: <Building2 className="w-4 h-4" />, type: "Bank" },
];

export function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const { getConcert, bookTicket } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const concert = getConcert(id!);
  const [quantity, setQuantity] = useState(1);
  const [seatCategory, setSeatCategory] = useState<SeatCategory>("Regular");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Credit Card");
  const [loading, setLoading] = useState(false);
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

  const selectedTier = SEAT_CATEGORIES.find((c) => c.id === seatCategory)!;
  const basePrice = concert.price * selectedTier.multiplier;
  const total = basePrice * quantity;
  const serviceFee = total * 0.05;
  const grandTotal = total + serviceFee;

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= 1 && next <= Math.min(8, concert.availableSeats)) setQuantity(next);
  };

  const handleAddToCart = async () => {
    if (!currentUser) return;
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const result = bookTicket(currentUser.id, concert.id, quantity, seatCategory, paymentMethod);
    setLoading(false);
    if (result.success && result.ticketId) {
      navigate("/cart");
    } else {
      setError(result.message);
    }
  };

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-medium">
        <Link to={`/concerts/${concert.id}`} className="hover:text-primary transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          {concert.title}
        </Link>
        <ChevronRight className="w-4 h-4 text-border" />
        <span className="text-foreground font-bold">Book Tickets</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Concert info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden sticky top-28">
            <div className="relative h-48">
              <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-8">
              <h2 className="text-foreground font-black text-xl mb-1">{concert.title}</h2>
              <p className="text-primary text-sm font-bold mb-6">{concert.artist}</p>
              <div className="space-y-3">
                <SummaryRow icon={<Calendar className="w-4 h-4" />} text={concert.date} />
                <SummaryRow icon={<Clock className="w-4 h-4" />} text={concert.time} />
                <SummaryRow icon={<MapPin className="w-4 h-4" />} text={`${concert.venue}, ${concert.city}`} />
                <SummaryRow icon={<Ticket className="w-4 h-4" />} text={`${concert.availableSeats} seats remaining`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking form */}
        <div className="lg:col-span-3 space-y-4">
          {/* Step 1: Seat Category */}
          <div className="bg-white rounded-[2rem] border border-border shadow-sm p-8">
            <h3 className="text-foreground font-black text-lg mb-6">1. Choose seat category</h3>
            <div className="space-y-2.5">
              {SEAT_CATEGORIES.map((cat) => {
                const isSelected = seatCategory === cat.id;
                const catPrice = concert.price * cat.multiplier;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSeatCategory(cat.id)}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-accent hover:border-primary/30 hover:bg-accent/50"
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? `${cat.border} ${cat.bg}` : "border-gray-300"
                      }`}>
                      {isSelected && <div className={`w-2 h-2 rounded-full ${cat.dot}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-black ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {cat.label}
                        </span>
                        {cat.id === "VIP" && (
                          <span className="text-[10px] px-2 py-0.5 bg-primary text-white rounded-full font-bold uppercase tracking-wider shadow-sm">Popular</span>
                        )}
                        {cat.id === "VVIP" && (
                          <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full border border-amber-200 font-bold uppercase tracking-wider">Premium</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">{cat.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-base font-black ${isSelected ? "text-primary" : "text-foreground"}`}>
                        ${catPrice.toFixed(2)}
                      </p>
                      {cat.multiplier > 1 && (
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{cat.multiplier}× base</p>
                      )}
                    </div>
                    {isSelected && <Check className="w-5 h-5 flex-shrink-0 text-primary" />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Quantity */}
          <div className="bg-white rounded-[2rem] border border-border shadow-sm p-8">
            <h3 className="text-foreground font-black text-lg mb-6">2. Number of tickets</h3>
            <div className="flex items-center justify-between p-4 bg-accent rounded-2xl">
              <div>
                <p className="text-sm font-bold text-foreground">{seatCategory}</p>
                <p className="text-xs text-muted-foreground font-medium">${(concert.price * selectedTier.multiplier).toFixed(2)} per ticket</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={quantity}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="w-10 text-center text-foreground font-black text-xl"
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= Math.min(8, concert.availableSeats)}
                  className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3 font-bold uppercase tracking-widest">Max 8 tickets per transaction</p>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-[2rem] border border-border shadow-sm p-8">
            <h3 className="text-foreground font-black text-lg mb-6">3. Payment method</h3>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <motion.button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : "border-accent hover:border-primary/30 hover:bg-accent/50"
                      }`}
                  >
                    <span className={isSelected ? "text-primary" : "text-muted-foreground"}>
                      {method.icon}
                    </span>
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{method.label}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{method.type}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Order summary + CTA */}
          <div className="bg-white rounded-[2rem] border border-border shadow-sm p-8">
            <h3 className="text-foreground font-black text-lg mb-6">4. Order summary</h3>
            <div className="space-y-3 mb-6">
              <PriceRow label={`${seatCategory} × ${quantity}`} value={total} />
              <PriceRow label="Service fee (5%)" value={serviceFee} />
              <div className="pt-4 border-t border-border">
                <PriceRow label="Total Amount" value={grandTotal} bold />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mb-3 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleAddToCart}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-black bg-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding to cart...
                </span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart · ${grandTotal.toFixed(2)}
                </>
              )}
            </motion.button>

            <p className="text-[10px] text-muted-foreground text-center mt-4 font-bold uppercase tracking-widest">
              Tickets reserved for 24 hours after booking
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function SummaryRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="text-primary/70">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function PriceRow({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between items-center ${bold ? "text-foreground" : "text-muted-foreground"}`}>
      <span className={`${bold ? "text-base font-black" : "text-sm font-bold uppercase tracking-wider"}`}>{label}</span>
      <span className={`${bold ? "text-2xl font-black text-primary" : "text-sm font-bold"}`}>${value.toFixed(2)}</span>
    </div>
  );
}