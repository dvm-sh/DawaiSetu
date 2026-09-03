'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Recycle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

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
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Recycle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">DawaiSetu</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">Redistribute Medicine.<br />Reduce Waste.<br />Save Lives.</h2>
          <p className="text-teal-100 text-lg">Join thousands of organizations making healthcare accessible through smart medicine redistribution.</p>
        </div>
        <p className="text-teal-200 text-sm">&copy; {new Date().getFullYear()} DawaiSetu</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DawaiSetu</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
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
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-teal-600 font-medium hover:text-teal-700">
              Register your organization
            </Link>
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Demo Accounts:</p>
            <p>Admin: admin@dawaisetu.com / Admin@123456</p>
            <p>Donor: donor@citypharma.com / Password@123</p>
            <p>Recipient: recipient@cityhospital.com / Password@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
