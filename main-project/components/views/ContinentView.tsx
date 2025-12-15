import Link from 'next/link';
import { Continent, Country } from '@/lib/data';

interface Props {
  continent: Continent;
  countries: Country[];
}

export default function ContinentView({ continent, countries }: Props) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* HEADER */}
      <div className="mb-10 text-center md:text-left">
        <Link 
          href="/explore" 
          className="text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 inline-block transition-colors"
        >
          &larr; Back to World Map
        </Link>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {continent.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          {continent.description}
        </p>
      </div>

      {/* GRID DRŽAVA */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Available Countries
      </h2>

      {countries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {countries.map((country) => (
            <Link 
              key={country.slug}
              href={`/explore/${continent.slug}/${country.slug}`}
              className="group block h-full"
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden h-full flex flex-col">
                
                {/* SLIKA DRŽAVE */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {country.image ? (
                    <img 
                      src={country.image} 
                      alt={country.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    // Fallback ako nema slike
                    <div className="flex items-center justify-center h-full text-4xl bg-blue-50">🏳️</div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                {/* CONTENT */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {country.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Explore popular cities and airport connections in {country.name}.
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      View Cities
                    </span>
                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Prikaz ako nema država (prazno stanje)
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">
            No countries listed for {continent.name} yet.
          </p>
        </div>
      )}
    </div>
  );
}