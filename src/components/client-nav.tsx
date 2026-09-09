'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Recycle, Menu, X, LayoutDashboard, LogOut, User, ShieldCheck, HeartHandshake, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { ThemeToggle } from '@/components/theme-toggle'

export function ClientNav({ initialUser }: { initialUser: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { logout, user: authUser } = useAuth()

  const user = authUser || initialUser
  const dashboardUrl = '/dashboard'

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full pointer-events-auto">
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-6 lg:px-8 py-3 shadow-sm shadow-teal-900/5 dark:shadow-black/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                <Recycle className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                  DawaiSetu
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-medium leading-none mt-0.5">
                  Redistribution Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/60 dark:bg-gray-900/60 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-800/50">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      isActive
                        ? 'text-teal-700 dark:text-teal-300 font-bold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full shadow-sm"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Desktop Right User Controls */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                  <Link
                    href={dashboardUrl}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-600 text-white font-mono uppercase">
                      {user.role}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-full shadow-md shadow-teal-600/20 transition-all"
                  >
                    Register Entity
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="md:hidden mt-3 max-w-7xl mx-auto pointer-events-auto bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
              {user ? (
                <>
                  <Link
                    href={dashboardUrl}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-teal-600 text-white text-sm font-semibold shadow-md shadow-teal-600/20"
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Go to Dashboard</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full uppercase font-mono">
                      {user.role}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-semibold cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-2xl text-center text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-2xl text-center text-sm font-semibold bg-teal-600 text-white shadow-md"
                  >
                    Register Entity
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

