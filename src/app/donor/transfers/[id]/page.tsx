'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DashboardSkeleton } from '@/components/ui/skeleton'
import { formatDate, formatDateTime } from '@/lib/utils'
import { ArrowLeft, Check, X, Truck, Package, ClipboardCheck, Star } from 'lucide-react'

const TIMELINE_STEPS = [
  { status: 'REQUESTED', label: 'Request Created', icon: Package },
  { status: 'APPROVED', label: 'Donor Approved', icon: Check },
  { status: 'AWAITING_CONFIRMATION', label: 'Awaiting Confirmation', icon: ClipboardCheck },
  { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: Package },
  { status: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
  { status: 'DELIVERED', label: 'Delivered', icon: Package },
  { status: 'UNDER_INSPECTION', label: 'Under Inspection', icon: ClipboardCheck },
  { status: 'ACCEPTED', label: 'Accepted', icon: Check },
  { status: 'COMPLETED', label: 'Completed', icon: Star },
]

const STATUS_ORDER = TIMELINE_STEPS.map(s => s.status)

export default function TransferDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [transfer, setTransfer] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showShipmentModal, setShowShipmentModal] = useState(false)
  const [showInspectionModal, setShowInspectionModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [shipmentForm, setShipmentForm] = useState({ method: 'PICKUP', carrier: '', trackingNumber: '', pickupDate: '', expectedDelivery: '' })
  const [inspectionForm, setInspectionForm] = useState({ isAccepted: true, packagingCondition: 'Good', temperatureOk: true, quantityVerified: true, expiryVerified: true, rejectionReason: '', notes: '' })
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, deliveryExperience: 5, medicineCondition: 5, comments: '' })

  const basePath = user?.role === 'ADMIN' ? '/admin' : user?.role === 'DONOR' ? '/donor' : '/recipient'

  const fetchTransfer = () => {
    fetch(`/api/transfers/${params.id}`).then(r => r.json()).then(d => {
      if (d.success) setTransfer(d.data)
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }

  useEffect(() => { fetchTransfer() }, [params.id])

  const updateStatus = async (newStatus: string, reason?: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/transfers/${params.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', status: newStatus, reason }),
      })
      const d = await res.json()
      if (d.success) {
        addToast({ type: 'success', title: `Transfer ${newStatus.replace(/_/g, ' ').toLowerCase()}` })
        fetchTransfer()
      } else addToast({ type: 'error', title: d.error || 'Failed' })
    } catch { addToast({ type: 'error', title: 'Network error' }) }
    setActionLoading(false)
  }

  const createShipment = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/transfers/${params.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createShipment', ...shipmentForm }),
      })
      if (res.ok) {
        addToast({ type: 'success', title: 'Shipment details saved' })
        setShowShipmentModal(false)
        fetchTransfer()
      }
    } catch { addToast({ type: 'error', title: 'Failed' }) }
    setActionLoading(false)
  }

  const submitInspection = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/transfers/${params.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createInspection', ...inspectionForm }),
      })
      if (res.ok) {
        addToast({ type: 'success', title: inspectionForm.isAccepted ? 'Medicine accepted!' : 'Medicine rejected' })
        setShowInspectionModal(false)
        fetchTransfer()
      }
    } catch { addToast({ type: 'error', title: 'Failed' }) }
    setActionLoading(false)
  }

  const submitFeedback = async () => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferId: params.id, ...feedbackForm }),
      })
      const d = await res.json()
      if (d.success) {
        addToast({ type: 'success', title: 'Feedback submitted! Thank you.' })
        setShowFeedbackModal(false)
        fetchTransfer()
      } else addToast({ type: 'error', title: d.error || 'Failed' })
    } catch { addToast({ type: 'error', title: 'Failed' }) }
    setActionLoading(false)
  }

  if (isLoading) return <DashboardSkeleton />
  if (!transfer) return <div className="text-center py-12 text-gray-500">Transfer not found</div>

  const currentStatus = transfer.status as string
  const currentIdx = STATUS_ORDER.indexOf(currentStatus)
  const isCancelled = currentStatus === 'CANCELLED'
  const isRejected = currentStatus === 'REJECTED'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`${basePath}/transfers`}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Transfer #{(transfer.id as string).slice(-6)}</h1>
          <p className="text-gray-600">Created {formatDateTime(transfer.createdAt as string)}</p>
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader><CardTitle>Transfer Timeline</CardTitle></CardHeader>
        <CardContent>
          {(isCancelled || isRejected) ? (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="font-semibold text-red-700">{isCancelled ? 'Transfer Cancelled' : 'Transfer Rejected'}</p>
              {transfer.cancellationReason && <p className="text-sm text-red-600 mt-1">Reason: {transfer.cancellationReason as string}</p>}
            </div>
          ) : (
            <div className="relative">
              {TIMELINE_STEPS.map((step, idx) => {
                const isComplete = idx <= currentIdx
                const isCurrent = idx === currentIdx
                return (
                  <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isComplete ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      {idx < TIMELINE_STEPS.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${isComplete ? 'bg-teal-600' : 'bg-gray-200'}`} />}
                    </div>
                    <div className={`pb-4 ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                      <p className={`text-sm font-semibold ${isCurrent ? 'text-teal-700' : ''}`}>{step.label}</p>
                      {isComplete && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {step.status === 'REQUESTED' && transfer.requestedAt && formatDateTime(transfer.requestedAt as string)}
                          {step.status === 'APPROVED' && transfer.approvedAt && formatDateTime(transfer.approvedAt as string)}
                          {step.status === 'IN_TRANSIT' && transfer.inTransitAt && formatDateTime(transfer.inTransitAt as string)}
                          {step.status === 'DELIVERED' && transfer.deliveredAt && formatDateTime(transfer.deliveredAt as string)}
                          {step.status === 'COMPLETED' && transfer.completedAt && formatDateTime(transfer.completedAt as string)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isCancelled && !isRejected && (
        <Card>
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {currentStatus === 'REQUESTED' && user?.role === 'DONOR' && (
                <>
                  <Button onClick={() => updateStatus('APPROVED')} isLoading={actionLoading}><Check className="h-4 w-4" /> Approve</Button>
                  <Button variant="destructive" onClick={() => setShowRejectModal(true)}><X className="h-4 w-4" /> Reject</Button>
                </>
              )}
              {currentStatus === 'APPROVED' && user?.role === 'DONOR' && (
                <Button onClick={() => { updateStatus('AWAITING_CONFIRMATION'); setShowShipmentModal(true) }} isLoading={actionLoading}>Confirm & Add Shipment Details</Button>
              )}
              {currentStatus === 'AWAITING_CONFIRMATION' && (
                <Button onClick={() => updateStatus('READY_FOR_PICKUP')} isLoading={actionLoading}>Mark Ready for Pickup</Button>
              )}
              {currentStatus === 'READY_FOR_PICKUP' && (
                <Button onClick={() => updateStatus('IN_TRANSIT')} isLoading={actionLoading}><Truck className="h-4 w-4" /> Mark In Transit</Button>
              )}
              {currentStatus === 'IN_TRANSIT' && (
                <Button onClick={() => updateStatus('DELIVERED')} isLoading={actionLoading}>Mark Delivered</Button>
              )}
              {currentStatus === 'DELIVERED' && user?.role === 'RECIPIENT' && (
                <Button onClick={() => { updateStatus('UNDER_INSPECTION'); }} isLoading={actionLoading}><ClipboardCheck className="h-4 w-4" /> Start Inspection</Button>
              )}
              {currentStatus === 'UNDER_INSPECTION' && user?.role === 'RECIPIENT' && (
                <Button onClick={() => setShowInspectionModal(true)}><ClipboardCheck className="h-4 w-4" /> Submit Inspection</Button>
              )}
              {currentStatus === 'ACCEPTED' && (
                <Button onClick={() => updateStatus('COMPLETED')} isLoading={actionLoading}><Star className="h-4 w-4" /> Mark Completed</Button>
              )}
              {currentStatus === 'COMPLETED' && user?.role === 'RECIPIENT' && !(transfer.feedback) && (
                <Button onClick={() => setShowFeedbackModal(true)}><Star className="h-4 w-4" /> Submit Feedback</Button>
              )}
              {!['COMPLETED', 'ACCEPTED', 'REJECTED'].includes(currentStatus) && (
                <Button variant="outline" onClick={() => updateStatus('CANCELLED', 'Cancelled by user')} isLoading={actionLoading}>Cancel Transfer</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transfer Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Donor</CardTitle></CardHeader>
          <CardContent>
            <p className="font-semibold text-gray-900">{(transfer.donorOrg as Record<string, string>)?.name}</p>
            <p className="text-sm text-gray-500">{(transfer.donorOrg as Record<string, string>)?.city}, {(transfer.donorOrg as Record<string, string>)?.state}</p>
            <p className="text-sm text-gray-500 mt-1">{(transfer.donorOrg as Record<string, string>)?.contactPerson} · {(transfer.donorOrg as Record<string, string>)?.phone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recipient</CardTitle></CardHeader>
          <CardContent>
            <p className="font-semibold text-gray-900">{(transfer.recipientOrg as Record<string, string>)?.name}</p>
            <p className="text-sm text-gray-500">{(transfer.recipientOrg as Record<string, string>)?.city}, {(transfer.recipientOrg as Record<string, string>)?.state}</p>
            <p className="text-sm text-gray-500 mt-1">{(transfer.recipientOrg as Record<string, string>)?.contactPerson} · {(transfer.recipientOrg as Record<string, string>)?.phone}</p>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader><CardTitle>Medicines</CardTitle></CardHeader>
        <CardContent>
          {((transfer.items as Record<string, unknown>[]) || []).map((item: Record<string, unknown>) => {
            const med = item.medicine as Record<string, unknown>
            return (
              <div key={item.id as string} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{med?.name as string}</p>
                  <p className="text-xs text-gray-500">Batch: {med?.batchNumber as string || 'N/A'} · Exp: {formatDate(med?.expiryDate as string)}</p>
                </div>
                <p className="font-semibold">{item.quantity as number} {med?.unit as string}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Shipment Info */}
      {transfer.shipment && (
        <Card>
          <CardHeader><CardTitle>Shipment Details</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid sm:grid-cols-2 gap-3">
              {[
                ['Method', (transfer.shipment as Record<string, string>).method],
                ['Carrier', (transfer.shipment as Record<string, string>).carrier],
                ['Tracking #', (transfer.shipment as Record<string, string>).trackingNumber],
                ['Pickup', (transfer.shipment as Record<string, string>).pickupAddress],
                ['Delivery', (transfer.shipment as Record<string, string>).deliveryAddress],
              ].filter(([,v]) => v).map(([k,v]) => (
                <div key={k} className="text-sm"><dt className="text-gray-500">{k}</dt><dd className="font-medium mt-0.5">{v}</dd></div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Inspection */}
      {transfer.inspection && (
        <Card>
          <CardHeader><CardTitle>Inspection Result</CardTitle></CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg ${(transfer.inspection as Record<string, boolean>).isAccepted ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-semibold">{(transfer.inspection as Record<string, boolean>).isAccepted ? '✓ Accepted' : '✗ Rejected'}</p>
              {(transfer.inspection as Record<string, string>).rejectionReason && <p className="text-sm mt-1">Reason: {(transfer.inspection as Record<string, string>).rejectionReason}</p>}
              {(transfer.inspection as Record<string, string>).notes && <p className="text-sm mt-1">Notes: {(transfer.inspection as Record<string, string>).notes}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      {transfer.feedback && (
        <Card>
          <CardHeader><CardTitle>Feedback</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < (transfer.feedback as Record<string, number>).rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>
            {(transfer.feedback as Record<string, string>).comments && <p className="text-sm text-gray-700">{(transfer.feedback as Record<string, string>).comments}</p>}
          </CardContent>
        </Card>
      )}

      {/* Reject Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Request" size="sm">
        <div className="space-y-4">
          <Textarea label="Rejection Reason" value={rejectReason} onChange={e => setRejectReason(e.target.value)} required placeholder="Please provide a reason" />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { updateStatus('REJECTED', rejectReason); setShowRejectModal(false) }} isLoading={actionLoading} disabled={!rejectReason}>Reject</Button>
          </div>
        </div>
      </Modal>

      {/* Shipment Modal */}
      <Modal isOpen={showShipmentModal} onClose={() => setShowShipmentModal(false)} title="Shipment Details">
        <div className="space-y-4">
          <Select label="Method" options={[{ value: 'PICKUP', label: 'Pickup' }, { value: 'SHIPPING', label: 'Shipping' }]}
            value={shipmentForm.method} onChange={e => setShipmentForm(p => ({ ...p, method: e.target.value }))} />
          {shipmentForm.method === 'SHIPPING' && (
            <>
              <Input label="Carrier" value={shipmentForm.carrier} onChange={e => setShipmentForm(p => ({ ...p, carrier: e.target.value }))} />
              <Input label="Tracking Number" value={shipmentForm.trackingNumber} onChange={e => setShipmentForm(p => ({ ...p, trackingNumber: e.target.value }))} />
            </>
          )}
          <Input label="Pickup Date" type="date" value={shipmentForm.pickupDate} onChange={e => setShipmentForm(p => ({ ...p, pickupDate: e.target.value }))} />
          <Input label="Expected Delivery" type="date" value={shipmentForm.expectedDelivery} onChange={e => setShipmentForm(p => ({ ...p, expectedDelivery: e.target.value }))} />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowShipmentModal(false)}>Skip</Button>
            <Button onClick={createShipment} isLoading={actionLoading}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Inspection Modal */}
      <Modal isOpen={showInspectionModal} onClose={() => setShowInspectionModal(false)} title="Medicine Inspection">
        <div className="space-y-4">
          <Input label="Packaging Condition" value={inspectionForm.packagingCondition} onChange={e => setInspectionForm(p => ({ ...p, packagingCondition: e.target.value }))} />
          <div className="space-y-2">
            {[
              { key: 'temperatureOk', label: 'Temperature/storage conditions OK' },
              { key: 'quantityVerified', label: 'Quantity verified' },
              { key: 'expiryVerified', label: 'Expiry date verified' },
            ].map(c => (
              <label key={c.key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={inspectionForm[c.key as keyof typeof inspectionForm] as boolean}
                  onChange={e => setInspectionForm(p => ({ ...p, [c.key]: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                {c.label}
              </label>
            ))}
          </div>
          <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
            <button onClick={() => setInspectionForm(p => ({ ...p, isAccepted: true }))}
              className={`flex-1 py-3 rounded-lg text-center font-medium ${inspectionForm.isAccepted ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' : 'bg-white border border-gray-200 text-gray-600'}`}>
              ✓ Accept
            </button>
            <button onClick={() => setInspectionForm(p => ({ ...p, isAccepted: false }))}
              className={`flex-1 py-3 rounded-lg text-center font-medium ${!inspectionForm.isAccepted ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-white border border-gray-200 text-gray-600'}`}>
              ✗ Reject
            </button>
          </div>
          {!inspectionForm.isAccepted && (
            <Textarea label="Rejection Reason" value={inspectionForm.rejectionReason} onChange={e => setInspectionForm(p => ({ ...p, rejectionReason: e.target.value }))} required />
          )}
          <Textarea label="Notes" value={inspectionForm.notes} onChange={e => setInspectionForm(p => ({ ...p, notes: e.target.value }))} />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowInspectionModal(false)}>Cancel</Button>
            <Button onClick={submitInspection} isLoading={actionLoading} disabled={!inspectionForm.isAccepted && !inspectionForm.rejectionReason}>Submit</Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="Submit Feedback">
        <div className="space-y-4">
          {['rating', 'deliveryExperience', 'medicineCondition'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setFeedbackForm(p => ({ ...p, [field]: n }))}
                    className={`p-1 ${n <= (feedbackForm[field as keyof typeof feedbackForm] as number) ? 'text-amber-400' : 'text-gray-200'}`}>
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Textarea label="Comments" value={feedbackForm.comments} onChange={e => setFeedbackForm(p => ({ ...p, comments: e.target.value }))} placeholder="Share your experience..." />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
            <Button onClick={submitFeedback} isLoading={actionLoading}>Submit Feedback</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
