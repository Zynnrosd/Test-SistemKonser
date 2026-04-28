import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Music2, Ticket, TrendingUp, Sparkles, Zap, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const activeConcerts = concerts.filter((c) => c.status === "active");
  const userTickets = currentUser ? getUserTickets(currentUser.id) : [];

  const filtered = useMemo(() => {
    return activeConcerts.filter((c) => {
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
  }, [activeConcerts, search, genre, priceRange]);

  // Reset pagination when filters change
  useMemo(() => { setCurrentPage(1); }, [search, genre, priceRange]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedConcerts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = [
    {
      label: "Available Concerts",
      value: activeConcerts.length,
      icon: Music2,
      color: "text-primary",
      bg: "bg-primary/10",
      emoji: "🎵",
    },
    {
      label: "My Bookings",
      value: userTickets.length,
      icon: Ticket,
      color: "text-primary",
      bg: "bg-primary/10",
      emoji: "🎫",
    },
    {
      label: "Upcoming Events",
      value: activeConcerts.filter((c) => new Date(c.date) > new Date()).length,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
      emoji: "🚀",
    },
  ];

  const isFiltered = search || genre !== "All" || priceRange !== "All";

  return (
    <PageTransition className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero Header */}
      <div className="relative mb-12 rounded-[2.5rem] overflow-hidden glass p-12 shadow-none border-border">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-32 w-24 h-24 rounded-full border border-primary/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 right-16 w-16 h-16 rounded-full border border-primary/10"
          />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 backdrop-blur-md rounded-full text-xs text-primary font-bold border border-primary/20 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Live Music Experience
              </span>
            </div>
            <h1 className="text-foreground font-extrabold mb-4 tracking-tight leading-none" style={{ fontSize: "3.5rem" }}>
              Discover Amazing<br />
              <span className="text-primary">Live Concerts</span> 🎸
            </h1>
            <p className="text-muted-foreground text-xl max-w-md leading-relaxed font-medium">
              Welcome back, <span className="text-foreground font-bold">{currentUser?.name}</span>! Explore the hottest concerts near you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map(({ label, value, icon: Icon, color, bg, emoji }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
            className="relative bg-white rounded-[1.5rem] border border-border p-6 shadow-sm group hover:shadow-xl hover:border-primary/20 transition-all duration-500"
          >
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <span className="text-3xl select-none">{emoji}</span>
            </div>
            <p className="text-4xl font-extrabold text-foreground mb-1 tracking-tight relative z-10">{value}</p>
            <p className="text-sm text-muted-foreground font-bold relative z-10 uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-[2rem] border border-border p-6 mb-8 relative z-20 shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concerts, artists, venues..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-accent/30 text-foreground placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="appearance-none px-5 py-4 pr-12 rounded-xl border border-border bg-accent/30 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm font-bold cursor-pointer"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-white text-foreground">{GENRE_EMOJIS[g]} {g}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="appearance-none px-5 py-4 pr-12 rounded-xl border border-border bg-accent/30 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm font-bold cursor-pointer"
              >
                <option value="All" className="bg-white text-foreground">💰 Any price</option>
                <option value="under100" className="bg-white text-foreground">Under $100</option>
                <option value="100-200" className="bg-white text-foreground">$100–$200</option>
                <option value="over200" className="bg-white text-foreground">Over $200</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filters */}
        <AnimatePresence>
          {isFiltered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center flex-wrap gap-2 mt-4 pt-4 border-t border-border"
            >
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active filters:</span>
              {search && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold">
                  "{search}"
                  <button onClick={() => setSearch("")} className="hover:text-foreground transition-colors">✕</button>
                </span>
              )}
              {genre !== "All" && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold">
                  {GENRE_EMOJIS[genre]} {genre}
                  <button onClick={() => setGenre("All")} className="hover:text-foreground transition-colors">✕</button>
                </span>
              )}
              {priceRange !== "All" && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold">
                  💰 {priceRange}
                  <button onClick={() => setPriceRange("All")} className="hover:text-foreground transition-colors">✕</button>
                </span>
              )}
              <button
                onClick={() => { setSearch(""); setGenre("All"); setPriceRange("All"); }}
                className="ml-auto text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-primary rounded-full shadow-lg shadow-primary/20" />
          <p className="text-muted-foreground font-medium">
            <span className="text-foreground font-black text-2xl">{filtered.length}</span>{" "}
            concerts found
          </p>
          {!isFiltered && (
            <span className="flex items-center gap-1.5 text-xs text-yellow-400 font-medium bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5" />
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
            className="text-center py-32 bg-white rounded-[2.5rem] border border-border shadow-sm"
          >
            <div className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border shadow-sm">
              <Music2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-foreground font-black text-2xl mb-2">No concerts found</p>
            <p className="text-muted-foreground text-sm mb-8 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
          <button
            onClick={() => { setSearch(""); setGenre("All"); setPriceRange("All"); }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white bg-primary shadow-lg shadow-primary/20 hover:scale-105 text-sm font-bold transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Show all concerts
          </button>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {paginatedConcerts.map((concert, i) => (
              <motion.div
                key={concert.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
              >
                <ConcertCard concert={concert} />
              </motion.div>
            ))}
          </div>
          
          {/* Shadcn-like Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-white text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      currentPage === i + 1 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "border border-border bg-white text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-white text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </PageTransition>
  );
}
