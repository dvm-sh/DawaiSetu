'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Building, Heart, CheckCircle2 } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { GlobalFooter } from '@/components/layout/global-footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col justify-between">
      <div className="max-w-5xl mx-auto space-y-12 relative z-10 px-4 py-12 flex-1 w-full">
        {/* Navigation Top */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 text-xs font-semibold transition-all shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Hero Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-14 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              About DawaiSetu
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
              DawaiSetu was established to address the critical discrepancy in healthcare: substantial quantities of unexpired essential pharmaceuticals are discarded daily while millions of patients face barriers to accessing basic medication.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">100% Verified</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Drug License Audit Gate</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Zero Waste</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unexpired Stock Preservation</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">Zero Patient Cost</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free Dispensing via Health NGOs</p>
            </div>
          </div>
        </motion.div>

        {/* 3 Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Rigorous Verification</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every participating entity must submit valid state drug licenses and official credentials. Unverified entities cannot list or receive medications.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Building className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Institutional Architecture</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Engineered to support hospital networks, retail pharmacy chains, and accredited healthcare non-profits with automated Excel inventory processing.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Direct Patient Care</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transferred batches directly relieve financial burdens for underprivileged patients receiving care through community health trusts.
            </p>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  )
}
