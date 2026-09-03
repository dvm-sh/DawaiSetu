'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { formatDateTime } from '@/lib/utils'
import { Bell, Check, CheckCheck } from 'lucide-react'
import Link from 'next/link'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToast } = useToast()

  const fetchNotifications = () => {
    fetch('/api/notifications?limit=50').then(r => r.json()).then(d => {
      if (d.success) setNotifications(d.data.notifications)
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }
  useEffect(() => { fetchNotifications() }, [])

  const markRead = async (id: string) => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notificationId: id }) })
    fetchNotifications()
  }

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'markAllRead' }) })
    addToast({ type: 'success', title: 'All notifications marked as read' })
    fetchNotifications()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Notifications</h1><p className="text-gray-600 mt-1">Stay updated on your activity</p></div>
        {notifications.some(n => !(n.isRead as boolean)) && (
          <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="h-4 w-4" /> Mark all read</Button>
        )}
      </div>
      {isLoading ? <TableSkeleton rows={5} cols={1} /> : notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-16 w-16" />} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <Card key={n.id as string} className={`p-4 cursor-pointer transition-colors ${!(n.isRead as boolean) ? 'bg-teal-50/50 border-teal-200' : 'hover:bg-gray-50'}`}
              onClick={() => { if (!(n.isRead as boolean)) markRead(n.id as string) }}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!(n.isRead as boolean) ? 'bg-teal-500' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{n.title as string}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message as string}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt as string)}</p>
                </div>
                {n.actionUrl && <Link href={n.actionUrl as string}><Button size="sm" variant="ghost">View</Button></Link>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
