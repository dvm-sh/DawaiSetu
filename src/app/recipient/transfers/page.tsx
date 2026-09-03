'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { Eye } from 'lucide-react'

export default function RecipientTransfersPage() {
  const [transfers, setTransfers] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  useEffect(() => {
    const params = new URLSearchParams({ page: page.toString() })
    if (status) params.set('status', status)
    fetch(`/api/transfers?${params}`).then(r => r.json()).then(d => {
      if (d.success) { setTransfers(d.data.transfers); setPagination(d.data.pagination) }
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [page, status])

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">My Transfers</h1><p className="text-gray-600 mt-1">Track all your medicine requests</p></div>
      <div className="flex gap-3">
        <Select options={[
          { value: 'REQUESTED', label: 'Requested' }, { value: 'APPROVED', label: 'Approved' }, { value: 'IN_TRANSIT', label: 'In Transit' },
          { value: 'DELIVERED', label: 'Delivered' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'CANCELLED', label: 'Cancelled' },
        ]} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} placeholder="All Statuses" className="w-48" />
      </div>
      {isLoading ? <TableSkeleton /> : transfers.length === 0 ? (
        <EmptyState title="No transfers yet" description="Request medicines to start receiving donations" />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Transfer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Donor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Medicine</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Action</th>
              </tr></thead>
              <tbody>
                {transfers.map(t => (
                  <tr key={t.id as string} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">#{(t.id as string).slice(-6)}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="font-medium text-gray-900">{(t.donorOrg as Record<string, string>)?.name}</p>
                      <p className="text-xs text-gray-500">{(t.donorOrg as Record<string, string>)?.city}</p>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      {((t.items as Record<string, unknown>[]) || []).map((item: Record<string, unknown>) => (
                        <span key={item.id as string} className="text-sm">{(item.medicine as Record<string, string>)?.name}</span>
                      ))}
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={t.status as string} /></td>
                    <td className="py-3 px-4 text-xs text-gray-500">{formatDate(t.createdAt as string)}</td>
                    <td className="py-3 px-4">
                      <Link href={`/recipient/transfers/${t.id}`}>
                        <button className="p-1.5 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-gray-100"><Eye className="h-4 w-4" /></button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-600">Page {page} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
