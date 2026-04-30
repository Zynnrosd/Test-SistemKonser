import { Link, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Music2, LogOut, Ticket, LayoutDashboard, ChevronDown,
  Compass, TrendingUp, Menu, X, Database,
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

  const isActive = (path: string) => {
    if (path === "/dashboard" || path === "/admin") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

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
    { to: "/admin/data-table", label: "Data Base", icon: Database, badge: null },
  ];

  const navLinks = isAdmin ? adminNavLinks : userNavLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: "4rem" }}>

          {/* Logo */}
          <Link
            to={isAdmin ? "/admin" : "/dashboard"}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-foreground text-xl tracking-tight">
              Concert<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map(({ to, label, icon: Icon, badge }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${active
                      ? "bg-slate-100 text-primary"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-slate-400"}`} />
                    {label}
                    {badge !== null && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${to === "/favorites"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-primary/10 text-primary"
                        }`}>
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Area */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    id="profile-btn"
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-slate-700">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                        id="profile-dropdown"
                      >
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                          <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        </div>
                        <div className="p-1">
                          <DropdownItem icon={<User className="w-4 h-4" />} label="My Profile" onClick={() => { navigate("/profile"); setDropdownOpen(false); }} />
                          <div className="my-1 border-t border-slate-100" />
                          <DropdownItem icon={<LogOut className="w-4 h-4" />} label="Sign out" onClick={handleLogout} danger />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileOpen((v) => !v)}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-primary hover:bg-primary/90 shadow-sm transition-colors">
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu (Simplified) */}
      <AnimatePresence>
        {mobileOpen && currentUser && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold ${isActive(to) ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 text-left"
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

function DropdownItem({ icon, label, onClick, danger = false }: { icon: ReactNode; label: string; onClick: () => void; danger?: boolean; }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${danger ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-slate-100"
        }`}
    >
      <span className={danger ? "text-rose-500" : "text-slate-400"}>{icon}</span>
      {label}
    </button>
  );
}