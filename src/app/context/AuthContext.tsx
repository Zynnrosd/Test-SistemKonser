import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
}

interface AuthContextType {
  currentUser: Profile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean; // <--- 1. KITA TAMBAHKAN DEKLARASINYA DI SINI
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // <--- 2. KITA BUAT LOGIKA PENGECEKAN ADMIN DI SINI
  const isAdmin = currentUser?.role === 'admin';

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) {
      setCurrentUser(data as Profile);
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: name } }
    });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    // <--- 3. TERAKHIR, KITA LEMPAR isAdmin KE PROVIDER AGAR BISA DIPAKAI DI SEMUA HALAMAN
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}