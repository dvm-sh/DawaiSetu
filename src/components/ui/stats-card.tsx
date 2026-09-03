'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; label: string }
  description?: string
  iconColor?: string
  className?: string
}

export function StatsCard({ title, value, icon: Icon, trend, description, iconColor = 'bg-teal-50 text-teal-600', className }: StatsCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
          {trend && (
            <p className={cn('text-xs font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-red-600')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
