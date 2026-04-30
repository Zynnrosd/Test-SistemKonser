import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
    const { currentUser, loading } = useAuth();

    // Selama Supabase masih mengecek sesi, tampilkan loading screen
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Jika setelah dicek ternyata TIDAK ADA user yang login, lempar paksa ke halaman Login
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Jika ada user, silakan lewat ke halaman yang dituju
    return <Outlet />;
}