import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
              <Info className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">About DawaiSetu</h1>
            </div>
          </div>
          
          <div className="prose prose-teal max-w-none text-gray-600">
            <p>DawaiSetu (MedCycle) is a platform born out of a critical need to bridge the gap between medicine waste and medicine scarcity.</p>
            <p>Every year, millions of dollars worth of perfectly usable medicines are discarded while millions of people lack access to basic healthcare. DawaiSetu provides a secure, verified, and intelligent platform for pharmacies, hospitals, and clinics to donate surplus stock to NGOs and rural clinics.</p>
            <p>Our mission is to ensure zero medicine waste and maximize healthcare impact through technology.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
