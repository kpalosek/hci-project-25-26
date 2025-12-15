export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-sm">A2C</span>
              </div>
              <span className="text-white">air2city</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting airports to city centers worldwide
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-3 uppercase tracking-wide text-sm">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/explore" className="text-gray-400 hover:text-white transition-colors text-sm">Explore</a></li>
              <li><a href="/news" className="text-gray-400 hover:text-white transition-colors text-sm">News</a></li>
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