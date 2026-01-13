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
    // VANJSKI KONTEJNER
    <div className="relative w-full h-[400px] bg-gray-900 overflow-hidden flex justify-center">
      
      {/* UNUTARNJI KONTEJNER */}
      <div className="relative w-full max-w-[1920px] h-full flex shadow-2xl">
        
        {/* --- LIJEVA STRANA: AERODROM --- */}
        <div className="relative w-1/2 h-full border-r-4 border-white/20">
          {airportImage ? (
            <>
              <Image
                src={airportImage}
                alt={airportName}
                fill
                className="object-cover opacity-90"
                priority
              />
              {/* PROMJENA OVDJE:
                  1. w-1/3: Gradijent je sada puno širi (trećina slike)
                  2. via-gray-900/50: Dodan međukorak za glađi prijelaz
              */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-gray-900 via-gray-900/50 to-transparent z-10" />
            </>
          ) : (
            <div className="w-full h-full bg-slate-800" />
          )}
          
          {/* Overlay dolje-gore */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
          
          <div className="absolute top-8 left-4 md:left-8 bg-white text-black px-5 py-3 rounded-br-2xl rounded-tl-lg shadow-lg z-20">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">From</span>
            <span className="block text-3xl font-black leading-none">{airportIata}</span>
          </div>
        </div>

        {/* --- DESNA STRANA: GRAD --- */}
        <div className="relative w-1/2 h-full">
          {cityImage ? (
            <>
              <Image
                src={cityImage}
                alt={cityName}
                fill
                className="object-cover opacity-90"
                priority
              />
              {/* PROMJENA OVDJE (Desna strana):
                  Isto kao lijevo: širi gradijent s međukorakom.
              */}
              <div className="absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-gray-900 via-gray-900/50 to-transparent z-10" />
            </>
          ) : (
            <div className="w-full h-full bg-blue-900" />
          )}
          
          {/* Overlay dolje-gore */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />

          <div className="absolute top-8 right-4 md:right-8 bg-white text-black px-5 py-3 rounded-bl-2xl rounded-tr-lg shadow-lg z-20 text-right">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">To</span>
            <span className="block text-2xl md:text-3xl font-black leading-none">{cityName}</span>
          </div>
        </div>

        {/* --- INFO BUBBLES --- */}
        {/* ... ostatak koda je isti ... */}
        <div className="absolute bottom-6 w-full px-4 md:px-8 flex justify-center md:justify-end gap-3 md:gap-6 z-30">
          {distance && (
            <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl border-4 border-gray-100">
              <MapPin className="w-5 h-5 text-gray-400 mb-0.5" />
              <span className="text-sm md:text-lg font-bold text-gray-900">{distance}</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase">Dist</span>
            </div>
          )}
          <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl border-4 border-gray-100">
            <Clock className="w-5 h-5 text-blue-500 mb-0.5" />
            <span className="text-sm md:text-lg font-bold text-gray-900">{minTime}</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase">Min</span>
          </div>
          <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-xl border-4 border-gray-100">
            <Coins className="w-5 h-5 text-green-600 mb-0.5" />
            <span className="text-sm md:text-lg font-bold text-gray-900">{minPrice}</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase">Start</span>
          </div>
        </div>

      </div>
    </div>
  );
}