"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { editAirportUpdate, deleteAirportUpdate } from "@/app/updateActions";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any; 
  onSuccess: (action: 'edit' | 'delete') => void; // <-- Updated to accept action type
}

export default function EditUpdateModal({ isOpen, onClose, post, onSuccess }: EditModalProps) {
  const [text, setText] = useState("");
  const [type, setType] = useState("bus");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  
  // NEW: State to control the delete confirmation screen
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (post) {
      setText(post.text || "");
      setType(post.type || "bus");
      setShowConfirmDelete(false); // Reset confirmation screen when opening
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    const result = await editAirportUpdate(post.id, text, type);

    setIsSaving(false);

    if (result.success) {
      onSuccess('edit'); // Tell the parent it was an edit
    } else {
      setError(result.error || "Failed to update the post.");
    }
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    setError("");

    const result = await deleteAirportUpdate(post.id);

    setIsDeleting(false);

    if (result.success) {
      onSuccess('delete'); // Tell the parent it was a delete
    } else {
      setError(result.error || "Failed to delete the post.");
      setShowConfirmDelete(false); // Go back to edit screen if it fails
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        <button 
          onClick={onClose} 
          disabled={isSaving || isDeleting}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* --- DELETE CONFIRMATION SCREEN --- */}
        {showConfirmDelete ? (
          <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete this update?</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              This action cannot be undone. Are you sure you want to permanently remove this post?
            </p>
            
            {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg text-left">{error}</div>}

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
                className="px-6 py-2.5 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-2 min-w-[120px] justify-center"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        ) : (
          /* --- NORMAL EDIT FORM --- */
          <div className="animate-in fade-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Update</h2>

            {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transport Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-black"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none text-black"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)} // Show confirmation instead of window.confirm
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving || !text.trim()}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}