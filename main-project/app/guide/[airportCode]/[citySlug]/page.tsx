import { notFound } from "next/navigation";
import Link from "next/link";
import { getSpecificGuide, getAirport } from "@/lib/data";

interface PageProps {
  params: { airportCode: string; citySlug: string };
}

export default async function GuidePage({ params }: PageProps) {
  // Await params (Next.js 15 standard)
  const { airportCode, citySlug } = await params;

  // 1. Dohvati podatke
  const guide = getSpecificGuide(airportCode, citySlug);
  const airport = getAirport(airportCode);

  // 2. Ako vodič ne postoji (npr. netko upiše krivi URL), baci 404
  if (!guide || !airport) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Breadcrumb za povratak */}
      <Link href={`/guide/${airportCode}`} className="text-sm text-gray-500 hover:underline mb-4 block">
        &larr; Back to {airport.name} options
      </Link>

      {/* HEADER */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Transfer: {airport.name} ({airportCode}) ➝ {citySlug.toUpperCase()}
        </h1>
        <div className="mt-4 flex gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            guide.type === 'primary' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {guide.type === 'primary' ? 'Primary Option' : 'Nearby / Alternative'}
          </span>
        </div>
      </div>

      {/* INFO BOX (Cijena i Trajanje) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center">
          <p className="text-sm text-blue-600 uppercase font-semibold">Avg. Price</p>
          <p className="text-3xl font-bold text-blue-900">{guide.price}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center">
          <p className="text-sm text-blue-600 uppercase font-semibold">Duration</p>
          <p className="text-3xl font-bold text-blue-900">{guide.duration}</p>
        </div>
      </div>

      {/* CONTENT (Tekst vodiča) */}
      <article className="prose lg:prose-xl text-gray-700 leading-relaxed">
        <h3 className="text-xl font-bold mb-2">Instructions</h3>
        {/* Ovdje samo ispisujemo tekst. Kasnije možeš dodati Markdown renderer */}
        <p className="whitespace-pre-line">{guide.markdownContent}</p>
      </article>
    </div>
  );
}