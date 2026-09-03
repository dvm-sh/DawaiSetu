'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MEDICINE_CATEGORIES, DOSAGE_FORMS, STORAGE_REQUIREMENTS } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddMedicinePage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: '', genericName: '', brandName: '', category: '', strength: '', dosageForm: '',
    batchNumber: '', manufacturer: '', quantity: '', unit: 'units', manufacturingDate: '',
    expiryDate: '', storageRequirement: 'ROOM_TEMPERATURE', prescriptionRequired: false,
    barcode: '', location: '', notes: '', estimatedValue: '',
  })

  const updateField = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name) e.name = 'Required'
    if (!form.category) e.category = 'Required'
    if (!form.dosageForm) e.dosageForm = 'Required'
    if (!form.quantity || parseInt(form.quantity) <= 0) e.quantity = 'Valid quantity required'
    if (!form.expiryDate) e.expiryDate = 'Required'
    else if (new Date(form.expiryDate) <= new Date()) e.expiryDate = 'Cannot add expired medicine'
    if (form.manufacturingDate && form.expiryDate && new Date(form.manufacturingDate) >= new Date(form.expiryDate)) {
      e.manufacturingDate = 'Must be before expiry date'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)

    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: 'success', title: 'Medicine added!', message: 'Medicine listed successfully. Matching engine is searching for recipients.' })
        router.push('/donor/inventory')
      } else {
        if (data.errors) setErrors(data.errors)
        else addToast({ type: 'error', title: 'Error', message: data.error || 'Failed to add medicine' })
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Network error. Please try again.' })
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/donor/inventory">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Medicine</h1>
          <p className="text-gray-600 mt-1">List surplus medicine for donation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Medicine Name" value={form.name} onChange={e => updateField('name', e.target.value)} error={errors.name} required placeholder="e.g., Paracetamol 500mg" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Generic Name" value={form.genericName} onChange={e => updateField('genericName', e.target.value)} placeholder="e.g., Acetaminophen" />
              <Input label="Brand Name" value={form.brandName} onChange={e => updateField('brandName', e.target.value)} placeholder="e.g., Crocin" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Category" options={MEDICINE_CATEGORIES} value={form.category} onChange={e => updateField('category', e.target.value)} placeholder="Select category" error={errors.category} required />
              <Select label="Dosage Form" options={DOSAGE_FORMS} value={form.dosageForm} onChange={e => updateField('dosageForm', e.target.value)} placeholder="Select form" error={errors.dosageForm} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Strength" value={form.strength} onChange={e => updateField('strength', e.target.value)} placeholder="e.g., 500mg" />
              <Input label="Manufacturer" value={form.manufacturer} onChange={e => updateField('manufacturer', e.target.value)} placeholder="e.g., Cipla" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quantity & Batch</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Quantity" type="number" value={form.quantity} onChange={e => updateField('quantity', e.target.value)} error={errors.quantity} required min="1" />
              <Input label="Unit" value={form.unit} onChange={e => updateField('unit', e.target.value)} placeholder="units, strips, bottles" />
              <Input label="Batch Number" value={form.batchNumber} onChange={e => updateField('batchNumber', e.target.value)} />
            </div>
            <Input label="Barcode" value={form.barcode} onChange={e => updateField('barcode', e.target.value)} placeholder="Scan or enter barcode" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Dates & Storage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Manufacturing Date" type="date" value={form.manufacturingDate} onChange={e => updateField('manufacturingDate', e.target.value)} error={errors.manufacturingDate} />
              <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={e => updateField('expiryDate', e.target.value)} error={errors.expiryDate} required />
            </div>
            <Select label="Storage Requirement" options={STORAGE_REQUIREMENTS} value={form.storageRequirement} onChange={e => updateField('storageRequirement', e.target.value)} />
            <div className="flex items-center gap-3">
              <input type="checkbox" id="prescriptionRequired" checked={form.prescriptionRequired}
                onChange={e => updateField('prescriptionRequired', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              <label htmlFor="prescriptionRequired" className="text-sm text-gray-700">Prescription Required</label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Location" value={form.location} onChange={e => updateField('location', e.target.value)} placeholder="Medicine storage location" />
            <Input label="Estimated Value (₹)" type="number" value={form.estimatedValue} onChange={e => updateField('estimatedValue', e.target.value)} placeholder="Per unit value" />
            <Textarea label="Notes" value={form.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Any additional information about this medicine" />
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/donor/inventory"><Button variant="outline">Cancel</Button></Link>
          <Button type="submit" isLoading={isLoading}>Add Medicine</Button>
        </div>
      </form>
    </div>
  )
}
