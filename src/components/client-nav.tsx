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
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DawaiSetu</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">About</Link>
            <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">How It Works</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href={dashboardUrl} className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                  Dashboard
                </Link>
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4">
          <Link href="/about" className="block text-gray-600">About</Link>
          <Link href="/how-it-works" className="block text-gray-600">How It Works</Link>
          <Link href="/contact" className="block text-gray-600">Contact</Link>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <>
                <Link href={dashboardUrl} className="block text-center px-4 py-2 text-teal-600 bg-teal-50 rounded-lg">Dashboard</Link>
                <button onClick={logout} className="w-full text-center px-4 py-2 text-white bg-red-600 rounded-lg">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-center px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">Sign In</Link>
                <Link href="/register" className="block text-center px-4 py-2 text-white bg-teal-600 rounded-lg">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
