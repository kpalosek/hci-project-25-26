"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "HOME", path: "/" },
  {
    title: "EXPLORE",
    path: "/explore",
  },
  {
    title: "NEWS",
    path: "/news",
  },
  {
    title: "ABOUT",
    path: "/about",
  },
  {
    title: "ACCOUNT",
    path: "/account",
  },
];

function processPage(page: Page, index: number, currentPath?: string, onClick?: () => void) {
  const isActive =
    page.path === "/"
      ? currentPath === page.path
      : currentPath?.startsWith(page.path);

  const baseClasses = `px-4 py-2 rounded-lg transition-all uppercase tracking-wide`;
  const underline = isActive && page.path !== "/account" ? `underline decoration-1 underline-offset-2 md:no-underline` : ``;
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

  return (
    <header className="bg-linear-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-sm">A2C</span>
              </div>
              <span>air2city</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2 list-none">
            {pages
              .filter((p) => p.path !== "/account")
              .map((page, index) => processPage(page, index, currentPath))}
          </ul>

          {/* Auth Links */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={pages.find((p) => p.path === "/account")?.path || "/account"}
              className="px-5 py-2 bg-white/15 backdrop-blur-sm text-white rounded-lg hover:bg-white/25 transition-all border border-white/20 uppercase tracking-wide"
            >
              ACCOUNT
            </Link>
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
              <ul className="flex flex-col space-y-8 list-none">
              {pages
                .filter((p) => p.path !== "/account")
                .map((page, index) => processPage(page, index, currentPath, () => setOpen(false)))}
            </ul>

              <div className="flex flex-col gap-2 pt-2">
                <Link href={pages.find((p) => p.path === "/account")?.path || "/account"} onClick={() => setOpen(false)} className="px-4 py-2 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-colors text-center border border-white/20 uppercase tracking-wide">
                  ACCOUNT
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}