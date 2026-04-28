import { useState } from "react";
import { Link, Navigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Music2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register, currentUser } = useAuth();
  const [name, setName] = useState("");
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
    const result = register(name, email, password);
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  if (currentUser) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-foreground">
      {/* Immersive Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 immersive-bg">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-white rounded-[3rem] border border-border shadow-2xl overflow-hidden relative z-10"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="px-8 pt-10 pb-8 flex flex-col items-center">
          <Link to="/" className="w-12 h-12 bg-gradient-to-br from-primary to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-6 hover:scale-105 transition-transform">
            <Music2 className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-foreground uppercase italic">Join the <span className="text-primary">Movement.</span></h1>
          <p className="text-[10px] text-muted-foreground text-center mb-8 font-black uppercase tracking-widest">Join us and experience the magic of live music</p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="John Doe"
                required
                className={`w-full px-5 py-4 rounded-2xl border bg-accent/50 text-foreground placeholder-slate-400 text-sm outline-none transition-all font-bold ${
                  focused === "name"
                    ? "border-primary ring-4 ring-primary/10 bg-white"
                    : "border-border hover:border-primary/30"
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@example.com"
                required
                className={`w-full px-5 py-4 rounded-2xl border bg-accent/50 text-foreground placeholder-slate-400 text-sm outline-none transition-all font-bold ${
                  focused === "email"
                    ? "border-primary ring-4 ring-primary/10 bg-white"
                    : "border-border hover:border-primary/30"
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2.5 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Create a strong password"
                  required
                  className={`w-full px-5 py-4 rounded-2xl border bg-accent/50 text-foreground placeholder-slate-400 text-sm outline-none transition-all pr-12 font-bold ${
                    focused === "password"
                      ? "border-primary ring-4 ring-primary/10 bg-white"
                      : "border-border hover:border-primary/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-8 rounded-2xl text-white text-xs font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-60 flex justify-center items-center mt-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Join ConcertHub"
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8 font-bold uppercase tracking-widest">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-black transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}