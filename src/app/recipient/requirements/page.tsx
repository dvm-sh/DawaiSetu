'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { Plus, ClipboardList, Search } from 'lucide-react'

export default function RecipientRequirementsPage() {
  const [requirements, setRequirements] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    fetch('/api/requirements').then(r => r.json()).then(d => { if (d.success) setRequirements(d.data.requirements); setIsLoading(false) }).catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Medicine Requirements</h1><p className="text-gray-600 mt-1">List medicines you need and get matched with donors</p></div>
        <Link href="/recipient/requirements/new"><Button><Plus className="h-4 w-4" /> New Requirement</Button></Link>
      </div>
      {isLoading ? <TableSkeleton /> : requirements.length === 0 ? (
        <EmptyState icon={<ClipboardList className="h-16 w-16" />} title="No requirements" description="Create a requirement to get matched with donors"
          action={<Link href="/recipient/requirements/new"><Button><Plus className="h-4 w-4" /> New Requirement</Button></Link>} />
      ) : (
        <div className="grid gap-4">
          {requirements.map(req => {
            const matches = (req.matches || []) as Record<string, unknown>[]
            return (
              <Card key={req.id as string} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{req.medicineName as string}</h3>
                      <StatusBadge status={req.status as string} />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${req.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : req.urgency === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {req.urgency as string}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {req.genericName && `${req.genericName} · `}{req.category && `${(req.category as string).replace(/_/g, ' ')} · `}
                      Qty: {req.quantityNeeded as number}{req.dosageForm && ` · ${req.dosageForm}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Created {formatDate(req.createdAt as string)}</p>
                    {matches.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-teal-600 mb-2"><Search className="inline h-3 w-3 mr-1" />{matches.length} match(es) found</p>
                        <div className="space-y-2">
                          {matches.slice(0, 3).map((m: Record<string, unknown>) => {
                            const med = m.medicine as Record<string, unknown>
                            const donorOrg = m.donorOrg as Record<string, string>
                            return (
                              <div key={m.id as string} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                                <div>
                                  <span className="font-medium">{med?.name as string}</span>
                                  <span className="text-gray-500"> · {donorOrg?.name} · {med?.quantity as number} units</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold ${(m.matchScore as number) >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>{Math.round(m.matchScore as number)}%</span>
                                  {med?.status === 'AVAILABLE' && !m.transfer && (
                                    <Link href={`/recipient/medicines/${med?.id}`}><Button size="sm" variant="outline">Request</Button></Link>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
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
