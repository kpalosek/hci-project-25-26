// lib/data.ts

// ==========================================
// 1. TIPOVI PODATAKA (Interfaces)
// ==========================================

export interface TransportOption {
  id: string; // npr. 'bus-express'
  type: 'bus' | 'train' | 'taxi' | 'uber' | 'shuttle' | 'subway';
  name: string; // npr. "Le Bus Direct" ili "RER B"
  duration: string;
  price: string;
  frequency: string; // npr. "Svakih 15 min"
  bookingLink?: string;
  description: string; // Ovdje ide detaljan tekst (Markdown ili HTML) samo za tu metodu
  pros: string[]; // Kratke natuknice zašto odabrati ovo
  cons: string[]; // Kratke natuknice zašto NE odabrati ovo
}

export interface Continent {
  slug: string;
  name: string;
  description: string;
  image?: string;
}

export interface Country {
  slug: string;
  name: string;
  parentContinent: string;
  image?: string;
}

export interface City {
  slug: string;
  name: string;
  parentCountry: string;
  image?: string;
}

export interface Airport {
  iata: string;
  name: string;
  locationCitySlug: string;
  image?: string
}

export interface TransferGuide {
  id: string;
  airportIata: string;
  targetCitySlug: string;
  type: 'primary' | 'nearby';
  distance: string,
  transportOptions: TransportOption[];
  isFeatured?: boolean;
}

// ==========================================
// 2. PODACI (Baza)
// ==========================================

export const continents: Continent[] = [
  { 
    slug: 'europe', 
    name: 'Europe', 
    description: 'Ancient history, diverse cultures, and seamless connections.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
  },
  { 
    slug: 'asia', 
    name: 'Asia', 
    description: 'From bustling metropolises to serene landscapes.',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80'
  },
  { 
    slug: 'north-america', 
    name: 'North America', 
    description: 'Iconic skylines, vast national parks, and road trips.',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
  },
  { 
    slug: 'south-america', 
    name: 'South America', 
    description: 'Vibrant cultures, the Amazon rainforest, and Andes peaks.',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80' 
    // Machu Picchu
  },
  { 
    slug: 'africa', 
    name: 'Africa', 
    description: 'Wild safaris, ancient pyramids, and breathtaking nature.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80'
    // Kenija/Safari
  },
  { 
    slug: 'australia', // ili 'oceania' ovisno što preferiraš
    name: 'Australia', 
    description: 'The land down under, coral reefs, and surfing beaches.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
    // Sydney Opera House
  }
];

