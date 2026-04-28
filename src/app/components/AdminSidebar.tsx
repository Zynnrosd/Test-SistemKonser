import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Music2,
  CreditCard,
  Database,
  ChevronRight,
  TrendingUp,
  LogOut,
  User,
  Shield,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, badge: null },
  { to: "/admin/concerts", label: "Concerts", icon: Music2, badge: "Live" },
  { to: "/admin/transactions", label: "Transactions", icon: CreditCard, badge: null },
  { to: "/admin/data-table", label: "Data Table", icon: Database, badge: null },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 min-h-screen glass border-r border-border flex flex-col fixed left-0 top-0 bottom-0 shadow-none z-50">
      {/* Brand Logo */}
      <div className="px-6 py-8">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight">
            Concert<span className="text-primary">Hub</span>
          </span>
        </Link>
      </div>

      {/* Section header */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
            Control Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all group ${
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              style={{ fontWeight: isActive ? 800 : 600 }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary shadow-sm shadow-primary/20"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
              <span className="flex-1">{label}</span>

              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-primary/10 text-primary border border-primary/20">
                  {badge}
                </span>
              )}

              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="relative">
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden p-1.5 z-50"
              >
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all border ${
              userMenuOpen ? "bg-accent border-primary/20" : "hover:bg-accent border-transparent"
            }`}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-black shadow-lg shadow-primary/20">
                {currentUser?.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-black text-foreground truncate">{currentUser?.name.split(" ")[0]}</p>
              <div className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-amber-500" />
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Admin</span>
              </div>
            </div>
            <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-0" : "rotate-180"}`} />
          </button>
        </div>
      </div>
    </aside>
  );
}
