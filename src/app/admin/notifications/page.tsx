'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/lib/utils'
import { Bell, CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => {
        if (d.success) setNotifications(d.data.notifications || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH', body: JSON.stringify({ isRead: true }) })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      console.error(e)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORG_APPROVED': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'ORG_REJECTED': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'LISTING_FLAGGED': return <ShieldAlert className="h-5 w-5 text-amber-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Platform alerts and updates</p>
      </div>

      {isLoading ? <TableSkeleton rows={5} /> : notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-16 w-16" />} title="No notifications" description="You're all caught up!" />
      ) : (
        <Card padding={false}>
          <div className="divide-y divide-gray-100">
            {notifications.map(n => (
              <div key={n.id as string} className={`p-4 sm:p-6 flex gap-4 transition-colors hover:bg-gray-50 ${!(n.isRead as boolean) ? 'bg-blue-50/30' : ''}`}>
                <div className="mt-1 shrink-0">{getIcon(n.type as string)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium ${!(n.isRead as boolean) ? 'text-gray-900' : 'text-gray-700'}`}>{n.title as string}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{formatDateTime(n.createdAt as string)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{n.message as string}</p>
                  <div className="flex items-center gap-4">
                    {n.actionUrl && (
                      <Link href={n.actionUrl as string} className="text-sm font-medium text-teal-600 hover:text-teal-700">
                        View Details
                      </Link>
                    )}
                    {!(n.isRead as boolean) && (
                      <button onClick={() => markAsRead(n.id as string)} className="text-sm text-gray-500 hover:text-gray-700">
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
