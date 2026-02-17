import { Hero } from "@/components/Hero";
import { getFeaturedGuides } from "@/lib/contentful"; 
import FeaturedCarousel from "@/components/FeaturedCarousel"; 

export default async function Home() {
  
  const featuredGuides = await getFeaturedGuides();

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <FeaturedCarousel guides={featuredGuides} />
      </section>
    </main>
  );
}