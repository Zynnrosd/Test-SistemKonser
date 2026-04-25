import { useState } from "react";
import { motion } from "motion/react";
import { Search, Music2, Ticket, TrendingUp, Sparkles, Zap, ChevronDown } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { ConcertCard } from "../components/ConcertCard";
import { PageTransition } from "../components/PageTransition";

const GENRES = ["All", "Rock / Alternative", "Electronic / House", "Jazz / Neo-Soul", "Classical / Orchestral", "Pop / Indie", "Folk / Indie", "Synthwave / Electronic", "Multi-Genre / Festival"];

const GENRE_EMOJIS: Record<string, string> = {
  "All": "🎵",
  "Rock / Alternative": "🎸",
  "Electronic / House": "🎧",
  "Jazz / Neo-Soul": "🎷",
  "Classical / Orchestral": "🎻",
  "Pop / Indie": "🎤",
  "Folk / Indie": "🪕",
  "Synthwave / Electronic": "⚡",
  "Multi-Genre / Festival": "🎪",
};

export function UserDashboard() {
  const { concerts, getUserTickets } = useData();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  const activeConcerts = concerts.filter((c) => c.status === "active");
  const userTickets = currentUser ? getUserTickets(currentUser.id) : [];

  const filtered = activeConcerts.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.artist.toLowerCase().includes(search.toLowerCase()) ||
      c.venue.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === "All" || c.genre === genre;
    const matchPrice =
      priceRange === "All" ||
      (priceRange === "under100" && c.price < 100) ||
      (priceRange === "100-200" && c.price >= 100 && c.price <= 200) ||
      (priceRange === "over200" && c.price > 200);
    return matchSearch && matchGenre && matchPrice;
  });

  const stats = [
    {
      label: "Available Concerts",
      value: activeConcerts.length,
      icon: Music2,
      gradient: "from-violet-500 to-indigo-600",
      bg: "from-violet-50 to-indigo-50",
      border: "border-violet-100",
      textColor: "text-indigo-700",
      emoji: "🎵",
    },
    {
      label: "My Bookings",
      value: userTickets.length,
      icon: Ticket,
      gradient: "from-purple-500 to-violet-600",
      bg: "from-purple-50 to-violet-50",
      border: "border-purple-100",
      textColor: "text-violet-700",
      emoji: "🎫",
    },
    {
      label: "Upcoming Events",
      value: activeConcerts.filter((c) => new Date(c.date) > new Date()).length,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-100",
      textColor: "text-emerald-700",
      emoji: "🚀",
    },
  ];

  const isFiltered = search || genre !== "All" || priceRange !== "All";

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="relative mb-10 rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-8 shadow-2xl shadow-indigo-200/50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-purple-900/20 blur-2xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-24 w-16 h-16 rounded-full border border-white/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-4 right-12 w-10 h-10 rounded-full border border-white/10"
          />
          {/* Music notes decoration */}
          {["🎵", "🎶", "🎸", "🎤"].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
              className="absolute text-lg select-none pointer-events-none"
              style={{ right: `${15 + i * 6}%`, top: `${20 + (i % 2) * 40}%` }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs text-white/90 font-medium border border-white/20">
                <Sparkles className="w-3 h-3" />
                Live Music Experience
              </span>
            </div>
            <h1 className="text-white font-bold mb-2" style={{ fontSize: "2rem", lineHeight: 1.2 }}>
              Discover Amazing<br />
              <span className="text-white/80">Live Concerts</span> 🎸
            </h1>
            <p className="text-white/70 text-sm max-w-md">
              Welcome back, <span className="text-white font-semibold">{currentUser?.name}</span>! Explore the hottest concerts near you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, gradient, bg, border, textColor, emoji }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className={`relative bg-gradient-to-br ${bg} rounded-2xl border ${border} p-5 shadow-sm overflow-hidden cursor-default`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/20 -translate-y-8 translate-x-8" />
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl select-none">{emoji}</span>
            </div>
            <p className={`text-3xl font-bold ${textColor} mb-0.5`}>{value}</p>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concerts, artists, venues..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:bg-white transition-all text-sm"
            />
            {search && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </motion.button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="appearance-none px-3 py-2.5 pr-8 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm font-medium cursor-pointer"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>{GENRE_EMOJIS[g]} {g}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="appearance-none px-3 py-2.5 pr-8 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm font-medium cursor-pointer"
              >
                <option value="All">💰 Any price</option>
                <option value="under100">Under $100</option>
                <option value="100-200">$100–$200</option>
                <option value="over200">Over $200</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filters */}
        {isFiltered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100"
          >
            <span className="text-xs text-gray-400 font-medium">Active filters:</span>
            {search && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                "{search}"
                <button onClick={() => setSearch("")} className="ml-0.5 hover:text-indigo-800">✕</button>
              </span>
            )}
            {genre !== "All" && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-medium">
                {GENRE_EMOJIS[genre]} {genre}
                <button onClick={() => setGenre("All")} className="ml-0.5 hover:text-violet-800">✕</button>
              </span>
            )}
            {priceRange !== "All" && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                💰 {priceRange}
                <button onClick={() => setPriceRange("All")} className="ml-0.5 hover:text-purple-800">✕</button>
              </span>
            )}
            <button
              onClick={() => { setSearch(""); setGenre("All"); setPriceRange("All"); }}
              className="ml-auto text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-violet-500 to-indigo-600 rounded-full" />
          <p className="text-sm text-gray-600">
            <span className="text-gray-900 font-bold text-base">{filtered.length}</span>{" "}
            <span className="font-medium">concerts found</span>
          </p>
          {!isFiltered && (
            <span className="flex items-center gap-1 text-xs text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3" />
              All shows
            </span>
          )}
        </div>

      </div>

      {/* Concert Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Music2 className="w-10 h-10 text-indigo-200" />
          </div>
          <p className="text-gray-700 font-semibold mb-1">No concerts found</p>
          <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => { setSearch(""); setGenre("All"); setPriceRange("All"); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold shadow-md shadow-indigo-200/50 hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Show all concerts
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((concert, i) => (
            <motion.div
              key={concert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <ConcertCard concert={concert} />
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
