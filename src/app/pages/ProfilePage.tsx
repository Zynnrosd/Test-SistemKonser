import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Mail, Phone, MapPin, Lock, CheckCircle2,
  Eye, EyeOff, AlertCircle, Save, ArrowLeft,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

export function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [address, setAddress] = useState(currentUser?.address ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = updateProfile({
      name,
      email,
      phone: phone || undefined,
      address: address || undefined,
      password: password || undefined,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-2xl border bg-accent text-foreground placeholder-muted-foreground text-sm outline-none transition-all font-bold ${
      focused === field
        ? "border-primary ring-4 ring-primary/10 bg-white"
        : "border-border hover:border-muted-foreground/30"
    }`;

  return (
    <PageTransition className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-8 font-black uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/20 border border-primary/20">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-foreground font-black text-3xl tracking-tight leading-none mb-1">{currentUser.name}</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">{currentUser.email}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal info */}
        <div className="bg-white rounded-[2rem] border border-border shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-foreground font-black text-lg tracking-tight">Personal Information</h2>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="Your full name"
                  required
                  className={`${inputClass("name")} pl-10`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  required
                  className={`${inputClass("email")} pl-10`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  placeholder="+62 812 3456 7890"
                  className={`${inputClass("phone")} pl-10`}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground/40" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={() => setFocused("address")}
                  onBlur={() => setFocused(null)}
                  placeholder="Your full address"
                  rows={2}
                  className={`${inputClass("address")} pl-10 resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password change */}
        <div className="bg-white rounded-[2rem] border border-border shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-foreground font-black text-lg tracking-tight">Change Password</h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Leave blank to keep current password</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Min. 6 characters"
                  className={`${inputClass("password")} pl-12 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused(null)}
                  placeholder="Repeat new password"
                  className={`${inputClass("confirm")} pl-12`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Profile updated successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl text-white font-black bg-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </motion.button>
      </form>
    </PageTransition>
  );
}
