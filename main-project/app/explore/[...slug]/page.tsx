import { Metadata } from "next";
import { notFound } from "next/navigation";
import ContinentView from "@/components/views/ContinentView";
import CountryView from "@/components/views/CountryView";
import CityView from "@/components/views/CityView";
import { 
  getContinentData, getCountriesByContinent,
  getCountryData, getCitiesByCountry,
  getCityData, getGuidesByTargetCity
} from "@/lib/contentful";
import { getUserFavorites } from "@/app/favoriteActions";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // --- 1. SLUČAJ: KONTINENT (npr. /explore/europe) ---
  if (slug.length === 1) {
    const continentSlug = slug[0];
    const continent = await getContinentData(continentSlug);

    if (!continent) return { title: "Continent Not Found" };

    return {
      title: `Explore ${continent.name}`,
      description: `Explore the best travel destinations and airport transfers in ${continent.name}.`,
      openGraph: {
        title: `Travel to ${continent.name}`,
      }
    };
  }

  // --- 2. SLUČAJ: DRŽAVA (npr. /explore/europe/croatia) ---
  if (slug.length === 2) {
    const countrySlug = slug[1];
    const country = await getCountryData(countrySlug);

    if (!country) return { title: "Country Not Found" };

    return {
      title: `Explore ${country.name}`,
      description: `Find the cheapest and fastest airport transfers to cities in ${country.name}.`,
    };
  }

  // --- 3. SLUČAJ: GRAD (npr. /explore/europe/croatia/zadar) ---
  if (slug.length === 3) {
    const citySlug = slug[2];
    const city = await getCityData(citySlug);

    if (!city) return { title: "City Not Found" };

    return {
      title: `${city.name} - Transfer Guides`,
      description: `Complete guide for transfers to ${city.name} from nearby airports. Prices, bus routes, and taxis.`,
    };
  }

  return {
    title: "Explore Destinations",
  };
}

export default async function DynamicExplorePage({ params }: PageProps) {
  const { slug } = await params;
  const userFavorites = await getUserFavorites();

  // --- 1. RAZINA: KONTINENT (npr. /explore/europe) ---
  if (slug.length === 1) {
    const continentSlug = slug[0];
    
    const continent = await getContinentData(continentSlug);
    if (!continent) return notFound();
    
    const countries = await getCountriesByContinent(continentSlug);
    
    return <ContinentView continent={continent} countries={countries} />;
  }

  // --- 2. RAZINA: DRŽAVA (npr. /explore/europe/croatia) ---
  if (slug.length === 2) {
      const continentSlug = slug[0]; 
      const countrySlug = slug[1];
      
      const country = await getCountryData(countrySlug);
      if (!country) return notFound();

      if (country.parentContinent !== continentSlug) {
          return notFound();
      }

      const cities = await getCitiesByCountry(countrySlug);
      
      return <CountryView country={country} cities={cities} />;
    }

    // --- 3. RAZINA: GRAD (npr. /explore/europe/croatia/zadar) ---

    if (slug.length === 3) {
        const countrySlug = slug[1];
        const citySlug = slug[2];

        const city = await getCityData(citySlug);
        if (!city) return notFound();

        if (!city.parentCountry || city.parentCountry.toLowerCase() !== countrySlug.toLowerCase()) {
            console.log(`Mismatch: URL says '${countrySlug}', but City belongs to '${city.parentCountry}'`);
            return notFound();
        }

        const guides = await getGuidesByTargetCity(citySlug);
        return <CityView city={city} guides={guides} userFavorites={userFavorites} />;
      }

  // Ako je URL predugačak
  return notFound();
}