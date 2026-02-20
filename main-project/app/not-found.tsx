import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    // Lighter background (gray-50) for light mode, deeper black for dark mode
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl w-full text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">

        {/* Thematic headline with bolder font */}
        <h1 className="mt-0 mb-6 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h1>

        <div className="mx-auto w-full max-w-xl my-8">
          <Image
            src="/not-found-image.png"
            // Alt text updated to match the split-flap style
            alt='Airport display board showing flight 404 with status: "Missing Route"'
            width={1300}
            height={700}
            // Added shadow-xl for a bit more depth off the lighter background
            className="rounded-2xl shadow-xl object-contain"
            priority
          />
        </div>

        {/* New casual, thematic text. */}
        <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            <p>
                We searched the gate, the tarmac, and even the lost and found bin—but that page seems to have vanished off our radar.
            </p>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-2xl shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            aria-label="Return to home page"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  )
}