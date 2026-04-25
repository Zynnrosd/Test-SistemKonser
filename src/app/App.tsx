import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import "../styles/fonts.css";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <FavoritesProvider>
          <RouterProvider router={router} />
        </FavoritesProvider>
      </DataProvider>
    </AuthProvider>
  );
}
