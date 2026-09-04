'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Settings as SettingsIcon } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-gray-600 mt-1">Platform configuration</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><SettingsIcon className="h-4 w-4" /> Platform Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-gray-900">Auto-matching Engine</p><p className="text-sm text-gray-500">Automatically match medicines with requirements</p></div>
              <div className="w-12 h-6 bg-teal-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-gray-900">Expiry Notifications</p><p className="text-sm text-gray-500">Notify donors when medicines approach expiry</p></div>
              <div className="w-12 h-6 bg-teal-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-gray-900">Auto-reject Expired Medicines</p><p className="text-sm text-gray-500">Automatically reject listing of expired medicines</p></div>
              <div className="w-12 h-6 bg-teal-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-gray-900">Minimum Expiry Days</p><p className="text-sm text-gray-500">Minimum days before expiry for accepting donations</p></div>
              <span className="text-sm font-mono bg-white border border-gray-300 rounded-lg px-3 py-1">30 days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
