'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { TransportOption } from '@/lib/data';
import { getUpdatesByAirport, TransportType } from '@/lib/updates';
import { Bus, Train, Car, SquareM, Check, X, User, AlertCircle } from 'lucide-react';

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
    case "bus": return "bg-blue-100 text-blue-700 border-blue-200";
    case "uber": return "bg-black text-white border-gray-800";
    case "taxi": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "train": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const iconMap: Record<string, any> = {
  bus: Bus, shuttle: Bus, train: Train, subway: SquareM, taxi: Car, uber: Car
};

export default function TransportTabs({ airportName, airportIata, cityName, options }: Props) {
  const [activeTabId, setActiveTabId] = useState(options[0].id);
  const activeOption = options.find(o => o.id === activeTabId) || options[0];
  const updates = getUpdatesByAirport(airportIata);

  return (
    // Dodan 'w-full' i 'overflow-hidden' na glavni wrapper za svaki slučaj
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30 pb-20 w-full">
      
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- LIJEVI STUPAC (Glavni sadržaj) --- */}
        {/* POPRAVAK: Dodan 'min-w-0' i 'w-full'. Ovo sprječava horizontalno scrollanje cijele stranice */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0 w-full">
          
          {/* TAB NAVIGACIJA */}
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
                    flex items-center gap-3 px-6 py-4 min-w-40 rounded-t-lg transition-all shadow-sm
                    border-b-4 bg-white
                    ${isActive 
                      ? `${activeStyle} font-bold shadow-md transform -translate-y-1` 
                      : 'text-gray-500 border-transparent hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? '' : 'text-gray-400'}`} />
                  <span className="text-lg capitalize">{option.type}</span>
                </button>
              );
            })}
          </div>

          {/* BIJELI OKVIR SA SADRŽAJEM */}
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
                        <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                        {pro}
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
                        <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- DESNI STUPAC (Sticky Sidebar) --- */}
        <div className="lg:col-span-1 min-w-0">
          <div className="sticky top-24 space-y-6 mt-24">
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-900">Latest Updates</h3>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="divide-y divide-gray-100 bg-white">
                {updates.length > 0 ? (
                  updates.map((update) => (
                    <div key={update.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                          {update.title}
                        </h4>
                        <span className={`shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${getUpdateBadgeColor(update.transportType)}`}>
                          {update.transportType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {update.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-500" />
                          </div>
                          <span className="text-[11px] font-medium text-gray-500">
                            {update.user.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400" suppressHydrationWarning>
                          {new Date(update.date).toLocaleDateString('en-GB')}
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
              
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-center">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  + Post an Update
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}