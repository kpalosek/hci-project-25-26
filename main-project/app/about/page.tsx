import { Plane, Users, Map, Clock, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const faqs = [
    {
      question: "Is air2city free to use?",
      answer: "Yes! Browsing airport guides and reading live community updates is completely free for everyone."
    },
    {
      question: "How do I post an update?",
      answer: "Simply sign in using the button in the top right, navigate to your airport, and click '+ Post an Update' under the relevant transport tab."
    },
    {
      question: "Can I edit or delete an update if I made a mistake?",
      answer: "Absolutely. You have full control over your posts. Just click the three-dot menu on any of your updates to edit the details or permanently delete it."
    },
    {
      question: "How accurate are the community updates?",
      answer: "Updates are provided by fellow travelers in real-time. We display a 'Live' badge and the exact date so you know exactly how fresh the information is."
    },
    {
      question: "What if I see a fake or spam update?",
      answer: "Community trust is our priority. You can report any misleading or spammy posts using the three-dot menu on the update, and our moderation team will review it."
    },
    {
      question: "Are you adding more airports?",
      answer: "We are constantly expanding! We are working hard to bring reliable transport guides and community features to major airports all over the world."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-slate-900/50" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Navigating from the runway to the city center, <span className="text-blue-400">made simple.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            air2city is your ultimate guide to airport transfers. We combine expert transportation guides with real-time community updates to ensure you never get stuck at the terminal.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Journey</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Landing in a new city is exciting, but figuring out how to get to your hotel can be stressful. Guidebooks get outdated, train schedules change, and taxi lines can stretch for hours.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We built air2city to solve this exact problem. By bringing together static, reliable transport guides and dynamic, real-time updates from fellow travelers, we take the guesswork out of your arrival.
              </p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-100 flex items-center justify-center">
              <Image 
                src="/air2city_logo_v2.png" 
                alt="air2city logo" 
                width={200} 
                height={200} 
                className="opacity-90"
              />
            </div>
          </div>

          {/* Core Values / Features */}
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Map className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Clear Options</h4>
              <p className="text-sm text-gray-500">Compare buses, trains, taxis, and ride-shares with pros, cons, and pricing.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Community Driven</h4>
              <p className="text-sm text-gray-500">Real travelers share their experiences, so you know exactly what to expect right now.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Live Updates</h4>
              <p className="text-sm text-gray-500">Find out if the taxi line is an hour long or if the express train is delayed before you leave the baggage claim.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                <Plane className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Global Reach</h4>
              <p className="text-sm text-gray-500">Expanding to major airports worldwide to become your go-to travel companion.</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-gray-100 pt-16">
            <div className="text-center mb-10">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-slate-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">{faq.question}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to travel smarter?</h2>
        <p className="text-gray-600 mb-8">Join the community and start sharing your airport updates to help fellow travelers.</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Start Exploring <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

    </div>
  );
}