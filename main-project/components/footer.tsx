import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

return (
    <footer className="bg-linear-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-8">

          <div className="flex flex-col items-start justify-start">
            <Link href="/" className="mb-4 transition-transform hover:opacity-90">
              <Image
                src="/air2city_logo_v2.png"
                alt="air2city logo"
                width={100} 
                height={100}
                priority
                className="w-auto h-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Navigating from the runway to the city center, made simple.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4 uppercase tracking-wider text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/explore" className="text-gray-400 hover:text-white transition-colors text-sm">Explore Airports</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About air2city</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white mb-4 uppercase tracking-wider text-sm font-semibold">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} air2city. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}