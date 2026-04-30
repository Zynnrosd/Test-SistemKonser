import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
    const { currentUser, loading } = useAuth();

    // Menampilkan loading screen saat sedang login
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Jika tidak ada user, kembali lagi ke halaman login
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Jika ada user, lanjut ke halaman yang dituju
    return <Outlet />;
}