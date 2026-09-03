'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/ui/modal'
import { formatDate, getDaysRemaining, getExpiryCategory, MEDICINE_CATEGORIES } from '@/lib/utils'
import { Plus, Search, Package, Eye, Edit, Trash2, Pause, Play } from 'lucide-react'

export default function DonorInventoryPage() {
  const [medicines, setMedicines] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { addToast } = useToast()

  const fetchMedicines = async () => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: '20' })
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (status) params.set('status', status)
    try {
      const res = await fetch(`/api/medicines?${params}`)
      const data = await res.json()
      if (data.success) {
        setMedicines(data.data.medicines)
        setPagination(data.data.pagination)
      }
    } catch { /* ignore */ }
    setIsLoading(false)
  }

  useEffect(() => { fetchMedicines() }, [page, category, status])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchMedicines()
  }

  const handleTogglePause = async (id: string, isPaused: boolean) => {
    try {
      const res = await fetch(`/api/medicines/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaused: !isPaused }),
      })
      if (res.ok) {
        addToast({ type: 'success', title: isPaused ? 'Listing resumed' : 'Listing paused' })
        fetchMedicines()
      }
    } catch { addToast({ type: 'error', title: 'Failed to update listing' }) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/medicines/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        addToast({ type: 'success', title: 'Medicine deleted' })
        fetchMedicines()
      } else {
        const d = await res.json()
        addToast({ type: 'error', title: d.error || 'Failed to delete' })
      }
    } catch { addToast({ type: 'error', title: 'Failed to delete' }) }
    setIsDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Inventory</h1>
          <p className="text-gray-600 mt-1">{pagination.total} medicines in your inventory</p>
        </div>
        <Link href="/donor/inventory/new">
          <Button><Plus className="h-4 w-4" /> Add Medicine</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text" placeholder="Search medicines..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <Select options={MEDICINE_CATEGORIES} value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} placeholder="All Categories" className="sm:w-48" />
          <Select options={[
            { value: 'AVAILABLE', label: 'Available' }, { value: 'RESERVED', label: 'Reserved' },
            { value: 'TRANSFER_PENDING', label: 'Transfer Pending' }, { value: 'IN_TRANSIT', label: 'In Transit' },
            { value: 'DISTRIBUTED', label: 'Distributed' }, { value: 'EXPIRED', label: 'Expired' },
          ]} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} placeholder="All Statuses" className="sm:w-44" />
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </Card>

      {/* Table */}
      {isLoading ? <TableSkeleton rows={5} cols={6} /> : medicines.length === 0 ? (
        <EmptyState title="No medicines found" description="Add your first medicine to start donating"
          action={<Link href="/donor/inventory/new"><Button><Plus className="h-4 w-4" /> Add Medicine</Button></Link>} />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Medicine</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Qty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Expiry</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => {
                  const days = getDaysRemaining(med.expiryDate as string)
                  const expCat = getExpiryCategory(days)
                  return (
                    <tr key={med.id as string} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{med.name as string}</p>
                        <p className="text-xs text-gray-500">{(med.genericName as string) || (med.brandName as string) || (med.manufacturer as string) || ''}</p>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="text-xs text-gray-600 capitalize">{(med.category as string)?.replace(/_/g, ' ').toLowerCase()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{med.quantity as number}</span>
                        <span className="text-gray-500 ml-1 text-xs">{med.unit as string}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-xs text-gray-600">{formatDate(med.expiryDate as string)}</p>
                          <span className={`text-xs font-medium ${expCat.color}`}>
                            {days <= 0 ? 'Expired' : `${days}d left · ${expCat.label}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={med.status as string} /></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/donor/inventory/${med.id}`}>
                            <button className="p-1.5 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-gray-100" title="View"><Eye className="h-4 w-4" /></button>
                          </Link>
                          <button onClick={() => handleTogglePause(med.id as string, med.isPaused as boolean)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100" title={med.isPaused ? 'Resume' : 'Pause'}>
                            {med.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                          </button>
                          <button onClick={() => setDeleteId(med.id as string)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">Page {page} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Medicine" description="Are you sure? This action cannot be undone."
        confirmLabel="Delete" variant="danger" isLoading={isDeleting} />
    </div>
  )
}
