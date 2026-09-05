'use client'

import Link from 'next/link'
import { Recycle, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { ThemeToggle } from '@/components/theme-toggle'

export function ClientNav({ initialUser }: { initialUser: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // We use initialUser for instant rendering, but auth context for logout action
  const { logout, user: authUser } = useAuth()
  
  const user = authUser || initialUser
  const dashboardUrl = user?.role === 'ADMIN' ? '/admin' : user?.role === 'DONOR' ? '/donor' : '/recipient'

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">DawaiSetu</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">About</Link>
            <Link href="/how-it-works" className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">How It Works</Link>
            <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href={dashboardUrl} className="px-4 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
                  Dashboard
                </Link>
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm cursor-pointer">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 space-y-4 transition-colors">
          <Link href="/about" className="block text-gray-600 dark:text-gray-300">About</Link>
          <Link href="/how-it-works" className="block text-gray-600 dark:text-gray-300">How It Works</Link>
          <Link href="/contact" className="block text-gray-600 dark:text-gray-300">Contact</Link>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
            {user ? (
              <>
                <Link href={dashboardUrl} className="block text-center px-4 py-2 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 rounded-lg">Dashboard</Link>
                <button onClick={logout} className="w-full text-center px-4 py-2 text-white bg-red-600 rounded-lg cursor-pointer">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg">Sign In</Link>
                <Link href="/register" className="block text-center px-4 py-2 text-white bg-teal-600 rounded-lg">Get Started</Link>
              </>
            )}
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
