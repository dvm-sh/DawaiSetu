import Link from 'next/link'
import { Heart, ArrowRight, Shield, Truck, Users, BarChart3, CheckCircle2, Pill, Building2, Recycle, Search, ChevronRight, Menu, X } from 'lucide-react'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { ClientNav } from '@/components/client-nav'

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
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <ClientNav initialUser={user} />


      {/* Hero */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-sm text-teal-700 font-medium mb-6">
            <Heart className="h-4 w-4" />
            Reducing medicine waste, saving lives
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
            Smart Medicine
            <span className="text-teal-600"> Redistribution</span> Platform
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect surplus medicine donors with healthcare organizations in need. 
            Our AI-powered matching ensures the right medicines reach the right patients, on time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30">
              Start Donating <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
              See How It Works
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Verified Organizations</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Expiry Tracking</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Smart Matching</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> End-to-End Tracking</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How DawaiSetu Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">A seamless 4-step process to redistribute surplus medicines</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Pill, title: 'Donor Lists Medicine', desc: 'Pharmacies, hospitals & NGOs list surplus medicines with expiry & quantity details', step: '01' },
              { icon: Search, title: 'Smart Matching', desc: 'Our engine matches medicines with recipients based on needs, location & urgency', step: '02' },
              { icon: Truck, title: 'Secure Transfer', desc: 'Verified pickup or shipping with real-time tracking and quality inspection', step: '03' },
              { icon: Heart, title: 'Patients Helped', desc: 'Medicines reach patients in need. Impact is tracked and reported', step: '04' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-teal-200 hover:shadow-lg transition-all group">
                <span className="text-5xl font-bold text-gray-100 group-hover:text-teal-50 transition-colors absolute top-4 right-4">{item.step}</span>
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                  <item.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">The Medicine Waste Crisis</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Every year, billions of rupees worth of medicines are wasted due to expiry while millions of patients lack access to basic healthcare. 
                DawaiSetu bridges this gap through intelligent redistribution.
              </p>
              <div className="space-y-4">
                {[
                  '₹18,000 Cr+ worth of medicines wasted annually in India',
                  '65% of the population lacks access to essential medicines',
                  '40% of donated medicines go unused due to poor matching',
                ].map((stat) => (
                  <div key={stat} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                    <p className="text-gray-700">{stat}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Solution</h3>
              <div className="space-y-6">
                {[
                  { icon: Search, title: 'Smart Matching', desc: 'AI-powered matching ensures 95%+ compatibility' },
                  { icon: Shield, title: 'Verification', desc: 'All organizations are verified before participation' },
                  { icon: BarChart3, title: 'Impact Tracking', desc: 'Real-time tracking of medicine redistribution impact' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                      <item.icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Platform Benefits</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">For donors, recipients, and the community</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: 'For Donors', items: ['Reduce medicine waste', 'Tax benefits', 'CSR compliance', 'Easy listing process'] },
              { icon: Heart, title: 'For Recipients', items: ['Access to free medicines', 'Smart matching', 'Quality assurance', 'End-to-end tracking'] },
              { icon: Users, title: 'For Community', items: ['Reduced healthcare costs', 'Environmental impact', 'Data-driven insights', 'Transparency'] },
            ].map((section) => (
              <div key={section.title} className="bg-white rounded-2xl p-6 border border-gray-200 text-left">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                  <section.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-700 font-medium mb-6">
            <Shield className="h-4 w-4" /> Safety First
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built with Safety & Trust</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">Every step of the process is verified and tracked</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Organization Verification', desc: 'Multi-document verification before approval' },
              { title: 'Expiry Monitoring', desc: 'Automatic tracking prevents expired medicine transfer' },
              { title: 'Quality Inspection', desc: 'Mandatory recipient inspection on delivery' },
              { title: 'Complete Audit Trail', desc: 'Every action is logged for transparency' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-teal-100 mb-8 max-w-xl mx-auto">
            Join DawaiSetu today and help redistribute surplus medicines to those who need them most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-700 font-medium rounded-xl hover:bg-teal-50 transition-colors">
              Register Your Organization <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Recycle className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">DawaiSetu</span>
              </div>
              <p className="text-sm leading-relaxed">Smart medicine redistribution platform connecting donors with recipients.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/about" className="block hover:text-white transition-colors">About</Link>
                <Link href="/how-it-works" className="block hover:text-white transition-colors">How It Works</Link>
                <Link href="/register" className="block hover:text-white transition-colors">Register</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
                <Link href="/contact" className="block hover:text-white transition-colors">Help Center</Link>
                <Link href="/faq" className="block hover:text-white transition-colors">FAQ</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} DawaiSetu. All rights reserved. Built to reduce medicine waste.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
