import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { AdminSidebar } from "./components/AdminSidebar";
import { Footer } from "./components/Footer";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UserDashboard } from "./pages/UserDashboard";
import { ConcertDetailPage } from "./pages/ConcertDetailPage";
import { BookingPage } from "./pages/BookingPage";
import { MyTicketsPage } from "./pages/MyTicketsPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminConcertsPage } from "./pages/AdminConcertsPage";
import { AdminTransactionsPage } from "./pages/AdminTransactionsPage";
import { DataTablePage } from "./pages/DataTablePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { CartPage } from "./pages/CartPage";
import { PaymentConfirmPage } from "./pages/PaymentConfirmPage";
import { ProfilePage } from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";

// ─── Layout wrappers ───────────────────────────────────────────────

function UserLayout() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === "admin") return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans flex flex-col">
      {/* Immersive Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="pt-20 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function AdminLayout() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans flex">
      {/* Immersive Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply" />
      </div>

      <AdminSidebar />
      <div className="relative z-10 flex flex-col flex-1 ml-60">
        <main className="flex-1 p-8">
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
    Component: LandingPage,
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
      { path: "tickets/:id", Component: TicketDetailPage },
      { path: "favorites", Component: FavoritesPage },
      { path: "cart", Component: CartPage },
      { path: "payment/:ticketId", Component: PaymentConfirmPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: "admin", Component: AdminDashboard },
      { path: "admin/concerts", Component: AdminConcertsPage },
      { path: "admin/transactions", Component: AdminTransactionsPage },
      { path: "admin/data-table", Component: DataTablePage },
      { path: "profile", Component: ProfilePage },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);