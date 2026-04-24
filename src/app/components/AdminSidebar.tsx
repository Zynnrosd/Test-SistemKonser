import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Music2,
  CreditCard,
  Database,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/concerts", label: "Concerts", icon: Music2 },
  { to: "/admin/transactions", label: "Transactions", icon: CreditCard },
  { to: "/admin/data-table", label: "Data Table", icon: Database },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-full bg-white border-r border-gray-100 flex flex-col pt-4 pb-8 fixed left-0 top-16 bottom-0">
      <div className="px-4 mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest px-3" style={{ fontWeight: 600 }}>
          Administration
        </p>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={{ fontWeight: isActive ? 500 : 400 }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-500"
                />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mx-3 mt-auto rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Database className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-indigo-700" style={{ fontWeight: 600 }}>
            Database Info
          </span>
        </div>
        <p className="text-xs text-indigo-500 leading-relaxed">
          3 Tables · Full CRUD · JOIN queries supported
        </p>
      </div>
    </aside>
  );
}
