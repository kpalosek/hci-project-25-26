'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TransportOption } from '@/lib/data';
import { Bus, Train, Car, SquareM, Check, X, User, AlertCircle, Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { getUpdatesForAirport } from "@/app/updateActions";
import UpdateModal from '@/components/updates/UpdateModal';

interface Props {
  airportName: string;
  airportIata: string;
  cityName: string;
  options: TransportOption[];
}

const typeColors: Record<string, string> = {
  bus: "border-orange-500 bg-orange-50 text-orange-700",
  shuttle: "border-orange-500 bg-orange-50 text-orange-700",
  train: "border-yellow-400 bg-yellow-50 text-yellow-800",
  subway: "border-purple-500 bg-purple-50 text-purple-800",
  taxi: "border-gray-800 bg-gray-100 text-gray-900",
  uber: "border-black bg-gray-100 text-black",
};

const getUpdateBadgeColor = (type: string) => {
  switch (type) {
    case "bus": case "shuttle": return "bg-blue-100 text-blue-700 border-blue-200";
    case "uber": return "bg-black text-white border-gray-800";
    case "taxi": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "train": case "subway": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const iconMap: Record<string, any> = {
  bus: Bus, shuttle: Bus, train: Train, subway: SquareM, taxi: Car, uber: Car
};

export default function TransportTabs({ airportName, airportIata, cityName, options }: Props) {
  const [activeTabId, setActiveTabId] = useState(options[0]?.id);
  const activeOption = options.find(o => o.id === activeTabId) || options[0];
  
  // Stanja za bazu i modale
  const { data: session } = useSession();
  const [updates, setUpdates] = useState<any[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [pendingUpdateIntent, setPendingUpdateIntent] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
      if (session && typeof window !== 'undefined') {
        const hasIntent = localStorage.getItem('pendingUpdateIntent');
      
      if (hasIntent === 'true') {
        setIsUpdateModalOpen(true);
        localStorage.removeItem('pendingUpdateIntent');
      }
    }
  }, [session]);

  // Funkcija koja dohvaća prave podatke iz baze
  const fetchUpdates = async () => {
    setLoadingUpdates(true);
    const result = await getUpdatesForAirport(airportIata);
    if (result.success && result.data) {
      setUpdates(result.data);
    }
    setLoadingUpdates(false);
  };

  // Povuci podatke čim se komponenta učita
  useEffect(() => {
    fetchUpdates();
  }, [airportIata]);

  // LOGIKA KLIKA NA GUMB ZA OBJAVU
  const handlePostClick = () => {
      if (session) {
        setIsUpdateModalOpen(true);
      } else {
        localStorage.setItem('pendingUpdateIntent', 'true');
        window.dispatchEvent(new Event('openAuthModal'));
      }
    };

  const handleUpdateSuccess = () => {
    fetchUpdates(); // 1. Povuci najnovije objave iz baze
    setShowSuccessToast(true); // 2. Pokaži zelenu poruku
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30 pb-20 w-full">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- LIJEVI STUPAC (Glavni sadržaj - ostaje nepromijenjen) --- */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0 w-full">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide w-full">
            {options.map((option) => {
              const Icon = iconMap[option.type] || Bus;
              const isActive = activeTabId === option.id;
              const activeStyle = typeColors[option.type] || "border-blue-600 bg-blue-50 text-blue-700";

              return (
                <button
                  key={option.id}
                  onClick={() => setActiveTabId(option.id)}
                  className={`
                    flex items-center gap-3 px-6 py-4 min-w-40 rounded-t-lg transition-all shadow-sm border-b-4 bg-white
                    ${isActive ? `${activeStyle} font-bold shadow-md transform -translate-y-1` : 'text-gray-500 border-transparent hover:bg-gray-50'}
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? '' : 'text-gray-400'}`} />
                  <span className="text-lg capitalize">{option.type}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-xl min-h-[400px] p-6 md:p-10 border border-gray-100">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
              <span className="capitalize">{activeOption.type}</span> guide from {airportName} to {cityName}
            </h1>
            <div className="space-y-8">
              <div className="prose prose-lg text-gray-600">
                <ReactMarkdown>{activeOption.description}</ReactMarkdown>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                  <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                    <div className="p-1 bg-green-200 rounded-full"><Check className="w-4 h-4" /></div>
                    Why choose this?
                  </h3>
                  <ul className="space-y-3">
                    {activeOption.pros.map((pro, i) => (
                      <li key={i} className="text-green-900 text-sm flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />{pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                  <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                    <div className="p-1 bg-red-200 rounded-full"><X className="w-4 h-4" /></div>
                    Downsides
                  </h3>
                  <ul className="space-y-3">
                    {activeOption.cons.map((con, i) => (
                      <li key={i} className="text-red-900 text-sm flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- DESNI STUPAC (PRAVI UPDATEOVI IZ BAZE) --- */}
        <div className="lg:col-span-1 min-w-0">
          <div className="sticky top-24 space-y-6 mt-24">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden flex flex-col max-h-[600px]">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                <h3 className="font-bold text-gray-900">Latest Updates</h3>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                </span>
              </div>

              {/* Lista Updateova (Scrollable) */}
              <div className="divide-y divide-gray-100 bg-white overflow-y-auto grow">
                {loadingUpdates ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : updates.length > 0 ? (
                  updates.map((update) => (
                    <div key={update.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        {/* Umjesto title-a prikazujemo type bedž lijevo gore */}
                        <span className={`shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${getUpdateBadgeColor(update.type)}`}>
                          {update.type}
                        </span>
                      </div>
                      
                      {/* Sadržaj iz baze (text) umjesto mock contenta */}
                      <p className="text-sm text-gray-800 mb-4 leading-relaxed font-medium">
                        {update.text}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-500" />
                          </div>
                          {/* Ime korisnika iz baze */}
                          <span className="text-[11px] font-medium text-gray-500">
                            {update.userName || "Traveler"} 
                          </span>
                        </div>
                        {/* Vrijeme iz baze */}
                        <span className="text-[10px] text-gray-400" suppressHydrationWarning>
                          {new Date(update.createdAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No recent updates</p>
                  </div>
                )}
              </div>
              
              {/* Footer Button - MAGIJA SE DOGAĐA OVDJE */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-center shrink-0">
                <button 
                  onClick={handlePostClick}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors py-2 w-full"
                >
                  + Post an Update
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* RENDERIRANJE MODALA ZA PISANJE OVDJE */}
      <UpdateModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        airportIata={airportIata}
        onSuccess={handleUpdateSuccess} // <-- Ažurirano
      />

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[110] bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Check className="w-5 h-5 text-white" />
          <span className="font-medium">Update successfully posted!</span>
        </div>
      )}

    </div>
  );
}