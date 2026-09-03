'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StatsCard } from '@/components/ui/stats-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Package, ArrowLeftRight, Clock, Plus, DollarSign, AlertTriangle, TrendingUp, Eye } from 'lucide-react'

export default function DonorDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => { setStats(data.data); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) return <DashboardSkeleton />

  const overview = (stats as Record<string, Record<string, number>>)?.overview || {}
  const recentActivity = ((stats as Record<string, unknown[]>)?.recentActivity || []) as Record<string, unknown>[]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your medicine donations and track impact</p>
        </div>
        <Link href="/donor/inventory/new">
          <Button><Plus className="h-4 w-4" /> Add Medicine</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Medicines" value={overview.activeMedicines || 0} icon={Package} iconColor="bg-blue-50 text-blue-600" />
        <StatsCard title="Pending Requests" value={overview.pendingRequests || 0} icon={Clock} iconColor="bg-amber-50 text-amber-600" />
        <StatsCard title="Completed Transfers" value={overview.completedTransfers || 0} icon={ArrowLeftRight} iconColor="bg-emerald-50 text-emerald-600" />
        <StatsCard title="Value Donated" value={formatCurrency(overview.totalValue || 0)} icon={DollarSign} iconColor="bg-purple-50 text-purple-600" />
      </div>

      {/* Expiring Medicines Warning */}
      {overview.expiringMedicines > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">{overview.expiringMedicines} medicine(s) approaching expiry</p>
            <p className="text-xs text-amber-600">Review and prioritize these for donation</p>
          </div>
          <Link href="/donor/inventory?expiryCategory=CRITICAL">
            <Button variant="outline" size="sm">View</Button>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: '/donor/inventory/new', icon: Plus, label: 'Add Medicine', color: 'bg-teal-50 text-teal-600' },
          { href: '/donor/inventory', icon: Package, label: 'View Inventory', color: 'bg-blue-50 text-blue-600' },
          { href: '/donor/transfers', icon: ArrowLeftRight, label: 'View Transfers', color: 'bg-purple-50 text-purple-600' },
          { href: '/donor/analytics', icon: TrendingUp, label: 'Analytics', color: 'bg-emerald-50 text-emerald-600' },
        ].map(action => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-gray-700">{action.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <Link href="/donor/transfers"><Button variant="ghost" size="sm">View All</Button></Link>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((transfer: Record<string, unknown>) => (
                <div key={transfer.id as string} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <ArrowLeftRight className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Transfer to {(transfer.recipientOrg as Record<string, string>)?.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(transfer.createdAt as string)}</p>
                  </div>
                  <StatusBadge status={transfer.status as string} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No recent activity" description="Your recent transfers and donations will appear here" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
