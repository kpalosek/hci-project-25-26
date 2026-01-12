// app/guide/[airportCode]/[citySlug]/page.tsx
import { notFound } from "next/navigation";
import { getAirport, getGuideByAirportAndCity, cities } from "@/lib/data";
import GuideHeader from "@/components/guide/GuideHeader";
import TransportTabs from "@/components/guide/TransportTabs";

interface Props {
  params: Promise<{ airportCode: string; citySlug: string }>;
}

export default async function GuidePage({ params }: Props) {
  const { airportCode, citySlug } = await params;

  // 1. Dohvat podataka
  const guide = getGuideByAirportAndCity(airportCode, citySlug);
  const airport = getAirport(airportCode);
  const city = cities.find(c => c.slug === citySlug);

  if (!guide || !airport || !city) return notFound();

  // Izračunaj minimalne vrijednosti za header
  const minTime = guide.transportOptions[0]?.duration;
  const minPrice = guide.transportOptions[0]?.price;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Header sekcija (Split Image) */}
      <GuideHeader 
        airportName={airport.name}
        airportIata={airport.iata}
        airportImage={airport.image}
        cityName={city.name}
        cityImage={city.image}
        distance={guide.distance}
        minTime={minTime}
        minPrice={minPrice}
      />

      {/* 2. Glavni sadržaj (Tabovi koji "uplivavaju" u header) */}
      <TransportTabs 
        airportName={airport.name}
        cityName={city.name}
        options={guide.transportOptions}
      />

    </main>
  );
}