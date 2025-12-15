import Link from 'next/link';
import { City, TransferGuide, getAirport } from '@/lib/data';

interface Props {
  city: City;
  guides: TransferGuide[];
}

export default function CityView({ city, guides }: Props) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transport to {city.name}</h1>
      
      {guides.length === 0 ? <p>No guides available.</p> : (
        <div className="grid gap-4">
          {guides.map((guide) => {
            // Trebamo ime aerodroma za prikaz
            const airport = getAirport(guide.airportIata);
            
            return (
              <div key={guide.id} className="border p-4 rounded">
                <h3 className="font-bold">From: {airport?.name} ({guide.airportIata})</h3>
                <p className="text-sm text-gray-600">
                  Type: {guide.type} | Price: {guide.price} | Duration: {guide.duration}
                </p>
                <Link 
                  href={`/guide/${guide.airportIata}/${guide.targetCitySlug}`}
                  className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View Guide
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}