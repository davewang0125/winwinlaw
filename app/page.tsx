import { Check, X, ArrowRight, Clock, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-800">WinWin Law</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-primary-700">How It Works</a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-700">Pricing</a>
            <a href="#demo" className="text-gray-700 hover:text-primary-700">Demo</a>
          </nav>
          <Link href="/demo" className="bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition">
            Book Demo
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Get Qualified Legal Cases<br />
            <span className="text-primary-700">Not Junk Leads</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We turn messy client inquiries into structured, lawyer-ready case summaries —
            so you spend less time on intake and more time on billable work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/demo" className="bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-800 transition flex items-center justify-center">
              Get 3 Free Cases <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/demo" className="border-2 border-primary-700 text-primary-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition">
              Book a 15-min Demo
            </Link>
          </div>
          <div className="text-gray-600">
            <p className="font-medium">Built for litigation and dispute-focused law firms</p>
            <p className="text-sm">Pilot program now open</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Most Legal Leads Are a Waste of Time
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              "Incomplete client information",
              "No documents, no context",
              "Wrong practice area",
              "Low conversion rates",
              "Hours wasted on intake calls"
            ].map((problem, i) => (
              <div key={i} className="flex items-start space-x-3 bg-red-50 border border-red-200 p-6 rounded-lg">
                <X className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">{problem}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              You don't need more leads.
            </p>
            <p className="text-2xl font-bold text-primary-700">
              You need better cases.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            We Deliver Structured, Pre-Qualified Cases
          </h2>

          {/* Process Flow */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            {[
              { step: "1", title: "Client Submits Case", desc: "Client provides details via our intake form" },
              { step: "2", title: "AI Structures + Analyzes", desc: "System organizes information and identifies issues" },
              { step: "3", title: "Lawyer-Ready Package", desc: "You receive a structured case summary" }
            ].map((item, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="bg-primary-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* What Lawyers Receive */}
          <div className="bg-white border-2 border-primary-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">What lawyers receive:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Case summary (clear facts, timeline)",
                "Key issues identified",
                "Supporting documents organized",
                "Missing information flagged",
                "Suggested next steps"
              ].map((feature, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-800 text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            See the Difference
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div>
              <div className="bg-red-50 border-2 border-red-300 rounded-t-lg px-6 py-3">
                <h3 className="text-xl font-bold text-red-800">Before (raw lead)</h3>
              </div>
              <div className="bg-white border-2 border-red-300 border-t-0 rounded-b-lg p-6">
                <p className="text-gray-700 italic">
                  "Hi, someone didn't pay me after I shipped goods..."
                </p>
              </div>
            </div>

            {/* After */}
            <div>
              <div className="bg-green-50 border-2 border-green-300 rounded-t-lg px-6 py-3">
                <h3 className="text-xl font-bold text-green-800">After (your platform)</h3>
              </div>
              <div className="bg-white border-2 border-green-300 border-t-0 rounded-b-lg p-6 space-y-4">
                <div>
                  <p className="font-semibold text-gray-900">Case Type: <span className="font-normal">Contract Dispute</span></p>
                  <p className="font-semibold text-gray-900">Jurisdiction: <span className="font-normal">California / China</span></p>
                  <p className="font-semibold text-gray-900">Amount: <span className="font-normal">$85,000</span></p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">Summary:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Client delivered goods under agreed contract</li>
                    <li>Buyer has not paid within 30 days</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">Key Issues:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Valid contract existence</li>
                    <li>Proof of delivery</li>
                    <li>Breach of payment obligation</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">Missing:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Signed contract</li>
                    <li>Delivery confirmation</li>
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <p className="font-semibold text-primary-700">Recommended: Lawyer review + potential arbitration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            More Billable Work. Less Intake Waste.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 text-primary-200" />
              <h3 className="text-3xl font-bold mb-2">60–80%</h3>
              <p className="text-xl text-primary-100">Time saved on intake</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-primary-200" />
              <h3 className="text-3xl font-bold mb-2">Higher</h3>
              <p className="text-xl text-primary-100">Conversion rate from lead to client</p>
            </div>
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-primary-200" />
              <h3 className="text-3xl font-bold mb-2">Better</h3>
              <p className="text-xl text-primary-100">Case fit (right practice area)</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            How It Works (Lawyer Side)
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Sign up", desc: "2 minutes" },
              { num: "2", title: "Set your practice area", desc: "& jurisdiction" },
              { num: "3", title: "Receive qualified cases", desc: "Structured and ready" },
              { num: "4", title: "Accept and connect", desc: "With clients" }
            ].map((step, i) => (
              <div key={i} className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary-700 mb-3">Step {step.num}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Start With Zero Risk
          </h2>

          <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-12">
            <div className="mb-8">
              <p className="text-2xl text-gray-700 mb-2">First 3 cases</p>
              <p className="text-5xl font-bold text-primary-700">FREE</p>
            </div>

            <div className="border-t-2 border-primary-300 pt-8">
              <p className="text-2xl text-gray-700 mb-2">Then</p>
              <p className="text-3xl font-bold text-gray-900 mb-4">Pay per qualified case</p>
              <p className="text-xl text-gray-600">No subscription upfront</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Compliance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Built for Legal Professionals
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "No legal advice provided",
              "Clients agree to disclaimers",
              "Full audit trail",
              "Data encrypted & secure"
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <Check className="h-8 w-8 text-green-600 mb-3" />
                <p className="text-gray-800 text-lg font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12">
            <p className="text-xl text-gray-700 mb-4">
              "Pilot firms currently testing the platform"
            </p>
            <p className="text-gray-600">
              Built with input from practicing attorneys
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Try Your First Qualified Cases — Free
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo" className="bg-white text-primary-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center">
              Get 3 Free Cases <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/demo" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-800 transition">
              Book a Demo
            </Link>
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
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white">Demo</a></li>
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
