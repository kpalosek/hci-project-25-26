import Image from "next/image";
import { MapPin, Clock, Coins } from "lucide-react";

interface Props {
  airportName: string;
  airportIata: string;
  airportImage?: string;
  cityName: string;
  cityImage?: string;
  distance?: string;
  minTime: string;
  minPrice: string;
}

export default function GuideHeader({
  airportName,
  airportIata,
  airportImage,
  cityName,
  cityImage,
  distance,
  minTime,
  minPrice,
}: Props) {
  return (
    <div className="relative w-full h-[400px] bg-gray-900 overflow-hidden">
      
      {/* --- SPLIT BACKGROUND IMAGES --- */}
      <div className="absolute inset-0 flex">
        {/* Lijeva strana: Aerodrom */}
        <div className="relative w-1/2 h-full border-r-4 border-white/20">
          {airportImage ? (
            <Image
              src={airportImage}
              alt={airportName}
              fill
              className="object-cover opacity-90"
              priority
            />
          ) : (
            <div className="w-full h-full bg-slate-800" />
          )}
          {/* Overlay gradient lijevo */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
          
          {/* Badge: From AIRPORT */}
          <div className="absolute top-8 left-4 md:left-8 bg-white text-black px-5 py-3 rounded-br-2xl rounded-tl-lg shadow-lg z-10">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">From</span>
            <span className="block text-3xl font-black leading-none">{airportName} ({airportIata})</span>
          </div>
        </div>

        {/* Desna strana: Grad */}
        <div className="relative w-1/2 h-full">
          {cityImage ? (
            <Image
              src={cityImage}
              alt={cityName}
              fill
              className="object-cover opacity-90"
              priority
            />
          ) : (
            <div className="w-full h-full bg-blue-900" />
          )}
          {/* Overlay gradient desno */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />

          {/* Badge: To CITY */}
          <div className="absolute top-8 right-4 md:right-8 bg-white text-black px-5 py-3 rounded-bl-2xl rounded-tr-lg shadow-lg z-10 text-right">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">To</span>
            <span className="block text-2xl md:text-3xl font-black leading-none">{cityName}</span>
          </div>
        </div>
      </div>

      {/* --- INFO BUBBLES (Circles) --- */}
      {/* Pozicionirani na dnu, centrirani preko granice ili desno kao na konceptu */}
      <div className="absolute bottom-6 w-full px-4 md:px-8 flex justify-center md:justify-end gap-3 md:gap-6 z-20">
        
        {/* 1. Distance */}
        {distance && (
          <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl border-4 border-gray-100">
            <MapPin className="w-5 h-5 text-gray-400 mb-0.5" />
            <span className="text-sm md:text-lg font-bold text-gray-900">{distance}</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase">Dist</span>
          </div>
        )}

        {/* 2. Time */}
        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl border-4 border-gray-100">
          <Clock className="w-5 h-5 text-blue-500 mb-0.5" />
          <span className="text-sm md:text-lg font-bold text-gray-900">{minTime}</span>
          <span className="text-[10px] text-gray-500 font-medium uppercase">Min</span>
        </div>

        {/* 3. Price */}
        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl border-4 border-gray-100">
          <Coins className="w-5 h-5 text-green-600 mb-0.5" />
          <span className="text-sm md:text-lg font-bold text-gray-900">{minPrice}</span>
          <span className="text-[10px] text-gray-500 font-medium uppercase">Start</span>
        </div>
      </div>
    </div>
  );
}