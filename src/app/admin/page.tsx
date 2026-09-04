'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StatsCard } from '@/components/ui/stats-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { Building2, Package, ArrowLeftRight, AlertTriangle, Users, DollarSign, ShieldCheck, Flag, TrendingUp, Pill } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => { setStats(d.data); setIsLoading(false) }).catch(() => setIsLoading(false))
  }, [])

  if (isLoading) return <DashboardSkeleton />

  const o = (stats as Record<string, Record<string, number>>)?.overview || {}
  const charts = (stats as Record<string, Record<string, unknown>>)?.charts || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Platform overview and management</p>
      </div>

      {/* Alerts */}
      {(o.pendingOrgs > 0 || o.flaggedMedicines > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {o.pendingOrgs > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">{o.pendingOrgs} organization(s) pending verification</p>
              </div>
              <Link href="/admin/organizations?status=PENDING"><Button variant="outline" size="sm">Review</Button></Link>
            </div>
          )}
          {o.flaggedMedicines > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <Flag className="h-5 w-5 text-red-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{o.flaggedMedicines} flagged medicine(s)</p>
              </div>
              <Link href="/admin/medicines"><Button variant="outline" size="sm">Review</Button></Link>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Organizations" value={o.activeOrgs || 0} icon={Building2} iconColor="bg-blue-50 text-blue-600" />
        <StatsCard title="Available Medicines" value={o.activeMedicines || 0} icon={Package} iconColor="bg-emerald-50 text-emerald-600" />
        <StatsCard title="Pending Transfers" value={o.pendingTransfers || 0} icon={ArrowLeftRight} iconColor="bg-amber-50 text-amber-600" />
        <StatsCard title="Completed Transfers" value={o.completedTransfers || 0} icon={TrendingUp} iconColor="bg-teal-50 text-teal-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Organizations" value={o.totalOrgs || 0} icon={Users} iconColor="bg-purple-50 text-purple-600" />
        <StatsCard title="Value Redistributed" value={formatCurrency(o.valueRedistributed || 0)} icon={DollarSign} iconColor="bg-cyan-50 text-cyan-600" />
        <StatsCard title="Expired Medicines" value={o.expiredMedicines || 0} icon={AlertTriangle} iconColor="bg-red-50 text-red-600" />
        <StatsCard title="Total Redistributed" value={o.totalRedistributed || 0} icon={Pill} iconColor="bg-pink-50 text-pink-600" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: '/admin/organizations', icon: Building2, label: 'Organizations', color: 'bg-blue-50 text-blue-600' },
          { href: '/admin/medicines', icon: Package, label: 'Medicines', color: 'bg-emerald-50 text-emerald-600' },
          { href: '/admin/transfers', icon: ArrowLeftRight, label: 'Transfers', color: 'bg-purple-50 text-purple-600' },
          { href: '/admin/audit-logs', icon: ShieldCheck, label: 'Audit Logs', color: 'bg-amber-50 text-amber-600' },
        ].map(a => (
          <Link key={a.href} href={a.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${a.color}`}><a.icon className="h-5 w-5" /></div>
              <p className="text-sm font-medium text-gray-700">{a.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Distribution Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Category Distribution</CardTitle></CardHeader>
          <CardContent>
            {(charts.categoryCounts as Record<string, unknown>[] || []).length > 0 ? (
              <div className="space-y-3">
                {(charts.categoryCounts as Record<string, unknown>[]).map((cat: Record<string, unknown>) => {
                  const count = (cat._count as number) || 0
                  const total = (charts.categoryCounts as Record<string, unknown>[]).reduce((s: number, c: Record<string, unknown>) => s + ((c._count as number) || 0), 0)
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={cat.category as string}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 capitalize">{(cat.category as string)?.replace(/_/g, ' ').toLowerCase()}</span>
                        <span className="font-medium">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : <p className="text-sm text-gray-500 text-center py-4">No data available</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Expiry Status</CardTitle></CardHeader>
          <CardContent>
            {(charts.expiryCounts as Record<string, unknown>[] || []).length > 0 ? (
              <div className="space-y-3">
                {(charts.expiryCounts as Record<string, unknown>[]).map((exp: Record<string, unknown>) => {
                  const count = (exp._count as number) || 0
                  const label = exp.expiryCategory as string
                  const colors: Record<string, string> = {
                    HEALTHY: 'bg-emerald-500', ATTENTION: 'bg-blue-500', HIGH_RISK: 'bg-amber-500', CRITICAL: 'bg-red-500', EXPIRED: 'bg-gray-500',
                  }
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors[label] || 'bg-gray-400'}`} />
                      <span className="text-sm text-gray-600 flex-1 capitalize">{label?.replace(/_/g, ' ').toLowerCase()}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  )
                })}
              </div>
            ) : <p className="text-sm text-gray-500 text-center py-4">No data available</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
