import Link from 'next/link';
import { City, TransferGuide, countries } from '@/lib/data';
import GuideCard from "@/components/cards/GuideCard";

interface Props {
  city: City;
  guides: TransferGuide[];
}

export default function CityView({ city, guides }: Props) {
  
  // 1. Pronađi državu da bi saznao kontinent (za Back link)
  const parentCountryObj = countries.find(c => c.slug === city.parentCountry);
  const continentSlug = parentCountryObj?.parentContinent;

  // 2. FILTRIRANJE: Razdvoji vodiče na primarne i nearby
  const primaryGuides = guides.filter(g => g.type === 'primary');
  const nearbyGuides = guides.filter(g => g.type === 'nearby');

  return (
    <div className="max-w-7xl mx-auto p-8">
      
      {/* HEADER & NAVIGACIJA */}
      <div className="mb-10">
        <Link 
          href={continentSlug ? `/explore/${continentSlug}/${city.parentCountry}` : '/explore'}
          className="text-sm font-medium text-gray-500 hover:text-blue-600 mb-3 inline-block transition-colors"
        >
          &larr; Back to {parentCountryObj?.name || 'Country'}
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Find transfer options to {city.name}
        </h1>
        <p className="text-xl text-gray-600">
          Select your airport of arrival and find out the best way to get to city of {city.name}.
        </p>
      </div>
      
      {/* 3. LOGIKA PRIKAZA: Ako nema niti jednog vodiča */}
      {guides.length === 0 && (
        <div className="p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center text-gray-500">
          No transfer guides available for {city.name} yet.
        </div>
      )}

      {/* --- SEKCIJA 1: PRIMARY AIRPORTS (Gornji red) --- */}
      {primaryGuides.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Primary Airports
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {primaryGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      )}

      {/* --- SEKCIJA 2: NEARBY AIRPORTS (Donji red) --- */}
      {nearbyGuides.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Nearby Airports
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nearbyGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}