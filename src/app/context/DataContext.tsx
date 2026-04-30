import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "./AuthContext";

// --- INTERFACES (Sesuai dengan database Supabase) ---
export interface Concert {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  capacity: number;
  availableSeats: number; // di DB namanya available_seats
  genre: string;
  description: string;
  image: string;
  status: "active" | "archived" | "sold_out";
  createdAt: string;
}

export interface Ticket {
  id: string;
  concertId: string; // di DB concert_id
  userId: string;    // di DB user_id
  seatCategory: string; // di DB seat_category
  quantity: number;
  totalPrice: number; // di DB total_price
  paymentMethod: string; // di DB payment_method
  status: "pending" | "booked" | "cancelled";
  bookingTimestamp: string; // di DB booking_timestamp
}

interface DataContextType {
  concerts: Concert[];
  tickets: Ticket[];
  loadingData: boolean;
  getConcert: (id: string) => Concert | undefined;
  getTicket: (id: string) => Ticket | undefined;
  getUserTickets: (userId: string) => Ticket[];
  getPendingTickets: (userId: string) => Ticket[];
  payTicket: (ticketId: string) => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;

  // --- FUNGSI BARU UNTUK ADMIN & USER ---
  addConcert: (data: Omit<Concert, "id" | "createdAt">) => Promise<void>;
  updateConcert: (id: string, data: Partial<Concert>) => Promise<void>;
  softDeleteConcert: (id: string) => Promise<void>;
  restoreConcert: (id: string) => Promise<void>;
  hardDeleteConcert: (id: string) => Promise<void>;
  bookTicket: (concertId: string, category: string, quantity: number, paymentMethod: string) => Promise<{ success: boolean; message?: string; ticketId?: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // --- FUNGSI TARIK DATA DARI SUPABASE ---
  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      // 1. Tarik semua konser (Public)
      const { data: concertData, error: concertErr } = await supabase
        .from('concerts')
        .select('*')
        .order('date', { ascending: true }); // Diurutkan berdasarkan tanggal

      if (concertErr) throw concertErr;

      // Mapping penamaan DB (snake_case) ke Frontend (camelCase)
      const formattedConcerts: Concert[] = concertData.map((c: any) => ({
        id: c.id,
        title: c.title,
        artist: c.artist,
        date: c.date,
        time: c.time,
        venue: c.venue,
        city: c.city,
        price: c.price,
        capacity: c.capacity,
        availableSeats: c.available_seats,
        genre: c.genre,
        description: c.description,
        image: c.image,
        status: c.status,
        createdAt: c.created_at || ""
      }));
      setConcerts(formattedConcerts);

      // 2. Tarik tiket HANYA JIKA user sudah login
      if (currentUser) {
        const { data: ticketData, error: ticketErr } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('booking_timestamp', { ascending: false });

        if (ticketErr) throw ticketErr;

        const formattedTickets: Ticket[] = ticketData.map((t: any) => ({
          id: t.id,
          concertId: t.concert_id,
          userId: t.user_id,
          seatCategory: t.seat_category,
          quantity: t.quantity,
          totalPrice: t.total_price,
          paymentMethod: t.payment_method || "",
          status: t.status,
          bookingTimestamp: t.booking_timestamp
        }));
        setTickets(formattedTickets);
      } else {
        setTickets([]); // Kosongkan tiket jika tidak ada user
      }
    } catch (err) {
      console.error("Error fetching data from Supabase:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentUser]);

  // --- HELPER FUNCTIONS ---
  const getConcert = (id: string) => concerts.find((c) => c.id === id);
  const getTicket = (id: string) => tickets.find((t) => t.id === id);
  const getUserTickets = (userId: string) => tickets.filter((t) => t.userId === userId && t.status === "booked");
  const getPendingTickets = (userId: string) => tickets.filter((t) => t.userId === userId && t.status === "pending");

  // --- FUNGSI BAYAR TIKET ---
  const payTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'booked' })
        .eq('id', ticketId);

