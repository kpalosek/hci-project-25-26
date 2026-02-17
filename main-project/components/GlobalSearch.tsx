'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchGlobalSearchData } from '@/app/actions'; 
import { Search, MapPin, Plane, X, Loader2 } from 'lucide-react';

interface SearchCity {
  name: string;
  slug: string;
  parentCountry: string;
  parentContinent: string;
}

interface SearchAirport {
  name: string;
  iata: string;
  locationCitySlug: string;
  locationCityName?: string;
}

interface Props {
  className?: string;
  inputClassName?: string;
  hideIcon?: boolean;
  placeholder?: string;
  renderButton?: boolean;
}

export default function GlobalSearch({ 
  className = "w-full max-w-3xl",
  inputClassName = "",
  hideIcon = false,
  placeholder = "Enter airport or destination...",
  renderButton = false 
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const [allCities, setAllCities] = useState<SearchCity[]>([]);
  const [allAirports, setAllAirports] = useState<SearchAirport[]>([]);
  
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [filteredCities, setFilteredCities] = useState<SearchCity[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<SearchAirport[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleFocus = async () => {
    if (hasFetched) {
      if (query.length >= 2) setIsOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const { cities, airports } = await fetchGlobalSearchData();
      setAllCities(cities);
      setAllAirports(airports);
      setHasFetched(true);

    } catch (error) {
      console.error("Failed to fetch search data", error);
    } finally {
      setIsLoading(false);
      if (query.length >= 2) setIsOpen(true);
    }
  };

  useEffect(() => {
    if (query.length < 2) {
      setFilteredCities([]);
      setFilteredAirports([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const foundCities = allCities.filter(c => 
      c.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    const foundAirports = allAirports.filter(a => {
      const cityName = a.locationCityName ? a.locationCityName.toLowerCase() : '';
      return (
        a.name.toLowerCase().includes(lowerQuery) || 
        a.iata.toLowerCase().includes(lowerQuery) || 
        cityName.includes(lowerQuery)
      );
    }).slice(0, 3);

    setFilteredCities(foundCities);
    setFilteredAirports(foundAirports);
    
    if (!isLoading) {
        setIsOpen(true);
    }
  }, [query, allCities, allAirports, isLoading]);

  const handleSelectCity = (city: SearchCity) => {
    setIsOpen(false);
    setQuery('');
    if (city.parentContinent && city.parentCountry) {
      router.push(`/explore/${city.parentContinent}/${city.parentCountry}/${city.slug}`);
    }
  };

  const handleSelectAirport = (airport: SearchAirport) => {
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
        
      <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100"> 
          
          <form onSubmit={handleSmartSearch} className="flex flex-col gap-2 md:flex-row md:items-center">
            
            {/* INPUT SEKCIJA */}
            <div className="flex items-center px-2 flex-1"> 
                {/* Ikona */}
                {!hideIcon && (
                   <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                )}
                
                <div className="relative flex-1">
                    <input
                        type="text"
                        className={`block w-full py-2 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-base font-medium ${inputClassName}`}
                        placeholder={placeholder}
                        value={query}
                        onFocus={handleFocus}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                    />
                     {/* Loader / Clear Button */}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : query ? (
                            <button 
                                type="button" 
                                onClick={() => { setQuery(''); setIsOpen(false); }}
                            >
                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* GUMB SEKCIJA */}
            {renderButton && (
                <button
                    type="submit"
                    className="bg-slate-900 text-white w-full md:w-auto px-8 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md uppercase tracking-wide font-semibold text-sm shrink-0"
                >
                    Search
                </button>
            )}
          </form>
      </div>

      {/* DROPDOWN REZULTATA */}
      {isOpen && !isLoading && (filteredCities.length > 0 || filteredAirports.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 text-left">
           {/* GRADOVI */}
           {filteredCities.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Cities</div>
              {filteredCities.map((city) => (
                <button 
                  type="button" 
                  key={city.slug} 
                  onClick={() => handleSelectCity(city)} 
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 transition-colors group border-b border-gray-50 last:border-0"
                >
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 text-blue-600 transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block text-sm">{city.name}</span>
                    <span className="text-xs text-gray-500 capitalize">
                      {city.parentCountry}, {city.parentContinent}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
           {filteredCities.length > 0 && filteredAirports.length > 0 && <div className="border-t border-gray-100" />}
           {/* AERODROMI */}
           {filteredAirports.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Airports</div>
              {filteredAirports.map((airport) => (
                <button 
                  type="button" 
                  key={airport.iata} 
                  onClick={() => handleSelectAirport(airport)} 
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-3 transition-colors group border-b border-gray-50 last:border-0"
                >
                  <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 text-orange-600 transition-colors">
                    <Plane className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block text-sm">{airport.name} ({airport.iata})</span>
                    <span className="text-xs text-gray-500 capitalize">
                      {airport.locationCityName || airport.locationCitySlug}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}