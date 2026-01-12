import { notFound } from "next/navigation";
import { getAirport, getGuidesFromAirport } from "@/lib/data";
import AirportView from "@/components/views/AirportView"; // Pazi na putanju gdje si spremio View

interface PageProps {
  // U novijim verzijama Next.js-a params je Promise, pa je ovo najsigurniji tip
  params: Promise<{ airportCode: string }>;
}

export default async function AirportPage({ params }: PageProps) {
  // 1. Dohvati parametre (await je obavezan u novom Next.js-u)
  const { airportCode } = await params;

  // 2. Dohvati podatke (Logic Layer)
  const airport = getAirport(airportCode);
  
  // Ako aerodrom ne postoji u tvojim podacima -> 404
  if (!airport) return notFound();

  // Dohvati sve vodiče koji kreću s tog aerodroma
  const availableGuides = getGuidesFromAirport(airportCode);

  // 3. Prikaži View (Presentation Layer)
  // Page komponenta ne mora znati ništa o HTML-u, gridovima ili slikama.
  // Ona samo prosljeđuje podatke View komponenti.
  return <AirportView airport={airport} guides={availableGuides} />;
}