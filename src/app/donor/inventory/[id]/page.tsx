'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { formatDate, getDaysRemaining, getExpiryCategory, formatStatus } from '@/lib/utils'
import { ArrowLeft, Package, Calendar, MapPin, Building2, Pill, AlertTriangle } from 'lucide-react'

export default function MedicineDetailPage() {
  const params = useParams()
  const [medicine, setMedicine] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/medicines/${params.id}`)
      .then(r => r.json())
      .then(data => { if (data.success) setMedicine(data.data); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }, [params.id])

  if (isLoading) return <DashboardSkeleton />
  if (!medicine) return <div className="text-center py-12 text-gray-500">Medicine not found</div>

  const days = getDaysRemaining(medicine.expiryDate as string)
  const expCat = getExpiryCategory(days)
  const matches = (medicine.matches || []) as Record<string, unknown>[]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/donor/inventory"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{medicine.name as string}</h1>
          <p className="text-gray-600">{(medicine.genericName as string) || (medicine.brandName as string) || ''}</p>
        </div>
        <StatusBadge status={medicine.status as string} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Pill className="h-4 w-4" /> Medicine Details</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {[
                ['Name', medicine.name],
                ['Generic Name', medicine.genericName],
                ['Brand Name', medicine.brandName],
                ['Category', formatStatus(medicine.category as string || '')],
                ['Dosage Form', formatStatus(medicine.dosageForm as string || '')],
                ['Strength', medicine.strength],
                ['Manufacturer', medicine.manufacturer],
                ['Batch Number', medicine.batchNumber],
                ['Barcode', medicine.barcode],
              ].filter(([, v]) => v).map(([label, val]) => (
                <div key={label as string} className="flex justify-between text-sm">
                  <dt className="text-gray-500">{label as string}</dt>
                  <dd className="font-medium text-gray-900">{val as string}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-4 w-4" /> Inventory & Expiry</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Quantity</dt>
                <dd className="font-medium">{medicine.quantity as number} {medicine.unit as string}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Original Quantity</dt>
                <dd className="font-medium">{medicine.originalQuantity as number} {medicine.unit as string}</dd>
              </div>
              {medicine.manufacturingDate && <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Mfg Date</dt>
                <dd className="font-medium">{formatDate(medicine.manufacturingDate as string)}</dd>
              </div>}
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Expiry Date</dt>
                <dd className="font-medium">{formatDate(medicine.expiryDate as string)}</dd>
              </div>
              <div className={`p-3 rounded-xl border ${expCat.bgColor}`}>
                <div className="flex items-center gap-2">
                  {days <= 30 && <AlertTriangle className="h-4 w-4" />}
                  <span className={`text-sm font-semibold ${expCat.color}`}>
                    {days <= 0 ? 'EXPIRED' : `${days} days remaining · ${expCat.label}`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Storage</dt>
                <dd className="font-medium">{formatStatus(medicine.storageRequirement as string || '')}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Prescription Req.</dt>
                <dd className="font-medium">{medicine.prescriptionRequired ? 'Yes' : 'No'}</dd>
              </div>
              {medicine.estimatedValue && <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Est. Value</dt>
                <dd className="font-medium">₹{medicine.estimatedValue as number}</dd>
              </div>}
            </dl>
          </CardContent>
        </Card>
      </div>

      {medicine.location && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-700">{medicine.location as string}</p></CardContent>
        </Card>
      )}

      {medicine.notes && (
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-700">{medicine.notes as string}</p></CardContent>
        </Card>
      )}

      {/* Matches */}
      {matches.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Matched Recipients ({matches.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matches.map((match: Record<string, unknown>) => {
                const recOrg = match.recipientOrg as Record<string, unknown>
                const score = match.matchScore as number
                const reasons = (match.matchReasons as string[]) || []
                return (
                  <div key={match.id as string} className="p-4 rounded-xl border border-gray-200 hover:border-teal-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{recOrg?.name as string}</p>
                        <p className="text-xs text-gray-500">{recOrg?.city as string} · {formatStatus(recOrg?.type as string || '')}</p>
                      </div>
                      <div className={`text-lg font-bold ${score >= 70 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {Math.round(score)}%
                        <span className="text-xs font-normal ml-1 text-gray-500">{score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Low'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {reasons.slice(0, 4).map((r, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
