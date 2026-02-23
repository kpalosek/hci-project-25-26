import { createClient } from 'contentful';
import { TransferGuide } from './data'; 

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Pomoćna funkcija za izvlačenje URL-a slike
const getImageUrl = (imageField: any): string | undefined => {
  if (!imageField?.fields?.file?.url) return undefined;
  return `https:${imageField.fields.file.url}`;
};

export async function getFeaturedGuides() {
  const response = await client.getEntries({
    content_type: 'transferGuide',
    'fields.isFeatured': true,
    include: 2,
  });

  return response.items.map((item: any) => {
    const fields = item.fields;
    
    return {
      id: fields.id,
      airportIata: fields.airport?.fields?.iata || 'UNKNOWN',
      targetCitySlug: fields.targetCity?.fields?.slug || 'UNKNOWN',
      type: fields.type || 'primary',
      transportOptions: fields.transportOptions?.map((opt: any) => ({
        type: opt.fields.type,
        price: opt.fields.price,
        duration: opt.fields.duration,
      })) || [],

      distance: fields.distance,
      isFeatured: true,
      
      // Slike i imena
      image: getImageUrl(fields.targetCity?.fields?.image),
      
      cityName: fields.targetCity?.fields?.name,
      cityImage: getImageUrl(fields.targetCity?.fields?.image),
      
      airportName: fields.airport?.fields?.name,
      airportImage: getImageUrl(fields.airport?.fields?.image),
    };
  });
}

export async function getAllContinents() {
  const response = await client.getEntries({
    content_type: 'continent',
    order: ['fields.name'], 
  });

  return response.items.map((item: any) => ({
    id: item.sys.id,
    name: item.fields.name,
    slug: item.fields.slug,
    description: item.fields.description,
    image: getImageUrl(item.fields.image),
  }));
}

export async function getContinentData(slug: string) {
  const response = await client.getEntries({
    content_type: 'continent',
    'fields.slug': slug,
    limit: 1,
  });

  if (response.items.length === 0) return null;
  const fields: any = response.items[0].fields;

  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description,
    image: getImageUrl(fields.image),
  };
}

export async function getCountriesByContinent(continentSlug: string) {
  const response = await client.getEntries({
    content_type: 'country',
    order: ['fields.name'],
    include: 2, 
  });

  const filteredItems = response.items.filter((item: any) => 
    item.fields.parentContinent?.fields?.slug === continentSlug
  );

  return filteredItems.map((item: any) => ({
    name: item.fields.name,
    slug: item.fields.slug,
    image: getImageUrl(item.fields.image),
    parentContinent: continentSlug,
  }));
}

export async function getCountryData(slug: string) {
  const response = await client.getEntries({
    content_type: 'country',
    'fields.slug': slug,
    limit: 1,
    include: 2,
  });

  if (response.items.length === 0) return null;
  const fields: any = response.items[0].fields;

  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description,
    image: getImageUrl(fields.image),
    parentContinent: fields.parentContinent?.fields?.slug,
  };
}

export async function getCitiesByCountry(countrySlug: string) {
  // 1. Dohvati ID države
  const countryResponse = await client.getEntries({
    content_type: 'country',
    'fields.slug': countrySlug,
    limit: 1,
  });

  if (countryResponse.items.length === 0) {
    console.error(`❌ Country '${countrySlug}' not found.`);
    return [];
  }

  const countryId = countryResponse.items[0].sys.id;

  // 2. Filtriraj gradove po ID-u države
  const response = await client.getEntries({
    content_type: 'city',
    'fields.parentCountry.sys.id': countryId,
    order: ['fields.name'],
    include: 2,
  });

  return response.items.map((item: any) => ({
    id: item.sys.id,
    name: item.fields.name,
    slug: item.fields.slug,
    image: getImageUrl(item.fields.image),
    parentCountry: countrySlug, 
  }));
}

