'use client'
import DashboardLayout from '@/components/layout/dashboard-layout'

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout requiredRole="DONOR">{children}</DashboardLayout>
}
