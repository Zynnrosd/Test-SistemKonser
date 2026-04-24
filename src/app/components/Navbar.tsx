import { Link, useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { Music2, LogOut, Ticket, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900" style={{ fontWeight: 600, fontSize: "1rem" }}>
              ConcertHub
            </span>
          </Link>

          {/* Nav Links */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1">
              {isAdmin ? (
                <>
                  <NavLink to="/admin" label="Overview" active={isActive("/admin")} />
                  <NavLink to="/admin/concerts" label="Concerts" active={isActive("/admin/concerts")} />
                  <NavLink to="/admin/transactions" label="Transactions" active={isActive("/admin/transactions")} />
                  <NavLink to="/admin/data-table" label="Data Table" active={isActive("/admin/data-table")} />
                </>
              ) : (
                <>
                  <NavLink to="/dashboard" label="Concerts" active={isActive("/dashboard")} />
                  <NavLink to="/my-tickets" label="My Tickets" active={isActive("/my-tickets")} />
                </>
              )}
            </div>
          )}

          {/* User Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm text-gray-800" style={{ fontWeight: 500, lineHeight: 1.2 }}>
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-400" style={{ lineHeight: 1.2 }}>
                    {isAdmin ? "Administrator" : "Member"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-gray-50">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{currentUser.name}</p>
                    <p className="text-xs text-gray-400">{currentUser.email}</p>
                  </div>
                  <div className="p-1.5">
                    {!isAdmin && (
                      <DropdownItem
                        icon={<Ticket className="w-4 h-4" />}
                        label="My Tickets"
                        onClick={() => { navigate("/my-tickets"); setDropdownOpen(false); }}
                      />
                    )}
                    {isAdmin && (
                      <DropdownItem
                        icon={<LayoutDashboard className="w-4 h-4" />}
                        label="Admin Dashboard"
                        onClick={() => { navigate("/admin"); setDropdownOpen(false); }}
                      />
                    )}
                    <DropdownItem
                      icon={<LogOut className="w-4 h-4" />}
                      label="Sign Out"
                      onClick={handleLogout}
                      danger
                    />
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-xl text-sm transition-colors ${
        active ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
      style={{ fontWeight: active ? 500 : 400 }}
    >
      {label}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500"
        />
      )}
    </Link>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}