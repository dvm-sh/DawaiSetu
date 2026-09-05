import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">How DawaiSetu Works</h1>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            DawaiSetu is designed to seamlessly bridge the gap between surplus medicine donors and healthcare organizations in need. Our intelligent matching engine ensures the right medicines reach the right patients.
          </p>
          
          <div className="space-y-12">
            <div className="relative">
              <div className="absolute top-0 left-6 bottom-0 w-0.5 bg-gray-100 -z-10" />
              
              {/* Step 1 */}
              <div className="flex gap-6 mb-12">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration & Verification</h3>
                  <p className="text-gray-600 leading-relaxed">Pharmacies, hospitals, and NGOs register on the platform. Our admin team verifies their licenses and credentials to ensure complete safety and compliance before they can participate.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 mb-12">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Listing & Requesting</h3>
                  <ul className="space-y-3 mt-4 text-gray-600">
                    <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" /> <span><b>Donors</b> upload their surplus medicines individually or via bulk Excel upload. Our system automatically categorizes and tracks expiry dates.</span></li>
                    <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" /> <span><b>Recipients</b> post specific medicine requirements based on their current patient needs.</span></li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 mb-12">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
                  <p className="text-gray-600 leading-relaxed">Our matching algorithm works in real-time to pair available medicines with active requirements. It scores matches based on generic name, category, urgency, location, and expiry window.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">4</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Transfer & Inspection</h3>
                  <p className="text-gray-600 leading-relaxed">Once a match is accepted by both parties, the transfer begins. Medicines are shipped and, upon arrival, the recipient completes a mandatory quality inspection to verify packaging and cold-chain integrity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
