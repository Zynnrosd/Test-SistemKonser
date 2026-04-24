import { useState } from "react";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, Music2, Ticket, TrendingUp } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { ConcertCard } from "../components/ConcertCard";
import { PageTransition } from "../components/PageTransition";

const GENRES = ["All", "Rock / Alternative", "Electronic / House", "Jazz / Neo-Soul", "Classical / Orchestral", "Pop / Indie", "Folk / Indie", "Synthwave / Electronic", "Multi-Genre / Festival"];

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
    { label: "Available Concerts", value: activeConcerts.length, icon: Music2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "My Bookings", value: userTickets.length, icon: Ticket, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Upcoming Events", value: activeConcerts.filter(c => new Date(c.date) > new Date()).length, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.75rem" }}>
          Discover Concerts
        </h1>
        <p className="text-gray-500 text-sm">
          Welcome back, <span className="text-indigo-600" style={{ fontWeight: 500 }}>{currentUser?.name}</span>! Find your next live music experience.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl text-gray-900 mb-0.5" style={{ fontWeight: 700 }}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concerts, artists, venues..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            >
              <option value="All">Any price</option>
              <option value="under100">Under $100</option>
              <option value="100-200">$100–$200</option>
              <option value="over200">Over $200</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          <span className="text-gray-900" style={{ fontWeight: 600 }}>{filtered.length}</span> concerts found
        </p>
        {(search || genre !== "All" || priceRange !== "All") && (
          <button
            onClick={() => { setSearch(""); setGenre("All"); setPriceRange("All"); }}
            className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Music2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No concerts match your search.</p>
          <button
            onClick={() => { setSearch(""); setGenre("All"); setPriceRange("All"); }}
            className="mt-3 text-indigo-600 text-sm hover:underline"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((concert, i) => (
            <motion.div
              key={concert.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <ConcertCard concert={concert} />
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
