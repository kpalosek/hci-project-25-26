import Link from "next/link";
import { getAllContinents } from "@/lib/data";

export default function ExplorePage() {
  const continents = getAllContinents();

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* HEADER SEKCIJA */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Explore by Continent
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a region to find detailed airport transfer guides and travel tips.
        </p>
      </div>

      {/* GRID KARTICA (3 stupca) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {continents.map((c) => (
          <Link 
            key={c.slug} 
            href={`/explore/${c.slug}`} 
            className="group block h-full"
          >
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
              
              {/* SLIKA KARTICE */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={c.image} 
                  alt={c.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay gradient da tekst bude čitljiviji ako ga staviš preko slike */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* SADRŽAJ KARTICE */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {c.name}
                  </h2>
                  <span className="text-blue-500 bg-blue-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    ➝
                  </span>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-4 flex-1">
                  {c.description}
                </p>
                
                <div className="text-sm font-semibold text-blue-600 mt-auto">
                  View Countries &rarr;
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}