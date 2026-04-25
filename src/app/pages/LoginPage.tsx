import { useState } from "react";
import { Link, Navigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Music2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 650));
    const result = login(email, password);
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  if (currentUser) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-[#f0eeff] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[860px] bg-white rounded-3xl shadow-2xl shadow-indigo-200/40 overflow-hidden flex"
        style={{ minHeight: "520px" }}
      >
        {/* ── Left: Form ── */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">ConcertHub</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-sm text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Demo hint */}
          <div className="mb-6 px-4 py-3 bg-violet-50 rounded-2xl border border-violet-100">
            <p className="text-xs text-violet-500 font-semibold mb-1">Demo credentials</p>
            <p className="text-xs text-violet-400 font-mono">john@example.com · user123</p>
            <p className="text-xs text-violet-400 font-mono">admin@concerts.com · admin123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@example.com"
                required
                className={`w-full px-4 py-2.5 rounded-xl border bg-[#fafafa] text-gray-900 placeholder-gray-300 text-sm outline-none transition-all ${
                  focused === "email"
                    ? "border-indigo-400 ring-3 ring-indigo-100 bg-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your password"
                  required
                  className={`w-full px-4 py-2.5 rounded-xl border bg-[#fafafa] text-gray-900 placeholder-gray-300 text-sm outline-none transition-all pr-11 ${
                    focused === "password"
                      ? "border-indigo-400 ring-3 ring-indigo-100 bg-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
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

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-200/60 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* ── Right: Branding Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex w-[42%] bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 flex-col justify-between p-10 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -right-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/10" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ConcertHub</span>
          </div>

          {/* Main copy */}
          <div className="relative">
            <h2 className="text-white font-bold leading-tight mb-4" style={{ fontSize: "2rem" }}>
              Your tickets,<br />one place.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Discover live concerts, book seats instantly, and manage all your bookings in one clean dashboard.
            </p>
          </div>

          {/* Feature pills */}
          <div className="relative space-y-2.5">
            {[
              { icon: "🎵", text: "Browse 1,000+ live events" },
              { icon: "⚡", text: "Instant e-ticket delivery" },
              { icon: "🔒", text: "Secure & encrypted checkout" },
            ].map(({ icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm"
              >
                <span className="text-base">{icon}</span>
                <span className="text-white/80 text-sm">{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}