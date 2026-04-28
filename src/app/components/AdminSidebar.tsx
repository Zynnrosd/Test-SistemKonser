import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Music2,
  CreditCard,
  Database,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, badge: null },
  { to: "/admin/concerts", label: "Concerts", icon: Music2, badge: "Live" },
  { to: "/admin/transactions", label: "Transactions", icon: CreditCard, badge: null },
  { to: "/admin/data-table", label: "Data Table", icon: Database, badge: null },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-full glass border-r border-border flex flex-col pt-5 pb-8 fixed left-0 top-16 bottom-0 shadow-none">
      {/* Section header */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
            Control Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all group ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              style={{ fontWeight: isActive ? 700 : 500 }}
            >
              {/* Active indicator — single element, animated via layout */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-primary shadow-sm shadow-primary/20"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                isActive
                  ? "bg-primary shadow-sm shadow-primary/20"
                  : "bg-accent group-hover:bg-primary/10"
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
              </div>

              <span className="flex-1">{label}</span>

              {/* Badge */}
              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                  {badge}
                </span>
              )}

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" />
                </motion.div>
              )}
            </Link>
          );
        })}

      </nav>

      {/* Quick stats */}
      <div className="px-3 mb-3">
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-indigo-100/50 -translate-y-4 translate-x-4" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs text-primary font-bold">
              System Status
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-primary/70 font-medium">
                <Database className="w-3 h-3" />
                <span>Database</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-primary/70 font-medium">
                <Users className="w-3 h-3" />
                <span>3 Tables</span>
              </div>
              <span className="text-[10px] font-bold text-primary/50 uppercase">Full CRUD</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
