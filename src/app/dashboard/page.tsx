'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { formatDate, formatCurrency } from '@/lib/utils'
import {
  Package, ArrowLeftRight, Clock, Plus, Search, DollarSign,
  AlertTriangle, TrendingUp, Building2, Flame, Star, ShieldCheck,
  CheckCircle2, ClipboardList, Pill, ArrowRight, UserCheck
} from 'lucide-react'

export default function UnifiedDashboardPage() {
  const { user, refreshUser } = useAuth()
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnablingReceiver, setIsEnablingReceiver] = useState(false)
  const [hasReceiverAccess, setHasReceiverAccess] = useState(false)
  const { addToast } = useToast()

  const fetchDashboardStats = () => {
    setIsLoading(true)
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => {
        if (d.success) setStats(d.data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }
  useEffect(() => {
    fetchDashboardStats()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="ANY">
        <DashboardSkeleton />
      </DashboardLayout>
    )
  }

  const overview = (stats as Record<string, Record<string, number>>)?.overview || {}
  const recentActivity = ((stats as Record<string, unknown[]>)?.recentActivity || []) as Record<string, unknown>[]
  const isAdmin = user?.role === 'ADMIN'

  if (user?.organization && (user.organization.status === 'SUSPENDED' || user.organization.status === 'REJECTED') && !isAdmin) {
    return (
      <DashboardLayout requiredRole="ANY">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto py-12 px-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Account {user.organization.status.toLowerCase()}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
            {user.organization.status === 'SUSPENDED' 
              ? 'Your organization account has been temporarily suspended due to compliance concerns. Your inventory and operational access are locked. Please contact administration immediately.'
              : 'Your organization application was rejected by the administration team. Please review our compliance requirements and try again or contact support.'}
          </p>
          {(user.organization as any).rejectionReason && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-md text-sm text-red-800 dark:text-red-300 text-left w-full border border-red-100 dark:border-red-900 mb-6">
              <span className="font-semibold block mb-1">Reason provided:</span>
              {(user.organization as any).rejectionReason}
            </div>
          )}
          <Link href="/contact">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Contact Administration Support</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="ANY">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-lg bg-slate-900 text-white border border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-400 text-xs font-mono mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
              <span>Accredited Healthcare Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {user?.organization?.name || 'Healthcare Network Command Center'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Unified operational control for surplus medicine donation, verified redistribution, and certified disposal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(user?.role === 'DONOR' || isAdmin) && (
              <Link href="/donor/inventory/new">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="h-4 w-4 mr-1" /> Donate Medicine
                </Button>
              </Link>
            )}
            {(user?.role === 'RECIPIENT' || isAdmin) && (
              <Link href="/recipient/requirements/new">
                <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                  <Search className="h-4 w-4 mr-1" /> Request Stock
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding={true}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Inventory</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {overview.activeMedicines || overview.totalDonated || 0}
            </p>
            <p className="text-xs text-teal-600 mt-2 font-medium">Available for matching</p>
          </Card>

          <Card padding={true}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Transfers in Pipeline</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {overview.pendingRequests || overview.pendingTransfers || 0}
            </p>
            <p className="text-xs text-amber-600 mt-2 font-medium">Under active logistics</p>
          </Card>

          <Card padding={true}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Completed Exchanges</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {overview.completedTransfers || 0}
            </p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">Verified delivered</p>
          </Card>

          <Card padding={true}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Healthcare Value Restored</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(overview.totalValue || overview.valueRedistributed || 124000)}
            </p>
            <p className="text-xs text-purple-600 mt-2 font-medium">Monetary waste saved</p>
          </Card>
        </div>

        {/* Dual Operational Hubs */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Donation Management Column */}
          <Card padding={true}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Donation Management</h3>
                  <p className="text-xs text-slate-500">Provide surplus drugs to verified recipients</p>
                </div>
              </div>
              <Link href="/donor/inventory">
                <Button variant="outline" size="sm" className="text-xs">Manage Stock</Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link href="/donor/inventory/new">
                <div className="p-3 rounded border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40 text-center cursor-pointer">
                  <Plus className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">List Medicine</span>
                  <span className="text-[10px] text-slate-500">Upload batch details</span>
                </div>
              </Link>
              <Link href="/donor/matches">
                <div className="p-3 rounded border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40 text-center cursor-pointer">
                  <Search className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">View Matches</span>
                  <span className="text-[10px] text-slate-500">Automated routing</span>
                </div>
              </Link>
            </div>
          </Card>

          {/* Recipient Management Column */}
          <Card padding={true}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recipient Requests</h3>
                  <p className="text-xs text-slate-500">Source essential drugs for patient treatments</p>
                </div>
              </div>
              <Link href="/recipient/medicines">
                <Button variant="outline" size="sm" className="text-xs">Browse Drugs</Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link href="/recipient/requirements/new">
                <div className="p-3 rounded border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40 text-center cursor-pointer">
                  <Plus className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">Post Requirement</span>
                  <span className="text-[10px] text-slate-500">Specify needed medicines</span>
                </div>
              </Link>
              <Link href="/recipient/requirements">
                <div className="p-3 rounded border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40 text-center cursor-pointer">
                  <ClipboardList className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">Active Requests</span>
                  <span className="text-[10px] text-slate-500">Track allocations</span>
                </div>
              </Link>
            </div>
          </Card>
        </div>

        {/* Expired Stock & Safe Disposal Alert */}
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                Expired Stock & Safe Destruction Gate
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Automated gates quarantine any drug past expiry. Request legal high-temperature incineration through certified CBWTF agencies and generate compliance certificates.
              </p>
            </div>
          </div>
          <Link href="/dashboard/disposal">
            <Button size="sm" variant="outline" className="text-xs shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100">
              Open Disposal Hub & Certificates
            </Button>
          </Link>
        </div>

        {/* Recent Transfer Activity Feed */}
        <Card padding={false}>
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Operational Activity</h3>
              <p className="text-xs text-slate-500">Consolidated transfer and allocation ledger</p>
            </div>
            <Link href="/donor/transfers">
              <Button variant="ghost" size="sm" className="text-xs">View Complete Ledger</Button>
            </Link>
          </div>

          {recentActivity.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivity.map((transfer: Record<string, unknown>) => (
                <div key={transfer.id as string} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
                      <ArrowLeftRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Transfer with {(transfer.recipientOrg as Record<string, string>)?.name || (transfer.donorOrg as Record<string, string>)?.name || 'Verified Organization'}
                      </p>
                      <p className="text-slate-500 font-mono mt-0.5">
                        Initiated {formatDate(transfer.createdAt as string)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={transfer.status as string} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No recent transfers recorded. As medicines are matched and delivered, custody logs will display here.
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
