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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/60"
          : "bg-white/80 backdrop-blur-md border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: "3.75rem" }}>

          {/* Logo */}
          <Link
            to={isAdmin ? "/admin" : "/dashboard"}
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm tracking-tight">
              Concert<span className="text-indigo-500">Hub</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ to, label, icon: Icon, badge }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "text-indigo-600"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId={activeLayoutId}
                        className="absolute inset-0 rounded-xl bg-indigo-50 -z-10"
                        transition={{ type: "spring", stiffness: 500, damping: 38 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 ${active ? "text-indigo-500" : "text-gray-400"}`} />
                    {label}
                    {badge !== null && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                        to === "/favorites"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-indigo-100 text-indigo-600"
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
          <div className="flex items-center gap-1">
            {currentUser ? (
              <>
                {/* Profile dropdown */}
                <div className="relative ml-0.5">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDropdownOpen((v) => !v)}
                    id="profile-btn"
                    className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl transition-all ${
                      dropdownOpen ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <motion.div
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-black/8 border border-gray-100 overflow-hidden"
                        id="profile-dropdown"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                          <span className={`inline-flex items-center gap-1 mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isAdmin ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
                            {isAdmin ? <><Shield className="w-3 h-3" /> Admin</> : <><User className="w-3 h-3" /> Member</>}
                          </span>
                        </div>

                        <div className="p-1.5">
                          <DropdownItem
                            icon={<User className="w-4 h-4" />}
                            label="My Profile"
                            onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                          />
                          <div className="my-1 border-t border-gray-100 mx-1" />
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
                  className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
                >
                  <AnimatePresence mode="wait">
                    {mobileOpen ? (
                      <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}>
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}>
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-sm transition-all"
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
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon, badge }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive(to) ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {badge !== null && (
                      <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                        to === "/favorites" ? "bg-rose-50 text-rose-500" : "bg-indigo-50 text-indigo-600"
                      }`}>{badge}</span>
                    )}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
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
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className={danger ? "text-red-400" : "text-gray-400"}>{icon}</span>
      {label}
    </button>
  );
}