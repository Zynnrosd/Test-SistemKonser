import React, { createContext, useContext, useState, useCallback } from "react";
import { USERS, User } from "../data/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password?: string;
  }) => { success: boolean; message: string };
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

  const updateProfile = useCallback(
    (data: { name: string; email: string; phone?: string; address?: string; password?: string }) => {
      if (!currentUser) return { success: false, message: "Not logged in." };
      const emailTaken = users.find((u) => u.email === data.email && u.id !== currentUser.id);
      if (emailTaken) return { success: false, message: "Email already in use by another account." };

      const updated: User = {
        ...currentUser,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        ...(data.password && data.password.length >= 6 ? { password: data.password } : {}),
      };
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
      setCurrentUser(updated);
      return { success: true, message: "Profile updated successfully!" };
    },
    [currentUser, users]
  );

  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
