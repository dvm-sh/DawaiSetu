'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { Eye, ClipboardList } from 'lucide-react'

export default function RecipientRequestsPage() {
  const [transfers, setTransfers] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transfers').then(r => r.json()).then(d => {
      if (d.success) setTransfers(d.data.transfers)
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-600 mt-1">All medicine requests you&apos;ve sent</p>
      </div>
      {isLoading ? <TableSkeleton /> : transfers.length === 0 ? (
        <EmptyState icon={<ClipboardList className="h-16 w-16" />} title="No requests sent" description="Browse available medicines and send a request" />
      ) : (
        <div className="grid gap-4">
          {transfers.map(t => (
            <Card key={t.id as string} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">To: {(t.donorOrg as Record<string, string>)?.name}</p>
                    <StatusBadge status={t.status as string} />
                  </div>
                  <p className="text-sm text-gray-500">{(t.donorOrg as Record<string, string>)?.city} · {formatDate(t.createdAt as string)}</p>
                  <div className="mt-2">
                    {((t.items as Record<string, unknown>[]) || []).map((item: Record<string, unknown>) => (
                      <p key={item.id as string} className="text-sm">
                        <span className="font-medium">{(item.medicine as Record<string, string>)?.name}</span> · {item.quantity as number} units
                      </p>
                    ))}
                  </div>
                </div>
                <Link href={`/recipient/transfers/${t.id}`}>
                  <button className="p-2 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-gray-100"><Eye className="h-5 w-5" /></button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
