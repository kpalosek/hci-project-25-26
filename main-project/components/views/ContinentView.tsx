import Link from 'next/link';
import Image from 'next/image';
import { Continent, Country } from '@/lib/data';

interface Props {
  continent: Continent;
  countries: Country[];
}

export default function ContinentView({ continent, countries }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
      {/* HEADER */}
      <div className="mb-10 text-center md:text-left">
        <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium">
          
          {/* 1. ROOT */}
          <Link 
            href="/explore" 
            className="hover:text-blue-600 transition-colors"
          >
            World
          </Link>

          <span className="mx-2 text-gray-300">/</span>

          {/* 2. CURRENT PAGE */}
          <span className="text-gray-900 font-semibold capitalize">
            {continent.slug}
          </span>

        </nav>
        
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
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                  {country.image ? (
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-100 text-gray-300">
                      🏳️
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                  <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 transition-colors">
                      {country.name}
                    </h3>

                    <span className="text-black-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      View Cities &rarr;
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed flex-1 line-clamp-3">
                    Explore popular cities and airport connections in {country.name}.
                  </p>
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