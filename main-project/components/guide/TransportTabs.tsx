'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TransportOption } from '@/lib/data';
import { Bus, Train, Car, SquareM, Check, X, User, AlertCircle, Loader2, MoreVertical, Edit2, Flag } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { getUpdatesForAirport } from "@/app/updateActions";
import UpdateModal from '@/components/updates/UpdateModal';
import EditUpdateModal from '@/components/updates/EditUpdateModal';

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
  const [toastMessage, setToastMessage] = useState("");
  const [postToEdit, setPostToEdit] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showReportToast, setShowReportToast] = useState(false);
  const [postToReport, setPostToReport] = useState<any>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target.closest('.update-dropdown-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    useEffect(() => {
      if (session && typeof window !== 'undefined') {
        const hasIntent = localStorage.getItem('pendingUpdateIntent');
      
      if (hasIntent === 'true') {
        setIsUpdateModalOpen(true);
        localStorage.removeItem('pendingUpdateIntent');
      }
    }
  }, [session]);

  const fetchUpdates = async () => {
    setLoadingUpdates(true);
    const result = await getUpdatesForAirport(airportIata);
    if (result.success && result.data) {
      setUpdates(result.data);
    }
    setLoadingUpdates(false);
  };

  useEffect(() => {
    fetchUpdates();
  }, [airportIata]);

  const handlePostClick = () => {
      if (session) {
        setIsUpdateModalOpen(true);
      } else {
        localStorage.setItem('pendingUpdateIntent', 'true');
        window.dispatchEvent(new Event('openAuthModal'));
      }
    };

  const handleUpdateSuccess = (action: 'create' | 'edit' | 'delete') => {
    fetchUpdates(); 
    
    if (action === 'delete') setToastMessage("Update successfully deleted!");
    else if (action === 'edit') setToastMessage("Update successfully saved!");
    else setToastMessage("Update successfully posted!");
    
    setTimeout(() => setToastMessage(""), 5000);
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30 pb-20 w-full">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- LIJEVI STUPAC (Glavni sadržaj) --- */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-w-0 w-full">
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
                  flex items-center gap-2 md:gap-3 
                  px-4 py-3 md:px-6 md:py-4 
                  min-w-28 md:min-w-40 
                  rounded-t-lg transition-all shadow-sm border-b-4 bg-white
                  ${isActive ? `${activeStyle} font-bold shadow-md transform -translate-y-1` : 'text-gray-500 border-transparent hover:bg-gray-50'}
                `}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? '' : 'text-gray-400'}`} />
                <span className="text-sm md:text-lg capitalize">{option.type}</span>
              </button>
              );
            })}
          </div>

          <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-xl min-h-[400px] p-6 md:p-10 border border-gray-100">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-8">
              <span className="capitalize">{activeOption.type}</span> guide from {airportName} to {cityName}
            </h1>
            <div className="space-y-6 md:space-y-8">
              <div className="prose prose-slate prose-p:text-gray-600 prose-headings:text-gray-900 md:prose-lg max-w-none">
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

        {/* --- DESNI STUPAC (UPDATEOVI IZ BAZE) --- */}
        <div className="lg:col-span-1 min-w-0">
          <div className="sticky top-24 space-y-6 mt-22">
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
                  updates.map((update) => {
                    
                    const currentUserId = session?.user?.id ? String(session.user.id) : "NO_USER";
                    const postUserId = update.userId ? String(update.userId) : (update.user_id ? String(update.user_id) : "NO_AUTHOR");
                    const isAuthor = currentUserId !== "NO_USER" && currentUserId === postUserId;

                    return (
                      <div key={update.id} className="relative p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          {/* Type badge */}
                          <span className={`shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${getUpdateBadgeColor(update.type)}`}>
                            {update.type}
                          </span>
                          
                          {/* 3-DOT MENU */}
                          <div className="relative update-dropdown-container">
                            <button 
                              onClick={() => setOpenMenuId(openMenuId === update.id ? null : update.id)}
                              className="p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openMenuId === update.id && (
                              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-60">
                                {isAuthor && (
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setPostToEdit(update); 
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Post
                                  </button>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    setPostToReport(update);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Flag className="w-4 h-4" />
                                  Report
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-800 mb-4 leading-relaxed font-medium">
                          {update.text}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-500" />
                            </div>
                            <span className="text-[11px] font-medium text-gray-500">
                              {update.userName || "Traveler"} 
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400" suppressHydrationWarning>
                            {new Date(update.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No recent updates</p>
                  </div>
                )}
              </div>
              
              {/* Footer Button  */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-center shrink-0">
                <button 
                  onClick={handlePostClick}
                  className="text-sm font-bold text-slate-900 hover:text-slate-800 cursor-pointer transition-colors py-2 w-full"
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
        onSuccess={() => handleUpdateSuccess('create')}
      />

      <EditUpdateModal 
        isOpen={!!postToEdit}
        onClose={() => setPostToEdit(null)}
        post={postToEdit}
        onSuccess={(action: 'edit' | 'delete') => {
          setPostToEdit(null); 
          handleUpdateSuccess(action); 
        }} 
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-110 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Check className="w-5 h-5 text-green-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {showReportToast && (
        <div className="fixed bottom-6 right-6 z-110 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Flag className="w-5 h-5 text-red-400" />
          <span className="font-medium text-sm">Post reported. Our team will review it.</span>
        </div>
      )}

      {postToReport && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flag className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Report this Post?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to report this update? Our moderation team will review it.
            </p>
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setPostToReport(null)}
                className="px-6 py-2.5 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors w-full"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPostToReport(null);
                  setShowReportToast(true);
                  setTimeout(() => setShowReportToast(false), 5000);
                }}
                className="px-6 py-2.5 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors w-full shadow-sm"
              >
                Yes, Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}