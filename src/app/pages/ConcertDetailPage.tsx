import { ReactNode, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  Calendar, MapPin, Users, Tag, Clock,
  ArrowLeft, Ticket, Info, ChevronRight, Heart,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

export function ConcertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getConcert } = useData();
  const navigate = useNavigate();
  const concert = getConcert(id!);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!concert) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Concert not found.</p>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-indigo-600 text-sm hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const soldOut = concert.availableSeats === 0;
  const fillPercent = Math.round(((concert.capacity - concert.availableSeats) / concert.capacity) * 100);

  return (
    <PageTransition className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Concerts
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 truncate max-w-xs">{concert.title}</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left */}
        <div className="lg:col-span-3 space-y-5">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl overflow-hidden h-72 sm:h-80 shadow-md"
          >
            <img src={concert.image} alt={concert.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            {/* Top row: status + favorite */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <StatusBadge status={soldOut ? "sold out" : concert.status} size="md" />
              <motion.button
                onClick={() => setIsFavorited((v) => !v)}
                whileTap={{ scale: 0.85 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isFavorited
                    ? "bg-rose-500 text-white"
                    : "bg-white/90 backdrop-blur-sm text-gray-500 hover:text-rose-500"
                }`}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h1 className="text-white font-bold text-2xl leading-tight mb-1">{concert.title}</h1>
              <p className="text-indigo-300 font-medium">{concert.artist}</p>
            </div>
          </motion.div>

          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-indigo-400" />
              <h2 className="text-gray-900 font-semibold text-sm">About this event</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{concert.description}</p>
          </div>

          {/* Event details grid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-gray-900 font-semibold text-sm mb-4">Event Details</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <DetailItem icon={<Calendar className="w-4 h-4 text-indigo-400" />} label="Date" value={concert.date} />
              <DetailItem icon={<Clock className="w-4 h-4 text-indigo-400" />} label="Time" value={concert.time} />
              <DetailItem icon={<MapPin className="w-4 h-4 text-indigo-400" />} label="Venue" value={concert.venue} />
              <DetailItem icon={<MapPin className="w-4 h-4 text-violet-400" />} label="City" value={concert.city} />
              <DetailItem icon={<Tag className="w-4 h-4 text-emerald-400" />} label="Genre" value={concert.genre} />
              <DetailItem icon={<Users className="w-4 h-4 text-amber-400" />} label="Capacity" value={`${concert.capacity.toLocaleString()} total`} />
            </div>
          </div>
        </div>

        {/* Right: Booking card */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-5"
          >
            {/* Price */}
            <div className="flex items-end justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Starting from</p>
                <p className="text-gray-900 font-bold" style={{ fontSize: "1.9rem" }}>
                  ${concert.price.toFixed(2)}
                </p>
              </div>
              <span className="text-xs text-gray-400 pb-1">+ fees</span>
            </div>

            {/* Availability bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Availability</span>
                <span className={`font-medium ${soldOut ? "text-red-500" : concert.availableSeats < 100 ? "text-amber-500" : "text-emerald-500"}`}>
                  {soldOut ? "Sold Out" : `${concert.availableSeats.toLocaleString()} left`}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercent}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    fillPercent > 90 ? "bg-red-400" : fillPercent > 70 ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{fillPercent}% sold</p>
            </div>

            {/* Quick info pills */}
            <div className="flex flex-wrap gap-2">
              <InfoPill icon={<Calendar className="w-3 h-3" />} label={concert.date} />
              <InfoPill icon={<Clock className="w-3 h-3" />} label={concert.time} />
              <InfoPill icon={<MapPin className="w-3 h-3" />} label={concert.city} />
            </div>

            {/* Seat category teaser */}
            <div className="flex gap-2 text-xs">
              {["Regular", "VIP", "VVIP"].map((cat) => (
                <span key={cat} className={`px-2 py-1 rounded-lg font-medium ${
                  cat === "VVIP" ? "bg-amber-50 text-amber-600" :
                  cat === "VIP" ? "bg-indigo-50 text-indigo-600" :
                  "bg-gray-50 text-gray-500"
                }`}>{cat}</span>
              ))}
            </div>

            {/* CTA */}
            {concert.status === "archived" ? (
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-400">This event is no longer available.</p>
              </div>
            ) : soldOut ? (
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 font-medium">This event is sold out.</p>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(`/booking/${concert.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-indigo-200/50 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  Book Tickets
                </motion.button>
                {/* Favorite shortcut */}
                <button
                  onClick={() => setIsFavorited((v) => !v)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    isFavorited
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current text-rose-500" : ""}`} />
                  {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
                </button>
              </>
            )}

            <p className="text-xs text-gray-400 text-center">Secure checkout · Instant confirmation</p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function DetailItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
      <span className="text-gray-400">{icon}</span>
      {label}
    </div>
  );
}