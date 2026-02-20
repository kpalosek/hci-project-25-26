"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { signIn, signUp } from "@/lib/auth-client"; 

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  useEffect(() => {
    if (!isOpen) {
      // Kada se modal zatvori, resetiraj sve na početne postavke
      resetForm();
      setIsLogin(true);
      setShowPassword(false);
      setLoading(false); // Za svaki slučaj resetiramo i loading stanje
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ako se već učitava, spriječi ponovno slanje
    if (loading) return;
    
    setLoading(true);
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
       setError("Password must be at least 8 characters long.");
       setLoading(false);
       return;
    }

    try {
      if (isLogin) {
        // --- LOGIKA ZA PRIJAVU (LOGIN) ---
        const { error } = await signIn.email({ email, password });
        if (error) throw new Error(error.message || "Failed to sign in. Please check your credentials.");
        
        onClose(); 
        // OVO RJEŠAVA PROBLEM: Forsirani refresh kako bi Next.js povukao "Saved Guides"
        window.location.reload(); 
        
      } else {
        // --- LOGIKA ZA REGISTRACIJU (SIGN UP) ---
        const { error } = await signUp.email({ email, password, name });
        if (error) throw new Error(error.message || "Failed to sign up.");
        
        onClose(); 
        // OVO RJEŠAVA PROBLEM: Forsirani refresh nakon uspješne registracije
        window.location.reload(); 
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Gasimo loading samo ako dođe do greške (ako prođe, stranica se ionako refresha)
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[550px]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* LIJEVA STRANA: Forma */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isLogin ? "Please enter your details to sign in." : "Start your journey with us today."}
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-black"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-black"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none pr-10 text-black"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-black"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" // Spriječava da se ovo okine kao submit forme
              onClick={() => { 
                setIsLogin(!isLogin); 
                resetForm(); 
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>

        {/* DESNA STRANA: Slika */}
        <div className="hidden md:block w-1/2 relative bg-gray-100">
          <Image
            src="/auth_form_image.jpg"
            alt="Travel background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
            <h3 className="text-white text-2xl font-bold">
              Find the fastest routes from your airport to the city.
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
}