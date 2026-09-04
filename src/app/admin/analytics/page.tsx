'use client'
import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/ui/stats-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { Building2, Package, ArrowLeftRight, DollarSign, TrendingUp, Users } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(d => { setStats(d.data); setIsLoading(false) }).catch(() => setIsLoading(false)) }, [])
  if (isLoading) return <DashboardSkeleton />
  const o = (stats as Record<string, Record<string, number>>)?.overview || {}
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1><p className="text-gray-600 mt-1">Comprehensive platform metrics</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Organizations" value={o.totalOrgs || 0} icon={Building2} iconColor="bg-blue-50 text-blue-600" />
        <StatsCard title="Active Organizations" value={o.activeOrgs || 0} icon={Users} iconColor="bg-emerald-50 text-emerald-600" />
        <StatsCard title="Available Medicines" value={o.activeMedicines || 0} icon={Package} iconColor="bg-amber-50 text-amber-600" />
        <StatsCard title="All Transfers" value={o.allTransfers || 0} icon={ArrowLeftRight} iconColor="bg-purple-50 text-purple-600" />
        <StatsCard title="Completed Transfers" value={o.completedTransfers || 0} icon={TrendingUp} iconColor="bg-teal-50 text-teal-600" />
        <StatsCard title="Value Redistributed" value={formatCurrency(o.valueRedistributed || 0)} icon={DollarSign} iconColor="bg-pink-50 text-pink-600" />
      </div>
      <Card><CardHeader><CardTitle>Platform Impact</CardTitle></CardHeader><CardContent>
        <div className="grid sm:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-teal-50 rounded-xl"><p className="text-3xl font-bold text-teal-700">{o.totalRedistributed || 0}</p><p className="text-sm text-teal-600">Units Redistributed</p></div>
          <div className="p-4 bg-blue-50 rounded-xl"><p className="text-3xl font-bold text-blue-700">{o.completedTransfers || 0}</p><p className="text-sm text-blue-600">Successful Transfers</p></div>
          <div className="p-4 bg-purple-50 rounded-xl"><p className="text-3xl font-bold text-purple-700">{formatCurrency(o.valueRedistributed || 0)}</p><p className="text-sm text-purple-600">Value Saved</p></div>
          <div className="p-4 bg-emerald-50 rounded-xl"><p className="text-3xl font-bold text-emerald-700">{o.activeOrgs || 0}</p><p className="text-sm text-emerald-600">Active Partners</p></div>
        </div>
      </CardContent></Card>
    </div>
  )
}
