'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { formatDate, getDaysRemaining, getExpiryCategory, formatStatus } from '@/lib/utils'
import { ArrowLeft, Pill, Package, Building2, AlertTriangle, Heart } from 'lucide-react'

export default function RecipientMedicineDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const [medicine, setMedicine] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    fetch(`/api/medicines/${params.id}`).then(r => r.json()).then(d => { if (d.success) setMedicine(d.data); setIsLoading(false) }).catch(() => setIsLoading(false))
  }, [params.id])

  const handleRequestMedicine = async () => {
    if (!medicine) return
    setIsRequesting(true)
    // Find the match for this medicine and current user's org
    try {
      const matchRes = await fetch(`/api/matches?medicineId=${params.id}`)
      const matchData = await matchRes.json()
      if (!matchData.success || !matchData.data.matches.length) {
        addToast({ type: 'error', title: 'No match found', message: 'No match exists for this medicine. Please create a requirement first.' })
        setIsRequesting(false)
        return
      }
      const match = matchData.data.matches[0]
      // Create transfer from this match
      const res = await fetch('/api/transfers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.id }),
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: 'success', title: 'Request sent!', message: 'The donor will be notified of your request.' })
        router.push(`/recipient/transfers/${data.data.id}`)
      } else {
        addToast({ type: 'error', title: data.error || 'Failed to send request' })
      }
    } catch {
      addToast({ type: 'error', title: 'Network error' })
    }
    setIsRequesting(false)
  }

  if (isLoading) return <DashboardSkeleton />
  if (!medicine) return <div className="text-center py-12 text-gray-500">Medicine not found</div>

  const days = getDaysRemaining(medicine.expiryDate as string)
  const expCat = getExpiryCategory(days)
  const org = medicine.organization as Record<string, string>
  const matches = (medicine.matches || []) as Record<string, unknown>[]
  const hasMatch = matches.length > 0

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/recipient/medicines"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{medicine.name as string}</h1>
          <p className="text-gray-600">{(medicine.genericName as string) || ''}</p>
        </div>
        <StatusBadge status={medicine.status as string} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Pill className="h-4 w-4" /> Medicine Info</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {[['Name', medicine.name], ['Generic Name', medicine.genericName], ['Brand', medicine.brandName], ['Category', formatStatus(medicine.category as string || '')],
                ['Dosage Form', formatStatus(medicine.dosageForm as string || '')], ['Strength', medicine.strength], ['Manufacturer', medicine.manufacturer],
              ].filter(([,v]) => v).map(([k,v]) => <div key={k as string} className="flex justify-between text-sm"><dt className="text-gray-500">{k as string}</dt><dd className="font-medium">{v as string}</dd></div>)}
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-4 w-4" /> Availability</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm"><dt className="text-gray-500">Quantity</dt><dd className="font-medium">{medicine.quantity as number} {medicine.unit as string}</dd></div>
              <div className="flex justify-between text-sm"><dt className="text-gray-500">Expiry</dt><dd className="font-medium">{formatDate(medicine.expiryDate as string)}</dd></div>
              <div className={`p-3 rounded-xl border ${expCat.bgColor}`}>
                <span className={`text-sm font-semibold ${expCat.color}`}>{days <= 0 ? 'EXPIRED' : `${days} days left · ${expCat.label}`}</span>
              </div>
              <div className="flex justify-between text-sm"><dt className="text-gray-500">Storage</dt><dd className="font-medium">{formatStatus(medicine.storageRequirement as string || '')}</dd></div>
              <div className="flex justify-between text-sm"><dt className="text-gray-500">Rx Required</dt><dd className="font-medium">{medicine.prescriptionRequired ? 'Yes' : 'No'}</dd></div>
              {!!medicine.estimatedValue && <div className="flex justify-between text-sm"><dt className="text-gray-500">Est. Value</dt><dd className="font-medium">₹{medicine.estimatedValue as number}</dd></div>}
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Donor Information</CardTitle></CardHeader>
        <CardContent>
          <p className="font-semibold text-gray-900">{org?.name}</p>
          <p className="text-sm text-gray-500">{org?.city}, {org?.state}</p>
          <p className="text-sm text-gray-500 capitalize">{org?.type?.replace(/_/g, ' ').toLowerCase()}</p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {hasMatch ? (
          <Button onClick={handleRequestMedicine} isLoading={isRequesting} className="flex-1 py-3">
            <Heart className="h-4 w-4" /> Request This Medicine
          </Button>
        ) : (
          <div className="flex-1 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> No match found. Create a requirement first, and our engine will match you with available medicines.
            <Link href="/recipient/requirements/new" className="text-teal-600 font-medium underline ml-1">Create Requirement</Link>
          </div>
        )}
      </div>
    </div>
  )
}
