import { useState } from "react";
import { User, Mail, ShieldCheck, Settings, Save, X, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";
import { supabase } from "../../lib/supabase";

export function ProfilePage() {
  const { currentUser, isAdmin } = useAuth();

  // HAPUS BARIS INI: const navigate = useNavigate(); <-- Ini yang bikin error tadi!

  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menyimpan perubahan ke Supabase
  const handleSave = async () => {
    if (!name.trim() || name === currentUser?.name) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Update tabel profiles saja
      const { error } = await supabase
        .from('profiles')
        .update({ name: name })
        .eq('id', currentUser?.id);

      if (error) throw error;

      // 2. Gunakan reload biasa agar foto dan nama di Navbar langsung terupdate dengan mulus
      window.location.reload();

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal menyimpan profil. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-32 bg-slate-900">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-3xl">
                {currentUser?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentUser?.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {/* Badge dinamis berdasarkan Role */}
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" /> System Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
                    <User className="w-3 h-3" /> Verified User
                  </span>
                )}
                <span className="text-slate-400 text-sm font-medium">{currentUser?.email}</span>
              </div>
            </div>

            {/* Tombol Aksi dinamis (Edit / Save / Cancel) */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setName(currentUser?.name || ""); // Kembalikan nama seperti semula jika batal
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                <Settings className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Form Informasi Akun */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Account Details</h2>

              {isEditing ? (
                /* Mode Edit Form */
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-800"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address (Read Only)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={currentUser?.email || ""}
                        disabled
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed directly for security reasons.</p>
                  </div>
                </div>
              ) : (
                /* Mode Lihat Form */
                <div className="space-y-4">
                  <ProfileItem icon={<User className="w-4 h-4" />} label="Full Name" value={currentUser?.name || ""} />
                  <ProfileItem icon={<Mail className="w-4 h-4" />} label="Email Address" value={currentUser?.email || ""} />
                </div>
              )}
            </div>

            {/* Statistik Keamanan (Security Overview) */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Security Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white">
                  <span className="text-xs text-slate-500 font-medium">Last Login Session</span>
                  <span className="text-xs text-slate-900 font-bold">Today</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white">
                  <span className="text-xs text-slate-500 font-medium">IP Location</span>
                  <span className="text-xs text-slate-900 font-bold">Semarang, ID</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500 font-medium">Account Status</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase">Verified</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function ProfileItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}