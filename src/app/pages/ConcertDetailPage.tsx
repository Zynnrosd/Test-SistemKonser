import { ReactNode, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  Calendar, MapPin, Users, Tag, Clock,
  ArrowLeft, Ticket, Info, ChevronRight, Heart, Sparkles
} from "lucide-react";
import { useData } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

export function ConcertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getConcert } = useData();
  const navigate = useNavigate();
  const concert = getConcert(id!);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!concert) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center text-foreground">
        <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border shadow-sm">
          <Info className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-2xl font-black mb-2">Concert not found.</p>
        <button onClick={() => navigate("/dashboard")} className="text-primary text-sm font-bold hover:underline transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const soldOut = concert.availableSeats === 0;
  const fillPercent = Math.round(((concert.capacity - concert.availableSeats) / concert.capacity) * 100);

  return (
    <PageTransition className="max-w-6xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-medium">
        <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Concerts
        </Link>
        <ChevronRight className="w-4 h-4 text-border" />
        <span className="text-foreground font-bold truncate max-w-xs">{concert.title}</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative rounded-[2.5rem] overflow-hidden h-80 sm:h-96 border border-border shadow-2xl"
          >
            <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Top row: status + favorite */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <StatusBadge status={soldOut ? "sold out" : concert.status} size="md" />
              <motion.button
                onClick={() => setIsFavorited((v) => !v)}
                whileTap={{ scale: 0.85 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${
                  isFavorited
                    ? "bg-rose-500 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                    : "bg-white/20 border-white/30 text-white hover:bg-white/40"
                }`}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h1 className="text-white font-black text-5xl leading-tight mb-2 tracking-tighter">{concert.title}</h1>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-white/90 font-bold text-xl">{concert.artist}</p>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <div className="bg-white rounded-[2rem] border border-border p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-foreground font-black text-xl tracking-tight">About this event</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[16px] font-medium">{concert.description}</p>
            </div>
          </div>

          {/* Event details grid */}
          <div className="bg-white rounded-[2rem] border border-border p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h2 className="text-foreground font-black text-xl tracking-tight mb-8">Event Details</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <DetailItem icon={<Calendar className="w-5 h-5" />} color="text-primary" label="Date" value={concert.date} />
                <DetailItem icon={<Clock className="w-5 h-5" />} color="text-primary" label="Time" value={concert.time} />
                <DetailItem icon={<MapPin className="w-5 h-5" />} color="text-primary" label="Venue" value={concert.venue} />
                <DetailItem icon={<MapPin className="w-5 h-5" />} color="text-primary" label="City" value={concert.city} />
                <DetailItem icon={<Tag className="w-5 h-5" />} color="text-primary" label="Genre" value={concert.genre} />
                <DetailItem icon={<Users className="w-5 h-5" />} color="text-primary" label="Capacity" value={`${concert.capacity.toLocaleString()} total`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking card */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="sticky top-28 bg-white rounded-[2.5rem] border border-border shadow-2xl p-10 space-y-8 overflow-hidden relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            {/* Price */}
            <div className="flex items-end justify-between pb-8 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-widest">Starting from</p>
                <p className="text-foreground font-black tracking-tighter" style={{ fontSize: "3rem", lineHeight: 1 }}>
                  ${concert.price.toFixed(2)}
                </p>
              </div>
              <span className="text-xs text-primary pb-1.5 font-bold px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20 uppercase">
                + fees
              </span>
            </div>

            {/* Availability bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                <span>Availability</span>
                <span className={`${soldOut ? "text-red-500" : concert.availableSeats < 100 ? "text-amber-500" : "text-emerald-600"}`}>
                  {soldOut ? "Sold Out" : `${concert.availableSeats.toLocaleString()} left`}
                </span>
              </div>
              <div className="h-2.5 bg-accent border border-border/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercent}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  className={`h-full rounded-full shadow-[0_0_15px_currentColor] ${
                    fillPercent > 90 ? "bg-gradient-to-r from-red-500 to-rose-500 text-red-500" 
                    : fillPercent > 70 ? "bg-gradient-to-r from-amber-500 to-orange-500 text-amber-500" 
                    : "bg-primary text-primary"
                  }`}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest">{fillPercent}% sold</p>
            </div>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-2.5">
              <InfoPill icon={<Calendar className="w-3.5 h-3.5" />} label={concert.date} />
              <InfoPill icon={<Clock className="w-3.5 h-3.5" />} label={concert.time} />
              <InfoPill icon={<MapPin className="w-3.5 h-3.5" />} label={concert.city} />
            </div>

            {/* Seat category teaser */}
            <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
              {["Regular", "VIP", "VVIP"].map((cat) => (
                <span key={cat} className={`px-3 py-2 rounded-xl border ${
                  cat === "VVIP" ? "bg-amber-100 text-amber-700 border-amber-200" :
                  cat === "VIP" ? "bg-primary/10 text-primary border-primary/20" :
                  "bg-accent text-muted-foreground border-border"
                }`}>{cat}</span>
              ))}
            </div>

            {/* CTA */}
            {concert.status === "archived" ? (
              <div className="text-center p-4 bg-black/40 rounded-2xl border border-white/10">
                <p className="text-sm text-gray-400 font-medium">This event is no longer available.</p>
              </div>
            ) : soldOut ? (
              <div className="text-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                <p className="text-sm text-red-400 font-bold">This event is sold out.</p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/booking/${concert.id}`)}
                  className="relative group w-full flex items-center justify-center gap-2 py-5 rounded-2xl text-white font-black bg-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all overflow-hidden"
                >
                  <Ticket className="w-6 h-6 relative z-10" />
                  <span className="relative z-10 text-lg tracking-wide">Book Tickets</span>
                </motion.button>
                
                {/* Favorite shortcut */}
                <button
                  onClick={() => setIsFavorited((v) => !v)}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold border transition-all ${
                    isFavorited
                      ? "border-rose-500/50 bg-rose-50 text-rose-600 shadow-lg shadow-rose-500/10"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
                </button>
              </div>
            )}

            <p className="text-[10px] text-muted-foreground text-center font-bold uppercase tracking-widest pt-4 border-t border-border">
              Secure checkout · Instant confirmation
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function DetailItem({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-accent/50 rounded-2xl border border-border/50 transition-colors hover:bg-accent">
      <div className={`mt-0.5 flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-[10px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-[15px] text-foreground font-bold">{value}</p>
      </div>
    </div>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-accent border border-border rounded-xl px-4 py-2.5">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
  );
}