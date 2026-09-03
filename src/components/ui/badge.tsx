'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'custom'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    custom: '',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    SUSPENDED: 'bg-gray-100 text-gray-600 border-gray-200',
    AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    RESERVED: 'bg-blue-50 text-blue-700 border-blue-200',
    MATCHED: 'bg-purple-50 text-purple-700 border-purple-200',
    TRANSFER_PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    IN_TRANSIT: 'bg-blue-50 text-blue-700 border-blue-200',
    RECEIVED: 'bg-teal-50 text-teal-700 border-teal-200',
    DISTRIBUTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    EXPIRED: 'bg-red-50 text-red-700 border-red-200',
    DISPOSED: 'bg-gray-100 text-gray-600 border-gray-200',
    PAUSED: 'bg-gray-100 text-gray-600 border-gray-200',
    REQUESTED: 'bg-amber-50 text-amber-700 border-amber-200',
    AWAITING_CONFIRMATION: 'bg-blue-50 text-blue-700 border-blue-200',
    READY_FOR_PICKUP: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    DELIVERED: 'bg-teal-50 text-teal-700 border-teal-200',
    UNDER_INSPECTION: 'bg-purple-50 text-purple-700 border-purple-200',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PARTIALLY_FULFILLED: 'bg-blue-50 text-blue-700 border-blue-200',
    FULFILLED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CRITICAL: 'bg-red-50 text-red-700 border-red-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    LOW: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  const label = status.replace(/_/g, ' ')

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
        statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-200',
        className
      )}
    >
      {label.toLowerCase()}
    </span>
  )
}
