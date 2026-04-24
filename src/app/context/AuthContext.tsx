import React, { createContext, useContext, useState, useCallback } from "react";
import { USERS, User } from "../data/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);

  const login = useCallback(
    (email: string, password: string) => {
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        return { success: true, message: "Login successful!" };
      }
      return { success: false, message: "Invalid email or password." };
    },
    [users]
  );

  const register = useCallback(
    (name: string, email: string, password: string) => {
      if (users.find((u) => u.email === email)) {
        return { success: false, message: "Email already registered." };
      }
      const newUser: User = {
        id: `u${users.length + 1}`,
        name,
        email,
        password,
        role: "user",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      return { success: true, message: "Registration successful!" };
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
