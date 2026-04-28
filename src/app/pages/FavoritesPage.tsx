import { motion } from "motion/react";
import { Link } from "react-router";
import { Heart, Calendar, MapPin, Users, ArrowRight, Music2, Clock } from "lucide-react";
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
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-slate-900 font-extrabold text-3xl tracking-tight mb-1">Saved Favorites</h1>
          <p className="text-slate-500 text-sm font-medium">
            {favoriteConcerts.length} concert{favoriteConcerts.length !== 1 ? "s" : ""} saved to your list
          </p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors shadow-sm"
        >
          <Music2 className="w-4 h-4" />
          Browse Events
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1">
        {favoriteConcerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-100">
              <Heart className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-slate-900 font-bold text-xl mb-2">No favorites yet</h2>
            <p className="text-slate-500 text-sm mb-8">
              Browse concerts and tap the heart icon to save them here.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-primary text-sm font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-95"
            >
              Discover Concerts
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteConcerts.map((concert, i) => {
              const soldOut = concert.availableSeats === 0;
              const fillPercent = Math.round(
                ((concert.capacity - concert.availableSeats) / concert.capacity) * 100
              );
              const isAlmostSoldOut = fillPercent >= 80 && !soldOut;

              return (
                <motion.div
                  key={concert.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={concert.image}
                      alt={concert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <StatusBadge status={soldOut ? "sold out" : concert.status} />
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(concert.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:scale-105 active:scale-95 text-rose-500"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
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
                      <h3 className="text-slate-900 font-bold text-lg mb-4 line-clamp-2 leading-snug">
                        {concert.title}
                      </h3>
                      <div className="space-y-2.5 mb-6">
                        <InfoRow icon={<Calendar className="w-4 h-4" />} text={`${concert.date} · ${concert.time}`} />
                        <InfoRow icon={<MapPin className="w-4 h-4" />} text={`${concert.venue}, ${concert.city}`} />
                        <InfoRow icon={<Users className="w-4 h-4" />} text={`${concert.availableSeats.toLocaleString()} seats left`} />
                      </div>
                    </div>

                    {/* Progress Bar Sama dengan ConcertCard */}
                    <div className="mb-5">
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
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

                    {/* Actions */}
                    <div className="mt-auto">
                      {concert.status === "archived" || soldOut ? (
                        <div className="w-full text-center py-2.5 text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-200 font-semibold">
                          {soldOut ? "Sold Out" : "Unavailable"}
                        </div>
                      ) : (
                        <Link
                          to={`/concerts/${concert.id}`}
                          className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-white font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-colors shadow-sm active:scale-[0.98]"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
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