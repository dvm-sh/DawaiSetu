'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  Recycle, LayoutDashboard, Package, Plus, ArrowLeftRight, BarChart3,
  Bell, User, Settings, Building2, Users, ClipboardList, LogOut,
  Menu, X, Search, Pill, FileText, Heart, ChevronDown, MessageSquare, ShieldCheck
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const DONOR_NAV = [
  { href: '/donor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/donor/inventory', label: 'Inventory', icon: Package },
  { href: '/donor/inventory/new', label: 'Add Medicine', icon: Plus },
  { href: '/donor/requests', label: 'Requests', icon: ClipboardList },
  { href: '/donor/matches', label: 'Matches', icon: Search },
  { href: '/donor/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { href: '/donor/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/donor/notifications', label: 'Notifications', icon: Bell },
  { href: '/donor/profile', label: 'Profile', icon: User },
]

const RECIPIENT_NAV = [
  { href: '/recipient', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/recipient/medicines', label: 'Find Medicine', icon: Search },
  { href: '/recipient/requirements', label: 'Requirements', icon: ClipboardList },
  { href: '/recipient/requirements/new', label: 'New Requirement', icon: Plus },
  { href: '/recipient/requests', label: 'Requests', icon: Pill },
  { href: '/recipient/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { href: '/recipient/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/recipient/notifications', label: 'Notifications', icon: Bell },
  { href: '/recipient/profile', label: 'Profile', icon: User },
]

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { href: '/admin/medicines', label: 'Medicines', icon: Pill },
  { href: '/admin/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children, requiredRole }: { children: React.ReactNode; requiredRole: 'ADMIN' | 'DONOR' | 'RECIPIENT' }) {
  const { user, isLoading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const navItems = requiredRole === 'ADMIN' ? ADMIN_NAV : requiredRole === 'DONOR' ? DONOR_NAV : RECIPIENT_NAV

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
    } else if (!isLoading && user && user.role !== requiredRole) {
      router.push(user.role === 'ADMIN' ? '/admin' : user.role === 'DONOR' ? '/donor' : '/recipient')
    }
  }, [user, isLoading, requiredRole, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    )
  }

  if (!user || user.role !== requiredRole) return null

  const pendingApproval = user.organization && user.organization.status !== 'APPROVED' && user.role !== 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex transition-colors">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed inset-y-0 left-0 z-30 transition-colors">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Recycle className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">DawaiSetu</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${requiredRole.toLowerCase()}` && pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-semibold' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{unreadCount}</span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100 w-full transition-colors cursor-pointer">
            <LogOut className="h-4.5 w-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 shadow-xl z-50 transition-colors">
            <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Recycle className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">DawaiSetu</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100'
                    )}>
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
              <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 w-full cursor-pointer">
                <LogOut className="h-4.5 w-4.5" /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-4 sm:px-6 lg:px-8 transition-colors">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href={`/${requiredRole.toLowerCase()}/notifications`} className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-950/60 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">{user.email[0].toUpperCase()}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">{user.organization?.name || user.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Pending Approval Banner */}
        {pendingApproval && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900 px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <p>Your organization is <strong>{user.organization?.status?.toLowerCase()}</strong>. Some features are restricted until admin approval.</p>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
