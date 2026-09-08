'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck, HeartHandshake, HelpCircle, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useToast } from '@/components/ui/toast'
import { ParticleCanvas } from '@/components/home/particle-canvas'
import { ScrollProgress } from '@/components/home/scroll-progress'

const INQUIRY_CATEGORIES = [
  { id: 'general', label: 'General Inquiry', icon: HelpCircle },
  { id: 'donor', label: 'Surplus Donor Support', icon: HeartHandshake },
  { id: 'recipient', label: 'Recipient Verification', icon: ShieldCheck },
  { id: 'urgent', label: 'Emergency Medicine Request', icon: MessageSquare },
]

export default function ContactPage() {
  const { addToast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState('general')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 3D Parallax Tilt for Contact Container
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      addToast({
        type: 'success',
        title: 'Message Received',
        message: 'Thank you! Our support coordinator will get back to you within 24 hours.',
      })
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors relative overflow-hidden flex flex-col">
      <ScrollProgress />
      <ParticleCanvas />

      {/* Top Header Navigation */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-semibold transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-mono px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Active Response Center
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {/* Title Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 text-xs font-bold uppercase tracking-wider">
            <span>Direct Communication Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            We are here to support your redistribution mission.
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Have questions about medicine donation, compliance verification, or urgent recipient assistance? Connect with our dedicated healthcare support team.
          </p>
        </motion.div>

        {/* 3D Depth Card Container */}
        <div className="perspective-[1200px]">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 dark:border-gray-800/80 grid md:grid-cols-5 transition-colors"
          >
            {/* Left 2 Columns: Contact Detail Cards */}
            <div className="md:col-span-2 p-8 sm:p-10 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden space-y-8">
              {/* Decorative depth blurred lights */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Reach Our Support Desk</h2>
                  <p className="text-sm text-teal-100/90 leading-relaxed">
                    Our team answers inquiries from hospitals, verified pharmacies, non-profits, and individual donors.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/30 flex items-center justify-center shrink-0 border border-teal-300/30">
                      <Mail className="h-5 w-5 text-teal-200" />
                    </div>
                    <div>
                      <p className="text-xs text-teal-200 uppercase font-mono font-semibold tracking-wider">Email Communication</p>
                      <p className="font-semibold text-white text-sm">support@dawaisetu.com</p>
                      <p className="text-[11px] text-teal-200/80">Average response time: 2 hours</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/30 flex items-center justify-center shrink-0 border border-teal-300/30">
                      <Phone className="h-5 w-5 text-teal-200" />
                    </div>
                    <div>
                      <p className="text-xs text-teal-200 uppercase font-mono font-semibold tracking-wider">Toll-Free Helpline</p>
                      <p className="font-semibold text-white text-sm">+91 1800-DAWAI-CARE</p>
                      <p className="text-[11px] text-teal-200/80">Mon to Sat • 9:00 AM - 8:00 PM IST</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/30 flex items-center justify-center shrink-0 border border-teal-300/30">
                      <MapPin className="h-5 w-5 text-teal-200" />
                    </div>
                    <div>
                      <p className="text-xs text-teal-200 uppercase font-mono font-semibold tracking-wider">National Office</p>
                      <p className="font-semibold text-white text-sm">BKC Financial Center, Mumbai</p>
                      <p className="text-[11px] text-teal-200/80">Maharashtra, 400051, India</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/30 flex items-center justify-center shrink-0 border border-teal-300/30">
                      <Clock className="h-5 w-5 text-teal-200" />
                    </div>
                    <div>
                      <p className="text-xs text-teal-200 uppercase font-mono font-semibold tracking-wider">Operational Status</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="font-semibold text-white text-sm">Systems & Logistics Active</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-teal-200/90 flex items-center justify-between">
                <span>Verification ID: DS-HUB-2026</span>
                <span className="font-mono text-[10px]">Encrypted Channel</span>
              </div>
            </div>

            {/* Right 3 Columns: Interactive 3D Form */}
            <div className="md:col-span-3 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send a Direct Message</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Select your inquiry category so we can route your message to the appropriate coordinator.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-3xl text-center space-y-4 my-8"
                  >
                    <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-teal-600/30">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-teal-900 dark:text-teal-100">Message Delivered Successfully</h3>
                    <p className="text-sm text-teal-700 dark:text-teal-300 max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="font-semibold">{name || 'valued user'}</span>. Our support team has logged your ticket under category <span className="font-semibold uppercase font-mono text-xs">{category}</span>.
                    </p>
                    <Button
                      onClick={() => {
                        setSubmitted(false)
                        setMessage('')
                      }}
                      variant="outline"
                      className="mt-4 rounded-xl border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selector Pills */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                        Inquiry Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {INQUIRY_CATEGORIES.map((cat) => {
                          const Icon = cat.icon
                          const isSelected = category === cat.id
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategory(cat.id)}
                              className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-2.5 cursor-pointer text-xs font-medium ${
                                isSelected
                                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 shadow-sm'
                                  : 'bg-gray-50/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                              }`}
                            >
                              <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'}`} />
                              <span className="truncate">{cat.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Rajesh Sharma"
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@hospital.org"
                        required
                      />
                    </div>

                    <div>
                      <Textarea
                        label="Your Message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your medicine donation or request inquiry details..."
                        required
                      />
                      <div className="flex justify-between items-center mt-1 text-[11px] text-gray-400">
                        <span>Please omit sensitive patient identity details</span>
                        <span>{message.length} characters</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl text-base font-semibold shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2"
                      isLoading={isSubmitting}
                    >
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer minimal info */}
      <footer className="relative z-10 py-6 text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200/50 dark:border-gray-800/50">
        &copy; {new Date().getFullYear()} DawaiSetu Healthcare Redistribution Hub • Safe, Verified & Accessible
      </footer>
    </div>
  )
}

