import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, handleApiError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'

    if (session.user.role === 'ADMIN') {
      return getAdminStats(type)
    } else if (session.user.role === 'DONOR') {
      return getDonorStats(session.organization!.id, type)
    } else {
      return getRecipientStats(session.organization!.id, type)
    }
  } catch (error) {
    return handleApiError(error)
  }
}

async function getAdminStats(type: string) {
  const [
    pendingOrgs, activeOrgs, activeMedicines, pendingTransfers,
    completedTransfers, expiredMedicines, totalRedistributed,
    totalOrgs, allTransfers, flaggedMedicines
  ] = await Promise.all([
    prisma.organization.count({ where: { status: 'PENDING' } }),
    prisma.organization.count({ where: { status: 'APPROVED' } }),
    prisma.medicine.count({ where: { status: 'AVAILABLE' } }),
    prisma.transfer.count({ where: { status: { in: ['REQUESTED', 'APPROVED', 'AWAITING_CONFIRMATION'] } } }),
    prisma.transfer.count({ where: { status: 'COMPLETED' } }),
    prisma.medicine.count({ where: { status: 'EXPIRED' } }),
    prisma.medicine.aggregate({ where: { status: 'DISTRIBUTED' }, _sum: { quantity: true } }),
    prisma.organization.count(),
    prisma.transfer.count(),
    prisma.medicine.count({ where: { flagReason: { not: null } } }),
  ])

  const valueRedistributed = await prisma.medicine.aggregate({
    where: { status: 'DISTRIBUTED' },
    _sum: { estimatedValue: true },
  })

  // Monthly stats for charts
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const monthlyTransfers = await prisma.transfer.groupBy({
    by: ['status'],
    _count: true,
    where: { createdAt: { gte: sixMonthsAgo } },
  })

  const categoryCounts = await prisma.medicine.groupBy({
    by: ['category'],
    _count: true,
    where: { status: { not: 'EXPIRED' } },
  })

  const expiryCounts = await prisma.medicine.groupBy({
    by: ['expiryCategory'],
    _count: true,
    where: { status: 'AVAILABLE' },
  })

  return successResponse({
    overview: {
      pendingOrgs,
      activeOrgs,
      totalOrgs,
      activeMedicines,
      pendingTransfers,
      completedTransfers,
      allTransfers,
      expiredMedicines,
      flaggedMedicines,
      totalRedistributed: totalRedistributed._sum.quantity || 0,
      valueRedistributed: valueRedistributed._sum.estimatedValue || 0,
    },
    charts: { monthlyTransfers, categoryCounts, expiryCounts },
  })
}

async function getDonorStats(orgId: string, type: string) {
  const [
    activeMedicines, totalDonated, pendingRequests, completedTransfers,
    expiringMedicines, totalQuantity
  ] = await Promise.all([
    prisma.medicine.count({ where: { organizationId: orgId, status: 'AVAILABLE' } }),
    prisma.medicine.count({ where: { organizationId: orgId, status: 'DISTRIBUTED' } }),
    prisma.transfer.count({ where: { donorOrgId: orgId, status: 'REQUESTED' } }),
    prisma.transfer.count({ where: { donorOrgId: orgId, status: 'COMPLETED' } }),
    prisma.medicine.count({
      where: { organizationId: orgId, status: 'AVAILABLE', expiryCategory: { in: ['CRITICAL', 'HIGH_RISK'] } },
    }),
    prisma.medicine.aggregate({ where: { organizationId: orgId }, _sum: { quantity: true } }),
  ])

  const totalValue = await prisma.medicine.aggregate({
    where: { organizationId: orgId, status: 'DISTRIBUTED' },
    _sum: { estimatedValue: true },
  })

  const recentActivity = await prisma.transfer.findMany({
    where: { donorOrgId: orgId },
    include: {
      recipientOrg: { select: { name: true } },
      items: { include: { medicine: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return successResponse({
    overview: {
      activeMedicines,
      totalDonated,
      pendingRequests,
      completedTransfers,
      expiringMedicines,
      totalQuantity: totalQuantity._sum.quantity || 0,
      totalValue: totalValue._sum.estimatedValue || 0,
    },
    recentActivity,
  })
}

async function getRecipientStats(orgId: string, type: string) {
  const [
    requestsSent, pendingTransfers, completedTransfers,
    activeRequirements, matchesFound
  ] = await Promise.all([
    prisma.transfer.count({ where: { recipientOrgId: orgId } }),
    prisma.transfer.count({ where: { recipientOrgId: orgId, status: { in: ['REQUESTED', 'APPROVED', 'IN_TRANSIT'] } } }),
    prisma.transfer.count({ where: { recipientOrgId: orgId, status: 'COMPLETED' } }),
    prisma.medicineRequirement.count({ where: { organizationId: orgId, status: 'ACTIVE' } }),
    prisma.match.count({ where: { recipientOrgId: orgId, isActive: true } }),
  ])

  const totalReceived = await prisma.medicine.aggregate({
    where: { transferItems: { some: { transfer: { recipientOrgId: orgId, status: 'COMPLETED' } } } },
    _sum: { quantity: true },
  })

  const totalValue = await prisma.medicine.aggregate({
    where: { transferItems: { some: { transfer: { recipientOrgId: orgId, status: 'COMPLETED' } } } },
    _sum: { estimatedValue: true },
  })

  const recentActivity = await prisma.transfer.findMany({
    where: { recipientOrgId: orgId },
    include: {
      donorOrg: { select: { name: true } },
      items: { include: { medicine: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return successResponse({
    overview: {
      requestsSent,
      pendingTransfers,
      completedTransfers,
      activeRequirements,
      matchesFound,
      totalReceived: totalReceived._sum.quantity || 0,
      totalValue: totalValue._sum.estimatedValue || 0,
    },
    recentActivity,
  })
}
