'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', padding && 'p-6', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between pb-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-gray-900', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-gray-500', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('pt-4', className)}>{children}</div>
}
