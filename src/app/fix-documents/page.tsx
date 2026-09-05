'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { AlertCircle, Upload, CheckCircle2 } from 'lucide-react'

export default function FixDocumentsPage() {
  const { user, refreshUser, logout } = useAuth()
  const router = useRouter()
  const { addToast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [org, setOrg] = useState<any>(null)
  
  const [files, setFiles] = useState({
    drugLicense: '',
    orgRegistration: '',
    authRepDetails: '',
    requiredAgreement: '',
    otherDocs: ''
  })

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      router.push('/admin')
      return
    }

    if (user) {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data.organization) {
            const organization = data.data.organization
            setOrg(organization)
            
            // If they are no longer rejected, send them back to login to refresh token
            if (organization.status !== 'REJECTED') {
              logout()
            }
          }
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [user, router, logout])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate upload by updating org status to PENDING
    try {
      const res = await fetch('/api/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'PENDING',
          // we would normally send the files here, but since it's simulated, just changing status is enough to trigger a re-review
        })
      })
      
      const data = await res.json()
      if (data.success) {
        addToast({ type: 'success', title: 'Documents Submitted', message: 'Your documents have been submitted for re-verification.' })
        // Log out to clear the token containing the REJECTED status
        await logout()
      } else {
        addToast({ type: 'error', title: 'Error', message: data.error || 'Failed to submit documents' })
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Network error' })
    }
    
    setIsSubmitting(false)
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  
  if (!user || !org) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p>Please log in first.</p>
        <Button onClick={() => router.push('/login')}>Go to Login</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-bold text-red-900">Verification Rejected</h2>
            <p className="text-red-700 mt-1">Your organization verification was rejected by our admins.</p>
            {org.rejectionReason && (
              <div className="mt-4 p-4 bg-white/50 rounded-lg border border-red-100">
                <p className="text-sm font-medium text-red-900">Reason for rejection:</p>
                <p className="text-sm text-red-800 mt-1">{org.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Re-upload Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">Please upload the required verification documents to submit your application for re-review. *Simulated for demo*</p>
              
              <div className="space-y-4">
                {[
                  { id: 'drugLicense', label: 'Drug License' },
                  { id: 'orgRegistration', label: 'Organization Registration' },
                  { id: 'authRepDetails', label: 'Authorized Representative Details' },
                  { id: 'requiredAgreement', label: 'Required Agreement' },
                  { id: 'otherDocs', label: 'Other Verification Documents (Optional)' },
                ].map((doc) => (
                  <div key={doc.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{doc.label}</label>
                    <input 
                      type="file" 
                      onChange={(e) => setFiles(prev => ({ ...prev, [doc.id]: e.target.files?.[0]?.name || '' }))} 
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" 
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" type="button" onClick={logout} className="flex-1">Sign Out</Button>
                <Button type="submit" isLoading={isSubmitting} className="flex-1">Submit for Re-review</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
