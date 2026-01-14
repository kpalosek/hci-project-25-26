import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Coins } from "lucide-react";

interface Props {
  airportName: string;
  airportIata: string;
  airportImage?: string;
  cityName: string;
  citySlug: string;
  countrySlug: string;
  continentSlug: string;
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
  citySlug,
  countrySlug,
  continentSlug,
  cityImage,
  distance,
  minTime,
  minPrice,
}: Props) {
  
  // Konstrukcija linka za grad (osiguravamo da ne pukne ako fali podataka)
  const cityUrl = (continentSlug && countrySlug && citySlug) 
    ? `/explore/${continentSlug}/${countrySlug}/${citySlug}`
    : "#";

  return (
    <div className="relative w-full h-[400px] bg-gray-900 flex justify-center z-0">
      <div className="absolute inset-0 w-full h-full overflow-hidden flex justify-center">
        <div className="relative w-full max-w-[1920px] h-full flex shadow-2xl">
          
          {/* --- LIJEVA STRANA: AERODROM --- */}
          <div className="relative w-1/2 h-full border-r-4 border-white/20 group/left">
            {airportImage ? (
              <>
                <Image
                  src={airportImage}
                  alt={airportName}
                  fill
                  className="object-cover opacity-90 transition-transform duration-700" // Bez hover efekta na sliku
                  priority
                />
                <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-gray-900 via-gray-900/50 to-transparent z-10" />
              </>
            ) : (
              <div className="w-full h-full bg-slate-800" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />

            {/* BADGE (Lijevi) - Link na Airport Overview */}
            <Link
              href={`/guide/${airportIata}`} // <-- POPRAVLJEN LINK
              className="absolute top-6 left-4 md:top-8 md:left-8 z-20 group"
            >
              <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-sm transition-all group-hover:bg-black/70 group-hover:scale-105 border border-white/10 ml-auto inline-block">
                <span className="block text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider mb-0.5">
                  From Airport
                </span>
                <span className="block text-xl md:text-4xl font-black leading-none tracking-tight">
                  {airportIata}
                </span>
              </div>
            </Link>
          </div>

          {/* --- DESNA STRANA: GRAD --- */}
          <div className="relative w-1/2 h-full group/right">
            {cityImage ? (
              <>
                <Image
                  src={cityImage}
                  alt={cityName}
                  fill
                  className="object-cover opacity-90 transition-transform duration-700" // Bez hover efekta na sliku
                  priority
                />
                <div className="absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-gray-900 via-gray-900/50 to-transparent z-10" />
              </>
            ) : (
              <div className="w-full h-full bg-blue-900" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />

            {/* BADGE (Desni) - Link na City Overview */}
            <Link
              href={cityUrl}
              className="absolute top-6 right-4 md:top-8 md:left-8 z-20 group text-right"
            >
              <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-sm transition-all group-hover:bg-black/70 group-hover:scale-105 border border-white/10 ml-auto inline-block">
                <span className="block text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider mb-0.5">
                  To City
                </span>
                <span className="block text-lg md:text-3xl font-black leading-tight tracking-tight wrap-break-words max-w-[150px] md:max-w-none">
                  {cityName}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* INFO BUBBLES */}
      <div className="absolute -bottom-10 md:-bottom-12 w-full max-w-[1920px] px-4 md:px-12 flex justify-center md:justify-end gap-3 md:gap-6 z-40 pointer-events-none">
        {distance && (
          <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-2xl border-4 border-gray-50 pointer-events-auto">
            <MapPin className="w-5 h-5 text-gray-400 mb-0.5" />
            <span className="text-sm md:text-lg font-bold text-gray-900 leading-none">
              {distance}
            </span>
            <span className="text-[10px] text-gray-500 font-medium uppercase mt-1">
              Dist
            </span>
          </div>
        )}
        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-2xl border-4 border-gray-50 pointer-events-auto">
          <Clock className="w-5 h-5 text-blue-500 mb-0.5" />
          <span className="text-sm md:text-lg font-bold text-gray-900 leading-none">
            {minTime}
          </span>
          <span className="text-[10px] text-gray-500 font-medium uppercase mt-1">
            Min
          </span>
        </div>
        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-2xl border-4 border-gray-50 pointer-events-auto">
          <Coins className="w-5 h-5 text-green-600 mb-0.5" />
          <span className="text-sm md:text-lg font-bold text-gray-900 leading-none">
            {minPrice}
          </span>
          <span className="text-[10px] text-gray-500 font-medium uppercase mt-1">
            Start
          </span>
        </div>
      </div>
    </div>
  );
}