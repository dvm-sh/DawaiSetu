'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/lib/utils'
import { FileText } from 'lucide-react'

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [entityType, setEntityType] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  useEffect(() => {
    const params = new URLSearchParams({ page: page.toString(), limit: '30' })
    if (entityType) params.set('entityType', entityType)
    fetch(`/api/admin/audit-logs?${params}`).then(r => r.json()).then(d => {
      if (d.success) { setLogs(d.data.logs); setPagination(d.data.pagination) }
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [page, entityType])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1><p className="text-gray-600 mt-1">Complete activity trail for transparency</p></div>
        <Select options={[
          { value: 'User', label: 'User' }, { value: 'Organization', label: 'Organization' },
          { value: 'Medicine', label: 'Medicine' }, { value: 'Transfer', label: 'Transfer' },
          { value: 'MedicineRequirement', label: 'Requirement' },
        ]} value={entityType} onChange={e => { setEntityType(e.target.value); setPage(1) }} placeholder="All Types" className="w-48" />
      </div>

      {isLoading ? <TableSkeleton rows={10} /> : logs.length === 0 ? (
        <EmptyState icon={<FileText className="h-16 w-16" />} title="No audit logs" description="Activity will be logged here" />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Actor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Entity</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden lg:table-cell">Details</th>
              </tr></thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id as string} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">{formatDateTime(log.createdAt as string)}</td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-gray-600">{(log.actor as Record<string, string>)?.email}</p>
                      <p className="text-xs text-gray-400">{(log.actor as Record<string, string>)?.role}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{log.action as string}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs text-gray-500">{log.entityType as string}</span>
                      <span className="text-xs text-gray-400 block font-mono">#{(log.entityId as string)?.slice(-8)}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 max-w-xs truncate block">
                        {log.metadata ? JSON.stringify(log.metadata).slice(0, 60) : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-600">Page {page} of {pagination.totalPages} · {pagination.total} entries</p>
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
