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
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to={`/concerts/${concert.id}`} className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          {concert.title}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 font-medium">Book Tickets</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Concert info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative h-44">
              <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-5">
              <h2 className="text-gray-900 font-semibold text-base mb-0.5">{concert.title}</h2>
              <p className="text-indigo-500 text-sm font-medium mb-4">{concert.artist}</p>
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
          {/* Step 1: Seat Category */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-900 font-semibold text-sm mb-4">1. Choose seat category</h3>
            <div className="space-y-2.5">
              {SEAT_CATEGORIES.map((cat) => {
                const isSelected = seatCategory === cat.id;
                const catPrice = concert.price * cat.multiplier;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSeatCategory(cat.id)}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${isSelected
                        ? `${cat.border} ${cat.bg}`
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/60"
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? `${cat.border} ${cat.bg}` : "border-gray-300"
                      }`}>
                      {isSelected && <div className={`w-2 h-2 rounded-full ${cat.dot}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-sm font-semibold ${isSelected ? cat.color : "text-gray-700"}`}>
                          {cat.label}
                        </span>
                        {cat.id === "VIP" && (
                          <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-md font-medium">Popular</span>
                        )}
                        {cat.id === "VVIP" && (
                          <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-md font-medium">Premium</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{cat.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${isSelected ? cat.color : "text-gray-700"}`}>
                        ${catPrice.toFixed(2)}
                      </p>
                      {cat.multiplier > 1 && (
                        <p className="text-xs text-gray-400">{cat.multiplier}× base</p>
                      )}
                    </div>
                    {isSelected && <Check className={`w-4 h-4 flex-shrink-0 ${cat.color}`} />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Quantity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-900 font-semibold text-sm mb-4">2. Number of tickets</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">{seatCategory}</p>
                <p className="text-xs text-gray-400">${(concert.price * selectedTier.multiplier).toFixed(2)} per ticket</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                    className="w-8 text-center text-gray-900 font-bold text-lg"
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= Math.min(8, concert.availableSeats)}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Max 8 tickets per transaction</p>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-900 font-semibold text-sm mb-4">3. Payment method</h3>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <motion.button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${isSelected
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <span className={isSelected ? "text-indigo-600" : "text-gray-400"}>
                      {method.icon}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold ${isSelected ? "text-indigo-700" : "text-gray-700"}`}>{method.label}</p>
                      <p className="text-[10px] text-gray-400">{method.type}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-indigo-500 ml-auto" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Order summary + CTA */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-900 font-semibold text-sm mb-4">4. Order summary</h3>
            <div className="space-y-2 mb-4">
              <PriceRow label={`${seatCategory} × ${quantity}`} value={total} />
              <PriceRow label="Service fee (5%)" value={serviceFee} />
              <div className="pt-2 border-t border-gray-100">
                <PriceRow label="Total" value={grandTotal} bold />
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-indigo-200/50 transition-all disabled:opacity-60"
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

            <p className="text-xs text-gray-400 text-center mt-3">
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
    <div className="flex items-center gap-2 text-gray-500">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs">{text}</span>
    </div>
  );
}

function PriceRow({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-gray-900" : "text-gray-500"}`}>
      <span className={`text-sm ${bold ? "font-semibold" : ""}`}>{label}</span>
      <span className={`text-sm ${bold ? "font-bold" : ""}`}>${value.toFixed(2)}</span>
    </div>
  );
}