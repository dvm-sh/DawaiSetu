'use client'

import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="mb-4 text-gray-300">
        {icon || <Package className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
