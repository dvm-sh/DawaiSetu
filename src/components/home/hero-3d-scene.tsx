'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, CheckCircle2, ChevronRight, Award, Activity } from 'lucide-react'

export function Hero3DScene({ user }: { user?: any }) {
  const dashboardUrl = user?.role === 'ADMIN' ? '/admin' : user?.role === 'DONOR' ? '/donor' : '/recipient'

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column - Authoritative Copy */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Institutional Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-semibold"
          >
            <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Official Healthcare Redistribution Network</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              National Infrastructure for <span className="text-teal-600 dark:text-teal-400">Surplus Medicine</span> Redistribution.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
              Connecting licensed pharmaceutical suppliers, hospital networks, and verified healthcare non-profits to prevent medicine waste and deliver essential treatments safely.
            </p>
          </motion.div>

          {/* Primary Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            {user ? (
              <Link
                href={dashboardUrl}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold rounded-2xl shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Access Organization Dashboard</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold rounded-2xl shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02]"
                >
                  <span>Register Entity</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-base font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 transition-all"
                >
                  <span>Redistribution Protocol</span>
                </Link>
              </>
            )}
          </motion.div>

          {/* Compliance Certification Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Drug License Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Cold-Chain Protocols</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Batch Audit Trails</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Official Institutional Dashboard Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            {/* Platform Header Status */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
                  DS
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">System Operations</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Live National Feed</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-semibold border border-emerald-200 dark:border-emerald-800">
                Network Active
              </span>
            </div>

            {/* Key Platform Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Stock Preserved</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">105,400+</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block">Units Redistributed</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Verified Partners</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">480+</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">Hospitals & NGOs</span>
              </div>
            </div>

            {/* Verified Operational Flow Item */}
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-teal-900 dark:text-teal-200">Latest Batch Match</span>
                <span className="text-teal-600 dark:text-teal-400 font-mono text-[10px]">Just Verified</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Amoxicillin 500mg (1,200 Caps) matched from <span className="font-semibold text-slate-900 dark:text-white">City Care Pharmacy</span> to <span className="font-semibold text-slate-900 dark:text-white">Hope Rural Healthcare Trust</span>.
              </p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 dark:text-slate-400 border-t border-teal-200/40 dark:border-teal-800/40">
                <span>Expiry Window: 14 Months</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Quality Pass</span>
              </div>
            </div>

            {/* Platform Guarantee Disclaimer */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400">
              <Award className="h-4 w-4 text-teal-600 shrink-0" />
              <span>Compliant with Indian Drugs & Cosmetics Act Regulations</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
