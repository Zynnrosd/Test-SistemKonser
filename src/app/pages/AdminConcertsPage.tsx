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
import { useData, Concert } from "../context/DataContext";
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
      status: concert.status === "sold_out" ? "active" : (concert.status as "active" | "archived"),
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground tracking-tighter" style={{ fontWeight: 900, fontSize: "2.5rem" }}>
            Concerts
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {concerts.length} TOTAL
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
              {concerts.filter(c => c.status === "active" && c.availableSeats > 0).length} ACTIVE
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-200">
              {concerts.filter(c => c.status === "active" && c.availableSeats === 0).length} SOLD OUT
            </span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white bg-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all text-sm font-black"
        >
          <Plus className="w-5 h-5" />
          Add Concert
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm p-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, artist, venue..."
            className="w-full pl-12 pr-5 py-3 rounded-2xl border border-border bg-accent text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
        <div className="flex gap-1 bg-accent rounded-2xl p-1.5 border border-border">
          {(["all", "active", "archived"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-sm transition-all capitalize font-bold ${filter === f
                ? "bg-white text-primary shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                <th className="px-6 py-4 text-left text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                  Concert
                </th>
                <th className="px-6 py-4 text-left text-[10px] text-muted-foreground uppercase tracking-widest font-black hidden sm:table-cell">
                  Date & Venue
                </th>
                <th className="px-6 py-4 text-left text-[10px] text-muted-foreground uppercase tracking-widest font-black hidden md:table-cell">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-[10px] text-muted-foreground uppercase tracking-widest font-black hidden lg:table-cell">
                  Seats
                </th>
                <th className="px-6 py-4 text-left text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[10px] text-muted-foreground uppercase tracking-widest font-black">
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
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={concert.image}
                        alt={concert.title}
                        className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-sm"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate max-w-[220px] font-black tracking-tight">
                          {concert.title}
                        </p>
                        <p className="text-xs text-primary font-bold">{concert.artist}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest sm:hidden mt-1">{concert.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden sm:table-cell">
                    <p className="text-sm text-foreground font-bold">{concert.date}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px] font-medium">{concert.venue}</p>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">
                    <span className="text-base text-foreground font-black tracking-tight">
                      ${concert.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-5 hidden lg:table-cell">
                    <div>
                      <span className="text-sm text-foreground font-bold">{concert.availableSeats.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground font-medium"> / {concert.capacity.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-accent rounded-full mt-2 w-24 overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                        style={{
                          width: `${((concert.capacity - concert.availableSeats) / concert.capacity) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={concert.status === "archived" ? "archived" : (concert.availableSeats === 0 ? "sold out" : "active")} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <ActionBtn
                        icon={<Pencil className="w-4 h-4" />}
                        label="Edit"
                        onClick={() => openEdit(concert)}
                        color="text-primary hover:bg-primary/10"
                      />
                      {concert.status === "active" ? (
                        <ActionBtn
                          icon={<Archive className="w-4 h-4" />}
                          label="Archive"
                          onClick={() => softDeleteConcert(concert.id)}
                          color="text-amber-600 hover:bg-amber-100"
                        />
                      ) : (
                        <ActionBtn
                          icon={<RotateCcw className="w-4 h-4" />}
                          label="Restore"
                          onClick={() => restoreConcert(concert.id)}
                          color="text-emerald-600 hover:bg-emerald-100"
                        />
                      )}
                      <ActionBtn
                        icon={<Trash2 className="w-4 h-4" />}
                        label="Delete"
                        onClick={() => setDeleteConfirm(concert.id)}
                        color="text-rose-500 hover:bg-rose-100"
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
                  className="flex-1 py-3 rounded-2xl border border-border text-muted-foreground hover:bg-accent text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl text-white bg-primary text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all font-black"
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
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-2xl border border-border text-muted-foreground hover:bg-accent text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { hardDeleteConcert(deleteConfirm!); setDeleteConfirm(null); }}
                  className="flex-1 py-3 rounded-2xl text-white bg-rose-500 hover:bg-rose-600 text-sm shadow-xl shadow-rose-500/20 font-black transition-all"
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
  "w-full px-4 py-3 rounded-2xl border border-border bg-accent text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium";

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] text-muted-foreground mb-2 font-black uppercase tracking-widest">
        {label} {required && <span className="text-rose-500">*</span>}
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
        className="bg-white rounded-[2.5rem] shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <h2 className={`${danger ? "text-rose-600" : "text-foreground"} font-black text-xl tracking-tight`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all border border-border shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}