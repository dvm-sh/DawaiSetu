import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function TermsOfServicePage() {
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
              <ShieldCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Terms of Service</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Last Updated: September 2026</p>
            </div>
          </div>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">1. Introduction</h3>
              <p className="leading-relaxed">Welcome to DawaiSetu. By registering on our platform, whether as a Donor or Recipient organization, you agree to be bound by these Terms of Service.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">2. Eligibility</h3>
              <p className="leading-relaxed">Only verified, legally registered pharmacies, hospitals, clinics, and recognized NGOs are eligible to use this platform. We reserve the right to reject any registration at our sole discretion based on our verification process.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">3. Donor Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><strong>Medicine Quality:</strong> Donors guarantee that all listed medicines are genuine, unadulterated, and stored according to manufacturer guidelines prior to transfer.</li>
                <li><strong>Expiry Dates:</strong> Donors MUST NOT list any medicine that has expired or has less than 30 days remaining until expiry.</li>
                <li><strong>Accuracy:</strong> Donors are responsible for the accuracy of batch numbers, quantities, and descriptions listed.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">4. Recipient Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><strong>Inspection:</strong> Recipients must thoroughly inspect all received medicines for cold-chain integrity, packaging damage, and correct expiry dates before accepting the transfer on the platform.</li>
                <li><strong>Distribution:</strong> Medicines obtained through DawaiSetu must be distributed to patients in need and MUST NOT be resold for profit under any circumstances.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">5. Platform Liability</h3>
              <p className="leading-relaxed">DawaiSetu acts merely as a technology facilitator (a bridge) between Donors and Recipients. While we strictly verify organizations, DawaiSetu accepts no liability for the physical condition, efficacy, or adverse effects of the medicines transferred. The final responsibility of verifying medicine safety lies with the Recipient organization&apos;s qualified healthcare professionals.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">6. Data Privacy</h3>
              <p className="leading-relaxed">We collect and store your organization&apos;s data to facilitate matching and auditing. By using the platform, you consent to our data collection practices as necessary for platform operation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
