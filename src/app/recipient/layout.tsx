'use client'
import DashboardLayout from '@/components/layout/dashboard-layout'

export default function RecipientLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout requiredRole="RECIPIENT">{children}</DashboardLayout>
}
