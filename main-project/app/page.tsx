// app/page.tsx
import { Hero } from "@/components/Hero";
import { getFeaturedGuides } from "@/lib/data";
import FeaturedCarousel from "@/components/FeaturedCarousel"; // Importaj novu komponentu
import { TrendingUp } from "lucide-react";

export default function Home() {
  const featuredGuides = getFeaturedGuides();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section ... */}
      <Hero />
      {/* TRENDING SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        
        {/* Pozivamo komponentu i šaljemo joj SVE vodiče */}
        {/* Ona će sama brinuti o strelicama i prikazivanju 4 po 4 */}
        <FeaturedCarousel guides={featuredGuides} />

      </section>
    </main>
  );
}