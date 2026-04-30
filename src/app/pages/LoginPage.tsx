import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext"; // Diperbaiki: ../ bukan ../../
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { PageTransition } from "../components/PageTransition"; // Diperbaiki: ../ bukan ../../

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Failed to login");
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2 text-center">Welcome Back</h1>
        <p className="text-slate-500 text-sm text-center mb-8">Sign in to your ConcertHub account</p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-500 rounded-xl text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium" placeholder="you@example.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </PageTransition>
  );
}