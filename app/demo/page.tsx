import DemoForm from '@/components/DemoForm';
import Link from 'next/link';

export const metadata = {
  title: 'Book a Demo - WinWin Law',
  description: 'Schedule a 15-minute demo to see how WinWin Law delivers qualified legal cases.',
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-800">
            WinWin Law
          </Link>
          <Link href="/" className="text-gray-700 hover:text-primary-700">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Demo Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Book Your 15-Minute Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how WinWin Law can help you get qualified cases instead of wasting time on junk leads.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
            <DemoForm />
          </div>

          {/* What to Expect */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What to Expect in Your Demo
            </h2>
            <div className="space-y-4">
              {[
                "See real examples of structured case summaries",
                "Learn how the intake process works",
                "Discuss your practice areas and case volume",
                "Get answers to your questions",
                "No pressure, no commitment"
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">WinWin Law</h3>
              <p className="text-sm">
                Better cases. Less intake.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>319 N Bernardo Ave</li>
                <li>Mountain View, CA 94043</li>
                <li className="pt-2">
                  <a href="mailto:info@winwinlaw.com" className="hover:text-white">
                    info@winwinlaw.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 WinWin Law. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
