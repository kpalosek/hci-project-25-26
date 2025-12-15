import Link from 'next/link';
import { Country, City } from '@/lib/data';

interface Props {
  country: Country;
  cities: City[];
}

export default function CountryView({ country, cities }: Props) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* HEADER I BREADCRUMBS */}
      <div className="mb-8">
        <Link 
          href={`/explore/${country.parentContinent}`} 
          className="text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 inline-block transition-colors"
        >
          &larr; Back to Continent
        </Link>
        
        <div className="flex items-baseline gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {country.name}
          </h1>
          <span className="text-gray-500 text-lg">
            Select a city
          </span>
        </div>
      </div>
      
      {/* GRID GRADOVA */}
      {cities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city) => (
            <Link 
              key={city.slug}
              href={`/explore/${country.parentContinent}/${country.slug}/${city.slug}`}
              className="group block h-full"
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden h-full flex flex-col">
                
                {/* SLIKA GRADA */}
                {/* Napomena: Ovo pretpostavlja da si dodao 'image' u City interface. 
                    Ako nisi, ovaj dio će baciti grešku ili biti prazan. */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {/* @ts-ignore - privremeno ignoriramo TS grešku ako još nisi dodao image polje */}
                  {city.image ? (
                     <img 
                       /* @ts-ignore */
                       src={city.image} 
                       alt={city.name}
                       className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                     />
                  ) : (
                    // Fallback ako nema slike
                    <div className="flex items-center justify-center h-full text-4xl">🏙️</div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                {/* TEXT CONTENT */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                      {city.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      View airport transfer guides for {city.name} and nearby locations.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm">
                    View Transport Options &rarr;
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No cities listed for this country yet.</p>
        </div>
      )}
    </div>
  );
}