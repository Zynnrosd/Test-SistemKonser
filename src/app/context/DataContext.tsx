import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "./AuthContext";

// INTERFACES (Sesuai dengan database Supabase)
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
  availableSeats: number;
  genre: string;
  description: string;
  image: string;
  status: "active" | "archived" | "sold_out";
  createdAt: string;
}

export interface Ticket {
  id: string;
  concertId: string;
  userId: string;
  seatCategory: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  status: "pending" | "booked" | "cancelled";
  bookingTimestamp: string;
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

  // FUNGSI AMBIL DATA DARI SUPABASE
  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const { data: concertData, error: concertErr } = await supabase
        .from('concerts')
        .select('*')
        .order('date', { ascending: true });

      if (concertErr) throw concertErr;

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
        setTickets([]);
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

  // HELPER FUNCTIONS
  const getConcert = (id: string) => concerts.find((c) => c.id === id);
  const getTicket = (id: string) => tickets.find((t) => t.id === id);
  const getUserTickets = (userId: string) => tickets.filter((t) => t.userId === userId && t.status === "booked");
  const getPendingTickets = (userId: string) => tickets.filter((t) => t.userId === userId && t.status === "pending");

  // FUNGSI BAYAR TIKET
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

  // FUNGSI CRUD ADMIN & BOOKING
  const mapToSupabaseConcert = (data: Partial<Concert>) => {
    const dbData: any = { ...data };
    if (dbData.availableSeats !== undefined) {
      dbData.available_seats = dbData.availableSeats;
      delete dbData.availableSeats;
    }
    return dbData;
  };

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

  const softDeleteConcert = async (id: string) => {
    await updateConcert(id, { status: 'archived' });
  };

  const restoreConcert = async (id: string) => {
    await updateConcert(id, { status: 'active' });
  };

  const hardDeleteConcert = async (id: string) => {
    const { error } = await supabase.from('concerts').delete().eq('id', id);
    if (error) {
      console.error("Error deleting concert:", error);
      alert("Gagal menghapus konser permanen karena ada transaksi yang terhubung.");
    } else {
      fetchAllData();
    }
  };

  // Init booking & sinkronisasi stok via optimistic update
  const bookTicket = async (concertId: string, category: string, quantity: number, paymentMethod: string) => {
    try {
      if (!currentUser) throw new Error("Anda harus login untuk memesan tiket.");

      const targetConcert = concerts.find(c => c.id === concertId);
      if (!targetConcert) throw new Error("Konser tidak ditemukan.");

      if (targetConcert.availableSeats < quantity) {
        throw new Error("Sisa kursi tidak mencukupi untuk jumlah pesanan ini.");
      }

      let multiplier = 1;
      if (category === "VIP") multiplier = 1.5;
      if (category === "VVIP") multiplier = 2.5;

      const subtotal = targetConcert.price * multiplier * quantity;
      const calculatedTotalPrice = subtotal + (subtotal * 0.05);

      // Handle booking: Optimistic update untuk responsivitas UI
      const newAvailableSeats = targetConcert.availableSeats - quantity;
      const newStatus = newAvailableSeats <= 0 ? "sold_out" : targetConcert.status;

      setConcerts(prev => prev.map(c =>
        c.id === concertId
          ? { ...c, availableSeats: newAvailableSeats, status: newStatus }
          : c
      ));

      // Push data booking ke tabel 'bookings' Supabase
      const { data, error: insertError } = await supabase.from('bookings').insert([{
        concert_id: concertId,
        user_id: currentUser.id,
        seat_category: category,
        quantity: quantity,
        total_price: calculatedTotalPrice,
        payment_method: paymentMethod,
        status: 'pending'
      }]).select();

      if (insertError) {
        // Rollback state konser jika transaksi booking gagal
        await fetchAllData();
        throw insertError;
      }

      // Update ketersediaan kursi pada tabel 'concerts'-
      const { error: updateError } = await supabase.from('concerts')
        .update({
          available_seats: newAvailableSeats,
          status: newStatus
        })
        .eq('id', concertId);

      if (updateError) {
        console.error("Supabase RLS memblokir pemotongan kursi:", updateError);
      }

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