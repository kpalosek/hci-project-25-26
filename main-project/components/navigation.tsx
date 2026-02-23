"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { User, LogOut, Loader2 } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useSession, signOut } from "@/lib/auth-client";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "HOME", path: "/" },
  { title: "EXPLORE", path: "/explore" },
  { title: "ABOUT", path: "/about" },
];

function processPage(page: Page, index: number, currentPath?: string, onClick?: () => void) {
  const isActive =
    page.path === "/"
      ? currentPath === page.path
      : currentPath?.startsWith(page.path);

  const isMobile = typeof onClick === "function";
  const baseClasses = isMobile
    ? `block w-full px-4 py-3 rounded-lg transition-all uppercase tracking-wide text-left`
    : `px-4 py-2 rounded-lg transition-all uppercase tracking-wide`;
  const underline = isActive ? `underline decoration-1 underline-offset-2 md:no-underline` : ``;
  const activeBg = isActive
    ? `md:font-bold md:bg-white/10`
    : `hover:bg-white/10`;

  return (
    <li key={index}>
      <Link href={page.path} onClick={onClick} className={`${baseClasses} ${underline} ${activeBg} text-white`}>
        {page.title}
      </Link>
    </li>
  );
}

export default function Navigation() {
  const currentPath = usePathname();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
      const handleOpenAuth = () => setIsModalOpen(true);
      window.addEventListener('openAuthModal', handleOpenAuth);
      
      return () => window.removeEventListener('openAuthModal', handleOpenAuth);
    }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

return (
    <>
      <header className="bg-linear-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="shrink-0 flex items-center self-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/air2city_logo_v2.png"
                  alt="air2city logo"
                  width={80} 
                  height={80}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 list-none">
              {pages.map((page, index) => processPage(page, index, currentPath))}
            </ul>

            {/* Auth Links (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {isPending ? (
                <div className="w-28 h-10 bg-white/10 rounded-xl animate-pulse flex items-center justify-center border border-white/20">
                  <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                </div>
              ) : session?.user ? (
                <div className="flex items-center gap-4">
                  {/* User Card (Desktop) */}
                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/60 border border-white/15 rounded-xl shadow-sm backdrop-blur-md">
                    <div className="bg-slate-700/50 p-1.5 rounded-lg border border-white/10 shadow-inner">
                      <User className="w-4 h-4 text-white/90" />
                    </div>
                    <span className="font-semibold text-sm text-white pr-2 max-w-[150px] truncate">
                      {session.user.name || "User"}
                    </span>
                  </div>
                  
                  {/* Sign Out Button (Desktop) */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-sm font-bold text-white/60 hover:text-red-400 transition-colors uppercase tracking-wide px-2"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline-block">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group flex items-center gap-2.5 px-5 py-2 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-xl transition-all duration-300 backdrop-blur-md text-white shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                >
                  <User className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" strokeWidth={2} />
                  <span className="font-semibold text-sm tracking-wide">
                    Sign In
                  </span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              aria-label="Toggle navigation"
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {open && (
            <div className="md:hidden py-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4">
                <ul className="flex flex-col space-y-6 list-none m-0 p-0">
                  {pages.map((page, index) => processPage(page, index, currentPath, () => setOpen(false)))}
                </ul>

                {/* Auth Links (Mobile) */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-2">
                  {isPending ? (
                    <div className="w-full h-12 bg-white/10 animate-pulse rounded-xl border border-white/20 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
                    </div>
                  ) : session?.user ? (
                    <div className="flex flex-col gap-3">
                      {/* User Card (Mobile) */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 rounded-xl border border-white/15 backdrop-blur-sm shadow-sm">
                        <div className="bg-slate-700/50 p-2 rounded-lg border border-white/10">
                          <User className="w-5 h-5 text-white/90" />
                        </div>
                        <span className="font-semibold text-white truncate">
                          {session.user.name || "User"}
                        </span>
                      </div>
                      
                      {/* Sign Out Button (Mobile) */}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20 uppercase tracking-wide font-bold text-sm"
                      >
                        <LogOut className="w-5 h-5" />
                        SIGN OUT
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setOpen(false);
                      }}
                      className="group flex items-center justify-center gap-2 w-full px-5 py-3 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-xl transition-all duration-300 backdrop-blur-md text-white shadow-sm"
                    >
                      <User className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" strokeWidth={2} />
                      <span className="font-semibold text-sm tracking-wide">
                        Sign In
                      </span>
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Renderiranje Modala */}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}