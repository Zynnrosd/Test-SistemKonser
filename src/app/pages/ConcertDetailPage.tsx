import { ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
  ArrowLeft,
  Ticket,
  Info,
  ChevronRight,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

export function ConcertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getConcert } = useData();
  const navigate = useNavigate();
  const concert = getConcert(id!);

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
        {/* Left: Image + Info */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl overflow-hidden h-72 sm:h-80"
          >
            <img
              src={concert.image}
              alt={concert.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <StatusBadge status={soldOut ? "sold out" : concert.status} size="md" />
                  <h1 className="text-white mt-2" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                    {concert.title}
                  </h1>
                  <p className="text-indigo-300" style={{ fontWeight: 500 }}>
                    {concert.artist}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-indigo-500" />
              <h2 className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                About this event
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{concert.description}</p>
          </div>

          {/* Event details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-gray-900 mb-4" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Event Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <DetailItem icon={<Calendar className="w-4 h-4 text-indigo-500" />} label="Date" value={concert.date} />
              <DetailItem icon={<Clock className="w-4 h-4 text-indigo-500" />} label="Time" value={concert.time} />
              <DetailItem icon={<MapPin className="w-4 h-4 text-indigo-500" />} label="Venue" value={concert.venue} />
              <DetailItem icon={<MapPin className="w-4 h-4 text-violet-500" />} label="City" value={concert.city} />
              <DetailItem icon={<Tag className="w-4 h-4 text-emerald-500" />} label="Genre" value={concert.genre} />
              <DetailItem
                icon={<Users className="w-4 h-4 text-amber-500" />}
                label="Capacity"
                value={`${concert.capacity.toLocaleString()} total`}
              />
            </div>
          </div>
        </div>

        {/* Right: Booking card */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-lg p-6 space-y-5"
          >
            {/* Price */}
            <div className="flex items-end justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 mb-1">Price per ticket</p>
                <p className="text-gray-900" style={{ fontWeight: 800, fontSize: "2rem" }}>
                  ${concert.price.toFixed(2)}
                </p>
              </div>
              <span className="text-xs text-gray-400">+ fees</span>
            </div>

            {/* Availability */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Seats Available</span>
                <span className={soldOut ? "text-red-500" : concert.availableSeats < 100 ? "text-amber-500" : "text-emerald-500"} style={{ fontWeight: 600 }}>
                  {soldOut ? "Sold Out" : `${concert.availableSeats.toLocaleString()} left`}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercent}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    fillPercent > 90 ? "bg-red-400" : fillPercent > 70 ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{fillPercent}% of tickets sold</p>
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2">
              <InfoPill icon={<Calendar className="w-3 h-3" />} label={concert.date} />
              <InfoPill icon={<Clock className="w-3 h-3" />} label={concert.time} />
              <InfoPill icon={<MapPin className="w-3 h-3" />} label={concert.city} />
            </div>

            {/* CTA */}
            {concert.status === "archived" ? (
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-400">This event is no longer available.</p>
              </div>
            ) : soldOut ? (
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-500" style={{ fontWeight: 500 }}>This event is sold out.</p>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/booking/${concert.id}`)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-200 transition-all"
                style={{ fontWeight: 600 }}
              >
                <Ticket className="w-4 h-4" />
                Book Tickets
              </motion.button>
            )}

            <p className="text-xs text-gray-400 text-center">
              Secure checkout · Instant confirmation
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function DetailItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
      <span className="text-gray-400">{icon}</span>
      {label}
    </div>
  );
}