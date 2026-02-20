"use client"

import { useSession } from "@/lib/auth-client";
import Link from 'next/link';
import { TransferGuide } from '@/lib/data'; 
import GuideCard from "@/components/cards/GuideCard";

interface Airport {
  id: string;
  name: string;
  iata: string;
  image?: string;
  locationCitySlug?: string;
  locationCityName?: string;
  countrySlug?: string;
  countryName?: string;
  continentSlug?: string;
}

interface Props {
  airport: Airport;
  guides: TransferGuide[];
  userFavorites?: { airportIata: string; targetCitySlug: string }[]; // <-- ADDED
}

export default function AirportView({ airport, guides, userFavorites = [] }: Props) { // <-- ADDED DEFAULT

  const { data: session } = useSession();

  const continentSlug = airport.continentSlug || 'europe';
  const countrySlug = airport.countrySlug;
  const countryName = airport.countryName || 'Country';
  const cityName = airport.locationCityName || 'City Center';

  const primaryGuides = guides.filter(g => g.targetCitySlug === airport.locationCitySlug);
  const nearbyGuides = guides.filter(g => g.targetCitySlug !== airport.locationCitySlug);

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
      
      {/* HEADER */}
      <div className="mb-10">
        <Link 
          // Link na Explore stranicu države
          href={`/explore/${continentSlug}/${countrySlug}`}
          className="text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 inline-flex items-center transition-colors"
        >
          &larr; Back to {countryName}
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Transfers from {airport.name} ({airport.iata})
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Find the best ways to reach {cityName} or nearby destinations directly from the airport.
        </p>
      </div>
      
      {/* EMPTY STATE */}
      {guides.length === 0 && (
        <div className="py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-lg">No transfer routes found from this airport yet.</p>
        </div>
      )}

      {/* --- SECTION 1: CITY CENTER TRANSFER (Primary) --- */}
      {primaryGuides.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              To {cityName} City Center
            </h2>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Most Popular
            </span>
          </div>
          
          <ResponsiveGrid items={primaryGuides} />
        </div>
      )}

      {/* --- SECTION 2: NEARBY CITIES (Intercity) --- */}
      {nearbyGuides.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              To Nearby Cities
            </h2>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Connections
            </span>
          </div>
          
          <ResponsiveGrid items={nearbyGuides} />
        </div>
      )}

    </div>
  );
}