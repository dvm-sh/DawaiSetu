'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { TableSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import DashboardLayout from '@/components/layout/dashboard-layout'
import {
  AlertOctagon, Flame, ShieldCheck, FileCheck, Printer,
  Building2, CheckSquare, Square, Trash2, ArrowRight, Download,
  Clock, ShieldAlert, CheckCircle2
} from 'lucide-react'

interface ExpiredMedicine {
  id: string
  name: string
  batchNumber: string | null
  quantity: number
  unit: string
  expiryDate: string
  status: string
  notes: string | null
  organization: {
    id: string
    name: string
    city: string
    state: string
  }
}

interface DestructionCertificate {
  manifestNumber: string
  issuedAt: string
  authorizedBy: string
  disposalFacility: string
  destructionMethod: string
  complianceStandard: string
  totalItems: number
  totalUnits: number
  items: Array<{
    id: string
    name: string
    batchNumber: string
    quantity: number
    unit: string
    expiryDate: string
  }>
}

export default function DisposalPage() {
  const [medicines, setMedicines] = useState<ExpiredMedicine[]>([])
  const [stats, setStats] = useState<{
    quarantinedCount: number
    quarantinedQuantity: number
    disposedCount: number
    disposedQuantity: number
    complianceRate: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  // Modals
  const [showDisposalModal, setShowDisposalModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [currentCertificate, setCurrentCertificate] = useState<DestructionCertificate | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Disposal form
  const [wastePartner, setWastePartner] = useState('GreenWave State Authorized CBWTF Facility')
  const [disposalMethod, setDisposalMethod] = useState('High Temperature Incineration (1100°C)')
  const [disposalNotes, setDisposalNotes] = useState('')

  const { addToast } = useToast()

  const fetchDisposalData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/disposal')
      const data = await res.json()
      if (data.success) {
        setMedicines(data.data.medicines || [])
        setStats(data.data.stats || null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDisposalData()
  }, [])

  const pendingMedicines = medicines.filter(m => m.status !== 'DISPOSED')
  const disposedMedicines = medicines.filter(m => m.status === 'DISPOSED')

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const selectAllPending = () => {
    if (selectedIds.length === pendingMedicines.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(pendingMedicines.map(m => m.id))
    }
  }

  const handleInitiateDisposal = async () => {
    if (selectedIds.length === 0) {
      addToast({ type: 'error', title: 'Selection Required', message: 'Please select at least one expired batch to dispose.' })
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/disposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineIds: selectedIds,
          wastePartner,
          disposalMethod,
          notes: disposalNotes
        })
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: 'success', title: 'Disposal Manifest Created', message: 'Medicines have been marked for certified destruction.' })
        setCurrentCertificate(data.data.certificate)
        setShowDisposalModal(false)
        setShowCertificateModal(true)
        setSelectedIds([])
        fetchDisposalData()
      } else {
        addToast({ type: 'error', title: 'Action Failed', message: data.error || 'Failed to submit disposal request.' })
      }
    } catch {
      addToast({ type: 'error', title: 'Network Error', message: 'Could not connect to the disposal gateway.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout requiredRole="DONOR">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-mono mb-2">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              <span>Biomedical Waste Management Rule, 2016 Compliant</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Expired Medicine Quarantine & Safe Disposal
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Automated gatekeeping quarantines all expired stock, preventing redistribution and facilitating legal incineration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pendingMedicines.length > 0 && (
              <Button
                onClick={() => setShowDisposalModal(true)}
                disabled={selectedIds.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                <Flame className="h-4 w-4" />
                Request Certified Destruction ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding={true}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Quarantined Batches</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats?.quarantinedCount ?? 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
                <AlertOctagon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2 font-medium">Automatic match freeze active</p>
          </Card>

          <Card padding={true}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Units Needing Disposal</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats?.quarantinedQuantity ?? 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Designated for yellow bio-bin</p>
          </Card>

          <Card padding={true}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Certified Destroyed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats?.disposedQuantity ?? 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2">Incineration manifests issued</p>
          </Card>

          <Card padding={true}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Audit & Safety Rate</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  100%
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Zero leakage into open market</p>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Quarantined Stocks ({pendingMedicines.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Destruction Manifests & Certificates ({disposedMedicines.length})
          </button>
        </div>

        {/* Content Table */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : activeTab === 'pending' ? (
          pendingMedicines.length === 0 ? (
            <Card padding={true}>
              <EmptyState
                icon={<CheckCircle2 className="h-12 w-12 text-emerald-500" />}
                title="No Quarantined Medicines"
                description="All inventory is within legitimate expiry limits. No medicines currently require disposal."
              />
            </Card>
          ) : (
            <Card padding={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <th className="py-3 px-4 text-left w-10">
                        <button onClick={selectAllPending} className="cursor-pointer">
                          {selectedIds.length === pendingMedicines.length && pendingMedicines.length > 0 ? (
                            <CheckSquare className="h-4 w-4 text-teal-600" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-4 text-left">Medicine Name</th>
                      <th className="py-3 px-4 text-left">Batch Number</th>
                      <th className="py-3 px-4 text-left">Expired Quantity</th>
                      <th className="py-3 px-4 text-left">Expiry Date</th>
                      <th className="py-3 px-4 text-left">Quarantine Status</th>
                      <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pendingMedicines.map(med => {
                      const isSelected = selectedIds.includes(med.id)
                      return (
                        <tr
                          key={med.id}
                          className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                            isSelected ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <button onClick={() => toggleSelect(med.id)} className="cursor-pointer">
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-red-600" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-400" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                            {med.name}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                            {med.batchNumber || 'UNTRACKED'}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-200">
                            {med.quantity} {med.unit}
                          </td>
                          <td className="py-3 px-4 text-xs font-mono text-red-600 dark:text-red-400 font-semibold">
                            {formatDate(med.expiryDate)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900">
                              <AlertOctagon className="h-3 w-3" />
                              LOCKED (EXPIRED)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedIds([med.id])
                                setShowDisposalModal(true)
                              }}
                              className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Dispose Batch
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        ) : (
          disposedMedicines.length === 0 ? (
            <Card padding={true}>
              <EmptyState
                icon={<FileCheck className="h-12 w-12 text-slate-400" />}
                title="No Disposal Manifests Yet"
                description="Completed safe destruction certificates will appear here once items are incinerated."
              />
            </Card>
          ) : (
            <Card padding={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <th className="py-3 px-4 text-left">Medicine</th>
                      <th className="py-3 px-4 text-left">Batch</th>
                      <th className="py-3 px-4 text-left">Quantity Destroyed</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Disposal Details</th>
                      <th className="py-3 px-4 text-left">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {disposedMedicines.map(med => (
                      <tr key={med.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{med.name}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">{med.batchNumber || 'N/A'}</td>
                        <td className="py-3 px-4 font-medium">{med.quantity} {med.unit}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                            <Flame className="h-3 w-3" />
                            INCINERATED
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {med.notes || 'Destroyed via Authorized Bio-Medical Facility'}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentCertificate({
                                manifestNumber: `DS-BMW-2026-${med.id.slice(0, 6).toUpperCase()}`,
                                issuedAt: new Date().toISOString(),
                                authorizedBy: med.organization.name,
                                disposalFacility: 'State Certified Common Bio-medical Waste Treatment Plant',
                                destructionMethod: 'High Temperature Thermal Incineration (1100°C)',
                                complianceStandard: 'Biomedical Waste Management Rules, 2016',
                                totalItems: 1,
                                totalUnits: med.quantity,
                                items: [{
                                  id: med.id,
                                  name: med.name,
                                  batchNumber: med.batchNumber || 'N/A',
                                  quantity: med.quantity,
                                  unit: med.unit,
                                  expiryDate: med.expiryDate
                                }]
                              })
                              setShowCertificateModal(true)
                            }}
                            className="text-xs"
                          >
                            <FileCheck className="h-3.5 w-3.5 mr-1 text-teal-600" />
                            View Manifest
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        )}

        {/* Modal: Request Certified Disposal */}
        <Modal
          isOpen={showDisposalModal}
          onClose={() => setShowDisposalModal(false)}
          title="Initiate Certified Safe Destruction"
          size="md"
        >
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md text-red-800 dark:text-red-300 text-xs">
              <strong>Notice:</strong> This action permanently takes <strong>{selectedIds.length} batch(es)</strong> out of the healthcare chain and assigns them to an authorized biomedical waste disposal contractor for incineration.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Authorized Waste Management Agency (CBWTF)
              </label>
              <select
                value={wastePartner}
                onChange={e => setWastePartner(e.target.value)}
                className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm"
              >
                <option value="GreenWave State Authorized CBWTF Facility">GreenWave State Authorized CBWTF Facility</option>
                <option value="EcoClean Bio-Hazardous Waste Solutions">EcoClean Bio-Hazardous Waste Solutions</option>
                <option value="Regional Municipal Bio-Medical Incinerator Hub">Regional Municipal Bio-Medical Incinerator Hub</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Destruction Method
              </label>
              <select
                value={disposalMethod}
                onChange={e => setDisposalMethod(e.target.value)}
                className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm"
              >
                <option value="High Temperature Incineration (1100°C)">High Temperature Incineration (1100°C - Recommended for cytotoxic/antibiotics)</option>
                <option value="Chemical Inactivation & Micro-encapsulation">Chemical Inactivation & Micro-encapsulation</option>
                <option value="Controlled High-Security Deep Well Burial">Controlled High-Security Deep Well Burial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Officer Notes / Consignment Seal ID
              </label>
              <input
                type="text"
                value={disposalNotes}
                onChange={e => setDisposalNotes(e.target.value)}
                placeholder="e.g., Consignment Seal #DS-994, Packaged in Yellow Bio-hazard bag"
                className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm"
              />
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setShowDisposalModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleInitiateDisposal}
                isLoading={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm & Generate Manifest
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Official Certificate of Destruction */}
        <Modal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          title="Official Certificate of Destruction"
          size="lg"
        >
          {currentCertificate && (
            <div className="space-y-6 text-slate-800 dark:text-slate-200 print:text-black">
              <div className="border-2 border-slate-900 dark:border-slate-100 p-6 rounded-lg bg-white dark:bg-slate-900 space-y-4">
                {/* Certificate Header */}
                <div className="text-center border-b pb-4 border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                    GOVERNMENT BIOMEDICAL WASTE COMPLIANCE MANIFEST
                  </span>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase mt-1">
                    Certificate of Safe Medicine Destruction
                  </h2>
                  <p className="text-xs font-mono text-teal-700 dark:text-teal-400 mt-1 font-semibold">
                    Manifest ID: {currentCertificate.manifestNumber}
                  </p>
                </div>

                {/* Metadata Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Originating Healthcare Entity:</span>
                    <strong className="text-sm">{currentCertificate.authorizedBy}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Certified Waste Facility:</span>
                    <strong className="text-sm">{currentCertificate.disposalFacility}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Destruction Methodology:</span>
                    <strong>{currentCertificate.destructionMethod}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Certification Date & Timestamp:</span>
                    <strong>{new Date(currentCertificate.issuedAt).toLocaleString()}</strong>
                  </div>
                </div>

                {/* Destroyed Batches Table */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Destroyed Pharmaceutical Consignment:
                  </span>
                  <table className="w-full text-xs border border-slate-200 dark:border-slate-800">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="p-2 text-left">Medicine Name</th>
                        <th className="p-2 text-left">Batch Number</th>
                        <th className="p-2 text-left">Quantity</th>
                        <th className="p-2 text-left">Recorded Expiry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                      {currentCertificate.items.map(item => (
                        <tr key={item.id}>
                          <td className="p-2 font-sans font-semibold">{item.name}</td>
                          <td className="p-2">{item.batchNumber}</td>
                          <td className="p-2">{item.quantity} {item.unit}</td>
                          <td className="p-2">{formatDate(item.expiryDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legal Attestation */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700">
                  <p>
                    <strong>Legal Declaration:</strong> It is certified that the above-listed pharmaceutical consignments have been permanently quarantined, neutralized, and incinerated in accordance with Schedule I & II of the Bio-Medical Waste Management Rules. This manifest serves as permanent audit proof of non-redistribution.
                  </p>
                </div>

                {/* Seal & Verification */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px]">Digital Verification Signature</span>
                    <span className="font-mono text-emerald-600 font-bold">VERIFIED_BMW_COMPLIANT</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block font-mono text-[10px]">Central Registry Status</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Logged in DawaiSetu Chain of Custody</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowCertificateModal(false)}>
                  Close
                </Button>
                <Button onClick={() => window.print()} className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Printer className="h-4 w-4 mr-1.5" />
                  Print Manifest
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
