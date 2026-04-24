import React, { createContext, useContext, useState, useCallback } from "react";
import { CONCERTS, TICKETS, USERS, Concert, Ticket } from "../data/mockData";

interface DataContextType {
  concerts: Concert[];
  tickets: Ticket[];
  getConcert: (id: string) => Concert | undefined;
  addConcert: (concert: Omit<Concert, "id" | "createdAt">) => void;
  updateConcert: (id: string, updates: Partial<Concert>) => void;
  softDeleteConcert: (id: string) => void;
  restoreConcert: (id: string) => void;
  hardDeleteConcert: (id: string) => void;
  bookTicket: (userId: string, concertId: string, quantity: number) => { success: boolean; message: string };
  getUserTickets: (userId: string) => Ticket[];
  getJoinedData: () => JoinedRecord[];
}

export interface JoinedRecord {
  ticketId: string;
  bookingDate: string;
  quantity: number;
  totalPrice: number;
  ticketStatus: string;
  userId: string;
  userName: string;
  userEmail: string;
  concertId: string;
  concertTitle: string;
  concertArtist: string;
  concertVenue: string;
  concertDate: string;
  concertPrice: number;
  concertStatus: string;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [concerts, setConcerts] = useState<Concert[]>(CONCERTS);
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);

  const getConcert = useCallback(
    (id: string) => concerts.find((c) => c.id === id),
    [concerts]
  );

  const addConcert = useCallback((concert: Omit<Concert, "id" | "createdAt">) => {
    const newConcert: Concert = {
      ...concert,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setConcerts((prev) => [newConcert, ...prev]);
  }, []);

  const updateConcert = useCallback((id: string, updates: Partial<Concert>) => {
    setConcerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const softDeleteConcert = useCallback((id: string) => {
    setConcerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "archived" } : c))
    );
  }, []);

  const restoreConcert = useCallback((id: string) => {
    setConcerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "active" } : c))
    );
  }, []);

  const hardDeleteConcert = useCallback((id: string) => {
    setConcerts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const bookTicket = useCallback(
    (userId: string, concertId: string, quantity: number) => {
      const concert = concerts.find((c) => c.id === concertId);
      if (!concert) return { success: false, message: "Concert not found." };
      if (concert.status === "archived")
        return { success: false, message: "This concert is no longer available." };
      if (concert.availableSeats < quantity)
        return { success: false, message: `Only ${concert.availableSeats} seats available.` };

      const totalPrice = concert.price * quantity;
      const newTicket: Ticket = {
        id: `t${Date.now()}`,
        userId,
        concertId,
        quantity,
        totalPrice,
        bookingDate: new Date().toISOString().split("T")[0],
        status: "booked",
      };
      setTickets((prev) => [newTicket, ...prev]);
      setConcerts((prev) =>
        prev.map((c) =>
          c.id === concertId
            ? { ...c, availableSeats: c.availableSeats - quantity }
            : c
        )
      );
      return { success: true, message: "Tickets booked successfully!" };
    },
    [concerts]
  );

  const getUserTickets = useCallback(
    (userId: string) => tickets.filter((t) => t.userId === userId),
    [tickets]
  );

  const getJoinedData = useCallback((): JoinedRecord[] => {
    return tickets.map((ticket) => {
      const user = USERS.find((u) => u.id === ticket.userId);
      const concert = concerts.find((c) => c.id === ticket.concertId);
      return {
        ticketId: ticket.id,
        bookingDate: ticket.bookingDate,
        quantity: ticket.quantity,
        totalPrice: ticket.totalPrice,
        ticketStatus: ticket.status,
        userId: ticket.userId,
        userName: user?.name ?? "Unknown",
        userEmail: user?.email ?? "—",
        concertId: ticket.concertId,
        concertTitle: concert?.title ?? "Unknown Concert",
        concertArtist: concert?.artist ?? "—",
        concertVenue: concert?.venue ?? "—",
        concertDate: concert?.date ?? "—",
        concertPrice: concert?.price ?? 0,
        concertStatus: concert?.status ?? "—",
      };
    });
  }, [tickets, concerts]);

  return (
    <DataContext.Provider
      value={{
        concerts,
        tickets,
        getConcert,
        addConcert,
        updateConcert,
        softDeleteConcert,
        restoreConcert,
        hardDeleteConcert,
        bookTicket,
        getUserTickets,
        getJoinedData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}