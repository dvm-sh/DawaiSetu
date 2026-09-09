'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useEffect, useState, useCallback } from 'react'
import { cn, formatDate } from '@/lib/utils'
import {
  Recycle, LayoutDashboard, Package, Plus, ArrowLeftRight, BarChart3,
  Bell, User, Settings, Building2, Users, ClipboardList, LogOut,
  Menu, X, Search, Pill, FileText, Heart, Flame, Star, ShieldCheck,
  ChevronRight, Sparkles
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function DashboardLayout({
  children,
  requiredRole = 'ANY'
}: {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'DONOR' | 'RECIPIENT' | 'ANY'
}) {
  const { user, isLoading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?unreadOnly=true&limit=1')
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.data?.unreadCount || 0)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user, fetchNotifications])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (!isLoading && user && requiredRole !== 'ANY') {
      if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
        router.push('/dashboard')
      }
      // Allow donors and recipients to cross-access organizational features
    }
  }, [user, isLoading, requiredRole, router])

  const isAdmin = user?.role === 'ADMIN'
  const isOrg = user?.role === 'DONOR' || user?.role === 'RECIPIENT'
  
  // A suspended or rejected org cannot see normal menus
  const isRestricted = user?.organization && (user.organization.status === 'SUSPENDED' || user.organization.status === 'REJECTED') && !isAdmin

  const pendingApproval = user?.organization?.status === 'PENDING'

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 fixed inset-y-0 left-0 z-30 transition-colors">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-800">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
            <Recycle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight block">DawaiSetu</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">Unified Portal</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {/* Main Dashboard Command Center */}
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === '/dashboard' || pathname === '/donor' || pathname === '/recipient'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              Unified Overview
            </Link>
          </div>

          {!isRestricted && (
            <>
              {/* Donation Hub */}
              {(user.role === 'DONOR' || isAdmin) && (
                <div className="space-y-1">
                  <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Donation Hub
                  </p>
                  <Link
                    href="/donor/inventory"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname.startsWith('/donor/inventory') && pathname !== '/donor/inventory/new'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <Package className="h-4 w-4 text-teal-400" />
                    Medicine Inventory
                  </Link>
                  <Link
                    href="/donor/inventory/new"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname === '/donor/inventory/new'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <Plus className="h-4 w-4 text-teal-400" />
                    Add Donation Batch
                  </Link>
                  <Link
                    href="/donor/matches"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname === '/donor/matches'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <Search className="h-4 w-4 text-teal-400" />
                    Matched Recipients
                  </Link>
                </div>
              )}

              {/* Recipient Hub */}
              {(user.role === 'RECIPIENT' || isAdmin) && (
                <div className="space-y-1">
                  <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Recipient Hub
                  </p>
                  <Link
                    href="/recipient/medicines"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname === '/recipient/medicines'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <Search className="h-4 w-4 text-blue-400" />
                    Search Medicines
                  </Link>
                  <Link
                    href="/recipient/requirements/new"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname === '/recipient/requirements/new'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <Plus className="h-4 w-4 text-blue-400" />
                    Post Medicine Need
                  </Link>
                  <Link
                    href="/recipient/requirements"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname === '/recipient/requirements'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <ClipboardList className="h-4 w-4 text-blue-400" />
                    Active Requests
                  </Link>
                </div>
              )}

              {/* Logistics & Compliance */}
              {(user.role === 'DONOR' || isAdmin) && (
                <div className="space-y-1">
                  <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Logistics & Safety
                  </p>
                  <Link
                    href="/donor/transfers"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname.includes('/transfers')
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <ArrowLeftRight className="h-4 w-4 text-purple-400" />
                    Transfers & Shipping
                  </Link>
                  <Link
                    href="/dashboard/disposal"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname === '/dashboard/disposal'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <Flame className="h-4 w-4 text-red-400" />
                    Safe Disposal Hub
                  </Link>
                  <Link
                    href="/dashboard/reviews"
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      pathname === '/dashboard/reviews'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    )}
                  >
                    <Star className="h-4 w-4 text-amber-400" />
                    Donor Reviews
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Admin Section if Admin */}
          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                Admin Controls
              </p>
              <Link
                href="/admin/organizations"
                className={cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                  pathname === '/admin/organizations'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <Building2 className="h-4 w-4 text-teal-400" />
                Accreditation & Docs
              </Link>
              <Link
                href="/admin/medicines"
                className={cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                  pathname === '/admin/medicines'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <Pill className="h-4 w-4 text-teal-400" />
                All Medicines
              </Link>
              <Link
                href="/admin/audit-logs"
                className={cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                  pathname === '/admin/audit-logs'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <FileText className="h-4 w-4 text-teal-400" />
                Compliance Audit Logs
              </Link>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Top Institutional Header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-4 sm:px-6 lg:px-8 transition-colors shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Welcome Text */}
          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Welcome back, {isAdmin ? 'System Admin' : user.organization?.name || 'Organization'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {formatDate(new Date().toISOString())}
            </p>
          </div>

          <div className="flex-1" />

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Mockup (Visual Polish) */}
            <div className="hidden md:flex items-center relative mr-2">
              <Search className="h-4 w-4 absolute left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-full text-sm w-48 lg:w-64 transition-all outline-none"
              />
            </div>

            {/* Notifications Shortcut */}
            <Link
              href={isAdmin ? '/admin/notifications' : '/dashboard/notifications'}
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-sm border-2 border-white dark:border-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            {/* User Profile Indicator */}
            <div className="flex items-center gap-3 pl-1 sm:pl-2 cursor-pointer group">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors">
                  {isAdmin ? 'Administrator' : user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </span>
                <span className="text-[11px] text-slate-500 max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>
              <div className="w-9 h-9 bg-gradient-to-tr from-teal-600 to-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-900 group-hover:shadow-md transition-all">
                {user.email[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Approval Warning Banner */}
        {pendingApproval && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600" />
              <p>
                Accreditation status: <strong className="uppercase">{user.organization?.status}</strong>. Document verification is in review by the compliance board.
              </p>
            </div>
          </div>
        )}

        {/* Body Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
