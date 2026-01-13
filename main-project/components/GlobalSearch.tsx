'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cities, airports, countries, City, Airport } from '@/lib/data';
import { Search, MapPin, Plane, X } from 'lucide-react';

interface Props {
  className?: string;
  inputClassName?: string;
  hideIcon?: boolean;
  placeholder?: string;
  renderButton?: boolean;
}

export default function GlobalSearch({ 
  className = "w-full max-w-md", 
  inputClassName = "",
  hideIcon = false,
  placeholder = "Search city or airport...",
  renderButton = false 
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setFilteredCities([]);
      setFilteredAirports([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // 1. FILTRIRANJE GRADOVA (Standardno)
    const foundCities = cities.filter(c => 
      c.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    // 2. FILTRIRANJE AERODROMA (Napredno)
    const foundAirports = airports.filter(a => {
      // Pronađi grad kojem ovaj aerodrom pripada da možemo pretražiti i njegovo ime
      const city = cities.find(c => c.slug === a.locationCitySlug);
      const cityName = city ? city.name.toLowerCase() : '';

      return (
        a.name.toLowerCase().includes(lowerQuery) || // Traži po imenu (npr. "Heathrow")
        a.iata.toLowerCase().includes(lowerQuery) || // Traži po kodu (npr. "LHR")
        cityName.includes(lowerQuery)                // Traži po gradu (npr. "London")
      );
    }).slice(0, 3);

    setFilteredCities(foundCities);
    setFilteredAirports(foundAirports);
    setIsOpen(true);
  }, [query]);

  // --- Ostatak logike navigacije je isti ---
  const handleSelectCity = (city: City) => {
    setIsOpen(false);
    setQuery('');
    const country = countries.find(c => c.slug === city.parentCountry);
    const continent = country?.parentContinent;
    if (continent && country) {
      router.push(`/explore/${continent}/${country.slug}/${city.slug}`);
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/guide/${airport.iata}`);
  };

  const handleSmartSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (filteredCities.length > 0) handleSelectCity(filteredCities[0]);
    else if (filteredAirports.length > 0) handleSelectAirport(filteredAirports[0]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchContainerRef} className={`relative ${className}`}>
      <form onSubmit={handleSmartSearch} className="relative flex items-center h-full gap-2">
        <div className="relative flex-1 h-full flex items-center">
            {!hideIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            )}
            
            <input
              type="text"
              className={`block w-full py-3 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition-shadow sm:text-sm ${!hideIcon ? 'pl-10' : 'pl-2'} pr-10 ${inputClassName}`}
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
              }}
              onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
            />

            {query && (
            <button 
                type="button" 
                onClick={() => { setQuery(''); setIsOpen(false); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
            )}
        </div>

        {renderButton && (
            <button
                type="submit"
                className="bg-linear-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 hover:from-slate-800/95 hover:via-slate-700/95 hover:to-slate-800/95 text-white px-8 py-2.5 rounded-xl transition-all shadow-md uppercase tracking-wide shrink-0 h-full"
            >
                Search
            </button>
        )}
      </form>

      {isOpen && (filteredCities.length > 0 || filteredAirports.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 text-left">
           
           {/* GRADOVI */}
           {filteredCities.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Cities</div>
              {filteredCities.map((city) => (
                <button type="button" key={city.slug} onClick={() => handleSelectCity(city)} className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 transition-colors group">
                  <div className="bg-blue-100 p-1.5 rounded-lg group-hover:bg-blue-200 text-blue-600"><MapPin className="h-4 w-4" /></div>
                  <div><span className="font-medium text-gray-900 block">{city.name}</span><span className="text-xs text-gray-500 capitalize">{city.parentCountry}</span></div>
                </button>
              ))}
            </div>
          )}

           {filteredCities.length > 0 && filteredAirports.length > 0 && <div className="border-t border-gray-100 my-1" />}

           {/* AERODROMI - OVDJE JE PROMJENA PRIKAZA */}
           {filteredAirports.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Airports</div>
              {filteredAirports.map((airport) => {
                // Pronađi grad za prikaz "lijepog" imena
                const city = cities.find(c => c.slug === airport.locationCitySlug);
                
                return (
                  <button type="button" key={airport.iata} onClick={() => handleSelectAirport(airport)} className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-3 transition-colors group">
                    <div className="bg-orange-100 p-1.5 rounded-lg group-hover:bg-orange-200 text-orange-600"><Plane className="h-4 w-4" /></div>
                    <div>
                      <span className="font-medium text-gray-900 block">{airport.name} ({airport.iata})</span>
                      {/* Prikazujemo city.name (npr. New York City) umjesto slug-a */}
                      <span className="text-xs text-gray-500 capitalize">
                        {city ? city.name : airport.locationCitySlug}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}