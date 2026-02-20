"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { postAirportUpdate } from "@/app/updateActions";

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  airportIata: string;
  onSuccess: () => void;
}

export default function UpdateModal({ isOpen, onClose, airportIata, onSuccess }: UpdateModalProps) {
  const [text, setText] = useState("");
  const [type, setType] = useState("bus");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Pozivamo backend akciju iz Faze 4
    const result = await postAirportUpdate(text, type, airportIata);

    setLoading(false);

    if (result.success) {
      setText(""); // Očisti formu
      onSuccess(); // Osvježi listu na ekranu
      onClose();
    } else {
      setError(result.error || "Došlo je do greške pri objavi.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Post an Update for {airportIata}</h2>

        {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transport Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="bus">Bus / Shuttle</option>
              <option value="train">Train / Subway</option>
              <option value="taxi">Taxi</option>
              <option value="uber">Uber / Ride-app</option>
              <option value="general">General Warning</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Info</label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="E.g., Huge line for the taxi, consider taking the train..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post Update"}
          </button>
        </form>
      </div>
    </div>
  );
}