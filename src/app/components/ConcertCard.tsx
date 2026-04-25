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
  /** When true, don't show the heart icon (e.g. admin view) */
  hideFavorite?: boolean;
}

export function ConcertCard({ concert, showActions = true, hideFavorite = false }: ConcertCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const soldOut = concert.availableSeats === 0;
  const fillPercent = Math.round(((concert.capacity - concert.availableSeats) / concert.capacity) * 100);
  const isAlmostSoldOut = fillPercent >= 80 && !soldOut;
  const fav = isFavorite(concert.id);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-white rounded-3xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100/60 transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <motion.img
          src={concert.image}
          alt={concert.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <StatusBadge status={soldOut ? "sold out" : concert.status} />
          {isAlmostSoldOut && (
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm"
            >
              <Sparkles className="w-3 h-3" />
              Almost gone!
            </motion.span>
          )}
        </div>

        {/* Favorite button — top right */}
        {!hideFavorite && (
          <motion.button
            whileTap={{ scale: 0.8 }}
            animate={{ scale: fav ? [1, 1.25, 1] : 1 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(concert.id);
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
              fav
                ? "bg-rose-500 text-white"
                : "bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white"
            }`}
            title={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
          </motion.button>
        )}

        {/* Bottom info on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <span className="text-xs text-white/90 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1 font-medium">
              {concert.genre}
            </span>
          </div>
          {concert.status === "active" && !soldOut && (
            <div className="flex items-center gap-1 text-white/80 text-xs bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
              <Clock className="w-3 h-3" />
              {concert.time}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold text-base mb-0.5 line-clamp-1 group-hover:text-indigo-700 transition-colors">
            {concert.title}
          </h3>
          <p className="text-indigo-500 text-sm font-medium mb-3.5">
            {concert.artist}
          </p>

          <div className="space-y-2 mb-4">
            <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} text={`${concert.date} · ${concert.time}`} />
            <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} text={`${concert.venue}, ${concert.city}`} />
            <InfoRow icon={<Users className="w-3.5 h-3.5" />} text={`${concert.availableSeats.toLocaleString()} seats available`} />
          </div>
        </div>

        {/* Seat fill bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Availability</span>
            <span className={fillPercent > 90 ? "text-red-500 font-medium" : fillPercent > 70 ? "text-amber-500 font-medium" : "text-emerald-500 font-medium"}>
              {100 - fillPercent}% left
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className={`h-full rounded-full ${
                fillPercent > 90
                  ? "bg-gradient-to-r from-red-400 to-rose-500"
                  : fillPercent > 70
                  ? "bg-gradient-to-r from-amber-400 to-orange-400"
                  : "bg-gradient-to-r from-indigo-400 to-violet-500"
              }`}
            />
          </div>
        </div>

        {showActions && (
          <div className="mt-auto">
            {concert.status === "archived" ? (
              <div className="w-full text-center py-2.5 text-sm text-gray-400 bg-gray-50 rounded-2xl border border-gray-100 font-medium">
                Unavailable
              </div>
            ) : soldOut ? (
              <div className="w-full text-center py-2.5 text-sm text-gray-400 bg-gray-50 rounded-2xl border border-gray-100 font-medium">
                Sold Out
              </div>
            ) : (
              <Link
                to={`/concerts/${concert.id}`}
                className="group/btn flex items-center justify-center gap-2 w-full py-2.5 text-sm text-white font-semibold rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-indigo-200/60 hover:shadow-lg hover:shadow-indigo-200/80"
              >
                View Details
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/0 group-hover:ring-indigo-100/60 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <span className="text-indigo-300 flex-shrink-0">{icon}</span>
      <span className="text-xs truncate">{text}</span>
    </div>
  );
}