'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users as UsersIcon } from 'lucide-react'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Users</h1><p className="text-gray-600 mt-1">User accounts are managed through organization verification</p></div>
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><UsersIcon className="h-8 w-8 text-gray-400" /></div>
          <p className="text-gray-600 mb-2">Users are created during organization registration.</p>
          <p className="text-sm text-gray-500">Manage users through the <a href="/admin/organizations" className="text-teal-600 underline">Organizations</a> page.</p>
        </CardContent>
      </Card>
    </div>
  )
}
