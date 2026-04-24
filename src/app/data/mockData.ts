export type UserRole = "user" | "admin";
export type ConcertStatus = "active" | "archived";
export type TicketStatus = "booked" | "cancelled" | "attended";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Concert {
  id: string;
  title: string;
  artist: string;
  genre: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  availableSeats: number;
  image: string;
  description: string;
  status: ConcertStatus;
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  concertId: string;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
  status: TicketStatus;
}

export const USERS: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@concerts.com",
    password: "admin123",
    role: "admin",
    createdAt: "2024-01-01",
  },
  {
    id: "u2",
    name: "John Smith",
    email: "john@example.com",
    password: "user123",
    role: "user",
    createdAt: "2024-02-15",
  },
  {
    id: "u3",
    name: "Jane Doe",
    email: "jane@example.com",
    password: "user123",
    role: "user",
    createdAt: "2024-03-10",
  },
  {
    id: "u4",
    name: "Michael Chen",
    email: "michael@example.com",
    password: "user123",
    role: "user",
    createdAt: "2024-04-05",
  },
];

export const CONCERTS: Concert[] = [
  {
    id: "c1",
    title: "Neon Horizons Tour",
    artist: "The Midnight",
    genre: "Synthwave / Electronic",
    venue: "Madison Square Garden",
    city: "New York, NY",
    date: "2025-08-15",
    time: "08:00 PM",
    price: 89.99,
    capacity: 5000,
    availableSeats: 1230,
    image:
      "https://images.unsplash.com/photo-1610900538035-b04c4d957d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description:
      "Experience the electrifying Neon Horizons Tour — a night of dreamy synthwave and pulsating beats that blur the line between retro nostalgia and modern electronic soundscapes. The Midnight deliver an unforgettable visual and sonic spectacle.",
    status: "active",
    createdAt: "2025-01-10",
  },
  {
    id: "c2",
    title: "Thunder & Lightning World Tour",
    artist: "Imagine Dragons",
    genre: "Rock / Alternative",
    venue: "Crypto.com Arena",
    city: "Los Angeles, CA",
    date: "2025-09-05",
    time: "07:30 PM",
    price: 120.0,
    capacity: 8000,
    availableSeats: 2450,
    image:
      "https://images.unsplash.com/photo-1600201508641-23fbbc36e8e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description:
      "Imagine Dragons bring their explosive energy back to the stage with the Thunder & Lightning World Tour. Expect anthemic hits, massive pyrotechnics, and a raw emotional journey through their legendary catalog.",
    status: "active",
    createdAt: "2025-01-15",
  },
  {
    id: "c3",
    title: "Blue Note Sessions",
    artist: "Kamasi Washington",
    genre: "Jazz / Neo-Soul",
    venue: "Blue Note Jazz Club",
    city: "Chicago, IL",
    date: "2025-07-20",
    time: "09:00 PM",
    price: 65.0,
    capacity: 500,
    availableSeats: 78,
    image:
      "https://images.unsplash.com/photo-1677845100776-0aad8a8173a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description:
      "An intimate evening of transcendent jazz with saxophonist Kamasi Washington. Blue Note Sessions offers an up-close experience of cosmic jazz improvisation that pushes the boundaries of the genre.",
    status: "active",
    createdAt: "2025-02-01",
  },
  {
    id: "c4",
    title: "Symphony of the Stars",
    artist: "Berlin Philharmonic",
    genre: "Classical / Orchestral",
    venue: "Carnegie Hall",
    city: "New York, NY",
    date: "2025-10-12",
    time: "07:00 PM",
    price: 175.0,
    capacity: 2800,
    availableSeats: 340,
    image:
      "https://images.unsplash.com/photo-1519683000900-034603c717b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description:
      "The world-renowned Berlin Philharmonic performs a breathtaking program featuring Beethoven's 9th Symphony and Brahms' Piano Concerto No. 2. A refined evening of unparalleled musical mastery.",
    status: "active",
    createdAt: "2025-02-20",
  },
  {
    id: "c5",
    title: "Ultrawave Festival",
    artist: "Daft Punk Legacy + Guests",
    genre: "Electronic / House",
    venue: "Coachella Valley Music & Arts Festival",
    city: "Indio, CA",
    date: "2025-11-01",
    time: "10:00 PM",
    price: 299.0,
    capacity: 15000,
    availableSeats: 4500,
    image:
      "https://images.unsplash.com/photo-1616709062048-788acece6a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description:
      "The ultimate electronic music festival experience. Ultrawave brings together world-class DJs and producers for an all-night dance odyssey under the desert sky.",
    status: "active",
    createdAt: "2025-03-01",
  },
  {
    id: "c6",
    title: "Eras Reimagined",
    artist: "Aurora Bell",
    genre: "Pop / Indie",
    venue: "Allegiant Stadium",
    city: "Las Vegas, NV",
    date: "2025-12-14",
    time: "08:00 PM",
    price: 150.0,
    capacity: 12000,
    availableSeats: 3800,
    image:
      "https://images.unsplash.com/photo-1517231155085-247ebcab650f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description:
      "Aurora Bell's Eras Reimagined tour takes audiences through a stunning retrospective of her decade-long career with brand new arrangements, stunning visuals, and surprise guest appearances.",
    status: "active",
    createdAt: "2025-03-15",
  },
  {
    id: "c7",
    title: "Roots & Rivers Folk Fest",
    artist: "Fleet Foxes",
    genre: "Folk / Indie",
    venue: "Red Rocks Amphitheatre",
    city: "Morrison, CO",
    date: "2025-06-08",
    time: "06:30 PM",
    price: 75.0,
    capacity: 3000,
    availableSeats: 0,
    image:
      "https://images.unsplash.com/photo-1770155623767-8051b483f01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description:
      "An enchanting evening of acoustic folk harmonies set against the stunning backdrop of Red Rocks. Fleet Foxes perform new and classic songs in this limited-capacity intimate show.",
    status: "archived",
    createdAt: "2024-12-01",
  },
  {
    id: "c8",
    title: "Summer Solstice Music Festival",
    artist: "Various Artists",
    genre: "Multi-Genre / Festival",
    venue: "Grant Park",
    city: "Chicago, IL",
    date: "2025-06-21",
    time: "12:00 PM",
    price: 199.0,
    capacity: 25000,
    availableSeats: 5200,
    image:
      "https://images.unsplash.com/photo-1582711012124-a56cf82307a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description:
      "A day-long celebration of music across three stages. Summer Solstice features 20+ artists spanning genres from hip-hop and R&B to indie and electronic music. Food, art installations, and community.",
    status: "archived",
    createdAt: "2024-11-15",
  },
];

