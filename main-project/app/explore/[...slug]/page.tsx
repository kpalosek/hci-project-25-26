import { notFound } from "next/navigation";
import { 
  getContinent, getCountriesByContinent,
  getCountry, getCitiesByCountry,
  getCity, getGuidesForCity
} from "@/lib/data";

import ContinentView from "@/components/views/ContinentView";
import CountryView from "@/components/views/CountryView";
import CityView from "@/components/views/CityView";

interface PageProps {
  params: { slug: string[] };
}

export default async function DynamicExplorePage({ params }: PageProps) {
  // Await params za kompatibilnost s Next.js 15
  const { slug } = await params;

  // --- 1. RAZINA: KONTINENT (npr. /explore/europe) ---
  if (slug.length === 1) {
    const continentSlug = slug[0];
    const continent = getContinent(continentSlug);
    if (!continent) return notFound();

    const countries = getCountriesByContinent(continentSlug);
    return <ContinentView continent={continent} countries={countries} />;
  }

  // --- 2. RAZINA: DRŽAVA (npr. /explore/europe/croatia) ---
  if (slug.length === 2) {
    const continentSlug = slug[0]; // koristi se za provjeru roditelja
    const countrySlug = slug[1];
    
    const country = getCountry(countrySlug, continentSlug);
    if (!country) return notFound();

    const cities = getCitiesByCountry(countrySlug);
    return <CountryView country={country} cities={cities} />;
  }

  // --- 3. RAZINA: GRAD (npr. /explore/europe/croatia/zadar) ---
  if (slug.length === 3) {
    const countrySlug = slug[1];
    const citySlug = slug[2];

    const city = getCity(citySlug, countrySlug);
    if (!city) return notFound();

    const guides = getGuidesForCity(citySlug);
    return <CityView city={city} guides={guides} />;
  }

  // Ako je URL predugačak
  return notFound();
}