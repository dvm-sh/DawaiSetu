import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDaysRemaining(expiryDate: Date | string): number {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diff = expiry.getTime() - now.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getExpiryCategory(daysRemaining: number): {
  label: string
  color: string
  bgColor: string
} {
  if (daysRemaining <= 0) return { label: 'Expired', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' }
  if (daysRemaining < 30) return { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' }
  if (daysRemaining < 90) return { label: 'High Risk', color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200' }
  if (daysRemaining < 180) return { label: 'Attention', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200' }
  return { label: 'Healthy', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200' }
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    SUSPENDED: 'bg-gray-50 text-gray-700 border-gray-200',
    AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    RESERVED: 'bg-blue-50 text-blue-700 border-blue-200',
    MATCHED: 'bg-purple-50 text-purple-700 border-purple-200',
    TRANSFER_PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    IN_TRANSIT: 'bg-blue-50 text-blue-700 border-blue-200',
    RECEIVED: 'bg-teal-50 text-teal-700 border-teal-200',
    DISTRIBUTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    EXPIRED: 'bg-red-50 text-red-700 border-red-200',
    DISPOSED: 'bg-gray-50 text-gray-700 border-gray-200',
    PAUSED: 'bg-gray-50 text-gray-700 border-gray-200',
    REQUESTED: 'bg-amber-50 text-amber-700 border-amber-200',
    AWAITING_CONFIRMATION: 'bg-blue-50 text-blue-700 border-blue-200',
    READY_FOR_PICKUP: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    DELIVERED: 'bg-teal-50 text-teal-700 border-teal-200',
    UNDER_INSPECTION: 'bg-purple-50 text-purple-700 border-purple-200',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-gray-50 text-gray-700 border-gray-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PARTIALLY_FULFILLED: 'bg-blue-50 text-blue-700 border-blue-200',
    FULFILLED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getMatchScoreLabel(score: number): {
  label: string
  color: string
} {
  if (score >= 85) return { label: 'Excellent', color: 'text-emerald-600' }
  if (score >= 70) return { label: 'Good', color: 'text-blue-600' }
  if (score >= 50) return { label: 'Fair', color: 'text-amber-600' }
  return { label: 'Low', color: 'text-gray-500' }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const MEDICINE_CATEGORIES = [
  { value: 'ANTIBIOTIC', label: 'Antibiotic' },
  { value: 'ANALGESIC', label: 'Analgesic / Painkiller' },
  { value: 'ANTIVIRAL', label: 'Antiviral' },
  { value: 'ANTIFUNGAL', label: 'Antifungal' },
  { value: 'CARDIOVASCULAR', label: 'Cardiovascular' },
  { value: 'RESPIRATORY', label: 'Respiratory' },
  { value: 'GASTROINTESTINAL', label: 'Gastrointestinal' },
  { value: 'ENDOCRINE', label: 'Endocrine' },
  { value: 'NEUROLOGICAL', label: 'Neurological' },
  { value: 'DERMATOLOGICAL', label: 'Dermatological' },
  { value: 'OPHTHALMIC', label: 'Ophthalmic' },
  { value: 'IMMUNOLOGICAL', label: 'Immunological' },
  { value: 'ONCOLOGICAL', label: 'Oncological' },
  { value: 'PSYCHIATRIC', label: 'Psychiatric' },
  { value: 'VITAMIN_SUPPLEMENT', label: 'Vitamin / Supplement' },
  { value: 'FIRST_AID', label: 'First Aid' },
  { value: 'SURGICAL', label: 'Surgical' },
  { value: 'DIAGNOSTIC', label: 'Diagnostic' },
  { value: 'OTHER', label: 'Other' },
]

export const DOSAGE_FORMS = [
  { value: 'TABLET', label: 'Tablet' },
  { value: 'CAPSULE', label: 'Capsule' },
  { value: 'SYRUP', label: 'Syrup' },
  { value: 'INJECTION', label: 'Injection' },
  { value: 'CREAM', label: 'Cream' },
  { value: 'OINTMENT', label: 'Ointment' },
  { value: 'GEL', label: 'Gel' },
  { value: 'DROPS', label: 'Drops' },
  { value: 'INHALER', label: 'Inhaler' },
  { value: 'POWDER', label: 'Powder' },
  { value: 'SUSPENSION', label: 'Suspension' },
  { value: 'SUPPOSITORY', label: 'Suppository' },
  { value: 'PATCH', label: 'Patch' },
  { value: 'SPRAY', label: 'Spray' },
  { value: 'SOLUTION', label: 'Solution' },
  { value: 'OTHER', label: 'Other' },
]

export const STORAGE_REQUIREMENTS = [
  { value: 'ROOM_TEMPERATURE', label: 'Room Temperature' },
  { value: 'REFRIGERATED', label: 'Refrigerated (2-8°C)' },
  { value: 'FROZEN', label: 'Frozen (-20°C)' },
  { value: 'COOL_DRY_PLACE', label: 'Cool & Dry Place' },
  { value: 'PROTECT_FROM_LIGHT', label: 'Protect from Light' },
  { value: 'OTHER', label: 'Other' },
]

export const ORG_TYPES = [
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'NGO', label: 'NGO' },
  { value: 'CLINIC', label: 'Clinic' },
  { value: 'HEALTH_ORGANIZATION', label: 'Health Organization' },
  { value: 'OTHER', label: 'Other' },
]
