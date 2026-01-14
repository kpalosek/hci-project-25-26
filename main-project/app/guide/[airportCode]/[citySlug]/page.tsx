import { notFound } from "next/navigation";
import { getAirport, getGuideByAirportAndCity, cities, countries } from "@/lib/data";
import { getUpdatesByAirport } from "@/lib/updates";
import GuideHeader from "@/components/guide/GuideHeader";
import TransportTabs from "@/components/guide/TransportTabs";

interface Props {
  // U novijim verzijama Next.js params su Promise
  params: Promise<{ airportCode: string; citySlug: string }>;
}

export default async function GuidePage({ params }: Props) {
  // 1. Pričekaj parametre
  const { airportCode, citySlug } = await params;

  // 2. Dohvati osnovne podatke
  const guide = getGuideByAirportAndCity(airportCode, citySlug);
  const airport = getAirport(airportCode);
  const city = cities.find((c) => c.slug === citySlug);
  const updates = getUpdatesByAirport(airportCode);

  // 3. Ako bilo koji podatak nedostaje, vrati 404
  if (!guide || !airport || !city) {
    return notFound();
  }

  // 4. Dohvati dodatne podatke za navigaciju (Država i Kontinent)
  // Ovo je potrebno da bi linkovi u Headeru (npr. "To City") radili ispravno
  const country = countries.find((c) => c.slug === city.parentCountry);
  const continentSlug = country?.parentContinent;

  // --- LOGIKA ZA IZRAČUN NAJNIŽE CIJENE I VREMENA ---
  
  // Helper: Pretvori "€15.50" u 15.50
  const getPriceValue = (priceStr: string) => {
    if (!priceStr) return Infinity;
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? Infinity : num; 
  };

  // Helper: Pretvori "45 min" u 45
  const getDurationValue = (durationStr: string) => {
    if (!durationStr) return Infinity;
    const num = parseInt(durationStr.replace(/\D/g, ''));
    return isNaN(num) ? Infinity : num;
  };

  // Pronađi najjeftiniju opciju
  const cheapestOption = guide.transportOptions.reduce((min, current) => 
    getPriceValue(current.price) < getPriceValue(min.price) ? current : min
  , guide.transportOptions[0]);

  // Pronađi najbržu opciju
  const fastestOption = guide.transportOptions.reduce((min, current) => 
    getDurationValue(current.duration) < getDurationValue(min.duration) ? current : min
  , guide.transportOptions[0]);

  // Postavi vrijednosti za prikaz (koristimo originalne stringove)
  const minPrice = cheapestOption?.price || "N/A";
  const minTime = fastestOption?.duration || "N/A";

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. HEADER SEKCIJA */}
      <GuideHeader 
        airportName={airport.name}
        airportIata={airport.iata}
        airportImage={airport.image}
        cityName={city.name}
        citySlug={city.slug}
        cityImage={city.image}
        countrySlug={country?.slug || ""}
        continentSlug={continentSlug || ""}
        distance={guide.distance}
        minTime={minTime}
        minPrice={minPrice}
      />

      {/* 2. GLAVNI SADRŽAJ (Tabovi) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 lg:-mt-6">
        <TransportTabs 
          airportName={airport.name}
          airportIata={airport.iata}
          cityName={city.name}
          options={guide.transportOptions}
        />
      </div>

    </main>
  );
}