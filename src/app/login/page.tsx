'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Recycle, Eye, EyeOff, ShieldCheck, Heart, Pill, Sparkles, ArrowRight } from 'lucide-react'

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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success && result.redirectUrl) {
      addToast({ type: 'success', title: 'Welcome back!', message: 'Login successful' })
      router.push(result.redirectUrl)
    } else {
      setError(result.error || 'Login failed')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors relative overflow-hidden">
      {/* Left 3D Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-md">
            <Recycle className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">DawaiSetu</span>
        </Link>

        {/* Floating 3D Cards Stack */}
        <div className="relative z-10 perspective-[1000px] my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/25 shadow-2xl text-white space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-teal-200" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-teal-100 font-semibold">Verification System</span>
                <h3 className="font-bold text-lg text-white">Direct Redistribution Hub</h3>
              </div>
            </div>

            <p className="text-teal-50 text-base leading-relaxed">
              Connecting surplus medicine donors with healthcare organizations in real-time. Zero waste, maximum impact.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20 text-xs">
              <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                <span className="text-teal-200 block">Verified Entities</span>
                <span className="text-lg font-bold text-white">100% Inspected</span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                <span className="text-teal-200 block">Transfer Security</span>
                <span className="text-lg font-bold text-white">Cold-Chain Lock</span>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-teal-200 text-xs z-10">&copy; {new Date().getFullYear()} DawaiSetu. All rights reserved.</p>
      </div>

      {/* Right Column Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 relative z-10">
        <div className="flex justify-between items-center w-full">
          <div className="lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white">
                <Recycle className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">DawaiSetu</span>
            </Link>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto my-auto py-8"
        >
          <div className="text-center sm:text-left mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Sign in to your organization account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full h-12 text-base rounded-xl font-semibold shadow-lg shadow-teal-600/20" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
              Register your organization
            </Link>
          </p>

          {/* Clickable Quick Demo Logins */}
          <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs space-y-3">
            <p className="font-bold text-gray-800 dark:text-gray-200 flex items-center justify-between">
              <span>Quick Demo Sign In:</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal">Click to fill</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@dawaisetu.com', 'Admin@123456')}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:border-teal-500 transition-colors cursor-pointer text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('donor@citypharma.com', 'Password@123')}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:border-teal-500 transition-colors cursor-pointer text-center"
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('recipient@cityhospital.com', 'Password@123')}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:border-teal-500 transition-colors cursor-pointer text-center"
              >
                Recipient
              </button>
            </div>
          </div>
        </motion.div>

        <div className="text-center text-xs text-gray-400">
          DawaiSetu Medicine Redistribution Platform
        </div>
      </div>
    </div>
  )
}
