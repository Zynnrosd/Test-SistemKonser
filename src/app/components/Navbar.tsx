import { Link, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Music2, LogOut, Ticket, LayoutDashboard, ChevronDown,
  Compass, TrendingUp, Menu, X, Shield, Database,
  Heart, ShoppingCart, User,
} from "lucide-react";
import { useState, ReactNode, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useFavorites } from "../context/FavoritesContext";

export function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const { getPendingTickets } = useData();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pendingCount = currentUser ? getPendingTickets(currentUser.id).length : 0;
  const favCount = favorites.length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#profile-btn") && !target.closest("#profile-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Exact match for /dashboard and /admin, prefix match for others
  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/admin") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  // User nav: Favorites & Cart as full menu items (with badges)
  const userNavLinks = [
    { to: "/dashboard", label: "Explore", icon: Compass, badge: null },
    { to: "/my-tickets", label: "My Tickets", icon: Ticket, badge: null },
    { to: "/favorites", label: "Favorites", icon: Heart, badge: favCount > 0 ? favCount : null },
    { to: "/cart", label: "Cart", icon: ShoppingCart, badge: pendingCount > 0 ? pendingCount : null },
  ];

  const adminNavLinks = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, badge: null },
    { to: "/admin/concerts", label: "Concerts", icon: Music2, badge: null },
    { to: "/admin/transactions", label: "Transactions", icon: TrendingUp, badge: null },
    { to: "/admin/data-table", label: "Data Table", icon: Database, badge: null },
  ];

  const navLinks = isAdmin ? adminNavLinks : userNavLinks;

  // Separate layoutId per role to avoid bubble duplication
  const activeLayoutId = isAdmin ? "nav-active-admin" : "nav-active-user";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-xl shadow-black/5"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: "4rem" }}>

          {/* Logo */}
          <Link
            to={isAdmin ? "/admin" : "/dashboard"}
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-foreground text-lg tracking-tight">
              Concert<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon, badge }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId={activeLayoutId}
                        className="absolute inset-0 rounded-xl bg-primary/10 -z-10 border border-primary/20"
                        transition={{ type: "spring", stiffness: 500, damping: 38 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    {label}
                    {badge !== null && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                        to === "/favorites"
                          ? "bg-rose-500/20 text-rose-400"
                          : "bg-primary/20 text-primary"
                      }`}>
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right: profile only */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                {/* Profile dropdown */}
                <div className="relative ml-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen((v) => !v)}
                    id="profile-btn"
                    className={`flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-full transition-all border ${
                      dropdownOpen ? "bg-primary/10 border-primary/20" : "bg-white/50 border-border hover:bg-accent hover:border-primary/20 shadow-sm"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <motion.div
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-3 w-64 glass rounded-[2rem] shadow-2xl border-border overflow-hidden z-50"
                        id="profile-dropdown"
                      >
                        {/* User info */}
                        <div className="px-6 py-5 border-b border-border bg-accent/30">
                          <p className="text-sm font-bold text-foreground truncate">{currentUser.name}</p>
                          <p className="text-xs text-muted-foreground truncate mb-2">{currentUser.email}</p>
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${isAdmin ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-primary/10 text-primary border border-primary/20"}`}>
                            {isAdmin ? <><Shield className="w-3 h-3" /> ADMIN</> : <><User className="w-3 h-3" /> MEMBER</>}
                          </span>
                        </div>

                        <div className="p-2">
                          <DropdownItem
                            icon={<User className="w-4 h-4" />}
                            label="My Profile"
                            onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                          />
                          <div className="my-1.5 border-t border-white/5 mx-2" />
                          <DropdownItem
                            icon={<LogOut className="w-4 h-4" />}
                            label="Sign out"
                            onClick={handleLogout}
                            danger
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileOpen((v) => !v)}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-foreground hover:bg-accent transition-all ml-1 border border-border shadow-sm"
                >
                  <AnimatePresence mode="wait">
                    {mobileOpen ? (
                      <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <X className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Menu className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-foreground hover:text-primary rounded-full hover:bg-accent transition-all"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:scale-105"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && currentUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1.5">
              {navLinks.map(({ to, label, icon: Icon, badge }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive(to) ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                    {badge !== null && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                        to === "/favorites" ? "bg-rose-500/20 text-rose-400" : "bg-primary/20 text-primary"
                      }`}>{badge}</span>
                    )}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 border-t border-white/10 mt-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <User className="w-5 h-5" />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function DropdownItem({
  icon, label, onClick, danger = false,
}: {
  icon: ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-foreground hover:bg-accent"
      }`}
    >
      <span className={danger ? "text-red-400" : "text-muted-foreground"}>{icon}</span>
      {label}
    </button>
  );
}