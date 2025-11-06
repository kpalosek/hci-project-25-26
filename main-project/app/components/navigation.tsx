"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        className={`px-2 py-2 border-b-2 transition
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
  return (
    <nav className="mt-4">
      <ul className="flex justify-center gap-48 text-2xl">
        {pages.map((page, index) => processPage(page, index, currentPath))}
      </ul>
    </nav>
  );
}