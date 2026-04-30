import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { ConcertCard } from "../components/ConcertCard";
import { PageTransition } from "../components/PageTransition";
import { Sparkles, Search, SlidersHorizontal, ArrowDownAz, Calendar, DollarSign, Ticket, X } from "lucide-react";

const CATEGORIES = ["All", "Pop", "Rock", "Jazz", "Hip Hop", "Classical"];

export function UserDashboard() {
  const { concerts } = useData();
  const visibleConcerts = concerts.filter(c => c.status !== "archived");
  const { currentUser } = useAuth();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeSort, setActiveSort] = useState("Newest");

  // Logic Filter & Sort
  const processedConcerts = visibleConcerts
    .filter(c => {
      const matchCat = activeCategory === "All" || c.genre.includes(activeCategory);
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (activeSort === "Price: Low to High") return a.price - b.price;
      if (activeSort === "Price: High to Low") return b.price - a.price;
      if (activeSort === "Nearest Date") return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  const isFiltered = activeCategory !== "All" || searchQuery !== "" || activeSort !== "Newest";
  const clearFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setActiveSort("Newest");
    setShowFilters(false);
  };

  return (
    <PageTransition className="relative min-h-screen bg-slate-50 pb-48 font-sans text-slate-900 selection:bg-primary/20 overflow-hidden">

      {/* BACKGROUND AURA */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 blur-[160px] rounded-full mix-blend-multiply opacity-40" />
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/20 blur-[160px] rounded-full mix-blend-multiply opacity-30" />
        <div className="absolute bottom-[0%] left-[20%] w-[60vw] h-[60vw] bg-cyan-400/20 blur-[160px] rounded-full mix-blend-multiply opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* HERO SECTION CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 hover:shadow-primary/30 bg-slate-900 border border-slate-800 transition-shadow duration-500 cursor-default"
        >
          {/* Animated Mesh Gradient */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div animate={{ x: [0, 80, 0], y: [0, -40, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-fuchsia-600 rounded-full mix-blend-screen blur-[120px] opacity-60 group-hover:scale-110 transition-transform duration-1000" />
            <motion.div animate={{ x: [0, -80, 0], y: [0, 80, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] right-[0%] w-[60%] h-[80%] bg-indigo-600 rounded-full mix-blend-screen blur-[130px] opacity-60 group-hover:scale-110 transition-transform duration-1000" />
            <motion.div animate={{ x: [0, 40, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-[20%] left-[20%] w-[40%] h-[60%] bg-rose-500 rounded-full mix-blend-screen blur-[100px] opacity-40 group-hover:scale-110 transition-transform duration-1000" />
            <motion.div animate={{ x: [0, -40, 0], y: [0, -40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[0%] right-[30%] w-[30%] h-[50%] bg-cyan-400 rounded-full mix-blend-screen blur-[100px] opacity-40 group-hover:scale-110 transition-transform duration-1000" />

            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[40px]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity duration-500" />
          </div>

          {/* Konten Hero */}
          <div className="relative z-10 p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Kiri: Teks & Typografi */}
            <div className="w-full lg:w-3/5 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-black text-white border border-white/10 shadow-lg uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" /> Premium Access
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-5 text-white">
                Ready to rock, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-fuchsia-200 to-indigo-200 drop-shadow-sm">
                  {currentUser?.name?.split(' ')[0] || "Guest"}?
                </span> 🎸
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 group-hover:text-white transition-colors duration-500">
                Discover electrifying live events, exclusive presales, and unforgettable moments happening around you.
              </motion.p>
            </div>

            {/* Kanan: Dekorasi VIP Ticket */}
            <div className="hidden lg:flex w-2/5 justify-end relative perspective-1000">

              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative z-20">
                <div className="w-64 h-40 rounded-2xl bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-xl border border-white/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] p-6 flex flex-col justify-between -rotate-6 group-hover:rotate-0 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500 ease-out">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner group-hover:bg-white/30 transition-colors">
                      <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-black text-white uppercase tracking-widest border border-white/10">VIP Pass</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-white/30 rounded-full" />
                    <div className="h-2 w-1/2 bg-white/20 rounded-full" />
                  </div>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute -right-4 -bottom-6 z-10">
                <div className="w-64 h-40 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rotate-6 group-hover:rotate-12 group-hover:translate-x-6 group-hover:translate-y-2 transition-all duration-500 ease-out" />
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* CONTROLS (Pill Tabs & Search) */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

            {/* Floating Pill Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap outline-none flex-shrink-0 ${isActive ? "text-white" : "text-slate-500 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white hover:text-slate-900 shadow-sm"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePillTab"
                        className="absolute inset-0 bg-slate-900 rounded-full shadow-md"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar & Filter Toggle */}
            <div className="flex items-center gap-3 w-full lg:w-auto relative">
              <div className="relative w-full lg:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search artists, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all placeholder:font-medium placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border shadow-sm transition-all flex-shrink-0 flex items-center justify-center ${showFilters
                  ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-white/80 backdrop-blur-md border-slate-200 text-slate-500 hover:text-primary hover:bg-white"
                  }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10, filter: "blur(10px)" }}
                animate={{ opacity: 1, height: "auto", y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, height: 0, y: -10, filter: "blur(10px)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 mr-2">
                    <ArrowDownAz className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sort By</span>
                  </div>
                  {["Newest", "Price: Low to High", "Price: High to Low", "Nearest Date"].map((sortOption) => (
                    <button
                      key={sortOption}
                      onClick={() => setActiveSort(sortOption)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSort === sortOption
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-white hover:border-slate-300"
                        }`}
                    >
                      {sortOption.includes("Price") ? <DollarSign className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                      {sortOption.replace("Price: ", "")}
                    </button>
                  ))}
                </div>

                {/* Clear Filter Button */}
                {isFiltered && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-lg transition-colors sm:ml-auto"
                  >
                    <X className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MASONRY/GRID ANIMATION */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {processedConcerts.map((concert, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                key={concert.id}
                className="h-full"
              >
                <ConcertCard concert={concert} />
              </motion.div>
            ))}
          </AnimatePresence>

          {processedConcerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-32 text-center bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-sm"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No concerts found</h3>
              <p className="text-slate-500 font-bold mb-6">We couldn't find anything matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}