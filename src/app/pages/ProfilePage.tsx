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
    `w-full px-4 py-2.5 rounded-xl border bg-[#fafafa] text-gray-900 placeholder-gray-300 text-sm outline-none transition-all ${
      focused === field
        ? "border-indigo-400 ring-3 ring-indigo-100 bg-white"
        : "border-gray-200 hover:border-gray-300"
    }`;

  return (
    <PageTransition className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-200/50">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-2xl">{currentUser.name}</h1>
            <p className="text-gray-400 text-sm">{currentUser.email}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-indigo-50 rounded-xl flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <h2 className="text-gray-900 font-semibold text-sm">Personal Information</h2>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300" />
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-violet-50 rounded-xl flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-gray-900 font-semibold text-sm">Change Password</h2>
              <p className="text-xs text-gray-400">Leave blank to keep current password</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="New password (min. 6 characters)"
                  className={`${inputClass("password")} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused(null)}
                  placeholder="Repeat new password"
                  className={`${inputClass("confirm")} pl-10`}
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
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-200/50 transition-all disabled:opacity-60"
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