export async function getAirportData(iata: string) {
  const response = await client.getEntries({
    content_type: 'airport',
    'fields.iata': iata,
    limit: 1,
    include: 3,
  });

  if (response.items.length === 0) return null;
  const fields: any = response.items[0].fields;

  const cityFields = fields.city?.fields;
  const countryFields = cityFields?.parentCountry?.fields;
  const continentFields = countryFields?.parentContinent?.fields;

  return {
    id: response.items[0].sys.id,
    name: fields.name,
    iata: fields.iata,
    image: getImageUrl(fields.image),
    locationCitySlug: cityFields?.slug,
    locationCityName: cityFields?.name,
    countrySlug: countryFields?.slug,
    countryName: countryFields?.name,
    continentSlug: continentFields?.slug,
  };
}

export async function getCityData(slug: string) {
  const response = await client.getEntries({
    content_type: 'city',
    'fields.slug': slug,
    limit: 1,
    include: 2 
  });

  if (response.items.length === 0) return null;
  
  const item = response.items[0];
  const fields: any = item.fields;
  const countryField = fields.country || fields.parentCountry;

  return {
    id: item.sys.id,
    name: fields.name,
    slug: fields.slug,
    image: getImageUrl(fields.image),
    description: fields.description,
    parentCountry: countryField?.fields?.slug, 
    countryName: countryField?.fields?.name,
    continentSlug: countryField?.fields?.parentContinent?.fields?.slug,
  };
}

export async function getTransferGuideFromCMS(airportIata: string, citySlug: string): Promise<TransferGuide | null> {

  try {
    // 1. DOHVAT SVIH VODIČA
    const response = await client.getEntries({
      content_type: 'transferGuide', 
      include: 4, 
    });

    // 2. FILTRIRANJE U KODU
    const foundItem = response.items.find((item: any) => {
      const airportCode = item.fields.airport?.fields?.iata;
      const targetSlug = item.fields.targetCity?.fields?.slug;

      return (
        airportCode?.toLowerCase() === airportIata.toLowerCase() &&
        targetSlug?.toLowerCase() === citySlug.toLowerCase()
      );
    });

    if (!foundItem) {
      console.log("⚠️ Guide not found.");
      return null;
    }

    const fields: any = foundItem.fields;
    const cityObj = fields.targetCity?.fields;
    const countryObj = cityObj?.parentCountry?.fields;
    const continentObj = countryObj?.parentContinent?.fields;

    const guide: TransferGuide = {
      id: fields.id,
      
      // Osnovni podaci
      airportIata: fields.airport?.fields?.iata || 'UNKNOWN',
      targetCitySlug: fields.targetCity?.fields?.slug || 'UNKNOWN',
      type: fields.type,
      distance: fields.distance,
      isFeatured: fields.isFeatured || false,
      airportName: fields.airport?.fields?.name,
      airportImage: getImageUrl(fields.airport?.fields?.image),
      cityName: fields.targetCity?.fields?.name,
      cityImage: getImageUrl(fields.targetCity?.fields?.image),   
      countryName: countryObj?.name,
      countrySlug: countryObj?.slug,
      continentSlug: continentObj?.slug,

      // Transport Opcije
      transportOptions: fields.transportOptions?.map((opt: any) => ({
        id: opt.fields.id,
        type: opt.fields.type,
        name: opt.fields.name,
        duration: opt.fields.duration,
        price: opt.fields.price,
        frequency: opt.fields.frequency,
        description: opt.fields.description,
        pros: opt.fields.pros || [],
        cons: opt.fields.cons || [],
      })) || []
    };

    return guide;

  } catch (error: any) {
    console.error("❌ CMS Error:", error.message);
    return null;
  }
}

// 1. DOHVAT SVIH VODIČA ZA ODREĐENI AERODROM (npr. svi transferi sa Split Airport)
export async function getGuidesByAirport(airportIata: string) {
  const response = await client.getEntries({
    content_type: 'transferGuide',
    include: 2, 
  });

  const filteredItems = response.items.filter((item: any) => 
    item.fields.airport?.fields?.iata === airportIata
  );

  return filteredItems.map((item: any) => {
    const fields = item.fields;
    return {
      id: fields.id,
      airportIata: fields.airport?.fields?.iata,
      targetCitySlug: fields.targetCity?.fields?.slug,
      
      type: fields.type || 'primary', 
      distance: fields.distance || 'N/A',

      cityImage: getImageUrl(fields.targetCity?.fields?.image),
      cityName: fields.targetCity?.fields?.name,
      airportName: fields.airport?.fields?.name,
      airportImage: getImageUrl(fields.airport?.fields?.image),

      transportOptions: fields.transportOptions?.map((opt: any) => ({
        type: opt.fields.type,
        price: opt.fields.price,
        duration: opt.fields.duration,
      })) || [],
    };
  });
}

