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
    <PageTransition className="relative min-h-screen bg-slate-50 selection:bg-primary/20 overflow-x-hidden flex flex-col">

      {/* 1. BACKGROUND AURA (Konsisten dengan Dashboard) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[140px] rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/5 blur-[140px] rounded-full mix-blend-multiply opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow">

        {/* Header (Dirampingkan proporsinya) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <h1 className="text-slate-900 font-black text-3xl md:text-4xl tracking-tight mb-1.5">Saved Favorites</h1>
            <p className="text-slate-500 text-sm font-medium">
              {favoriteConcerts.length} concert{favoriteConcerts.length !== 1 ? "s" : ""} saved to your list
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-xl border border-white text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-sm font-bold transition-all shadow-sm"
          >
            <Music2 className="w-4 h-4" /> Browse Events
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1">
          {favoriteConcerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              className="text-center py-28 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl shadow-slate-200/30"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-100 shadow-inner">
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
              <h2 className="text-slate-900 font-black text-2xl mb-2">No favorites yet</h2>
              <p className="text-slate-500 text-sm font-medium mb-8">
                Browse concerts and tap the heart icon to save them here.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white bg-slate-900 text-sm font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 group"
              >
                Discover Concerts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="group relative bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-white overflow-hidden shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Header (Lebih Compact) */}
                    <div className="relative h-44 overflow-hidden bg-slate-100 m-2.5 mb-0 rounded-[1.25rem]">
                      <img
                        src={concert.image}
                        alt={concert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20 opacity-90" />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                        <StatusBadge status={soldOut ? "sold out" : concert.status} />
                      </div>

                      {/* Tombol Remove Favorite (Lebih Elegant) */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(concert.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/40 shadow-sm hover:bg-rose-50 hover:border-rose-100 active:scale-95 text-rose-500 transition-all"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2">
                        <span className="text-[9px] font-black text-white bg-primary/90 backdrop-blur-md rounded-md px-2 py-1 uppercase tracking-widest shadow-sm">
                          {concert.genre}
                        </span>
                        {concert.status === "active" && !soldOut && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-white bg-white/20 border border-white/20 backdrop-blur-md rounded-md px-2 py-1 uppercase tracking-widest">
                            <Clock className="w-3 h-3 text-amber-300" /> {concert.time}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content (Padding & Typografi Dirampingkan) */}
                    <div className="flex-1 p-5 flex flex-col">
                      <div className="flex-1">
                        <p className="text-primary font-bold text-[10px] mb-1.5 uppercase tracking-[0.15em] truncate">
                          {concert.artist}
                        </p>
                        <h3 className="text-slate-900 font-black text-lg mb-3 line-clamp-2 leading-snug tracking-tight">
                          {concert.title}
                        </h3>

                        <div className="space-y-2 mb-5">
                          <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} text={`${concert.date} · ${concert.time}`} />
                          <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} text={`${concert.venue}, ${concert.city}`} />
                          <InfoRow icon={<Users className="w-3.5 h-3.5" />} text={`${concert.availableSeats.toLocaleString()} seats left`} />
                        </div>
                      </div>

                      {/* Progress Bar (Sama seperti ConcertCard) */}
                      <div className="mb-5">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                          <span>Capacity</span>
                          <span className={isAlmostSoldOut ? "text-rose-500" : "text-primary"}>
                            {fillPercent}% Filled
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${fillPercent}%` }} transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                            className={`h-full rounded-full ${isAlmostSoldOut ? "bg-rose-500" : "bg-primary"}`}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto">
                        {concert.status === "archived" || soldOut ? (
                          <div className="w-full text-center py-2.5 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200 font-bold uppercase tracking-widest">
                            {soldOut ? "Sold Out" : "Unavailable"}
                          </div>
                        ) : (
                          <Link
                            to={`/concerts/${concert.id}`}
                            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs text-white font-bold rounded-xl bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/20 transition-all active:scale-[0.98] group"
                          >
                            View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
      </div>
    </PageTransition>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-slate-600">
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      <span className="text-[11px] font-bold truncate">{text}</span>
    </div>
  );
}