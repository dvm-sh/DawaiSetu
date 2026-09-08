'use client'

import { useAuth } from '@/context/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Building2, MapPin, Mail, Phone, Edit, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/toast'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { addToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  if (!user) return null
  const org = user.organization as Record<string, string> | undefined
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editForm, setEditForm] = useState({
    contactPerson: org?.contactPerson || '',
    phone: org?.phone || '',
    address: org?.address || '',
    city: org?.city || '',
    state: org?.state || '',
    pincode: org?.pincode || '',
  })

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: 'success', title: 'Profile Updated', message: 'Your organization details have been updated.' })
        refreshUser()
        setIsEditing(false)
      } else {
        addToast({ type: 'error', title: 'Update Failed', message: data.error || 'Unknown error' })
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Network error occurred' })
    }
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Organization Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and organization details</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => addToast({ type: 'info', title: 'Settings', message: 'Organization settings are managed by your admin.' })}><Settings className="h-4 w-4 mr-2" /> Settings</Button>
          <Button onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2" /> Edit Profile</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400" /> Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Name</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{org?.name || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">{org?.type?.replace(/_/g, ' ').toLowerCase() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verification Status</p>
                  <div className="mt-1"><StatusBadge status={org?.status || 'PENDING'} /></div>
                </div>
              </div>
              <hr className="border-gray-100 dark:border-gray-800" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location</p>
                <p className="text-gray-900 dark:text-gray-100 text-sm">
                  {org?.city}, {org?.state} <br />
                  {org?.country} - {org?.pincode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-teal-600 dark:text-teal-400" /> Primary Contact</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{org?.contactPerson || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1"><Mail className="h-4 w-4" /> Email Address</p>
                <p className="text-gray-900 dark:text-gray-100 text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1"><Phone className="h-4 w-4" /> Phone Number</p>
                <p className="text-gray-900 dark:text-gray-100 text-sm">{org?.phone || 'Not provided'}</p>
              </div>
              <hr className="border-gray-100 dark:border-gray-800" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Role</p>
                <div className="mt-1"><StatusBadge status={user.role} /></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-form" onSubmit={handleEditSubmit} className="space-y-4">
                <Input label="Contact Person" value={editForm.contactPerson} onChange={e => setEditForm(p => ({...p, contactPerson: e.target.value}))} required />
                <Input label="Phone Number" value={editForm.phone} onChange={e => setEditForm(p => ({...p, phone: e.target.value}))} required />
                <Input label="Address" value={editForm.address} onChange={e => setEditForm(p => ({...p, address: e.target.value}))} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" value={editForm.city} onChange={e => setEditForm(p => ({...p, city: e.target.value}))} required />
                  <Input label="State" value={editForm.state} onChange={e => setEditForm(p => ({...p, state: e.target.value}))} required />
                </div>
                <Input label="PIN / ZIP" value={editForm.pincode} onChange={e => setEditForm(p => ({...p, pincode: e.target.value}))} required />
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" form="edit-form" isLoading={isSubmitting}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
