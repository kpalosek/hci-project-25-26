import { Hero } from "@/components/Hero";
import { getFeaturedGuides, getGuidesByFavorites } from "@/lib/contentful";
import { getUserFavorites } from "@/app/favoriteActions";
import SavedCarousel from "@/components/SavedCarousel"; 
import FeaturedCarousel from "@/components/FeaturedCarousel"; 

export default async function Home() {

  const userFavorites = await getUserFavorites();
  const featuredGuides = await getFeaturedGuides();

  let savedGuides: any[] = [];
  if (userFavorites.length > 0) {
    savedGuides = await getGuidesByFavorites(userFavorites);
  }

return (
    <main className="min-h-screen bg-white">
      <Hero />
      
      {savedGuides.length > 0 && (
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SavedCarousel guides={savedGuides} userFavorites={userFavorites} />
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedCarousel guides={featuredGuides} userFavorites={userFavorites} />
        </div>
      </section>
    </main>
  );
}