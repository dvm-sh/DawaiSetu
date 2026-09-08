import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Link>
          <ThemeToggle />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950/60 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Last Updated: September 2026</p>
            </div>
          </div>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">1. Information We Collect</h3>
              <p className="leading-relaxed">We collect information necessary to verify and facilitate the donation process, including organization details, licenses, contact information, and audit logs of platform activity.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">2. How We Use Your Data</h3>
              <p className="leading-relaxed">Data is strictly used for platform operation, matching algorithms, legal compliance, and generating analytics. We do not sell data to third parties.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">3. Data Security</h3>
              <p className="leading-relaxed">All sensitive information, including passwords and JWT tokens, is securely encrypted. We follow industry best practices to protect against unauthorized access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
