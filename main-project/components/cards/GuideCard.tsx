import Link from "next/link";
import { TransferGuide } from "@/lib/data"; // Still importing the interface
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

  let imageUrl = guide.image;

    if (!imageUrl) {
      if (variant === 'airport') {
          imageUrl = guide.cityImage; 
      } else {
          imageUrl = guide.airportImage;
      }
    }

  imageUrl = imageUrl || "/images/placeholder.jpg"; 

  const cityName = guide.cityName || guide.targetCitySlug;
  const airportName = guide.airportName || `${guide.airportIata} Airport`;
  const options = guide.transportOptions || [];
  const distinctModes = Array.from(new Set(options.map(o => o.type)));

  const getPriceValue = (priceStr: string) => {
    if (!priceStr) return Infinity;
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? Infinity : num;
  };

  const getDurationValue = (durationStr: string) => {
    if (!durationStr) return Infinity;
    const num = parseInt(durationStr.replace(/\D/g, ''));
    return isNaN(num) ? Infinity : num;
  };

  const cheapestOption = options.length > 0 
    ? options.reduce((min, current) => 
        getPriceValue(current.price) < getPriceValue(min.price) ? current : min
      ) 
    : null;

  const fastestOption = options.length > 0 
    ? options.reduce((min, current) => 
        getDurationValue(current.duration) < getDurationValue(min.duration) ? current : min
      ) 
    : null;

  const displayPrice = cheapestOption ? `from ${cheapestOption.price}` : "N/A";
  const displayDuration = fastestOption ? `from ${fastestOption.duration}` : "N/A";

  return (
    <Link 
      href={`/guide/${guide.airportIata}/${guide.targetCitySlug}`}
      className="relative block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex-col group border border-gray-100"
    >
      
      {/* SLIKA */}
      <div className="h-48 overflow-hidden relative bg-gray-100">
        <img 
          src={imageUrl} 
          alt={`Transfer from ${airportName} to ${cityName}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* IATA Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 z-10">
          <div className="flex flex-col items-end leading-none">
            <span className="text-sm font-extrabold text-gray-900 leading-none">{guide.airportIata}</span>
          </div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
      </div>

      {/* SADRŽAJ */}
      <div className="p-5 flex flex-col flex-1">
        
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-1">
            <Plane className="h-3.5 w-3.5" />
            <span>Transfer to {cityName} Center</span>
          </div>
          <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {airportName}
          </h3>
        </div>
        
        {/* Info Redak (Cijena i Vrijeme) */}
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

        {/* Badgevi za tipove prijevoza */}
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