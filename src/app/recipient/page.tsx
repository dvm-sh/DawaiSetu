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
import { Search, ArrowLeftRight, Clock, Plus, DollarSign, TrendingUp, ClipboardList, Eye } from 'lucide-react'

export default function RecipientDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(d => { setStats(d.data); setIsLoading(false) }).catch(() => setIsLoading(false)) }, [])
  if (isLoading) return <DashboardSkeleton />
  const o = (stats as Record<string, Record<string, number>>)?.overview || {}
  const recentActivity = ((stats as Record<string, unknown[]>)?.recentActivity || []) as Record<string, unknown>[]
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Recipient Dashboard</h1><p className="text-gray-600 mt-1">Find and receive medicines for your patients</p></div>
        <div className="flex gap-3">
          <Link href="/recipient/medicines"><Button variant="outline"><Search className="h-4 w-4" /> Find Medicine</Button></Link>
          <Link href="/recipient/requirements/new"><Button><Plus className="h-4 w-4" /> New Requirement</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Requests Sent" value={o.requestsSent || 0} icon={ClipboardList} iconColor="bg-blue-50 text-blue-600" />
        <StatsCard title="Pending Transfers" value={o.pendingTransfers || 0} icon={Clock} iconColor="bg-amber-50 text-amber-600" />
        <StatsCard title="Completed" value={o.completedTransfers || 0} icon={ArrowLeftRight} iconColor="bg-emerald-50 text-emerald-600" />
        <StatsCard title="Value Received" value={formatCurrency(o.totalValue || 0)} icon={DollarSign} iconColor="bg-purple-50 text-purple-600" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: '/recipient/medicines', icon: Search, label: 'Find Medicine', color: 'bg-teal-50 text-teal-600' },
          { href: '/recipient/requirements/new', icon: Plus, label: 'New Requirement', color: 'bg-blue-50 text-blue-600' },
          { href: '/recipient/transfers', icon: ArrowLeftRight, label: 'Transfers', color: 'bg-purple-50 text-purple-600' },
          { href: '/recipient/analytics', icon: TrendingUp, label: 'Analytics', color: 'bg-emerald-50 text-emerald-600' },
        ].map(a => (
          <Link key={a.href} href={a.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${a.color}`}><a.icon className="h-5 w-5" /></div>
              <p className="text-sm font-medium text-gray-700">{a.label}</p>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle><Link href="/recipient/transfers"><Button variant="ghost" size="sm">View All</Button></Link></CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((t: Record<string, unknown>) => (
                <div key={t.id as string} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0"><ArrowLeftRight className="h-5 w-5 text-gray-500" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">From {(t.donorOrg as Record<string, string>)?.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(t.createdAt as string)}</p>
                  </div>
                  <StatusBadge status={t.status as string} />
                </div>
              ))}
            </div>
          ) : <EmptyState title="No recent activity" description="Start by searching for available medicines" />}
        </CardContent>
      </Card>
    </div>
  )
}
