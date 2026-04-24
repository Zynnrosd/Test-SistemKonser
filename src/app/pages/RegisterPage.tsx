import { useState } from "react";
import { Link, Navigate } from "react-router";
import { motion } from "motion/react";
import { Music2, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "../components/PageTransition";

export function RegisterPage() {
  const { register, currentUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = register(name, email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  const requirements = [
    { met: name.length > 1, label: "Full name entered" },
    { met: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), label: "Valid email address" },
    { met: password.length >= 6, label: "At least 6 characters" },
    { met: password === confirmPassword && confirmPassword.length > 0, label: "Passwords match" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      <PageTransition className="w-full max-w-md relative">
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
            Create your account
          </h1>
          <p className="text-gray-500 text-sm">Join ConcertHub and discover live music</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/80 border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all text-sm"
              />
            </div>

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
                  placeholder="Create a password"
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

            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all text-sm"
              />
            </div>

            {/* Requirements */}
            <div className="p-3 bg-gray-50 rounded-xl grid grid-cols-2 gap-1.5">
              {requirements.map(({ met, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${met ? "text-emerald-500" : "text-gray-300"}`}
                  />
                  <span className={`text-xs transition-colors ${met ? "text-gray-600" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
              ))}
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
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 transition-colors" style={{ fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </PageTransition>
    </div>
  );
}