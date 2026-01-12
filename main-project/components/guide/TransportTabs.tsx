'use client';

import { useState } from 'react';
import { TransportOption } from '@/lib/data';
import { Bus, Train, Car, Check, X, ExternalLink } from 'lucide-react';

interface Props {
  airportName: string;
  cityName: string;
  options: TransportOption[];
}

// Boje specifične za svaki tip prijevoza (za aktivno stanje)
const typeColors: Record<string, string> = {
  bus: "border-orange-500 bg-orange-50 text-orange-700",
  shuttle: "border-orange-500 bg-orange-50 text-orange-700",
  train: "border-yellow-400 bg-yellow-50 text-yellow-800",
  subway: "border-purple-500 bg-purple-50 text-purple-800",
  taxi: "border-gray-800 bg-gray-100 text-gray-900",
  uber: "border-black bg-gray-100 text-black",
};

const iconMap: Record<string, any> = {
  bus: Bus, shuttle: Bus, train: Train, subway: Train, taxi: Car, uber: Car
};

export default function TransportTabs({ airportName, cityName, options }: Props) {
  const [activeTabId, setActiveTabId] = useState(options[0].id);
  const activeOption = options.find(o => o.id === activeTabId) || options[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
      
      {/* --- TAB NAVIGATION (Kartice) --- */}
      <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
        {options.map((option) => {
          const Icon = iconMap[option.type] || Bus;
          const isActive = activeTabId === option.id;
          
          // Stilovi ovisno o tipu (ako je aktivan)
          const activeStyle = typeColors[option.type] || "border-blue-600 bg-blue-50 text-blue-700";

          return (
            <button
              key={option.id}
              onClick={() => setActiveTabId(option.id)}
              className={`
                flex items-center gap-3 px-6 py-4 min-w-40 rounded-t-lg transition-all shadow-sm
                border-b-4 
                ${isActive 
                  ? `${activeStyle} font-bold shadow-md transform -translate-y-1` 
                  : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-6 h-6 ${isActive ? '' : 'text-gray-400'}`} />
              <span className="text-lg capitalize">{option.type}</span>
            </button>
          );
        })}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-xl min-h-[400px] p-6 md:p-10 border border-gray-100">
        
        {/* Dynamic Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
          <span className="capitalize">{activeOption.type}</span> guide from {airportName} to {cityName}
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="prose prose-lg text-gray-600">
              <p>{activeOption.description}</p>
            </div>

            {/* Pros & Cons Grid */}
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

          {/* Sidebar / Latest Updates (1/3 width) - Opcionalno */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Latest Updates</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200/50 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}