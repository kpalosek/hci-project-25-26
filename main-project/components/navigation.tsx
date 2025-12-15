"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Home", path: "/" },
  {
    title: "Explore",
    path: "/explore",
  },
  {
    title: "News",
    path: "/news",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Account",
    path: "/account",
  },
];

function processPage(page: Page, index: number, currentPath?: string) {
  const isActive =
    page.path === "/"
      ? currentPath === page.path
      : currentPath?.startsWith(page.path);

  return (
    <li key={index}>
      <Link
        href={page.path}
        className={`block w-full text-center md:inline-block md:w-auto md:text-left px-2 py-2 border-b-2 transition
          ${isActive ? "font-bold border-black" : "border-transparent hover:border-gray-400"}
        `}
      >
        {page.title}
      </Link>
    </li>
  );
}

export default function Navigation() {
  const currentPath = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="mt-4">
      <div className="flex items-center justify-between px-4 md:px-0">
        {/* Mobile menu button */}
        <button
          aria-label="Toggle navigation"
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={() => setOpen((s) => !s)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex justify-center gap-12 md:text-2xl text-lg w-full">
          {pages.map((page, index) => processPage(page, index, currentPath))}
        </ul>
      </div>

      {/* Mobile menu - slides down */}
      {open && (
        <ul className="flex flex-col gap-1 text-lg mt-2 px-4 md:hidden">
          {pages.map((page, index) => processPage(page, index, currentPath))}
        </ul>
      )}
    </nav>
  );
}