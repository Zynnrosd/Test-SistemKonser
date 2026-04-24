import { useState } from "react";
import { Link, Navigate } from "react-router";
import { motion } from "motion/react";
import { Music2, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

export function LoginPage() {
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      // will re-render and navigate via redirect
    } else {
      setError(result.message);
    }
  };

  // If already logged in, redirect
  if (currentUser) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      <PageTransition className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 mb-4"
          >
            <Music2 className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.6rem" }}>
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your ConcertHub account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 border border-gray-100 p-8">
          {/* Demo credentials */}
          <div className="mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-xs text-indigo-600 mb-2" style={{ fontWeight: 600 }}>
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-indigo-500">
              <p>👤 User: <span className="font-mono">john@example.com</span> / <span className="font-mono">user123</span></p>
              <p>🔧 Admin: <span className="font-mono">admin@concerts.com</span> / <span className="font-mono">admin123</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all text-sm pr-12"
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

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-200 transition-all text-sm disabled:opacity-70"
              style={{ fontWeight: 600 }}
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
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 transition-colors" style={{ fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>
      </PageTransition>
    </div>
  );
}