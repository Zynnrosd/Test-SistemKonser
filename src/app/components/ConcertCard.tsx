import { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Calendar, MapPin, Users } from "lucide-react";
import { Concert } from "../data/mockData";
import { StatusBadge } from "./StatusBadge";

interface ConcertCardProps {
  concert: Concert;
  showActions?: boolean;
}

export function ConcertCard({ concert, showActions = true }: ConcertCardProps) {
  const soldOut = concert.availableSeats === 0;
  const fillPercent = Math.round(((concert.capacity - concert.availableSeats) / concert.capacity) * 100);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(99,102,241,0.15)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={concert.image}
          alt={concert.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={soldOut ? "sold out" : concert.status} />
        </div>
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
          <span className="text-indigo-600" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
            ${concert.price.toFixed(2)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-xs text-white/90 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
            {concert.genre}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-gray-900 mb-0.5 line-clamp-1" style={{ fontWeight: 600, fontSize: "1rem" }}>
          {concert.title}
        </h3>
        <p className="text-indigo-500 text-sm mb-3" style={{ fontWeight: 500 }}>
          {concert.artist}
        </p>

        <div className="space-y-1.5 mb-4">
          <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} text={`${concert.date} · ${concert.time}`} />
          <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} text={`${concert.venue}, ${concert.city}`} />
          <InfoRow icon={<Users className="w-3.5 h-3.5" />} text={`${concert.availableSeats.toLocaleString()} seats left`} />
        </div>

        {/* Seat fill bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Capacity</span>
            <span>{fillPercent}% sold</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className={`h-full rounded-full ${
                fillPercent > 90 ? "bg-red-400" : fillPercent > 70 ? "bg-amber-400" : "bg-indigo-400"
              }`}
            />
          </div>
        </div>

        {showActions && (
          <div className="mt-auto">
            {concert.status === "archived" ? (
              <div className="w-full text-center py-2.5 text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                Unavailable
              </div>
            ) : soldOut ? (
              <div className="w-full text-center py-2.5 text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                Sold Out
              </div>
            ) : (
              <Link
                to={`/concerts/${concert.id}`}
                className="block w-full text-center py-2.5 text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl hover:from-indigo-600 hover:to-violet-700 transition-all shadow-sm"
                style={{ fontWeight: 500 }}
              >
                View Details
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="text-xs truncate">{text}</span>
    </div>
  );
}