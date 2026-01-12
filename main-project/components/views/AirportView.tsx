import Link from 'next/link';
import { Airport, TransferGuide, cities, countries } from '@/lib/data';
import GuideCard from "@/components/cards/GuideCard";

interface Props {
  airport: Airport;
  guides: TransferGuide[];
}

export default function AirportView({ airport, guides }: Props) {
  
  // 1. Dohvaćamo "Matični grad" aerodroma da složimo Breadcrumbs i logiku
  const locationCity = cities.find(c => c.slug === airport.locationCitySlug);
  
  // Dohvaćamo državu radi breadcrumb navigacije
  const parentCountryObj = countries.find(c => c.slug === locationCity?.parentCountry);
  const continentSlug = parentCountryObj?.parentContinent;

  // 2. FILTRIRANJE:
  // Primary = Vodiči koji voze u grad gdje se aerodrom nalazi (npr. ZAD -> Zadar)
  const primaryGuides = guides.filter(g => g.targetCitySlug === airport.locationCitySlug);
  
  // Nearby = Vodiči koji voze u druge gradove (npr. ZAD -> Split)
  const nearbyGuides = guides.filter(g => g.targetCitySlug !== airport.locationCitySlug);

  // 3. RESPONSIVE GRID (Isto kao u CityView: Scroll na mobitelu, Grid na desktopu)
  const ResponsiveGrid = ({ items }: { items: TransferGuide[] }) => (
    <div className="
      flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-hide
      md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:pb-0 md:mx-0 md:px-0 md:overflow-visible
    ">
      {items.map((guide) => (
        <div 
          key={guide.id} 
          className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0"
        >
          {/* VAŽNO: Ovdje koristimo variant="city" (default).
             Budući da smo na aerodromu, želimo vidjeti slike DESTINACIJA (gradova).
          */}
          <GuideCard guide={guide} variant="city" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* HEADER */}
      <div className="mb-8">
        <Link 
          href={continentSlug && parentCountryObj ? `/explore/${continentSlug}/${parentCountryObj.slug}` : '/explore'}
          className="text-sm font-medium text-gray-500 hover:text-blue-600 mb-3 inline-block transition-colors"
        >
          &larr; Back to {parentCountryObj?.name || 'Country'}
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Transfers from {airport.name} ({airport.iata})
        </h1>
        <p className="text-lg text-gray-600">
          Find the best ways to reach {locationCity?.name} or nearby destinations.
        </p>
      </div>
      
      {/* EMPTY STATE */}
      {guides.length === 0 && (
        <div className="p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center text-gray-500">
          No transfer routes found from this airport.
        </div>
      )}

      {/* --- SECTION 1: CITY CENTER TRANSFER (Primary) --- */}
      {primaryGuides.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
            To {locationCity?.name} City Center
            <span className="hidden sm:inline-block text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Local Transfer
            </span>
          </h2>
          
          <ResponsiveGrid items={primaryGuides} />
        </div>
      )}

      {/* --- SECTION 2: NEARBY CITIES (Intercity) --- */}
      {nearbyGuides.length > 0 && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
            To Nearby Cities
            <span className="hidden sm:inline-block text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Day Trips & Connections
            </span>
          </h2>
          
          <ResponsiveGrid items={nearbyGuides} />
        </div>
      )}

    </div>
  );
}