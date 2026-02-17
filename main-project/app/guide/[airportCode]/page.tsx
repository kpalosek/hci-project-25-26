import { notFound } from "next/navigation";
import type { Metadata } from "next"; //
import { getAirportData, getGuidesByAirport } from "@/lib/contentful"; 
import AirportView from "@/components/views/AirportView"; 

interface PageProps {
  params: Promise<{ airportCode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { airportCode } = await params;
  const airport = await getAirportData(airportCode);

  if (!airport) {
    return {
      title: "Airport Not Found",
    };
  }

  return {
    title: `Transfers from ${airport.name} (${airport.iata}) | Air2City`,
    description: `Find transfers from ${airport.name}...`,
  };
}

export default async function AirportPage({ params }: PageProps) {

  const { airportCode } = await params;
  const airport = await getAirportData(airportCode);
  const availableGuides = await getGuidesByAirport(airportCode);

  if (!airport) return notFound();

  return <AirportView airport={airport} guides={availableGuides} />;
}