export const countries: Country[] = [
  // Europe
  { slug: 'croatia', name: 'Croatia', parentContinent: 'europe', image: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?auto=format&fit=crop&w=800&q=80' },
  { slug: 'france', name: 'France', parentContinent: 'europe', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
  // Asia
  { slug: 'japan', name: 'Japan', parentContinent: 'asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
  // North America
  { slug: 'usa', name: 'United States', parentContinent: 'north-america', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80' },
  // South America
  { slug: 'brazil', name: 'Brazil', parentContinent: 'south-america', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80' },
  // Africa
  { slug: 'egypt', name: 'Egypt', parentContinent: 'africa', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80' },
  // Australia
  { slug: 'australia', name: 'Australia', parentContinent: 'australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80' },
];

export const cities: City[] = [
  // Croatia
  { slug: 'zadar', name: 'Zadar', parentCountry: 'croatia', image: 'https://images.unsplash.com/photo-1661178434473-6daf1940d913?auto=format&fit=crop&w=800&q=80' },
  { slug: 'split', name: 'Split', parentCountry: 'croatia', image: 'https://images.unsplash.com/photo-1564679937942-90c22d5a0e6e?auto=format&fit=crop&w=800&q=80'},
  // France
  { slug: 'paris', name: 'Paris', parentCountry: 'france', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
  // Japan
  { slug: 'tokyo', name: 'Tokyo', parentCountry: 'japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
  // USA
  { slug: 'new-york', name: 'New York City', parentCountry: 'usa', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80' },
  // Brazil
  { slug: 'rio', name: 'Rio de Janeiro', parentCountry: 'brazil', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80' },
  // Egypt
  { slug: 'cairo', name: 'Cairo', parentCountry: 'egypt', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80' },
  // Australia
  { slug: 'sydney', name: 'Sydney', parentCountry: 'australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80' },
];

export const airports: Airport[] = [
  // Croatia
  { iata: 'ZAD', name: 'Zadar Airport', locationCitySlug: 'zadar', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Zadar_airport_terminal_croatia.JPG/330px-Zadar_airport_terminal_croatia.JPG' },
  { iata: 'SPU', name: 'Split Airport', locationCitySlug: 'split', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Split_Airport_new_terminal_night.jpg' },
  // France
  { iata: 'CDG', name: 'Charles de Gaulle', locationCitySlug: 'paris', image: 'https://images.unsplash.com/photo-1472664596512-0d00517b6ae0?auto=format&fit=crop&w=800&q=80' },
  { iata: 'BVA', name: 'Beauvais', locationCitySlug: 'paris', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Beauvais_airport_2012_-_panoramio.jpg/1200px-Beauvais_airport_2012_-_panoramio.jpg' },
  // USA (Placeholder)
  { iata: 'JFK', name: 'John F. Kennedy', locationCitySlug: 'new-york', image: 'https://images.unsplash.com/photo-1544975331-f15ed1a1c28f?auto=format&fit=crop&w=800&q=80' },
  { iata: 'LGA', name: 'LaGuardia Airport', locationCitySlug: 'new-york', image: 'https://images.unsplash.com/photo-1706963162691-ae2be3d2eff5?auto=format&fit=crop&w=800&q=80' },
  { iata: 'EWR', name: 'Newark Liberty Airport', locationCitySlug: 'new-york', image: 'https://images.unsplash.com/photo-1485727511593-8c9f45ea2a06?auto=format&fit=crop&w=800&q=80' },
];

export const transferGuides: TransferGuide[] = [
  // --- ZADAR ---
  {
    id: 'zad-zadar',
    airportIata: 'ZAD',
    targetCitySlug: 'zadar',
    type: 'primary',
    distance: '8 km',
    transportOptions: [
      {
        id: 'train',
        type: 'train',
        name: 'RER B Train',
        duration: '35 min',
        price: '€11.80',
        frequency: 'Every 10-15 min',
        description: 'The RER B is the fastest way to reach the city center...',
        pros: ['Fastest option', 'Avoids traffic', 'Cheapest'],
        cons: ['Can be crowded', 'Pickpockets warning']
      },
      {
        id: 'taxi',
        type: 'taxi',
        name: 'Official Taxi',
        duration: '45-60 min',
        price: '€55 (Fixed)',
        frequency: 'Always available',
        description: 'Taxis are located at the exit of the baggage claim area...',
        pros: ['Door-to-door', 'Comfortable', 'Fixed price'],
        cons: ['Expensive', 'Risk of traffic jams']
      }
    ],
    isFeatured: true
  },
  {
    id: 'zad-split',
    airportIata: 'ZAD',
    targetCitySlug: 'split',
    type: 'nearby',
    distance: '80 km',
    transportOptions: [
      {
        id: 'train',
        type: 'train',
        name: 'RER B Train',
        duration: '35 min',
        price: '€11.80',
        frequency: 'Every 10-15 min',
        description: 'The RER B is the fastest way to reach the city center...',
        pros: ['Fastest option', 'Avoids traffic', 'Cheapest'],
        cons: ['Can be crowded', 'Pickpockets warning']
      },
      {
        id: 'taxi',
        type: 'taxi',
        name: 'Official Taxi',
        duration: '45-60 min',
        price: '€55 (Fixed)',
        frequency: 'Always available',
        description: 'Taxis are located at the exit of the baggage claim area...',
        pros: ['Door-to-door', 'Comfortable', 'Fixed price'],
        cons: ['Expensive', 'Risk of traffic jams']
      }
    ],
    isFeatured: false
  },
  // --- SPLIT ---
  {
    id: 'spu-split',
    airportIata: 'SPU',
    targetCitySlug: 'split',
    type: 'primary',
    distance: '25 km',
    transportOptions: [
      {
        id: 'train',
        type: 'train',
        name: 'RER B Train',
        duration: '35 min',
        price: '11.80',
        frequency: 'Every 10-15 min',
        description: 'The RER B is the fastest way to reach the city center...',
        pros: ['Fastest option', 'Avoids traffic', 'Cheapest'],
        cons: ['Can be crowded', 'Pickpockets warning']
      },
      {
        id: 'taxi',
        type: 'taxi',
        name: 'Official Taxi',
        duration: '45-60 min',
        price: '€55 (Fixed)',
        frequency: 'Always available',
        description: 'Taxis are located at the exit of the baggage claim area...',
        pros: ['Door-to-door', 'Comfortable', 'Fixed price'],
        cons: ['Expensive', 'Risk of traffic jams']
      }
    ],
    isFeatured: true
  },
  // --- PARIS ---
  {
    id: 'cdg-paris',
    airportIata: 'CDG',
    targetCitySlug: 'paris',
    type: 'primary',
    distance: '30 km',
    transportOptions: [
      {
        id: 'train',
        type: 'train',
        name: 'RER B Train',
        duration: '35 min',
        price: '€11.80',
        frequency: 'Every 10-15 min',
        description: 'The RER B is the fastest way to reach the city center...',
        pros: ['Fastest option', 'Avoids traffic', 'Cheapest'],
        cons: ['Can be crowded', 'Pickpockets warning']
      },
      {
        id: 'taxi',
        type: 'taxi',
        name: 'Official Taxi',
        duration: '45-60 min',
        price: '€55 (Fixed)',
        frequency: 'Always available',
        description: 'Taxis are located at the exit of the baggage claim area...',
        pros: ['Door-to-door', 'Comfortable', 'Fixed price'],
        cons: ['Expensive', 'Risk of traffic jams']
      }
    ],
    isFeatured: true
  },
  // --- NEW YORK (Placeholder) ---
  {
    id: 'jfk-nyc',
    airportIata: 'JFK',
    targetCitySlug: 'new-york',
    type: 'primary',
    distance: '20 km',
    transportOptions: [
      {
        id: 'train',
        type: 'train',
        name: 'RER B Train',
        duration: '35 min',
        price: '€11.80',
        frequency: 'Every 10-15 min',
        description: 'The RER B is the fastest way to reach the city center...',
        pros: ['Fastest option', 'Avoids traffic', 'Cheapest'],
        cons: ['Can be crowded', 'Pickpockets warning']
      },
      {
        id: 'taxi',
        type: 'taxi',
        name: 'Official Taxi',
        duration: '45-60 min',
        price: '€55 (Fixed)',
        frequency: 'Always available',
        description: 'Taxis are located at the exit of the baggage claim area...',
        pros: ['Door-to-door', 'Comfortable', 'Fixed price'],
        cons: ['Expensive', 'Risk of traffic jams']
      }
    ],
    isFeatured: true
  },
  {
    id: 'lga-nyc',
    airportIata: 'LGA',
    targetCitySlug: 'new-york',
    type: 'primary',
    distance: '15 km',
    transportOptions: [
      {
        id: 'train',
        type: 'train',
        name: 'RER B Train',
        duration: '35 min',
        price: '€11.80',
        frequency: 'Every 10-15 min',
        description: 'The RER B is the fastest way to reach the city center...',
        pros: ['Fastest option', 'Avoids traffic', 'Cheapest'],
        cons: ['Can be crowded', 'Pickpockets warning']
      },
      {
        id: 'taxi',
        type: 'taxi',
        name: 'Official Taxi',
        duration: '45-60 min',
        price: '€55 (Fixed)',
        frequency: 'Always available',
        description: 'Taxis are located at the exit of the baggage claim area...',
        pros: ['Door-to-door', 'Comfortable', 'Fixed price'],
        cons: ['Expensive', 'Risk of traffic jams']
      }
    ],
    isFeatured: true
  },
  {
    id: 'ewr-nyc',
    airportIata: 'EWR',
    targetCitySlug: 'new-york',
    type: 'primary',
    distance: '40 km',
    transportOptions: [
      {
        id: 'train',
        type: 'train',
        name: 'RER B Train',
        duration: '35 min',
        price: '€11.80',
        frequency: 'Every 10-15 min',
        description: 'The RER B is the fastest way to reach the city center...',
        pros: ['Fastest option', 'Avoids traffic', 'Cheapest'],
        cons: ['Can be crowded', 'Pickpockets warning']
      },
      {
        id: 'taxi',
        type: 'taxi',
        name: 'Official Taxi',
        duration: '45-60 min',
        price: '€55 (Fixed)',
        frequency: 'Always available',
        description: 'Taxis are located at the exit of the baggage claim area...',
        pros: ['Door-to-door', 'Comfortable', 'Fixed price'],
        cons: ['Expensive', 'Risk of traffic jams']
      }
    ],
    isFeatured: true
  }
];

// ==========================================
// 3. HELPER FUNKCIJE
// ==========================================

export const getAllContinents = () => continents;

export const getContinent = (slug: string) => continents.find(c => c.slug === slug);

export const getCountriesByContinent = (continentSlug: string) => {
  return countries.filter(c => c.parentContinent === continentSlug);
};

export const getCountry = (slug: string, parentContinent: string) => {
  return countries.find(c => c.slug === slug && c.parentContinent === parentContinent);
};

export const getCitiesByCountry = (countrySlug: string) => {
  return cities.filter(c => c.parentCountry === countrySlug);
};

export const getCity = (slug: string, parentCountry: string) => {
  return cities.find(c => c.slug === slug && c.parentCountry === parentCountry);
};

export const getGuidesForCity = (citySlug: string) => {
  return transferGuides.filter(g => g.targetCitySlug === citySlug);
};

export const getAirport = (iata: string) => airports.find(a => a.iata === iata);

export const getGuidesFromAirport = (airportIata: string) => {
  return transferGuides.filter(g => g.airportIata === airportIata);
};

export const getSpecificGuide = (airportIata: string, citySlug: string) => {
  return transferGuides.find(g => g.airportIata === airportIata && g.targetCitySlug === citySlug);
};

export const getFeaturedGuides = () => {
  return transferGuides.filter(g => g.isFeatured);
};

export const getGuideByAirportAndCity = (airportCode: string, citySlug: string) => {
  return transferGuides.find((guide) => 
    // Koristimo .toLowerCase() za svaki slučaj, da 'ZAD' i 'zad' rade isto
    guide.airportIata.toLowerCase() === airportCode.toLowerCase() &&
    guide.targetCitySlug.toLowerCase() === citySlug.toLowerCase()
  );
};