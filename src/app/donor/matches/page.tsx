'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/ui/badge'
import { formatDate, getDaysRemaining, getExpiryCategory } from '@/lib/utils'
import { Search } from 'lucide-react'

export default function DonorMatchesPage() {
  const [matches, setMatches] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches').then(r => r.json()).then(d => {
      if (d.success) setMatches(d.data.matches)
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Matches</h1><p className="text-gray-600 mt-1">Recipients matched to your medicines by our smart engine</p></div>
      {isLoading ? <TableSkeleton /> : matches.length === 0 ? (
        <EmptyState icon={<Search className="h-16 w-16" />} title="No matches yet" description="When you add medicines, our matching engine will find suitable recipients" />
      ) : (
        <div className="grid gap-4">
          {matches.map(m => {
            const med = m.medicine as Record<string, unknown>
            const recOrg = m.recipientOrg as Record<string, string>
            const score = m.matchScore as number
            const reasons = (m.matchReasons as string[]) || []
            const transfer = m.transfer as Record<string, string> | null
            return (
              <Card key={m.id as string} className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`text-2xl font-bold ${score >= 70 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-gray-500'}`}>{Math.round(score)}%</div>
                      <div>
                        <p className="font-semibold text-gray-900">{recOrg?.name}</p>
                        <p className="text-xs text-gray-500">{recOrg?.city} · {recOrg?.type?.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="font-medium">{med?.name as string}</span> · {med?.quantity as number} units · Exp: {formatDate(med?.expiryDate as string)}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {reasons.map((r, i) => <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r}</span>)}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {transfer ? <StatusBadge status={transfer.status} /> : <span className="text-xs text-gray-400">No transfer yet</span>}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
