import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllContinents } from "@/lib/contentful";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse all countries and airports...",
};

export default async function ExplorePage() {
  const continents = await getAllContinents();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
      
      {/* HEADER SEKCIJA */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Explore by Continent
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Select a region to find detailed airport transfer guides, transport options, and travel tips.
        </p>
      </div>

      {/* GRID KARTICA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {continents.map((c) => (
          <Link 
            key={c.slug} 
            href={`/explore/${c.slug}`} 
            className="group block h-full"
          >
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
              
              <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-100 text-gray-300">
                    🌍
                  </div>
                )}
                
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 transition-colors">
                    {c.name}
                  </h2>
                  
                  
                  <span className="text-black-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View Countries &rarr;
                  </span>
                </div>
                
                <p className="text-gray-600 leading-relaxed flex-1 line-clamp-3">
                  {c.description}
                </p>
                
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}