import { User, Mail, Shield, ShieldCheck, Key, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

export function ProfilePage() {
  const { currentUser, isAdmin } = useAuth();

  return (
    <PageTransition className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-32 bg-primary">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-primary font-black text-3xl">
                {currentUser?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{currentUser?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> System Administrator
                </span>
                <span className="text-slate-400 text-sm font-medium">{currentUser?.email}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Form Informasi Akun */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Account Details</h2>
              <div className="space-y-4">
                <ProfileItem icon={<User className="w-4 h-4" />} label="Full Name" value={currentUser?.name || ""} />
                <ProfileItem icon={<Mail className="w-4 h-4" />} label="Email Address" value={currentUser?.email || ""} />
                <ProfileItem icon={<Key className="w-4 h-4" />} label="Access Level" value="Level 1 Administrator" />
              </div>
            </div>

            {/* Statistik Admin Eksklusif */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Security Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white">
                  <span className="text-xs text-slate-500 font-medium">Last Login Session</span>
                  <span className="text-xs text-slate-900 font-bold">Today, 08:45 AM</span>
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