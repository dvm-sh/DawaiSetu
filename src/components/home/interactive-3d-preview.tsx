'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, ShieldCheck, HeartHandshake, FileSpreadsheet, Check, Sparkles, AlertCircle } from 'lucide-react'

export function Interactive3DPreview() {
  const [activeTab, setActiveTab] = useState<'donor' | 'matcher' | 'recipient'>('matcher')

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
          Enterprise Interface Showcase
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Role-Tailored Healthcare Workflows
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Integrated modules built specifically for pharmaceutical donors, verification officers, and recipient health organizations.
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 gap-1 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('donor')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'donor'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Donor Module</span>
          </button>
          <button
            onClick={() => setActiveTab('matcher')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'matcher'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Smart Match Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('recipient')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'recipient'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HeartHandshake className="h-4 w-4" />
            <span>Recipient Portal</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {activeTab === 'donor' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Surplus Medicine Donor Dashboard</h3>
                <p className="text-xs text-slate-500">City Care Pharmacy • License #DL-2024-MH89</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center gap-1.5">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel Ingestion Enabled</span>
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-xs text-slate-500 font-medium">Batch #B-9021</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Metformin 500mg (2,400 Tabs)</p>
                <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-500">Expiry: Dec 2026</span>
                  <span className="text-emerald-600 font-semibold">Verified Safe</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-xs text-slate-500 font-medium">Batch #B-8812</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Azithromycin 250mg (800 Strips)</p>
                <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-500">Expiry: Nov 2026</span>
                  <span className="text-emerald-600 font-semibold">Matched (Dispatch Pending)</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-xs text-slate-500 font-medium">Batch #B-7104</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Insulin Regular 100IU Vials (150 Vials)</p>
                <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-500">Cold Storage Regimen</span>
                  <span className="text-teal-600 font-semibold">Cold-Chain Monitored</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'matcher' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Match Calculation Hub</h3>
                <p className="text-xs text-slate-500">Generic Salt Equivalence & Urgency Priority Matrix</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold">
                Match Engine Status: Active
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 text-white space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-teal-400 font-bold">[MATCH PROPOSAL #MP-9942]</span>
                <span className="text-emerald-400">Score: 98.4%</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px]">DONOR BATCH</span>
                  <p className="text-white font-bold text-sm">Paracetamol 650mg (1,500 Units)</p>
                  <p className="text-slate-400">Apex Hospital Stockroom • Mumbai</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">RECIPIENT REQUIREMENT</span>
                  <p className="text-white font-bold text-sm">Paracetamol 650mg (1,500 Units Needed)</p>
                  <p className="text-slate-400">Seva Rural Health Clinic • Thane (12.4 km)</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400">Calculated Expiry Window: 18 Months</span>
                <span className="text-teal-300">Action: Proposal Auto-Dispatched to Admin & Donor</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'recipient' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recipient NGO Requirement & Inspection Portal</h3>
                <p className="text-xs text-slate-500">Seva Community Health Trust • NGO Reg #NGO-8821</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                Authorization Passed
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-mono">REQ #R-104</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">ORS Oral Rehydration Packets (300 Packs)</p>
                  <p className="text-xs text-slate-500">Urgency: High • Matched & Delivered</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                    Inspection Approved
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Dispensed to 300 Children</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
