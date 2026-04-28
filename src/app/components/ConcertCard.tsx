import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Calendar, MapPin, Users, Sparkles, ArrowRight, Clock, Heart } from "lucide-react";
import { Concert } from "../data/mockData";
import { StatusBadge } from "./StatusBadge";
import { useFavorites } from "../context/FavoritesContext";

interface ConcertCardProps {
  concert: Concert;
  showActions?: boolean;
  hideFavorite?: boolean;
}

export function ConcertCard({ concert, showActions = true, hideFavorite = false }: ConcertCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const soldOut = concert.availableSeats === 0;
  const fillPercent = Math.round(((concert.capacity - concert.availableSeats) / concert.capacity) * 100);
  const isAlmostSoldOut = fillPercent >= 80 && !soldOut;
  const fav = isFavorite(concert.id);

  return (
    <div
      className="card-premium group relative rounded-[2rem] overflow-hidden flex flex-col h-full bg-white shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50"
    >
      {/* Top Gradient Glow on Hover */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-colors duration-500" />

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <div className="w-full h-full overflow-hidden">
          <motion.img
            src={concert.image}
            alt={concert.title}
            className="w-full h-full object-cover origin-center opacity-90"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60" />
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <StatusBadge status={soldOut ? "sold out" : concert.status} />
          {isAlmostSoldOut && (
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3" />
              Almost gone!
            </motion.span>
          )}
        </div>

        {/* Favorite button */}
        {!hideFavorite && (
          <motion.button
            whileTap={{ scale: 0.8 }}
            animate={{ scale: fav ? [1, 1.25, 1] : 1 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(concert.id);
            }}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${
              fav
                ? "bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                : "bg-white/20 border-white/30 text-white hover:bg-white/40"
            }`}
          >
            <Heart className={`w-5 h-5 ${fav ? "fill-current" : ""}`} />
          </motion.button>
        )}

        {/* Floating Info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] text-white bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 font-bold uppercase tracking-wider">
              {concert.genre}
            </span>
          </div>
          {concert.status === "active" && !soldOut && (
            <div className="flex items-center gap-1.5 text-white text-[10px] font-bold bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-3 py-1">
              <Clock className="w-3 h-3 text-primary" />
              {concert.time}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col relative z-10">
        <div className="flex-1">
          <h3 className="text-foreground font-bold text-xl mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {concert.title}
          </h3>
          <p className="text-primary font-bold text-sm mb-5">
            {concert.artist}
          </p>

          <div className="space-y-3 mb-6">
            <InfoRow icon={<Calendar className="w-4 h-4" />} text={`${concert.date} · ${concert.time}`} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} text={`${concert.venue}, ${concert.city}`} />
            <InfoRow icon={<Users className="w-4 h-4" />} text={`${concert.availableSeats.toLocaleString()} seats available`} />
          </div>
        </div>

        {/* Seat fill bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Availability</span>
            <span className={fillPercent > 90 ? "text-red-400" : fillPercent > 70 ? "text-amber-400" : "text-emerald-400"}>
              {100 - fillPercent}% left
            </span>
          </div>
          <div className="h-2 bg-accent/50 border border-border/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${
                fillPercent > 90
                  ? "bg-gradient-to-r from-red-500 to-rose-500 text-red-500"
                  : fillPercent > 70
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-amber-500"
                  : "bg-gradient-to-r from-cyan-400 to-emerald-400 text-cyan-400"
              }`}
            />
          </div>
        </div>

        {showActions && (
          <div className="mt-auto">
            {concert.status === "archived" ? (
              <div className="w-full text-center py-3.5 text-sm text-muted-foreground bg-white/5 rounded-xl border border-white/10 font-medium">
                Unavailable
              </div>
            ) : soldOut ? (
              <div className="w-full text-center py-3.5 text-sm text-muted-foreground bg-white/5 rounded-xl border border-white/10 font-medium">
                Sold Out
              </div>
            ) : (
              <Link
                to={`/concerts/${concert.id}`}
                className="group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full py-3.5 text-sm text-white font-semibold rounded-xl bg-primary transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10">View Details</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="text-primary flex-shrink-0">{icon}</span>
      <span className="text-sm truncate">{text}</span>
    </div>
  );
}