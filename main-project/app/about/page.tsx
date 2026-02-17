import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Air2City...",
};

export default function Home() {
  return (
    <h1 className="flex text-7xl justify-center mt-48 mb-128">About</h1>
  );
}