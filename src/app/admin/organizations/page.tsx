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
import { formatDate, formatDateTime } from '@/lib/utils'
import { Building2, Check, X, Ban, Eye, Mail, Phone, FileText, MapPin } from 'lucide-react'

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
  const { addToast } = useToast()

  const fetchOrgs = () => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: '20' })
    if (status) params.set('status', status)
    fetch(`/api/admin/organizations?${params}`).then(r => r.json()).then(d => {
      if (d.success) { setOrganizations(d.data.organizations); setPagination(d.data.pagination) }
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }

  useEffect(() => { fetchOrgs() }, [page, status])

  const handleAction = async (orgId: string, action: string, reason?: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/organizations', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId, action, reason }),
      })
      const d = await res.json()
      if (d.success) {
        addToast({ type: 'success', title: `Organization ${action}d` })
        fetchOrgs()
        setShowRejectModal(false)
        setShowDetailModal(false)
      } else addToast({ type: 'error', title: d.error || 'Failed' })
    } catch { addToast({ type: 'error', title: 'Network error' }) }
    setActionLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Organizations</h1><p className="text-gray-600 mt-1">Verify and manage registered organizations</p></div>
        <Select options={[
          { value: 'PENDING', label: 'Pending' }, { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' }, { value: 'SUSPENDED', label: 'Suspended' },
        ]} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} placeholder="All Statuses" className="w-48" />
      </div>

      {isLoading ? <TableSkeleton /> : organizations.length === 0 ? (
        <EmptyState icon={<Building2 className="h-16 w-16" />} title="No organizations found" description="Organizations will appear here when they register" />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Organization</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden lg:table-cell">Registered</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
              </tr></thead>
              <tbody>
                {organizations.map(org => (
                  <tr key={org.id as string} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{org.name as string}</p>
                      <p className="text-xs text-gray-500">{org.contactPerson as string}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-xs capitalize">{(org.type as string)?.replace(/_/g, ' ').toLowerCase()}</td>
                    <td className="py-3 px-4 hidden md:table-cell"><StatusBadge status={org.role as string} /></td>
                    <td className="py-3 px-4 hidden sm:table-cell text-xs text-gray-500">{org.city as string}, {org.state as string}</td>
                    <td className="py-3 px-4"><StatusBadge status={org.status as string} /></td>
                    <td className="py-3 px-4 hidden lg:table-cell text-xs text-gray-500">{formatDate(org.createdAt as string)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedOrg(org); setShowDetailModal(true) }} className="p-1.5 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-gray-100" title="View"><Eye className="h-4 w-4" /></button>
                        {org.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleAction(org.id as string, 'approve')} className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-100" title="Approve"><Check className="h-4 w-4" /></button>
                            <button onClick={() => { setRejectOrgId(org.id as string); setShowRejectModal(true) }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100" title="Reject"><X className="h-4 w-4" /></button>
                          </>
                        )}
                        {org.status === 'APPROVED' && (
                          <button onClick={() => handleAction(org.id as string, 'suspend')} className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100" title="Suspend"><Ban className="h-4 w-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-600">Page {page} of {pagination.totalPages} · {pagination.total} total</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Organization Details" size="lg">
        {selectedOrg && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Name</p><p className="font-semibold">{selectedOrg.name as string}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><StatusBadge status={selectedOrg.status as string} /></div>
              <div><p className="text-xs text-gray-500">Type</p><p className="capitalize">{(selectedOrg.type as string)?.replace(/_/g, ' ').toLowerCase()}</p></div>
              <div><p className="text-xs text-gray-500">Role</p><StatusBadge status={selectedOrg.role as string} /></div>
              <div><p className="text-xs text-gray-500">Registration #</p><p>{selectedOrg.registrationNumber as string}</p></div>
              <div><p className="text-xs text-gray-500">Contact Person</p><p>{selectedOrg.contactPerson as string}</p></div>
              <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3 text-gray-400" />{(selectedOrg.user as Record<string, string>)?.email}</div>
              <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3 text-gray-400" />{selectedOrg.phone as string}</div>
            </div>
            <div className="flex items-start gap-1 text-sm"><MapPin className="h-3 w-3 text-gray-400 mt-1 shrink-0" /><span>{selectedOrg.address as string}, {selectedOrg.city as string}, {selectedOrg.state as string} {selectedOrg.pincode as string}</span></div>
            {selectedOrg.website && <div className="text-sm">Website: <a href={selectedOrg.website as string} target="_blank" className="text-teal-600 underline">{selectedOrg.website as string}</a></div>}
            {selectedOrg.rejectionReason && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"><strong>Rejection Reason:</strong> {selectedOrg.rejectionReason as string}</div>}
            <div className="flex gap-3 pt-2 border-t">
              {selectedOrg.status === 'PENDING' && (
                <>
                  <Button onClick={() => handleAction(selectedOrg.id as string, 'approve')} isLoading={actionLoading}><Check className="h-4 w-4" /> Approve</Button>
                  <Button variant="destructive" onClick={() => { setRejectOrgId(selectedOrg.id as string); setShowRejectModal(true); setShowDetailModal(false) }}><X className="h-4 w-4" /> Reject</Button>
                </>
              )}
              {selectedOrg.status === 'APPROVED' && <Button variant="outline" onClick={() => handleAction(selectedOrg.id as string, 'suspend')} isLoading={actionLoading}><Ban className="h-4 w-4" /> Suspend</Button>}
              {selectedOrg.status === 'SUSPENDED' && <Button onClick={() => handleAction(selectedOrg.id as string, 'approve')} isLoading={actionLoading}><Check className="h-4 w-4" /> Re-approve</Button>}
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
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
