import { useState, ReactNode, FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Search, Pencil, Archive, RotateCcw, Trash2, X, Music2, AlertTriangle,
  MapPin, Calendar, Clock, DollarSign, Users, Tag, Image as ImageIcon, AlignLeft, Mic2,
  Info, LayoutDashboard
} from "lucide-react";
import { useData, Concert } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { PageTransition } from "../components/PageTransition";

type FilterStatus = "all" | "active" | "archived" | "sold_out";

const GENRES = ["Pop", "Rock", "Jazz", "Hip Hop", "Classical"];

const EMPTY_FORM = {
  title: "", artist: "", genre: GENRES[0], venue: "", city: "", date: "", time: "08:00 PM",
  price: "", capacity: "", image: "", description: "",
  status: "active" as "active" | "archived" | "sold_out",
};

export function AdminConcertsPage() {
  const { concerts, addConcert, updateConcert, softDeleteConcert, restoreConcert, hardDeleteConcert } = useData();

  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

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
      title: concert.title, artist: concert.artist, genre: concert.genre,
      venue: concert.venue, city: concert.city, date: concert.date, time: concert.time,
      price: String(concert.price), capacity: String(concert.capacity),
      image: concert.image, description: concert.description, status: concert.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const capacityInt = parseInt(form.capacity);

    let finalAvailableSeats = capacityInt;
    let finalStatus = form.status;

    if (editingConcert) {
      // Menghitung selisih kapasitas baru dikurangi kapasitas lama
      const capacityDiff = capacityInt - editingConcert.capacity;
      // Menambahkan selisih tersebut ke sisa kursi yang ada saat ini
      finalAvailableSeats = editingConcert.availableSeats + capacityDiff;
      // Validasi agar tidak ada kursi yang mines
      if (finalAvailableSeats < 0) finalAvailableSeats = 0;

      // Auto-update status konser berdasarkan ketersediaan kursi
      if (finalAvailableSeats > 0 && finalStatus === "sold_out") {
        finalStatus = "active";
      } else if (finalAvailableSeats === 0) {
        finalStatus = "sold_out";
      }
    }

    const data = {
      ...form,
      price: parseFloat(form.price),
      capacity: capacityInt,
      availableSeats: finalAvailableSeats,
      status: finalStatus
    };

    editingConcert ? updateConcert(editingConcert.id, data) : addConcert(data);
    setModalOpen(false);
  };

  const handleField = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageTransition className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">Concerts</h1>
          <p className="text-slate-500 text-sm mb-3 max-w-lg">
            Manage your event catalog, adjust pricing, and track seat availability in real-time.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge count={concerts.length} label="TOTAL" color="bg-slate-100 text-slate-600" />
            <Badge count={concerts.filter(c => c.status === "active").length} label="ACTIVE" color="bg-emerald-50 text-emerald-600" />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white bg-slate-900 shadow-lg shadow-slate-900/10 hover:bg-primary transition-all font-bold text-sm"
        >
          <Plus className="w-4 h-4" /> Add Concert
        </motion.button>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, artist, venue..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-none bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
        <div className="flex w-full md:w-auto gap-1 bg-slate-50 rounded-xl p-1 border border-slate-200/50 overflow-x-auto hide-scrollbar">
          {(["all", "active", "sold_out", "archived"] as FilterStatus[]).map((f) => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all uppercase tracking-wider font-bold ${filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* CONCERT LIST */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((concert, i) => (
          <motion.div
            key={concert.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-5 relative"
          >
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                <img src={concert.image} alt={concert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base text-slate-900 font-bold tracking-tight truncate">{concert.title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] text-primary font-bold uppercase tracking-wider">{concert.artist}</p>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <p className="text-[11px] text-slate-500 font-medium">{concert.genre}</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 flex-1 text-slate-500">
              <MapPin className="w-4 h-4 text-slate-300" />
              <p className="text-sm font-semibold truncate">{concert.venue}</p>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-6 pr-2">
              <div className="text-right">
                <span className="block text-lg text-slate-900 font-extrabold tracking-tight mb-1">${concert.price}</span>
                <StatusBadge status={concert.status} />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                <ActionBtn icon={<Pencil className="w-4 h-4" />} onClick={() => openEdit(concert)} color="text-slate-600 hover:bg-white" />
                {concert.status !== "archived" ? (
                  <ActionBtn icon={<Archive className="w-4 h-4" />} onClick={() => softDeleteConcert(concert.id)} color="text-amber-600 hover:bg-white" />
                ) : (
                  <ActionBtn icon={<RotateCcw className="w-4 h-4" />} onClick={() => restoreConcert(concert.id)} color="text-emerald-600 hover:bg-white" />
                )}
                <ActionBtn icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteConfirm(concert.id)} color="text-rose-500 hover:bg-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL FORM */}
      <AnimatePresence>
        {modalOpen && (
          <Modal title={editingConcert ? "Modify Concert" : "New Experience"} onClose={() => setModalOpen(false)}>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Section: Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Info className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Basic Information</h3>
                </div>
                <Field label="Concert Title" icon={<Music2 className="w-3 h-3" />} required>
                  <input value={form.title} onChange={(e) => handleField("title", e.target.value)} required placeholder="Tour Name" className={INPUT_CLASS} />
                </Field>
                <Field label="Artist Name" icon={<Mic2 className="w-3 h-3" />} required>
                  <input value={form.artist} onChange={(e) => handleField("artist", e.target.value)} required placeholder="Main Performer" className={INPUT_CLASS} />
                </Field>
                <Field label="Music Genre" icon={<Tag className="w-3 h-3" />}>
                  <select value={form.genre} onChange={(e) => handleField("genre", e.target.value)} className={INPUT_CLASS}>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>

                {editingConcert && (
                  <Field label="Current Status" icon={<LayoutDashboard className="w-3 h-3" />}>
                    <select value={form.status} onChange={(e) => handleField("status", e.target.value)} className={INPUT_CLASS}>
                      <option value="active">Active</option>
                      <option value="sold_out">Sold Out</option>
                      <option value="archived">Archived</option>
                    </select>
                  </Field>
                )}
              </div>

              {/* Section: Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full flex items-center gap-2 border-b border-slate-100 pb-2 pt-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Logistics</h3>
                </div>
                <Field label="Venue" icon={<MapPin className="w-3 h-3" />} required>
                  <input value={form.venue} onChange={(e) => handleField("venue", e.target.value)} required placeholder="Arena/Stadium" className={INPUT_CLASS} />
                </Field>
                <Field label="City" icon={<MapPin className="w-3 h-3" />} required>
                  <input value={form.city} onChange={(e) => handleField("city", e.target.value)} required placeholder="City Location" className={INPUT_CLASS} />
                </Field>
                <Field label="Show Date" icon={<Calendar className="w-3 h-3" />} required>
                  <input type="date" min={todayStr} value={form.date} onChange={(e) => handleField("date", e.target.value)} required className={INPUT_CLASS} />
                </Field>
                <Field label="Start Time" icon={<Clock className="w-3 h-3" />}>
                  <input value={form.time} onChange={(e) => handleField("time", e.target.value)} placeholder="08:00 PM" className={INPUT_CLASS} />
                </Field>
              </div>

              {/* Section: Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full flex items-center gap-2 border-b border-slate-100 pb-2 pt-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sales</h3>
                </div>
                <Field label="Base Price ($)" icon={<DollarSign className="w-3 h-3" />} required>
                  <input type="number" value={form.price} onChange={(e) => handleField("price", e.target.value)} required min="0" step="0.01" className={INPUT_CLASS} />
                </Field>
                <Field label="Max Capacity" icon={<Users className="w-3 h-3" />} required>
                  <input type="number" value={form.capacity} onChange={(e) => handleField("capacity", e.target.value)} required min="1" placeholder="Total Seats" className={INPUT_CLASS} />
                </Field>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <Field label="Poster Image URL" icon={<ImageIcon className="w-3 h-3" />}><input value={form.image} onChange={(e) => handleField("image", e.target.value)} placeholder="https://..." className={INPUT_CLASS} /></Field>
                <Field label="About the Event" icon={<AlignLeft className="w-3 h-3" />}><textarea value={form.description} onChange={(e) => handleField("description", e.target.value)} rows={3} className={INPUT_CLASS + " resize-none"} placeholder="What makes this concert special?" /></Field>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl text-white bg-slate-900 shadow-md shadow-slate-900/10 font-bold text-sm hover:bg-primary transition-all">
                  {editingConcert ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {deleteConfirm && (
          <Modal title="System Warning" onClose={() => setDeleteConfirm(null)}>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">Delete Permanently?</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
                This action will remove all concert data from our database. This cannot be recovered.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 transition-all hover:bg-slate-50">Cancel</button>
                <button
                  onClick={() => { hardDeleteConcert(deleteConfirm); setDeleteConfirm(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20 hover:bg-rose-600"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

// Helpers
const INPUT_CLASS = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium";

function Badge({ count, label, color }: { count: number, label: string, color: string }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/10 ${color}`}>
      <span className="text-xs font-bold">{count}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</span>
    </div>
  );
}

function Field({ label, required, children, icon }: { label: string; required?: boolean; children: ReactNode; icon?: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider ml-1">
        {icon} {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function ActionBtn({ icon, onClick, color }: { icon: ReactNode; onClick: () => void; color: string; }) {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${color} shadow-sm border border-current/5`}>
      {icon}
    </motion.button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode; }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-slate-900 font-extrabold text-lg tracking-tight">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto hide-scrollbar">{children}</div>
      </motion.div>
    </motion.div>
  );
}