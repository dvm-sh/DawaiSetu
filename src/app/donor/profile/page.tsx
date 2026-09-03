'use client'
import { useAuth } from '@/context/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { User, Building2, Mail, Phone, Globe, MapPin, FileText } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null
  const org = user.organization as Record<string, string> | undefined
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div><h1 className="text-2xl font-bold text-gray-900">Profile</h1><p className="text-gray-600 mt-1">Your organization information</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-4 w-4" /> Account</CardTitle></CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm"><dt className="text-gray-500">Email</dt><dd className="font-medium">{user.email}</dd></div>
            <div className="flex justify-between text-sm"><dt className="text-gray-500">Role</dt><dd><StatusBadge status={user.role} /></dd></div>
          </dl>
        </CardContent>
      </Card>
      {org && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Organization</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm"><dt className="text-gray-500">Name</dt><dd className="font-medium">{org.name}</dd></div>
              <div className="flex justify-between text-sm"><dt className="text-gray-500">Type</dt><dd className="font-medium capitalize">{org.type?.replace(/_/g, ' ').toLowerCase()}</dd></div>
              <div className="flex justify-between text-sm"><dt className="text-gray-500">Status</dt><dd><StatusBadge status={org.status} /></dd></div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
