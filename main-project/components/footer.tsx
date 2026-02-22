import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div className="shrink-0 flex items-center self-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/air2city_logo_v2.png"
                alt="air2city logo"
                width={100} 
                height={100}
                priority
              />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-3 uppercase tracking-wide text-sm">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/explore" className="text-gray-400 hover:text-white transition-colors text-sm">Explore</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white mb-3 uppercase tracking-wide text-sm">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} air2city. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}