"use client"

import { useSession } from "@/lib/auth-client";
import Link from 'next/link';
import { TransferGuide } from '@/lib/data'; 
import GuideCard from "@/components/cards/GuideCard";

interface City {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parentCountry?: string;
  countryName?: string;
  continentSlug?: string;
}

interface Props {
  city: City;
  guides: TransferGuide[];
  userFavorites?: { airportIata: string; targetCitySlug: string }[]; // <-- ADDED
}

export default function CityView({ city, guides, userFavorites = [] }: Props) { // <-- ADDED DEFAULT

  const { data: session } = useSession();

  const continentSlug = city.continentSlug || 'europe';
  const countryName = city.countryName || city.parentCountry;

  const primaryGuides = guides.filter(g => g.type === 'primary');
  const nearbyGuides = guides.filter(g => g.type === 'nearby');

  const ResponsiveGrid = ({ items }: { items: TransferGuide[] }) => (
    <div className="
      flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-hide
      md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:pb-0 md:mx-0 md:px-0 md:overflow-visible
    ">
      {items.map((guide) => {
        // <-- ADDED FAVORITE CHECK -->
        const isFav = userFavorites?.some(
          (fav) => fav.airportIata === guide.airportIata && fav.targetCitySlug === guide.targetCitySlug
        );

        return (
          <div 
            key={guide.id} 
            className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0"
          >
            <GuideCard 
              guide={guide} 
              variant="city" 
              session={session} 
              initialIsFavorited={isFav} // <-- PASSED TO CARD
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:p-12">
      
      {/* HEADER & BREADCRUMBS */}
      <div className="mb-10">
        <nav className="flex items-center flex-wrap text-sm text-gray-500 mb-6 font-medium">
          
          {/* 1. WORLD */}
          <Link 
            href="/explore" 
            className="hover:text-blue-600 transition-colors"
          >
            World
          </Link>

          <span className="mx-2 text-gray-300">/</span>

          {/* 2. CONTINENT */}
          <Link 
            href={`/explore/${continentSlug}`}
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {continentSlug || 'Continent'}
          </Link>

          <span className="mx-2 text-gray-300">/</span>

          {/* 3. COUNTRY */}
          <Link 
            href={`/explore/${continentSlug}/${city.parentCountry}`}
            className="hover:text-blue-600 transition-colors"
          >
            {countryName}
          </Link>

          <span className="mx-2 text-gray-300">/</span>

          {/* 4. CURRENT CITY */}
          <span className="text-gray-900 font-semibold">
            {city.name}
          </span>

        </nav>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Transport to {city.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Find the best ways to get to {city.name} from nearby airports. Compare prices, duration and transport types.
        </p>
      </div>
      
      {/* EMPTY STATE */}
      {guides.length === 0 && (
        <div className="py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-lg">We are currently adding transfer guides for {city.name}.</p>
        </div>
      )}

      {/* --- PRIMARY AIRPORTS --- */}
      {primaryGuides.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Primary Airports
            </h2>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Closest & Fastest
            </span>
          </div>
          
          <ResponsiveGrid items={primaryGuides} />
        </div>
      )}

      {/* --- NEARBY AIRPORTS --- */}
      {nearbyGuides.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
             <h2 className="text-2xl font-bold text-gray-900">
              Alternative Airports
            </h2>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Often Cheaper
            </span>
          </div>
          
          <ResponsiveGrid items={nearbyGuides} />
        </div>
      )}

    </div>
  );
}