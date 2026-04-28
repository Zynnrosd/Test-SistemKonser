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
      className="group relative rounded-2xl overflow-hidden flex flex-col h-full bg-white shadow-sm border border-border hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <motion.img
          src={concert.image}
          alt={concert.title}
          className="w-full h-full object-cover origin-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <StatusBadge status={soldOut ? "sold out" : concert.status} />
          {isAlmostSoldOut && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Selling Fast
            </span>
          )}
        </div>

        {/* Favorite button */}
        {!hideFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(concert.id);
            }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all bg-white shadow-sm hover:scale-105 active:scale-95 ${fav ? "text-rose-500" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Floating Category */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm rounded-md px-2 py-1 tracking-wide">
            {concert.genre}
          </span>
          {concert.status === "active" && !soldOut && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm rounded-md px-2 py-1">
              <Clock className="w-3 h-3 text-primary" />
              {concert.time}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex-1">
          <p className="text-primary font-semibold text-xs mb-1 uppercase tracking-wider">
            {concert.artist}
          </p>
          <h3 className="text-foreground font-bold text-lg mb-4 line-clamp-2 leading-snug">
            {concert.title}
          </h3>

          <div className="space-y-2.5 mb-6">
            <InfoRow icon={<Calendar className="w-4 h-4" />} text={`${concert.date} · ${concert.time}`} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} text={`${concert.venue}, ${concert.city}`} />
            <InfoRow icon={<Users className="w-4 h-4" />} text={`${concert.availableSeats.toLocaleString()} seats left`} />
          </div>
        </div>

        {/* Professional Seat fill bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
            <span>Capacity</span>
            <span className={isAlmostSoldOut ? "text-rose-600" : "text-slate-600"}>
              {fillPercent}% Filled
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
              className={`h-full rounded-full ${isAlmostSoldOut ? "bg-rose-500" : "bg-primary"
                }`}
            />
          </div>
        </div>

        {showActions && (
          <div className="mt-auto">
            {concert.status === "archived" || soldOut ? (
              <div className="w-full text-center py-3 text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-200 font-semibold">
                {soldOut ? "Sold Out" : "Unavailable"}
              </div>
            ) : (
              <Link
                to={`/concerts/${concert.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm text-white font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-colors shadow-sm active:scale-[0.98]"
              >
                <span>View Tickets</span>
                <ArrowRight className="w-4 h-4" />
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
    <div className="flex items-center gap-3 text-slate-600">
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      <span className="text-sm truncate font-medium">{text}</span>
    </div>
  );
}