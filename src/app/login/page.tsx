'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Recycle, Eye, EyeOff, ShieldCheck, Lock, CheckCircle2,
  Building2, ArrowRight, HelpCircle, AlertCircle
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success && result.redirectUrl) {
      addToast({ type: 'success', title: 'Welcome back', message: 'Authentication verified successfully.' })
      router.push(result.redirectUrl)
    } else {
      setError(result.error || 'Invalid credentials or organization not approved.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Left Institutional Information Column */}
      <div className="lg:w-5/12 bg-slate-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
        <div>
          {/* Platform Identity */}
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white">
              <Recycle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">DawaiSetu</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase block">Healthcare Redistribution Portal</span>
            </div>
          </Link>

          {/* Institutional Mission & Compliance Note */}
          <div className="mt-12 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                Secure National Medicine Exchange Network
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                A regulatory-compliant infrastructure connecting licensed pharmaceutical distributors, hospital pharmacies, and verified non-profit healthcare providers to eliminate medicine waste.
              </p>
            </div>

            {/* Platform Trust Attributes */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>License Verification:</strong> Every organization is verified against State Drug Control department records.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Expiry Gatekeeping:</strong> Automated safeguards prevent expired or near-expiry batches from redistribution.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>End-to-End Auditing:</strong> Physical inspections and digital chain-of-custody for every medicine unit.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
          <Link href="/contact" className="hover:text-teal-400 underline underline-offset-4">
            Need Technical Support?
          </Link>
        </div>
      </div>

      {/* Right Login Interaction Column */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Controls */}
        <div className="flex justify-between items-center w-full max-w-lg mx-auto">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home
          </Link>
        </div>

        {/* Central Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organization Sign In</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enter your authorized organization credentials to access the portal
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Authentication Failed</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., inventory@cityhospital.org"
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold rounded-md shadow-sm mt-2"
              isLoading={isLoading}
            >
              Sign In to Organization Dashboard
            </Button>
          </form>

          {/* Registration Referral */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
            <span>Don&apos;t have an accredited account? </span>
            <Link href="/register" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
              Register your organization
            </Link>
          </div>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Evaluation Demo Accounts
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400">Click to autofill</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@dawaisetu.com', 'Admin@123456')}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-medium text-xs text-slate-800 dark:text-slate-200 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer"
              >
                <span className="block font-semibold">Admin</span>
                <span className="text-[10px] text-slate-500 block">Compliance</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('donor@citypharma.com', 'Password@123')}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-medium text-xs text-slate-800 dark:text-slate-200 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer"
              >
                <span className="block font-semibold">Donor Org</span>
                <span className="text-[10px] text-slate-500 block">Pharmacy</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('recipient@cityhospital.com', 'Password@123')}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-medium text-xs text-slate-800 dark:text-slate-200 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer"
              >
                <span className="block font-semibold">Recipient</span>
                <span className="text-[10px] text-slate-500 block">Hospital</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Disclaimers */}
        <div className="w-full max-w-md mx-auto text-center text-[11px] text-slate-500 dark:text-slate-500">
          This system is intended strictly for accredited healthcare representatives. Unauthorized access attempts are monitored and recorded.
        </div>
      </div>
    </div>
  )
}
