import { motion } from "motion/react";
import { Link } from "react-router";
import { Heart, Calendar, MapPin, Users, ArrowRight, Music2, Sparkles, Clock } from "lucide-react";
import { useData } from "../context/DataContext";
import { useFavorites } from "../context/FavoritesContext";
import { PageTransition } from "../components/PageTransition";
import { StatusBadge } from "../components/StatusBadge";
import { ReactNode } from "react";

export function FavoritesPage() {
  const { concerts } = useData();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteConcerts = concerts.filter((c) => favorites.includes(c.id));

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <h1 className="text-gray-900 font-bold text-2xl">Favorites</h1>
          </div>
          <p className="text-gray-400 text-sm ml-10">
            {favoriteConcerts.length} concert{favoriteConcerts.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all"
        >
          <Music2 className="w-4 h-4" />
          Explore
        </Link>
      </div>

      {/* Empty state */}
      {favoriteConcerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Heart className="w-10 h-10 text-rose-200" />
          </div>
          <h2 className="text-gray-700 font-semibold mb-1">No favorites yet</h2>
          <p className="text-gray-400 text-sm mb-6">
            Browse concerts and tap the ❤️ to save them here
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold shadow-md shadow-indigo-200/50 hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Discover Concerts
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favoriteConcerts.map((concert, i) => {
            const soldOut = concert.availableSeats === 0;
            const fillPercent = Math.round(
              ((concert.capacity - concert.availableSeats) / concert.capacity) * 100
            );

            return (
              <motion.div
                key={concert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="group relative bg-white rounded-3xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100/60 transition-shadow duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={concert.image}
                    alt={concert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <StatusBadge status={soldOut ? "sold out" : concert.status} />
                  </div>

                  {/* Favorite button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(concert.id);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-rose-500 text-white shadow-sm"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </motion.button>

                  {/* Bottom on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="text-xs text-white/90 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1 font-medium">
                      {concert.genre}
                    </span>
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

                  {/* Price + fill bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span className="text-indigo-600 font-bold text-sm">${concert.price.toFixed(2)}</span>
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

                  {/* Actions */}
                  <div className="mt-auto">
                    {concert.status === "archived" || soldOut ? (
                      <div className="w-full text-center py-2.5 text-sm text-gray-400 bg-gray-50 rounded-2xl border border-gray-100 font-medium">
                        {concert.status === "archived" ? "Unavailable" : "Sold Out"}
                      </div>
                    ) : (
                      <Link
                        to={`/concerts/${concert.id}`}
                        className="group/btn flex items-center justify-center gap-2 w-full py-2.5 text-sm text-white font-semibold rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-indigo-200/60"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/0 group-hover:ring-indigo-100/60 transition-all duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      )}
    </PageTransition>
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
