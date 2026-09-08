'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Search, Pill, Heart, CheckCircle2, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { GlobalFooter } from '@/components/layout/global-footer'

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Registration & Verification',
      icon: Shield,
      desc: 'Pharmacies, hospitals, and healthcare NGOs register on DawaiSetu. Our compliance team verifies state drug licenses and organization credentials to ensure safety before participation.',
    },
    {
      num: '02',
      title: 'Surplus Stock & Requirement Listing',
      icon: Pill,
      desc: 'Donors list unexpired surplus inventory (bulk Excel or manual entry) with batch codes and expiry dates. Recipient health centers register their active medicine requirements.',
    },
    {
      num: '03',
      title: 'Generic Salt Matching',
      icon: Search,
      desc: 'The matching system pairs donor stock with active recipient requests based on exact generic salt composition, proximity, urgency, and expiry window thresholds.',
    },
    {
      num: '04',
      title: 'Inspection & Free Patient Dispensing',
      icon: Heart,
      desc: 'Medicines are dispatched under temperature-controlled packaging. Recipients inspect seal integrity upon arrival before dispensing treatments free to underprivileged patients.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden flex flex-col justify-between">
      <div className="max-w-4xl mx-auto space-y-10 relative z-10 px-4 py-12 flex-1 w-full">
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

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6"
        >
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Redistribution Process & Compliance
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              DawaiSetu connects surplus medicine donors with accredited healthcare organizations in need through a transparent, legal, and verified four-step operating procedure.
            </p>
          </div>

          {/* 4 Process Steps */}
          <div className="space-y-4 pt-4">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex flex-col sm:flex-row gap-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-sm">
                    {step.num}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      <span>{step.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Operational Safety Standards Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white">Quality Control & Regulatory Safeguards</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Minimum 60-Day Expiry Gate</span>
                <span className="text-slate-400">Stock near expiry (&lt;60 days) is automatically flagged to protect patient safety.</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Mandatory License Verification</span>
                <span className="text-slate-400">Only state-licensed pharmacies and registered NGOs are approved for transactions.</span>
              </div>
            </div>
          </div>
          <div className="pt-2 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
            >
              <span>Register Your Organization</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      <GlobalFooter />
    </div>
  )
}
