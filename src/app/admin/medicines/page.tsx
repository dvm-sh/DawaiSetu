'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { formatDate, getDaysRemaining, getExpiryCategory, MEDICINE_CATEGORIES } from '@/lib/utils'
import { Pill, Search, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const fetchMedicines = async () => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: '20' })
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (status) params.set('status', status)
    try {
      const res = await fetch(`/api/medicines?${params}`)
      const data = await res.json()
      if (data.success) { setMedicines(data.data.medicines); setPagination(data.data.pagination) }
    } catch {}
    setIsLoading(false)
  }

  useEffect(() => { fetchMedicines() }, [page, category, status])

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">All Medicines</h1><p className="text-gray-600 mt-1">Monitor all medicines on the platform</p></div>
      <Card className="p-4">
        <form onSubmit={e => { e.preventDefault(); setPage(1); fetchMedicines() }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <Select options={MEDICINE_CATEGORIES} value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} placeholder="All Categories" className="sm:w-44" />
          <Select options={[
            { value: 'AVAILABLE', label: 'Available' }, { value: 'RESERVED', label: 'Reserved' },
            { value: 'TRANSFER_PENDING', label: 'Transfer Pending' }, { value: 'IN_TRANSIT', label: 'In Transit' },
            { value: 'DISTRIBUTED', label: 'Distributed' }, { value: 'EXPIRED', label: 'Expired' },
          ]} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} placeholder="All Statuses" className="sm:w-44" />
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </Card>
      {isLoading ? <TableSkeleton /> : medicines.length === 0 ? (
        <EmptyState icon={<Pill className="h-16 w-16" />} title="No medicines found" description="Adjust filters to find medicines" />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Medicine</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Organization</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Qty</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Expiry</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              </tr></thead>
              <tbody>
                {medicines.map(med => {
                  const days = getDaysRemaining(med.expiryDate as string)
                  const expCat = getExpiryCategory(days)
                  const org = med.organization as Record<string, string>
                  return (
                    <tr key={med.id as string} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{med.name as string}</p>
                        <p className="text-xs text-gray-500 capitalize">{(med.category as string)?.replace(/_/g, ' ').toLowerCase()}</p>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <p className="text-sm">{org?.name}</p>
                        <p className="text-xs text-gray-500">{org?.city}</p>
                      </td>
                      <td className="py-3 px-4 font-medium">{med.quantity as number}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <p className="text-xs">{formatDate(med.expiryDate as string)}</p>
                        <span className={`text-xs font-medium ${expCat.color}`}>{days <= 0 ? 'Expired' : `${days}d`}</span>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={med.status as string} /></td>
                    </tr>
                  )
                })}
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
