'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Phone, HeartHandshake, ShieldCheck, X, Sparkles, HelpCircle, Headset } from 'lucide-react'

export function FloatingQuickAction() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border border-gray-200/80 dark:border-gray-800/80 w-72 space-y-3"
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Quick Actions</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <Link
                href="/donor"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 text-teal-900 dark:text-teal-200 hover:scale-[1.02] transition-transform font-medium"
              >
                <HeartHandshake className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Donate Surplus Stock</span>
              </Link>

              <Link
                href="/recipient"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 hover:scale-[1.02] transition-transform font-medium"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Request Medicine Batch</span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:scale-[1.02] transition-transform font-medium"
              >
                <MessageSquare className="h-4 w-4 text-slate-500 shrink-0" />
                <span>Contact Support Desk</span>
              </Link>

              <a
                href="tel:1800329242273"
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Call Toll-Free</span>
                </div>
                <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">24/7</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all z-50 relative"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" />}
      </button>
    </div>
  )
}
