import Link from 'next/link';
import Image from 'next/image';

interface City {
  id?: string;
  name: string;
  slug: string;
  image?: string;
}

interface Country {
  name: string;
  slug: string;
  description?: string;
  parentContinent?: string;
}

interface Props {
  country: Country;
  cities: City[];
}

export default function CountryView({ country, cities }: Props) {
  const continentSlug = country.parentContinent || 'europe';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
      {/* HEADER I BREADCRUMBS */}
      <div className="mb-10">
        <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium">
          
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
            {continentSlug}
          </Link>

          <span className="mx-2 text-gray-300">/</span>

          {/* 3. COUNTRY */}
          <span className="text-gray-900 font-semibold">
            {country.name}
          </span>

        </nav>
        
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {country.name} Transfers
          </h1>
          <span className="text-gray-500 text-lg">
            Choose a destination
          </span>
        </div>
        {country.description && (
          <p className="mt-4 text-gray-600 max-w-2xl">{country.description}</p>
        )}
      </div>
      
      {/* GRID GRADOVA */}
      {cities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Link 
              key={city.slug}
              href={`/explore/${continentSlug}/${country.slug}/${city.slug}`}
              className="group block h-full"
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                  {city.image ? (
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-50 text-gray-300">
                      🏙️
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 transition-colors">
                      {city.name}
                    </h3>

                    <span className="text-black-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      View Airports &rarr;
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed flex-1 line-clamp-3">
                    Airport transfers & local guides
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No destinations found in {country.name}.</p>
        </div>
      )}
    </div>
  );
}