export interface TransportOption {
  id: string;
  type: 'bus' | 'shuttle' | 'taxi' | 'uber' | 'train' | 'subway' | 'rer';
  name: string;
  duration: string;
  price: string;
  frequency: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface TransferGuide {
  id: string;
  airportIata: string;
  targetCitySlug: string;
  type: "primary" | "nearby";
  distance: string;
  transportOptions: TransportOption[];
  isFeatured?: boolean;
  
  // Metadata iz CMS-a
  image?: string;
  airportName?: string;
  airportImage?: string;
  cityName?: string;
  cityImage?: string;
  countrySlug?: string;
  countryName?: string;
  continentSlug?: string;
}

export interface Airport {
  id: string;
  name: string;
  iata: string;
  locationCitySlug?: string;
  locationCityName?: string;
  countrySlug?: string;
  countryName?: string;
  continentSlug?: string;
  image?: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parentCountry?: string;
  countryName?: string;
  continentSlug?: string;
}

export interface Country {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentContinent?: string;
}

export interface Continent {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}