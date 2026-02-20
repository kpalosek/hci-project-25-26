export type TransportType = "bus" | "train" | "taxi" | "uber" | "shuttle";

export interface TransportUpdate {
  id: string;
  airportIata: string; // Ključ za povezivanje
  user: {
    name: string;
    avatar?: string; // URL slike
    role?: "traveler" | "local_guide" | "driver"; // Može biti korisno za kredibilitet
  };
  title: string;
  content: string;
  date: string; // ISO string
  transportType: TransportType;
}

// Mock podaci
export const recentUpdates: TransportUpdate[] = [
  {
    id: "1",
    airportIata: "SPU",
    user: {
      name: "Marko K.",
      role: "local_guide",
      avatar: "https://i.pravatar.cc/150?u=marko",
    },
    title: "Radovi na cesti prema centru",
    content: "Trenutno su veliki radovi na ulazu u Split (Poljička cesta). Shuttle bus kasni oko 15-20 minuta. Preporučujem vlak ako žurite.",
    date: "2024-05-20T10:30:00Z",
    transportType: "bus",
  },
  {
    id: "2",
    airportIata: "SPU",
    user: {
      name: "Ana S.",
      role: "traveler",
    },
    title: "Uber cijene su skočile",
    content: "Upravo sam sletila, Uber traži €60 do centra zbog gužve. Uzela sam taksi ispred terminala za €45 fiksno.",
    date: "2024-05-21T14:15:00Z",
    transportType: "uber",
  },
  {
    id: "3",
    airportIata: "JFK",
    user: {
      name: "John D.",
      role: "driver",
    },
    title: "AirTrain out of service",
    content: "Terminal 1 AirTrain is down for maintenance. Use the shuttle bus provided at level 1.",
    date: "2024-05-22T09:00:00Z",
    transportType: "train",
  },
  {
    id: "4",
    airportIata: "KEF",
    user: {
      name: "Šimun V.",
      role: "driver",
    },
    title: "Nema mi biciklo",
    content: "Nemogu da dođem nema biciklo.",
    date: "2024-05-22T09:00:00Z",
    transportType: "bus",
  }
];

// Funkcija za dohvat updateova za specifičan aerodrom
export const getUpdatesByAirport = (iata: string) => {
  return recentUpdates
    .filter((update) => update.airportIata === iata)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};