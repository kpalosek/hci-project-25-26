import { Search } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";

export function Hero() {
  return (
    // 1. POPRAVAK: Maknuli smo 'overflow-hidden' iz ove linije
    // Sada dropdown može "ispasti" van okvira sekcije i prijeći preko sadržaja ispod
    <section className="relative h-[600px] flex items-center justify-center bg-gray-900">
      
      {/* 2. POZADINA (Cinematic Container)
         Ovdje ZADRŽAVAMO 'overflow-hidden' tako da slika ne razbije layout,
         ali to sada utječe samo na sliku, ne na tražilicu ispred.
      */}
      <div className="absolute inset-0 flex justify-center overflow-hidden">
        
        {/* Unutarnji omotač slike (limit na 1920px) */}
        <div className="relative w-full max-w-[1920px] h-full">
          <img
            src="https://images.unsplash.com/photo-1594937113195-27f8b9046013?auto=format&fit=crop&q=80&w=1920" 
            alt="Airplane window view"
            className="w-full h-full object-cover"
          />
          
          {/* Maska lijevo */}
          <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-gray-900 to-transparent"></div>
          {/* Maska desno */}
          <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-gray-900 to-transparent"></div>
        </div>

      </div>

      {/* Overlay preko cijele sekcije */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* --- SADRŽAJ --- */}
      {/* Budući da je ovaj div 'relative z-10', a roditelj (section) nema overflow-hidden,
          dropdown unutar ovoga će se sada normalno prikazati. */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <h1 className="text-white mb-5 tracking-tight leading-tight text-5xl font-sans">
            Find Your Perfect Transfer
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto leading-relaxed text-xl font-sans">
            Compare and book airport transfers to city centers worldwide
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-lg p-2 hover:border-gray-400 transition-all">
            <div className="flex items-center gap-2 relative z-50 h-full w-full">
              <Search className="h-5 w-5 text-gray-500 ml-3 shrink-0" />
              <GlobalSearch 
                className="w-full h-full" 
                inputClassName="bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-500 text-lg px-2 h-full py-2"
                hideIcon={true} 
                placeholder="Enter airport or destination..."
                renderButton={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}