export const TICKETS: Ticket[] = [
  {
    id: "t1",
    userId: "u2",
    concertId: "c1",
    quantity: 2,
    totalPrice: 179.98,
    bookingDate: "2025-06-01",
    status: "booked",
  },
  {
    id: "t2",
    userId: "u2",
    concertId: "c3",
    quantity: 1,
    totalPrice: 65.0,
    bookingDate: "2025-06-10",
    status: "booked",
  },
  {
    id: "t3",
    userId: "u3",
    concertId: "c2",
    quantity: 3,
    totalPrice: 360.0,
    bookingDate: "2025-05-20",
    status: "booked",
  },
  {
    id: "t4",
    userId: "u3",
    concertId: "c4",
    quantity: 2,
    totalPrice: 350.0,
    bookingDate: "2025-05-25",
    status: "booked",
  },
  {
    id: "t5",
    userId: "u4",
    concertId: "c5",
    quantity: 4,
    totalPrice: 1196.0,
    bookingDate: "2025-06-05",
    status: "booked",
  },
  {
    id: "t6",
    userId: "u2",
    concertId: "c7",
    quantity: 2,
    totalPrice: 150.0,
    bookingDate: "2025-04-15",
    status: "attended",
  },
  {
    id: "t7",
    userId: "u4",
    concertId: "c6",
    quantity: 1,
    totalPrice: 150.0,
    bookingDate: "2025-06-12",
    status: "booked",
  },
  {
    id: "t8",
    userId: "u3",
    concertId: "c8",
    quantity: 2,
    totalPrice: 398.0,
    bookingDate: "2025-05-01",
    status: "cancelled",
  },
];
