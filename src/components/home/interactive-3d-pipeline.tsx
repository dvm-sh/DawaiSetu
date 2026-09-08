'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pill, Search, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react'

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Surplus Inventory Ingestion',
    subtitle: 'Bulk & Manual Stock Upload',
    icon: Pill,
    description: 'Licensed pharmacies and hospital chains register unexpired surplus medicine batches into the secure system with batch codes, unit quantities, and expiry verification.',
    metrics: [
      { label: 'Ingestion Method', val: 'Excel / API / Manual' },
      { label: 'Expiry Safety Gate', val: 'Strict >60 Days Window' },
    ],
  },
  {
    step: '02',
    title: 'License & Compliance Verification',
    subtitle: 'Regulatory Safety Check',
    icon: ShieldCheck,
    description: 'Automated verification checks donor drug licenses, recipient authorization credentials, and packaging integrity standards before any match proposal is generated.',
    metrics: [
      { label: 'Verification Rate', val: '100% Inspected' },
      { label: 'Compliance Standard', val: 'CDSCO Regulatory' },
    ],
  },
  {
    step: '03',
    title: 'Intelligent Requirement Matching',
    subtitle: 'Salt Equivalence Algorithm',
    icon: Search,
    description: 'The platform pairs donor inventory with active recipient requests based on generic salt composition, geographical proximity, and medical urgency priority.',
    metrics: [
      { label: 'Match Score Threshold', val: '>95.0% Accuracy' },
      { label: 'Response Time', val: 'Real-Time Queue' },
    ],
  },
  {
    step: '04',
    title: 'Inspected Delivery & Patient Care',
    subtitle: 'Zero-Waste Final Distribution',
    icon: HeartHandshake,
    description: 'Medicines are dispatched via temperature-managed logistics. Recipient health centers inspect seal integrity upon delivery before dispensing free to patients.',
    metrics: [
      { label: 'Patient Cost', val: '₹0 Free Healthcare' },
      { label: 'Wastage Prevention', val: 'Zero Preserved Value' },
    ],
  },
]

export function Interactive3DPipeline() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
          Standard Operating Procedure
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verified Redistribution Process
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          A four-stage compliant workflow designed to guarantee safety, legal accountability, and rapid delivery.
        </p>
      </div>

      {/* 4 Step Grid Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PIPELINE_STEPS.map((item, idx) => {
          const Icon = item.icon
          const isActive = activeStep === idx

          return (
            <motion.div
              key={item.step}
              onClick={() => setActiveStep(idx)}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl shadow-teal-900/5'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                    PHASE {item.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Metrics Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {item.metrics.map((m) => (
                  <div key={m.label} className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">{m.label}:</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">{m.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
