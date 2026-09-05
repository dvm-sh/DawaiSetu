import Link from 'next/link'
import { ArrowLeft, HelpCircle } from 'lucide-react'

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
              <HelpCircle className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Can individuals donate medicines?</h3>
              <p className="text-gray-600 mt-2">Currently, to ensure the highest safety and quality standards, we only allow verified organizations (pharmacies, hospitals, clinics) to donate medicines. Individual donations are not supported.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">What happens if a medicine expires during transit?</h3>
              <p className="text-gray-600 mt-2">Our system strictly prevents the listing or transfer of any medicine that has less than 30 days until expiry to prevent this exact scenario.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Is it free to use?</h3>
              <p className="text-gray-600 mt-2">Yes, the DawaiSetu platform is completely free to use for both donors and recipients as part of our social initiative.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
