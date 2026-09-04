'use client'
import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/ui/stats-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { ClipboardList, ArrowLeftRight, DollarSign, Heart, Search, CheckCircle2 } from 'lucide-react'

export default function RecipientAnalyticsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(d => { setStats(d.data); setIsLoading(false) }).catch(() => setIsLoading(false)) }, [])
  if (isLoading) return <DashboardSkeleton />
  const o = (stats as Record<string, Record<string, number>>)?.overview || {}
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Analytics</h1><p className="text-gray-600 mt-1">Track medicines received and impact</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Requests Sent" value={o.requestsSent || 0} icon={ClipboardList} iconColor="bg-blue-50 text-blue-600" />
        <StatsCard title="Completed" value={o.completedTransfers || 0} icon={CheckCircle2} iconColor="bg-emerald-50 text-emerald-600" />
        <StatsCard title="Active Requirements" value={o.activeRequirements || 0} icon={Search} iconColor="bg-amber-50 text-amber-600" />
        <StatsCard title="Matches Found" value={o.matchesFound || 0} icon={Heart} iconColor="bg-pink-50 text-pink-600" />
        <StatsCard title="Total Received" value={o.totalReceived || 0} icon={ArrowLeftRight} iconColor="bg-cyan-50 text-cyan-600" />
        <StatsCard title="Value Received" value={formatCurrency(o.totalValue || 0)} icon={DollarSign} iconColor="bg-purple-50 text-purple-600" />
      </div>
      <Card><CardHeader><CardTitle>Impact Summary</CardTitle></CardHeader><CardContent>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-emerald-50 rounded-xl"><p className="text-3xl font-bold text-emerald-700">{o.totalReceived || 0}</p><p className="text-sm text-emerald-600">Medicines Received</p></div>
          <div className="p-4 bg-blue-50 rounded-xl"><p className="text-3xl font-bold text-blue-700">{o.completedTransfers || 0}</p><p className="text-sm text-blue-600">Successful Transfers</p></div>
          <div className="p-4 bg-purple-50 rounded-xl"><p className="text-3xl font-bold text-purple-700">{formatCurrency(o.totalValue || 0)}</p><p className="text-sm text-purple-600">Value Saved</p></div>
        </div>
      </CardContent></Card>
    </div>
  )
}
