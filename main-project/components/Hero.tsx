import { Search } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";

export function Hero() {
  return (
    <section className="relative h-[600px] flex items-center justify-center bg-gray-900">
      <div className="absolute inset-0 flex justify-center overflow-hidden">
        
        <div className="relative w-full max-w-[1920px] h-full">
          <img
            src="https://images.unsplash.com/photo-1594937113195-27f8b9046013?auto=format&fit=crop&q=80&w=1920" 
            alt="Airplane window view"
            className="w-full h-full object-cover"
          /> 
          <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-gray-900 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-gray-900 to-transparent"></div>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <h1 className="text-white mb-5 tracking-tight leading-tight text-6xl font-semibold font-sans">
            Find Your Perfect Transfer
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto leading-relaxed text-2xl font-sans">
            Compare and book airport transfers to city centers worldwide
          </p>
        </div>

        <div className="w-full max-w-md md:max-w-4xl mx-auto p-4">
          <GlobalSearch 
            renderButton={true}
            placeholder="Enter airport or destination..."
          />
        </div>
      </div>
    </section>
  );
}