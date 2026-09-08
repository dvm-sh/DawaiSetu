import Link from 'next/link'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { ClientNav } from '@/components/client-nav'
import { GlobalFooter } from '@/components/layout/global-footer'
import {
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Award,
  Pill,
  Search,
  HeartHandshake,
  Building2,
  FileCheck2,
  Lock,
  ArrowUpRight
} from 'lucide-react'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me')

async function getUserFromCookie() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export default async function HomePage() {
  const user = await getUserFromCookie()
  const dashboardUrl = user?.role === 'ADMIN' ? '/admin' : user?.role === 'DONOR' ? '/donor' : '/recipient'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col selection:bg-teal-600 selection:text-white">
      {/* Header Navigation */}
      <ClientNav initialUser={user} />

      {/* Main Content */}
      <main className="flex-1 space-y-24 sm:space-y-32 pb-24 pt-24">
        {/* HERO SECTION */}
        <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Headline & CTAs */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium">
                <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Verified Surplus Medicine Redistribution Platform</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  Connecting Surplus Medicine with <span className="text-teal-600 dark:text-teal-400">Patients in Need</span>.
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                  DawaiSetu enables licensed pharmacies, hospital chains, and pharmaceutical distributors to safely redistribute unexpired surplus inventory to accredited health NGOs and rural clinics.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                {user ? (
                  <Link
                    href={dashboardUrl}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <span>Go to Dashboard</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      <span>Register Organization</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/how-it-works"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                    >
                      <span>How Redistribution Works</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Core Safety Commitments */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Drug License Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Expiry Window Gates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Audit Trail Logged</span>
                </div>
              </div>
            </div>

            {/* Right Column - Live Operational Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                      DS
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Platform Telemetry</h3>
                      <p className="text-xs text-slate-500 font-mono">Real-Time Overview</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-medium border border-emerald-200 dark:border-emerald-800">
                    Operational
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Preserved Medicine</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">105,400+</span>
                    <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold block">Units Redistributed</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Verified Entities</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">480+</span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block">Pharmacies & NGOs</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-xs text-slate-500 font-semibold uppercase block tracking-wider">Active Match Protocol</span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                    Amoxicillin 500mg matched from <span className="font-semibold text-slate-900 dark:text-white">City Care Pharmacy</span> to <span className="font-semibold text-slate-900 dark:text-white">Hope Rural Trust</span>.
                  </p>
                  <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-700">
                    <span>Expiry: 14 Months</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Quality Inspected</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400">
                  <Award className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Compliant with Indian Drugs & Cosmetics Act</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Standard Operating Procedure
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              A 4-step verified workflow ensuring legal safety, quality control, and zero patient expense.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stock Registration</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Licensed pharmacies and hospitals list unexpired surplus medicine batches with batch numbers, quantities, and expiry dates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">License Audit</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Compliance checks verify state drug licenses for both donors and NGO recipients before match authorization is issued.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Generic Salt Matching</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Available inventory is matched with active NGO requirements using generic salt composition, proximity, and expiry windows.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Free Patient Dispensing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Medicines are transferred with seal verification, allowing health clinics to dispense treatments free to underprivileged patients.
              </p>
            </div>
          </div>
        </section>

        {/* KEY CAPABILITIES */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Regulatory Compliance & Safety
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Designed to uphold stringent healthcare governance standards at every operational stage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mandatory License Verification</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Unverified organizations cannot upload or request inventory. All participating entities undergo verification of state drug licenses and NGO registration certificates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Expiry Window Safety Gate</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Stock with less than 60 days of remaining shelf life is automatically flagged. Expired stock cannot enter the redistribution channel under any circumstances.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Complete Digital Audit Trail</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every transaction, match approval, batch transfer, and inspection sign-off is logged digitally to maintain an official chain of custody record.
              </p>
            </div>
          </div>
        </section>

        {/* STAKEHOLDER BENEFIT CARDS */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Serving Healthcare Stakeholders
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Structured solutions tailored for pharmacies, healthcare charities, and regulatory authorities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <Building2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pharmacies & Distributors</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Eliminate medicine destruction expenses, fulfill Corporate Social Responsibility (CSR) goals, and gain verified tax/impact reporting for donated stock.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <HeartHandshake className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Health NGOs & Clinics</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Request specific essential formulations at zero acquisition cost to treat patients in underserved and rural health centers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compliance & Governance</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Maintain full compliance with drugs act regulations, batch inspection protocols, and verified institutional identity management.
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl mx-auto">
          <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-3xl p-10 sm:p-14 text-center text-white shadow-xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Partner with DawaiSetu
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join verified hospital networks, retail pharmacy chains, and health NGOs across India in building a zero-waste medicine ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
              >
                <span>Register Organization</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors text-sm"
              >
                <span>Contact Compliance Team</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  )
}
