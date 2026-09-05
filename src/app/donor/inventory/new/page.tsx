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
import { ArrowLeft, Upload, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'
import Papa from 'papaparse'

export default function AddMedicinePage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single')
  
  // Single Entry State
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '', genericName: '', brandName: '', category: '', strength: '', dosageForm: '',
    batchNumber: '', manufacturer: '', quantity: '', unit: 'units', manufacturingDate: '',
    expiryDate: '', storageRequirement: 'ROOM_TEMPERATURE', prescriptionRequired: false,
    barcode: '', location: '', notes: '', estimatedValue: '',
  })

  // Bulk Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

  // -- Single Entry Logic --
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

  const handleSingleSubmit = async (e: React.FormEvent) => {
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

  // -- Bulk Upload Logic --
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      setIsParsing(true)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsedData(results.data)
          setIsParsing(false)
        },
        error: () => {
          addToast({ type: 'error', title: 'Parse Error', message: 'Failed to read CSV file' })
          setIsParsing(false)
        }
      })
    }
  }

  const handleBulkSubmit = async () => {
    if (parsedData.length === 0) return
    setBulkLoading(true)
    
    try {
      const res = await fetch('/api/donor/medicines/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: parsedData }),
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: 'success', title: 'Bulk upload successful!', message: `Successfully added ${data.data?.addedCount || parsedData.length} medicines.` })
        router.push('/donor/inventory')
      } else {
        addToast({ type: 'error', title: 'Upload Failed', message: data.error || 'Failed to process bulk upload' })
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Network error. Please try again.' })
    }
    setBulkLoading(false)
  }

  const downloadSample = () => {
    const headers = ['name', 'category', 'dosageForm', 'quantity', 'expiryDate', 'batchNumber']
    const row = ['Paracetamol 500mg', 'ANALGESIC', 'TABLET', '100', '2027-12-31', 'BATCH001']
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + row.join(",")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "dawaisetu_sample_inventory.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('single')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'single' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Single Entry
        </button>
        <button 
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'bulk' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Bulk Upload (CSV)
        </button>
      </div>

      {activeTab === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Form Content - Same as before */}
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
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-1">Instructions</h4>
                <p className="text-sm text-blue-800 mb-3">Upload a CSV file containing your medicine inventory. Make sure the headers match our required format exactly.</p>
                <button onClick={downloadSample} className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" /> Download Sample CSV
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors relative">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {csvFile ? csvFile.name : 'Click or drag file to upload'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isParsing ? 'Parsing...' : parsedData.length > 0 ? `Found ${parsedData.length} records` : 'CSV files only (Max 10MB)'}
                </p>
              </div>

              {parsedData.length > 0 && (
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => { setCsvFile(null); setParsedData([]) }}>Clear</Button>
                  <Button onClick={handleBulkSubmit} isLoading={bulkLoading}>
                    Upload {parsedData.length} Medicines
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
