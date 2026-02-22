import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTransferGuideFromCMS } from "@/lib/contentful"; 
import GuideHeader from "@/components/guide/GuideHeader";
import TransportTabs from "@/components/guide/TransportTabs";

interface Props {
  params: Promise<{ airportCode: string; citySlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { airportCode, citySlug } = await params;
  
  const guide = await getTransferGuideFromCMS(airportCode, citySlug);

  if (!guide) {
    return {
      title: "Transfer Guide Not Found",
    };
  }

  const getPriceValue = (p: string) => parseFloat(p.replace(/[^0-9.]/g, '')) || Infinity;
  
  const cheapest = guide.transportOptions.reduce((min, curr) => 
    getPriceValue(curr.price) < getPriceValue(min.price) ? curr : min
  , guide.transportOptions[0]);

  const priceString = cheapest?.price ? `from ${cheapest.price}` : 'cheaply';
  const airport = guide.airportName || `${guide.airportIata} Airport`;
  const city = guide.cityName || citySlug;

  return {
    title: `Transfer from ${airport} (${guide.airportIata}) to ${city} | Air2City`,
    description: `Best ways to get from ${airport} to ${city}. Compare transport options, bus schedules and taxi prices starting ${priceString}. Distance: ${guide.distance}.`,
    openGraph: {
      title: `How to get from ${airport} to ${city}`,
      description: `Cheapest transfer options starting ${priceString}.`,
      images: guide.cityImage ? [guide.cityImage] : (guide.airportImage ? [guide.airportImage] : []),
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { airportCode, citySlug } = await params;

  // 1. DOHVAT IZ CMS-a
  const guide = await getTransferGuideFromCMS(airportCode, citySlug);

  if (!guide) {
    return notFound();
  }

  // Helperi za cijene i vrijeme
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

  const cheapestOption = guide.transportOptions.reduce((min, current) => 
    getPriceValue(current.price) < getPriceValue(min.price) ? current : min
  , guide.transportOptions[0]);

  const fastestOption = guide.transportOptions.reduce((min, current) => 
    getDurationValue(current.duration) < getDurationValue(min.duration) ? current : min
  , guide.transportOptions[0]);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">

      <GuideHeader 
        airportName={guide.airportName || `${guide.airportIata} Airport`}
        airportIata={guide.airportIata}
        airportImage={guide.airportImage}
        
        cityName={guide.cityName || guide.targetCitySlug}
        citySlug={guide.targetCitySlug}
        cityImage={guide.cityImage}
        
        countrySlug={guide.countrySlug || ""}
        continentSlug={guide.continentSlug || ""}
        
        distance={guide.distance}
        minTime={fastestOption?.duration || "N/A"}
        minPrice={cheapestOption?.price || "N/A"}
      />

      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 lg:-mt-6">
        <TransportTabs 
          airportName={guide.airportName || guide.airportIata}
          airportIata={guide.airportIata}
          cityName={guide.cityName || guide.targetCitySlug}
          options={guide.transportOptions}
        />
      </div>

    </main>
  );
}