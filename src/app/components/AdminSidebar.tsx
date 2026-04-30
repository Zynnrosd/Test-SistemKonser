import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Music2, TrendingUp,
  LogOut, Shield
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/concerts", label: "Manage Concerts", icon: Music2 },
    { to: "/admin/transactions", label: "Transactions", icon: TrendingUp },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-6 border-b border-slate-50">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight">
            Admin<span className="text-primary">Hub</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
        {menuItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <item.icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bagian Bawah: Hanya Info Identitas & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            {currentUser?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name || "Administrator"}</p>
            <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> Administrator
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-4 h-4" />
          Sign Out System
        </button>
      </div>
    </aside>
  );
}