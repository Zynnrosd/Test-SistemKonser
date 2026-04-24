import { useState, ReactNode, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  Pencil,
  Archive,
  RotateCcw,
  Trash2,
  X,
  Music2,
  AlertTriangle,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { Concert } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

type FilterStatus = "all" | "active" | "archived";

const EMPTY_FORM = {
  title: "",
  artist: "",
  genre: "",
  venue: "",
  city: "",
  date: "",
  time: "08:00 PM",
  price: "",
  capacity: "",
  availableSeats: "",
  image: "",
  description: "",
  status: "active" as "active" | "archived",
};

export function AdminConcertsPage() {
  const { concerts, addConcert, updateConcert, softDeleteConcert, restoreConcert, hardDeleteConcert } = useData();

  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = concerts.filter((c) => {
    const matchFilter = filter === "all" || c.status === filter;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.artist.toLowerCase().includes(search.toLowerCase()) ||
      c.venue.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const openCreate = () => {
    setEditingConcert(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (concert: Concert) => {
    setEditingConcert(concert);
    setForm({
      title: concert.title,
      artist: concert.artist,
      genre: concert.genre,
      venue: concert.venue,
      city: concert.city,
      date: concert.date,
      time: concert.time,
      price: String(concert.price),
      capacity: String(concert.capacity),
      availableSeats: String(concert.availableSeats),
      image: concert.image,
      description: concert.description,
      status: concert.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      capacity: parseInt(form.capacity),
      availableSeats: parseInt(form.availableSeats),
    };
    if (editingConcert) {
      updateConcert(editingConcert.id, data);
    } else {
      addConcert(data);
    }
    setModalOpen(false);
  };

  const handleField = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageTransition className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.75rem" }}>
            Manage Concerts
          </h1>
          <p className="text-gray-500 text-sm">
            {concerts.length} total · {concerts.filter(c => c.status === "active").length} active · {concerts.filter(c => c.status === "archived").length} archived
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-sm transition-all text-sm"
          style={{ fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" />
          Add Concert
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, artist, venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["all", "active", "archived"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-all capitalize ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontWeight: filter === f ? 500 : 400 }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs text-gray-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Concert
                </th>
                <th className="px-5 py-3.5 text-left text-xs text-gray-400 uppercase tracking-wider hidden sm:table-cell" style={{ fontWeight: 600 }}>
                  Date & Venue
                </th>
                <th className="px-5 py-3.5 text-left text-xs text-gray-400 uppercase tracking-wider hidden md:table-cell" style={{ fontWeight: 600 }}>
                  Price
                </th>
                <th className="px-5 py-3.5 text-left text-xs text-gray-400 uppercase tracking-wider hidden lg:table-cell" style={{ fontWeight: 600 }}>
                  Seats
                </th>
                <th className="px-5 py-3.5 text-left text-xs text-gray-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-xs text-gray-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Music2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No concerts found</p>
                  </td>
                </tr>
              )}
              {filtered.map((concert, i) => (
                <motion.tr
                  key={concert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={concert.image}
                        alt={concert.title}
                        className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 truncate max-w-[180px]" style={{ fontWeight: 500 }}>
                          {concert.title}
                        </p>
                        <p className="text-xs text-indigo-500">{concert.artist}</p>
                        <p className="text-xs text-gray-400 sm:hidden">{concert.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-sm text-gray-700">{concert.date}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{concert.venue}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                      ${concert.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div>
                      <span className="text-sm text-gray-700">{concert.availableSeats.toLocaleString()}</span>
                      <span className="text-xs text-gray-400"> / {concert.capacity.toLocaleString()}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full mt-1.5 w-20">
                      <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{
                          width: `${((concert.capacity - concert.availableSeats) / concert.capacity) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={concert.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <ActionBtn
                        icon={<Pencil className="w-3.5 h-3.5" />}
                        label="Edit"
                        onClick={() => openEdit(concert)}
                        color="text-indigo-600 hover:bg-indigo-50"
                      />
                      {concert.status === "active" ? (
                        <ActionBtn
                          icon={<Archive className="w-3.5 h-3.5" />}
                          label="Archive"
                          onClick={() => softDeleteConcert(concert.id)}
                          color="text-amber-600 hover:bg-amber-50"
                        />
                      ) : (
                        <ActionBtn
                          icon={<RotateCcw className="w-3.5 h-3.5" />}
                          label="Restore"
                          onClick={() => restoreConcert(concert.id)}
                          color="text-emerald-600 hover:bg-emerald-50"
                        />
                      )}
                      <ActionBtn
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                        label="Delete"
                        onClick={() => setDeleteConfirm(concert.id)}
                        color="text-red-500 hover:bg-red-50"
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <Modal title={editingConcert ? "Edit Concert" : "Add New Concert"} onClose={() => setModalOpen(false)}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Concert Title" required>
                  <input
                    value={form.title}
                    onChange={(e) => handleField("title", e.target.value)}
                    required
                    placeholder="e.g. Neon Horizons Tour"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Artist / Band" required>
                  <input
                    value={form.artist}
                    onChange={(e) => handleField("artist", e.target.value)}
                    required
                    placeholder="e.g. The Midnight"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Genre">
                  <input
                    value={form.genre}
                    onChange={(e) => handleField("genre", e.target.value)}
                    placeholder="e.g. Synthwave / Electronic"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Venue" required>
                  <input
                    value={form.venue}
                    onChange={(e) => handleField("venue", e.target.value)}
                    required
                    placeholder="e.g. Madison Square Garden"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="City" required>
                  <input
                    value={form.city}
                    onChange={(e) => handleField("city", e.target.value)}
                    required
                    placeholder="e.g. New York, NY"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Date" required>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleField("date", e.target.value)}
                    required
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Time">
                  <input
                    value={form.time}
                    onChange={(e) => handleField("time", e.target.value)}
                    placeholder="e.g. 08:00 PM"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Price ($)" required>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleField("price", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g. 89.99"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Total Capacity" required>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => handleField("capacity", e.target.value)}
                    required
                    min="1"
                    placeholder="e.g. 5000"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Available Seats" required>
                  <input
                    type="number"
                    value={form.availableSeats}
                    onChange={(e) => handleField("availableSeats", e.target.value)}
                    required
                    min="0"
                    placeholder="e.g. 1230"
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => handleField("status", e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
                <Field label="Image URL">
                  <input
                    value={form.image}
                    onChange={(e) => handleField("image", e.target.value)}
                    placeholder="https://..."
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => handleField("description", e.target.value)}
                  rows={3}
                  placeholder="Describe the concert..."
                  className={INPUT_CLASS + " resize-none"}
                />
              </Field>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-all"
                  style={{ fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-sm shadow-sm transition-all"
                  style={{ fontWeight: 600 }}
                >
                  {editingConcert ? "Save Changes" : "Create Concert"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <Modal title="Confirm Permanent Delete" onClose={() => setDeleteConfirm(null)} danger>
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                This will <span className="text-red-600" style={{ fontWeight: 600 }}>permanently delete</span> this concert and all its data. This action <span style={{ fontWeight: 600 }}>cannot be undone</span>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-all"
                  style={{ fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { hardDeleteConcert(deleteConfirm!); setDeleteConfirm(null); }}
                  className="flex-1 py-2.5 rounded-xl text-white bg-red-500 hover:bg-red-600 text-sm shadow-sm transition-all"
                  style={{ fontWeight: 600 }}
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

// Shared sub-components
const INPUT_CLASS =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all";

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function ActionBtn({
  icon, label, onClick, color,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={label}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${color}`}
    >
      {icon}
    </motion.button>
  );
}

function Modal({
  title,
  onClose,
  children,
  danger = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className={`${danger ? "text-red-600" : "text-gray-900"}`} style={{ fontWeight: 600, fontSize: "1rem" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}