import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Calendar, MapPin, Clock, ArrowLeft, Star, Heart, Share2, Info, Ticket, ShieldCheck, ArrowRight } from "lucide-react";
import { useData } from "../context/DataContext";
import { useFavorites } from "../context/FavoritesContext";
import { PageTransition } from "../components/PageTransition";

export function ConcertDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getConcert } = useData();
  const { favorites, toggleFavorite } = useFavorites();

  const concert = getConcert(id || "");

  if (!concert) return null;

  const isFavorite = favorites.includes(concert.id);
  const soldOut = concert.availableSeats === 0;

  return (
    <PageTransition className="relative min-h-screen bg-slate-50 selection:bg-primary/20 overflow-x-hidden flex flex-col">

      {/* 1. COLORFUL AURA BACKGROUND */}
      {/* PERBAIKAN: Menambahkan CSS Masking untuk menghaluskan potongan kaku di bagian atas */}
      <div
        className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none z-0 overflow-hidden"
        style={{
          // Masker gradien: Transparan di paling atas (0%), perlahan menjadi pekat (black) di 20% ke bawah.
          // Ini menjamin transisi super halus dan menghilangkan garis potongan.
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 100%)" // Untuk Safari/WebKit
        }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/10 blur-[120px] rounded-full mix-blend-multiply opacity-70" />
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-400/10 blur-[120px] rounded-full mix-blend-multiply opacity-70" />
        <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-primary/10 blur-[120px] rounded-full mix-blend-multiply opacity-50" />
      </div>

      <div className="relative z-10 flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-32">

        {/* Floating Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white rounded-full text-slate-600 text-sm font-bold hover:bg-white hover:text-primary shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex gap-2.5">
            <button className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-xl border border-white flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 transition-all shadow-sm">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(concert.id)}
              className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-xl border border-white flex items-center justify-center text-slate-500 hover:bg-white transition-all shadow-sm"
            >
              <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-rose-500 text-rose-500" : "hover:text-rose-500"}`} />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* 2. LEFT COL: HERO IMAGE & DETAILS */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* Hero Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/10 border-4 border-white"
            >
              <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3 py-1 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                    {concert.genre}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 border border-white/20">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Top Rated
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-1.5 drop-shadow-xl">
                  {concert.title}
                </h1>
                <p className="text-lg md:text-2xl font-bold text-white/80 drop-shadow-md">{concert.artist}</p>
              </div>
            </motion.div>

            {/* Event Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <InfoCard icon={<Calendar />} label="Date" value={concert.date} />
              <InfoCard icon={<Clock />} label="Time" value={concert.time} />
              <InfoCard icon={<MapPin />} label="Venue" value={`${concert.venue}, ${concert.city}`} />
            </motion.div>

            {/* Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-2xl border border-white p-7 md:p-8 rounded-[1.5rem] shadow-lg shadow-slate-200/40"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">About the Event</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                {concert.description ? concert.description : `Experience the magic of ${concert.artist} live in ${concert.city}. This highly anticipated event will feature all their greatest hits along with spectacular visual production. Secure your spot now and witness history in the making.`}
              </p>
            </motion.div>
          </div>

          {/* 3. RIGHT COL: FLOATING BOOKING CARD */}
          <div className="lg:col-span-5 xl:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="sticky top-24 bg-white/90 backdrop-blur-3xl p-7 rounded-[2rem] border border-white shadow-2xl shadow-primary/10"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Ticket className="w-6 h-6" />
                </div>
                {/* Status Ketersediaan */}
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${soldOut ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}>
                  {soldOut ? "Sold Out" : "Available"}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Starting From</h3>
                <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">${concert.price.toFixed(2)}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Remaining Seats</span>
                  <span className={`text-lg font-black ${soldOut ? "text-rose-500" : "text-slate-900"}`}>
                    {soldOut ? "0" : concert.availableSeats}
                  </span>
                </div>
              </div>

              {soldOut ? (
                <button disabled className="w-full py-3.5 bg-slate-100 text-slate-400 text-sm font-black rounded-xl cursor-not-allowed">
                  Tickets Unavailable
                </button>
              ) : (
                <Link
                  to={`/booking/${concert.id}`}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white text-sm font-black rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
                >
                  Book Tickets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-2">
                <p className="text-center text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1.5 uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Buyer Guarantee
                </p>
                <p className="text-center text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1.5 uppercase tracking-widest">
                  <Info className="w-3.5 h-3.5" /> Instant Digital Delivery
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}

function InfoCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-5 rounded-[1.25rem] bg-white/80 backdrop-blur-xl border border-white flex flex-col gap-2 shadow-lg shadow-slate-200/30 hover:bg-white transition-colors">
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-primary flex items-center justify-center">
        <div className="scale-90">{icon}</div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );
}