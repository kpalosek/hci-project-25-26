import Link from "next/link";
import { TransferGuide, getAirport, cities } from "@/lib/data";
import { Clock, DollarSign, Plane } from "lucide-react";

interface Props {
  guide: TransferGuide;
  variant?: 'city' | 'airport'; 
}

const modeStyles: Record<string, string> = {
  bus:     "bg-orange-50 text-orange-700",
  shuttle: "bg-orange-50 text-orange-700",
  taxi:    "bg-yellow-50 text-yellow-700",
  uber:    "bg-yellow-50 text-yellow-700",
  train:   "bg-green-50 text-green-700",
  subway:  "bg-purple-50 text-purple-700",
  rer:     "bg-green-50 text-green-700",
};

export default function GuideCard({ guide, variant = 'city' }: Props) {
  const airport = getAirport(guide.airportIata);
  const city = cities.find(c => c.slug === guide.targetCitySlug);

  const showAirportImage = variant === 'airport' && airport?.image;
  const imageUrl = showAirportImage ? airport.image : city?.image;

  // --- POPRAVAK GREŠKE ---
  // Budući da sada imamo 'transportOptions' (niz objekata), a ne 'transportMethods' (niz stringova),
  // moramo izvući samo tipove prijevoza da bismo ih prikazali kao badgeve.
  // Koristimo Set da maknemo duplikate (npr. ako imaš 2 busa, da ne piše dvaput BUS).
  
  // 1. Provjeri postoji li niz (za svaki slučaj)
  const options = guide.transportOptions || [];

  // 2. Izvuci jedinstvene tipove (npr. ['bus', 'train'])
  const distinctModes = Array.from(new Set(options.map(o => o.type)));

  // 3. Izvuci najnižu cijenu i najkraće trajanje za prikaz na kartici
  // (Ovo je opcionalno poboljšanje, možeš zadržati i stare stringove ako ih imaš)
  const displayDuration = options[0]?.duration ||  "N/A";
  const displayPrice = options[0]?.price ||  "N/A";

  return (
    <Link 
      href={`/guide/${guide.airportIata}/${guide.targetCitySlug}`}
      className="relative block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex-col group border border-gray-100"
    >
      
      {/* SLIKA */}
      <div className="h-48 overflow-hidden relative bg-gray-100">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={showAirportImage ? `${airport?.name} terminal` : `${city?.name} destination`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">🏙️</div>
        )}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 z-10">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">FROM</span>
            <span className="text-sm font-extrabold text-gray-900 leading-none">{guide.airportIata}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
      </div>

      {/* SADRŽAJ */}
      <div className="p-5 flex flex-col flex-1">
        
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-1">
            <Plane className="h-3.5 w-3.5" />
            <span>Transfer to {city?.name} Center</span>
          </div>
          <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {airport ? airport.name : guide.airportIata}
          </h3>
        </div>
        
        {/* Info Redak */}
        <div className="flex items-center gap-4 mb-3 text-gray-600 mt-auto">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">{displayDuration}</span> 
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">{displayPrice}</span>
          </div>
        </div>

        {/* Badgevi - OVDJE JE BIO PROBLEM */}
        <div className="flex flex-wrap gap-2">
          {distinctModes.map((mode) => (
            <span 
              key={mode}
              className={`text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide ${
                modeStyles[mode] || "bg-blue-50 text-blue-700"
              }`}
            >
              {mode}
            </span>
          ))}
        </div>

      </div>
    </Link>
  );
}