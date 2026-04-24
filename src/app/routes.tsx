import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { AdminSidebar } from "./components/AdminSidebar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UserDashboard } from "./pages/UserDashboard";
import { ConcertDetailPage } from "./pages/ConcertDetailPage";
import { BookingPage } from "./pages/BookingPage";
import { MyTicketsPage } from "./pages/MyTicketsPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminConcertsPage } from "./pages/AdminConcertsPage";
import { AdminTransactionsPage } from "./pages/AdminTransactionsPage";
import { DataTablePage } from "./pages/DataTablePage";
import { useAuth } from "./context/AuthContext";

// ─── Layout wrappers ───────────────────────────────────────────────

function UserLayout() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === "admin") return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}

function AdminLayout() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 ml-60 p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ─── Router ────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "login",
    Component: LoginPage,
  },
  {
    path: "register",
    Component: RegisterPage,
  },
  {
    element: <UserLayout />,
    children: [
      { path: "dashboard", Component: UserDashboard },
      { path: "concerts/:id", Component: ConcertDetailPage },
      { path: "booking/:id", Component: BookingPage },
      { path: "my-tickets", Component: MyTicketsPage },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: "admin", Component: AdminDashboard },
      { path: "admin/concerts", Component: AdminConcertsPage },
      { path: "admin/transactions", Component: AdminTransactionsPage },
      { path: "admin/data-table", Component: DataTablePage },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);