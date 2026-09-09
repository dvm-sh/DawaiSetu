'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import {
  Building2, Check, X, Ban, Eye, Mail, Phone, FileText, MapPin,
  ShieldCheck, ShieldAlert, FileCheck, CheckCircle2, AlertCircle,
  ExternalLink, Download
} from 'lucide-react'

interface DocumentItem {
  id: string
  name: string
  type: string
  fileName: string
  fileSize: number
  fileUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string | null
  createdAt: string
}

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const [selectedOrg, setSelectedOrg] = useState<Record<string, unknown> | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectOrgId, setRejectOrgId] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  
  // Document verification states
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)
  const [showDocRejectModal, setShowDocRejectModal] = useState(false)
  const [rejectDocId, setRejectDocId] = useState('')
  const [rejectDocReason, setRejectDocReason] = useState('')
  const [docLoading, setDocLoading] = useState(false)

  const { addToast } = useToast()

  const fetchOrgs = () => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: '20' })
    if (status) params.set('status', status)
    fetch(`/api/admin/organizations?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setOrganizations(d.data.organizations)
          setPagination(d.data.pagination)
          // Update selectedOrg if open
          if (selectedOrg) {
            const updated = d.data.organizations.find((o: Record<string, unknown>) => o.id === selectedOrg.id)
            if (updated) setSelectedOrg(updated)
          }
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }

  useEffect(() => { fetchOrgs() }, [page, status])

  const handleAction = async (orgId: string, action: string, reason?: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/organizations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId, action, reason }),
      })
      const d = await res.json()
      if (d.success) {
        addToast({ type: 'success', title: `Organization ${action}d` })
        fetchOrgs()
        setShowRejectModal(false)
        setShowDetailModal(false)
      } else {
        addToast({ type: 'error', title: d.error || 'Failed' })
      }
    } catch {
      addToast({ type: 'error', title: 'Network error' })
    }
    setActionLoading(false)
  }

  const handleVerifyDocument = async (documentId: string, docStatus: 'APPROVED' | 'REJECTED', reason?: string) => {
    setDocLoading(true)
    try {
      const res = await fetch('/api/admin/organizations/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, status: docStatus, rejectionReason: reason })
      })
      const d = await res.json()
      if (d.success) {
        addToast({
          type: 'success',
          title: docStatus === 'APPROVED' ? 'Document Verified' : 'Document Rejected',
          message: docStatus === 'APPROVED' ? 'Verification record logged.' : 'Rejection notice sent.'
        })
        setShowDocRejectModal(false)
        setRejectDocReason('')
        fetchOrgs()
        
        // Locally update selectedOrg.documents for immediate feedback
        if (selectedOrg && Array.isArray(selectedOrg.documents)) {
          const updatedDocs = selectedOrg.documents.map((doc: DocumentItem) =>
            doc.id === documentId
              ? { ...doc, status: docStatus, rejectionReason: reason || null }
              : doc
          )
          setSelectedOrg({ ...selectedOrg, documents: updatedDocs })
        }
      } else {
        addToast({ type: 'error', title: d.error || 'Verification action failed' })
      }
    } catch {
      addToast({ type: 'error', title: 'Network error occurred' })
    } finally {
      setDocLoading(false)
    }
  }

  const docs = (selectedOrg?.documents as DocumentItem[]) || []
  const approvedDocsCount = docs.filter(d => d.status === 'APPROVED').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organization Accreditation</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Verify state drug licenses, registration documents, and compliance records
          </p>
        </div>
        <Select
          options={[
            { value: 'PENDING', label: 'Pending Review' },
            { value: 'APPROVED', label: 'Accredited / Approved' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'SUSPENDED', label: 'Suspended' },
          ]}
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          placeholder="All Accreditation Statuses"
          className="w-56"
        />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : organizations.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-16 w-16" />}
          title="No organizations found"
          description="Organizations will appear here when they submit their registration credentials."
        />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
                  <th className="text-left py-3 px-4 font-semibold">Organization</th>
                  <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Type</th>
                  <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Role</th>
                  <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Location</th>
                  <th className="text-left py-3 px-4 font-semibold">Docs Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {organizations.map(org => {
                  const orgDocs = (org.documents as DocumentItem[]) || []
                  const verifiedCount = orgDocs.filter(d => d.status === 'APPROVED').length
                  return (
                    <tr key={org.id as string} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{org.name as string}</p>
                        <p className="text-xs text-slate-500">{org.contactPerson as string}</p>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-xs capitalize text-slate-700 dark:text-slate-300">
                        {(org.type as string)?.replace(/_/g, ' ').toLowerCase()}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <StatusBadge status={org.role as string} />
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-xs text-slate-500">
                        {org.city as string}, {org.state as string}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                          verifiedCount === orgDocs.length && orgDocs.length > 0
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          <FileText className="h-3 w-3" />
                          {verifiedCount}/{orgDocs.length} Verified
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={org.status as string} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setSelectedOrg(org); setShowDetailModal(true) }}
                            className="p-1.5 text-slate-500 hover:text-teal-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Inspect Documents & Verify"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {org.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleAction(org.id as string, 'approve')}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-md cursor-pointer"
                                title="Approve Organization"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => { setRejectOrgId(org.id as string); setShowRejectModal(true) }}
                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-md cursor-pointer"
                                title="Reject Organization"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {org.status === 'APPROVED' && (
                            <button
                              onClick={() => handleAction(org.id as string, 'suspend')}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 rounded-md cursor-pointer"
                              title="Suspend Accreditation"
                            >
                              <ShieldAlert className="h-4 w-4" />
                            </button>
                          )}
                          {org.status === 'SUSPENDED' && (
                            <button
                              onClick={() => handleAction(org.id as string, 'approve')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-md cursor-pointer"
                              title="Unsuspend / Re-approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Page {page} of {pagination.totalPages} · {pagination.total} total organizations
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Organization Inspection & Document Verification Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Organization Credentials & Document Audit"
        size="lg"
      >
        {selectedOrg && (
          <div className="space-y-6 text-sm">
            {/* Summary Details */}
            <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500">Legal Entity Name</p>
                <p className="font-bold text-slate-900 dark:text-white text-base">{selectedOrg.name as string}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Accreditation Status</p>
                <StatusBadge status={selectedOrg.status as string} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Category & Role</p>
                <p className="capitalize font-medium">{(selectedOrg.type as string)?.replace(/_/g, ' ').toLowerCase()} ({selectedOrg.role as string})</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">State Drug License / Reg #</p>
                <p className="font-mono font-semibold">{selectedOrg.registrationNumber as string}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{(selectedOrg.user as Record<string, string>)?.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedOrg.phone as string}</span>
              </div>
            </div>

            {/* Document Verification Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-teal-600" />
                    Submitted Compliance Documents ({docs.length})
                  </h4>
                  <p className="text-xs text-slate-500">Inspect each legal document before approving the organization</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                  approvedDocsCount === docs.length && docs.length > 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {approvedDocsCount} of {docs.length} Approved
                </span>
              </div>

              {docs.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                  No separate document files uploaded during initial intake.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {docs.map(doc => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 shrink-0 mt-0.5">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900 dark:text-white">{doc.type}</p>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              doc.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : doc.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 w-48 sm:w-auto truncate">
                            {doc.fileName.split('/').pop()} · {(doc.fileSize / 1024).toFixed(1)} KB · Uploaded {formatDate(doc.createdAt)}
                          </p>
                          {doc.rejectionReason && (
                            <p className="text-xs text-red-600 mt-1">Rejection reason: {doc.rejectionReason}</p>
                          )}
                        </div>
                      </div>

                      {/* Document Action Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.name, '_blank')}
                          className="text-xs h-8 px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          View File
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewDoc(doc)}
                          className="text-xs h-8 px-2.5"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Inspect
                        </Button>
                        {doc.status !== 'APPROVED' && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyDocument(doc.id, 'APPROVED')}
                            isLoading={docLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-2.5"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Approve
                          </Button>
                        )}
                        {doc.status !== 'REJECTED' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setRejectDocId(doc.id)
                              setShowDocRejectModal(true)
                            }}
                            className="text-xs h-8 px-2.5"
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Overall Org Accreditation Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 justify-between items-center">
              <div>
                {approvedDocsCount === docs.length && docs.length > 0 && selectedOrg.status === 'PENDING' && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All documents verified. Ready to approve organization.
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {selectedOrg.status === 'PENDING' && (
                  <>
                    <Button
                      onClick={() => handleAction(selectedOrg.id as string, 'approve')}
                      isLoading={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-1" /> Grant Full Accreditation
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setRejectOrgId(selectedOrg.id as string)
                        setShowRejectModal(true)
                        setShowDetailModal(false)
                      }}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject Org
                    </Button>
                  </>
                )}
                {selectedOrg.status === 'APPROVED' && (
                  <Button variant="outline" onClick={() => handleAction(selectedOrg.id as string, 'suspend')} isLoading={actionLoading}>
                    <Ban className="h-4 w-4 mr-1 text-amber-600" /> Suspend Entity
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Document Preview & Audit Viewer */}
      <Modal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title="Document Audit Preview"
        size="md"
      >
        {previewDoc && (
          <div className="space-y-4 text-sm">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">{previewDoc.name}</span>
                <span className="text-xs font-mono text-slate-500">{previewDoc.type}</span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <p><strong>File Name:</strong> {previewDoc.fileName}</p>
                <p><strong>File Size:</strong> {(previewDoc.fileSize / 1024).toFixed(1)} KB</p>
                <p><strong>Upload Date:</strong> {formatDate(previewDoc.createdAt)}</p>
                <p><strong>Current Status:</strong> <span className="font-semibold text-teal-600">{previewDoc.status}</span></p>
              </div>

              {/* Simulated Document Inspection Box */}
              <div className="h-48 border border-dashed border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 flex flex-col items-center justify-center p-4 text-center">
                <ShieldCheck className="h-10 w-10 text-teal-600 mb-2" />
                <p className="font-bold text-slate-900 dark:text-white text-xs">Official Document On File</p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Document verified against state drug administration records for registration number {selectedOrg?.registrationNumber as string}.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-teal-700 dark:text-teal-400 font-mono bg-teal-50 dark:bg-teal-950/60 px-2 py-1 rounded">
                  <CheckCircle2 className="h-3 w-3" />
                  SHA-256 Checksum Verified
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500 font-mono">DawaiSetu Compliance Gate</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
                  Close
                </Button>
                {previewDoc.status !== 'APPROVED' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleVerifyDocument(previewDoc.id, 'APPROVED')
                      setPreviewDoc(null)
                    }}
                    className="bg-emerald-600 text-white"
                  >
                    Approve Document
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Document Rejection Reason */}
      <Modal
        isOpen={showDocRejectModal}
        onClose={() => setShowDocRejectModal(false)}
        title="Reject Document"
        size="sm"
      >
        <div className="space-y-4">
          <Textarea
            label="Reason for Document Rejection"
            value={rejectDocReason}
            onChange={e => setRejectDocReason(e.target.value)}
            required
            placeholder="e.g., License has expired, blurry document scan, name mismatch with registration records"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDocRejectModal(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => handleVerifyDocument(rejectDocId, 'REJECTED', rejectDocReason)}
              isLoading={docLoading}
              disabled={!rejectDocReason}
            >
              Reject Document
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Reject Organization */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Organization" size="sm">
        <div className="space-y-4">
          <Textarea label="Rejection Reason" value={rejectReason} onChange={e => setRejectReason(e.target.value)} required placeholder="Provide a reason for rejection" />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleAction(rejectOrgId, 'reject', rejectReason)} isLoading={actionLoading} disabled={!rejectReason}>Reject</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