      if (error) return { success: false, message: error.message };

      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: "booked" } : t));
      return { success: true, message: "Payment successful!" };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  // ==========================================
  // --- FUNGSI BARU (CRUD ADMIN & BOOKING) ---
  // ==========================================

  // Helper untuk mengubah data dari React (camelCase) agar cocok dengan Kolom Supabase (snake_case)
  const mapToSupabaseConcert = (data: Partial<Concert>) => {
    const dbData: any = { ...data };
    if (dbData.availableSeats !== undefined) {
      dbData.available_seats = dbData.availableSeats;
      delete dbData.availableSeats;
    }
    return dbData;
  };

  // 1. Tambah Konser (Admin)
  const addConcert = async (data: Omit<Concert, "id" | "createdAt">) => {
    const dbData = mapToSupabaseConcert(data);
    const { error } = await supabase.from('concerts').insert([dbData]);
    if (error) {
      console.error("Error adding concert:", error);
      alert(`Gagal menambahkan konser: ${error.message}`);
    } else {
      fetchAllData();
    }
  };

  // 2. Edit Konser (Admin)
  const updateConcert = async (id: string, data: Partial<Concert>) => {
    const dbData = mapToSupabaseConcert(data);
    const { error } = await supabase.from('concerts').update(dbData).eq('id', id);
    if (error) {
      console.error("Error updating concert:", error);
      alert(`Gagal mengupdate konser: ${error.message}`);
    } else {
      fetchAllData();
    }
  };

  // 3. Delete Sementara / Archive (Admin)
  const softDeleteConcert = async (id: string) => {
    await updateConcert(id, { status: 'archived' });
  };

  // 4. Kembalikan Konser dari Archive (Admin)
  const restoreConcert = async (id: string) => {
    await updateConcert(id, { status: 'active' });
  };

  // 5. Hapus Konser Permanen (Admin)
  const hardDeleteConcert = async (id: string) => {
    const { error } = await supabase.from('concerts').delete().eq('id', id);
    if (error) {
      console.error("Error deleting concert:", error);
      alert("Gagal menghapus konser permanen karena ada transaksi yang terhubung.");
    } else {
      fetchAllData();
    }
  };

  // 6. User Memesan Tiket Baru (User Booking)
  const bookTicket = async (concertId: string, category: string, quantity: number, paymentMethod: string) => {
    try {
      if (!currentUser) throw new Error("Anda harus login untuk memesan tiket.");

      // Hitung total harga berdasarkan harga konser
      const targetConcert = concerts.find(c => c.id === concertId);
      if (!targetConcert) throw new Error("Konser tidak ditemukan.");
      
      // Cari multiplier dari category (bisa dikirim dari frontend atau dihitung di sini)
      // Untuk sederhananya, kita asumsikan harga sudah termasuk multiplier atau kita biarkan logic frontend yang mengirim total
      const calculatedTotalPrice = targetConcert.price * quantity;

      // Insert data ke tabel 'bookings' Supabase
      const { data, error } = await supabase.from('bookings').insert([{
        concert_id: concertId,
        user_id: currentUser.id,
        seat_category: category,
        quantity: quantity,
        total_price: calculatedTotalPrice,
        payment_method: paymentMethod,
        status: 'pending' // Default selalu pending menunggu pembayaran
      }]).select();

      if (error) throw error;

      // Tarik ulang data agar tiket yang baru dibeli langsung masuk ke UI
      await fetchAllData();
      return { success: true, ticketId: data?.[0]?.id };
    } catch (error: any) {
      console.error("Booking error:", error);
      return { success: false, message: error.message };
    }
  };

  return (
    <DataContext.Provider value={{
      concerts, tickets, loadingData,
      getConcert, getTicket, getUserTickets, getPendingTickets, payTicket, refreshData: fetchAllData,
      addConcert, updateConcert, softDeleteConcert, restoreConcert, hardDeleteConcert, bookTicket
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error("useData must be used within a DataProvider");
  return context;
}