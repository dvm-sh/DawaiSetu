'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import { Check, X, Eye } from 'lucide-react'

export default function DonorRequestsPage() {
  const [transfers, setTransfers] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { addToast } = useToast()

  const fetchRequests = () => {
    fetch('/api/transfers?status=REQUESTED').then(r => r.json()).then(d => {
      if (d.success) setTransfers(d.data.transfers)
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }
  useEffect(() => { fetchRequests() }, [])

  const handleAction = async (id: string, status: string) => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/transfers/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', status }),
      })
      if (res.ok) { addToast({ type: 'success', title: `Request ${status.toLowerCase()}` }); fetchRequests() }
      else { const d = await res.json(); addToast({ type: 'error', title: d.error || 'Failed' }) }
    } catch { addToast({ type: 'error', title: 'Network error' }) }
    setActionLoading(null)
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Incoming Requests</h1><p className="text-gray-600 mt-1">Review medicine requests from recipients</p></div>
      {isLoading ? <TableSkeleton /> : transfers.length === 0 ? (
        <EmptyState title="No pending requests" description="When recipients request your medicines, they'll appear here" />
      ) : (
        <div className="grid gap-4">
          {transfers.map(t => (
            <Card key={t.id as string} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{(t.recipientOrg as Record<string, string>)?.name}</p>
                    <StatusBadge status={t.status as string} />
                  </div>
                  <p className="text-sm text-gray-500">{(t.recipientOrg as Record<string, string>)?.city} · {formatDate(t.createdAt as string)}</p>
                  <div className="mt-2">
                    {((t.items as Record<string, unknown>[]) || []).map((item: Record<string, unknown>) => (
                      <p key={item.id as string} className="text-sm"><span className="font-medium">{(item.medicine as Record<string, string>)?.name}</span> · {item.quantity as number} units</p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleAction(t.id as string, 'APPROVED')} isLoading={actionLoading === t.id}><Check className="h-4 w-4" /> Accept</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction(t.id as string, 'REJECTED')} isLoading={actionLoading === t.id}><X className="h-4 w-4" /> Reject</Button>
                  <Link href={`/donor/transfers/${t.id}`}><Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button></Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
