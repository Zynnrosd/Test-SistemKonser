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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      {/* flex-1 memastikan main mengambil sisa ruang agar footer tetap di bawah */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
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
    // Layout untuk User Biasa
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
    // Layout untuk Admin
    path: "/admin", // Letakkan path utama di sini
    element: <AdminLayout />,
    children: [
      { index: true, Component: AdminDashboard }, // Menjadi "/admin"
      { path: "concerts", Component: AdminConcertsPage }, // Menjadi "/admin/concerts"
      { path: "transactions", Component: AdminTransactionsPage }, // Menjadi "/admin/transactions"

      // Catatan: Rute "data-table" dan "profile" admin SUDAH DIHAPUS di sini
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);