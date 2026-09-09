'use client'

import Link from 'next/link'
import { Recycle, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Heart } from 'lucide-react'

export function GlobalFooter() {
  return (
    <footer className="bg-slate-900 text-gray-300 relative z-10 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <Recycle className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">DawaiSetu</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India&apos;s verified surplus medicine redistribution platform. Connecting donors, verified pharmacies, and healthcare non-profits to eliminate medicine waste and save lives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-teal-400 transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* User & Portal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Portals</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/login" className="hover:text-teal-400 transition-colors">Organization Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-teal-400 transition-colors">Register Entity</Link>
              </li>
              <li>
                <Link href="/donor" className="hover:text-teal-400 transition-colors">Donor Portal</Link>
              </li>
              <li>
                <Link href="/recipient" className="hover:text-teal-400 transition-colors">Recipient Portal</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-400 transition-colors">Admin Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Contact & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Emergency & Legal</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-xs text-teal-400 font-mono block font-semibold">24/7 Helpline</span>
                <span className="text-white font-bold block">+91 1800-DAWAI-CARE</span>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} DawaiSetu. All rights reserved. Built for Healthcare Impact.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            <span>Verified Safety & Quality Standards Enforced</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
