import React, { createContext, useContext, useState, useCallback } from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (concertId: string) => void;
  isFavorite: (concertId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = useCallback((concertId: string) => {
    setFavorites((prev) =>
      prev.includes(concertId)
        ? prev.filter((id) => id !== concertId)
        : [...prev, concertId]
    );
  }, []);

  const isFavorite = useCallback(
    (concertId: string) => favorites.includes(concertId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
