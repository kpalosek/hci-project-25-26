"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { User, LogOut } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useSession, signOut } from "@/lib/auth-client";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "HOME", path: "/" },
  { title: "EXPLORE", path: "/explore" },
  { title: "NEWS", path: "/news" },
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

  const handleSignOut = async () => {
    await signOut();
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
            <div className="hidden md:flex items-center gap-3">
              {isPending ? (
                <div className="w-24 h-10 bg-white/10 animate-pulse rounded-lg border border-white/20" />
              ) : session ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-lg hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all border border-white/20 uppercase tracking-wide text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  SIGN OUT
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2 bg-white/15 backdrop-blur-sm text-white rounded-lg hover:bg-white/25 transition-all border border-white/20 uppercase tracking-wide text-sm font-medium"
                >
                  SIGN IN
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              aria-label="Toggle navigation"
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10"
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

                {/* Mobile Auth Button */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10 mt-2">
                  {isPending ? (
                    <div className="w-full h-12 bg-white/10 animate-pulse rounded-lg border border-white/20" />
                  ) : session ? (
                    <button
                      onClick={() => {
                        handleSignOut();
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors text-left border border-white/20 uppercase tracking-wide"
                    >
                      <LogOut className="w-5 h-5" />
                      SIGN OUT
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setOpen(false);
                      }}
                      className="block w-full px-4 py-3 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-colors text-left border border-white/20 uppercase tracking-wide"
                    >
                      SIGN IN
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