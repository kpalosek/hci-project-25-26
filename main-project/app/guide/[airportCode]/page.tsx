import { notFound } from "next/navigation";
import Link from "next/link";
import { getAirport, getGuidesFromAirport } from "@/lib/data";

interface PageProps {
  params: { airportCode: string };
}

export default async function AirportPage({ params }: PageProps) {
  const { airportCode } = await params;

  // 1. Dohvati info o aerodromu
  const airport = getAirport(airportCode);
  if (!airport) return notFound();

  // 2. Dohvati sve vodiče koji kreću s ovog aerodroma
  const availableGuides = getGuidesFromAirport(airportCode);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{airport.name} ({airportCode})</h1>
        <p className="text-gray-600">
          Location: <span className="capitalize">{airport.locationCitySlug}</span>
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Available Connections:</h2>
      
      {availableGuides.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {availableGuides.map((guide) => (
            <Link 
              key={guide.id}
              href={`/guide/${airportCode}/${guide.targetCitySlug}`}
              className="group block border rounded-lg p-6 hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                  To: {guide.targetCitySlug.toUpperCase()}
                </h3>
                <span className="text-xl">👉</span>
              </div>
              <div className="mt-2 text-sm text-gray-500 flex gap-4">
                <span>⏱️ {guide.duration}</span>
                <span>💶 {guide.price}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No transfer guides available for this airport yet.</p>
      )}
    </div>
  );
}