'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MEDICINE_CATEGORIES, DOSAGE_FORMS } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export default function NewRequirementPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ medicineName: '', genericName: '', category: '', dosageForm: '', strength: '', quantityNeeded: '', urgency: 'MEDIUM', notes: '' })
  const updateField = (f: string, v: string) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(p => { const n = { ...p }; delete n[f]; return n }) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.medicineName) errs.medicineName = 'Required'
    if (!form.quantityNeeded || parseInt(form.quantityNeeded) <= 0) errs.quantityNeeded = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/requirements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { addToast({ type: 'success', title: 'Requirement created!', message: 'Matching engine is searching for donations.' }); router.push('/recipient/requirements') }
      else { if (data.errors) setErrors(data.errors); else addToast({ type: 'error', title: data.error || 'Failed' }) }
    } catch { addToast({ type: 'error', title: 'Network error' }) }
    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/recipient/requirements"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div><h1 className="text-2xl font-bold text-gray-900">New Requirement</h1><p className="text-gray-600 mt-1">Tell us what medicine you need</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Input label="Medicine Name" value={form.medicineName} onChange={e => updateField('medicineName', e.target.value)} error={errors.medicineName} required placeholder="e.g., Paracetamol 500mg" />
            <Input label="Generic Name (optional)" value={form.genericName} onChange={e => updateField('genericName', e.target.value)} placeholder="e.g., Acetaminophen" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Category" options={MEDICINE_CATEGORIES} value={form.category} onChange={e => updateField('category', e.target.value)} placeholder="Select category" />
              <Select label="Dosage Form" options={DOSAGE_FORMS} value={form.dosageForm} onChange={e => updateField('dosageForm', e.target.value)} placeholder="Select form" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Strength" value={form.strength} onChange={e => updateField('strength', e.target.value)} placeholder="e.g., 500mg" />
              <Input label="Quantity Needed" type="number" value={form.quantityNeeded} onChange={e => updateField('quantityNeeded', e.target.value)} error={errors.quantityNeeded} required min="1" />
              <Select label="Urgency" options={[{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' }]}
                value={form.urgency} onChange={e => updateField('urgency', e.target.value)} />
            </div>
            <Textarea label="Notes (optional)" value={form.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Any additional details about your requirement" />
            <div className="flex gap-3 justify-end pt-2">
              <Link href="/recipient/requirements"><Button variant="outline">Cancel</Button></Link>
              <Button type="submit" isLoading={isLoading}>Create Requirement</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
