import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-500 mt-1">Last Updated: September 2026</p>
            </div>
          </div>
          
          <div className="prose prose-teal max-w-none text-gray-600">
            <h3>1. Information We Collect</h3>
            <p>We collect information necessary to verify and facilitate the donation process, including organization details, licenses, contact information, and audit logs of platform activity.</p>
            
            <h3>2. How We Use Your Data</h3>
            <p>Data is strictly used for platform operation, matching algorithms, legal compliance, and generating analytics. We do not sell data to third parties.</p>
            
            <h3>3. Data Security</h3>
            <p>All sensitive information, including passwords and JWT tokens, is securely encrypted. We follow industry best practices to protect against unauthorized access.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
