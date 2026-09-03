'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { formatDate, getDaysRemaining, getExpiryCategory, MEDICINE_CATEGORIES } from '@/lib/utils'
import { Search, Eye, Pill } from 'lucide-react'

export default function RecipientMedicinesPage() {
  const [medicines, setMedicines] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const fetchMedicines = async () => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: '20' })
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    try {
      const res = await fetch(`/api/medicines?${params}`)
      const data = await res.json()
      if (data.success) { setMedicines(data.data.medicines); setPagination(data.data.pagination) }
    } catch {}
    setIsLoading(false)
  }
  useEffect(() => { fetchMedicines() }, [page, category])

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Available Medicines</h1><p className="text-gray-600 mt-1">Browse and request available medicines from donors</p></div>
      <Card className="p-4">
        <form onSubmit={e => { e.preventDefault(); setPage(1); fetchMedicines() }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by name, generic name, manufacturer..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <Select options={MEDICINE_CATEGORIES} value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} placeholder="All Categories" className="sm:w-48" />
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </Card>
      {isLoading ? <TableSkeleton /> : medicines.length === 0 ? (
        <EmptyState icon={<Pill className="h-16 w-16" />} title="No medicines found" description="Try adjusting your search filters" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicines.map(med => {
            const days = getDaysRemaining(med.expiryDate as string)
            const expCat = getExpiryCategory(days)
            const org = med.organization as Record<string, string>
            return (
              <Card key={med.id as string} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{med.name as string}</h3>
                    <p className="text-xs text-gray-500">{(med.genericName as string) || (med.manufacturer as string) || ''}</p>
                  </div>
                  <StatusBadge status={med.status as string} />
                </div>
                <dl className="space-y-1.5 text-sm mb-4">
                  <div className="flex justify-between"><dt className="text-gray-500">Quantity</dt><dd className="font-medium">{med.quantity as number} {med.unit as string}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Expiry</dt><dd className={`font-medium ${expCat.color}`}>{formatDate(med.expiryDate as string)} ({days}d)</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Category</dt><dd className="capitalize text-xs">{(med.category as string)?.replace(/_/g, ' ').toLowerCase()}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Donor</dt><dd className="text-xs">{org?.name} · {org?.city}</dd></div>
                </dl>
                <Link href={`/recipient/medicines/${med.id}`}><Button className="w-full" size="sm"><Eye className="h-4 w-4" /> View Details</Button></Link>
              </Card>
            )
          })}
        </div>
      )}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Page {page} of {pagination.totalPages} · {pagination.total} results</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