// 2. DOHVAT SVIH VODIČA ZA ODREĐENI GRAD
export async function getGuidesByTargetCity(citySlug: string) {

  const response = await client.getEntries({
    content_type: 'transferGuide',
    include: 2,
  });

  const filteredItems = response.items.filter((item: any) => 
    item.fields.targetCity?.fields?.slug?.toLowerCase() === citySlug.toLowerCase()
  );

  return filteredItems.map((item: any) => {
    const fields = item.fields;
    return {
      id: fields.id,
      airportIata: fields.airport?.fields?.iata,
      targetCitySlug: fields.targetCity?.fields?.slug,
      
      type: fields.type || 'primary',
      distance: fields.distance || 'N/A',

      airportImage: getImageUrl(fields.airport?.fields?.image),
      airportName: fields.airport?.fields?.name,
      cityName: fields.targetCity?.fields?.name,
      cityImage: getImageUrl(fields.targetCity?.fields?.image),

      transportOptions: fields.transportOptions?.map((opt: any) => ({
        type: opt.fields.type,
        price: opt.fields.price,
        duration: opt.fields.duration,
      })) || [],
    };
  });
}

export async function getSearchData() {
  // 1. DOHVATI SVE GRADOVE
  const citiesRes = await client.getEntries({
    content_type: 'city',
    limit: 1000,
    include: 3,
  });

  const cities = citiesRes.items.map((item: any) => {
    const fields = item.fields;
    const countryObj = fields.parentCountry;
    const continentObj = countryObj?.fields?.parentContinent;

    if (!countryObj) console.warn(`⚠️ City '${fields.name}' has no connected country (parentCountry)!`);
    if (countryObj && !continentObj) console.warn(`⚠️ Country '${countryObj.fields.name}' has no connected continent (parentContinent)!`);

    return {
      name: fields.name,
      slug: fields.slug,
      parentCountry: countryObj?.fields?.slug,
      parentContinent: continentObj?.fields?.slug,
    };
  });

  // 2. DOHVATI SVE AERODROME
  const airportsRes = await client.getEntries({
    content_type: 'airport',
    limit: 1000,
    include: 2, 
  });

  const airports = airportsRes.items.map((item: any) => {
    const fields = item.fields;
    const cityObj = fields.city || fields.locationCity; 

    return {
      name: fields.name,
      iata: fields.iata,
      locationCitySlug: cityObj?.fields?.slug,
      locationCityName: cityObj?.fields?.name,
    };
  });

  console.log(`✅ Loaded ${cities.length} cities and ${airports.length} airports for search.`);
  
  return { cities, airports };
}

export async function getGuidesByFavorites(favoritesList: { airportIata: string, targetCitySlug: string }[]) {
  if (!favoritesList || favoritesList.length === 0) return [];

  const response = await client.getEntries({
    content_type: 'transferGuide',
    include: 2,
  });

  const filteredItems = response.items.filter((item: any) => {
    const guideIata = item.fields.airport?.fields?.iata;
    const guideSlug = item.fields.targetCity?.fields?.slug;
    
    return favoritesList.some(fav => 
      fav.airportIata === guideIata && fav.targetCitySlug === guideSlug
    );
  });

  return filteredItems.map((item: any) => {
    const fields = item.fields;
    return {
      id: fields.id,
      airportIata: fields.airport?.fields?.iata,
      targetCitySlug: fields.targetCity?.fields?.slug,
      
      type: fields.type || 'primary',
      distance: fields.distance || 'N/A',

      airportImage: getImageUrl(fields.airport?.fields?.image),
      airportName: fields.airport?.fields?.name,
      cityName: fields.targetCity?.fields?.name,
      cityImage: getImageUrl(fields.targetCity?.fields?.image),

      transportOptions: fields.transportOptions?.map((opt: any) => ({
        type: opt.fields.type,
        price: opt.fields.price,
        duration: opt.fields.duration,
      })) || [],
    };
  });
}