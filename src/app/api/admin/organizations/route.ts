import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'
import { createNotification } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(['ADMIN'])
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (status) where.status = status

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, createdAt: true } },
          documents: true,
          _count: { select: { medicines: true, donorTransfers: true, recipientTransfers: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.organization.count({ where }),
    ])

    return successResponse({ organizations, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth(['ADMIN'])
    const body = await request.json()
    const { organizationId, action: adminAction, reason } = body

    if (!organizationId) return errorResponse('Organization ID is required')

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { user: true },
    })
    if (!org) return errorResponse('Organization not found')

    if (adminAction === 'approve') {
      await prisma.organization.update({
        where: { id: organizationId },
        data: { status: 'APPROVED', rejectionReason: null },
      })

      await createNotification({
        userId: org.userId,
        type: 'ORG_APPROVED',
        title: 'Organization Approved!',
        message: `Your organization "${org.name}" has been approved. You can now use the platform.`,
        entityType: 'Organization',
        entityId: organizationId,
        actionUrl: org.role === 'DONOR' ? '/donor' : '/recipient',
      })

      await createAuditLog({
        actorId: session.user.id,
        action: 'ORGANIZATION_APPROVED',
        entityType: 'Organization',
        entityId: organizationId,
        metadata: { organizationName: org.name },
      })
    } else if (adminAction === 'reject') {
      if (!reason) return errorResponse('Rejection reason is required')

      await prisma.organization.update({
        where: { id: organizationId },
        data: { status: 'REJECTED', rejectionReason: reason },
      })

      await createNotification({
        userId: org.userId,
        type: 'ORG_REJECTED',
        title: 'Organization Rejected',
        message: `Your organization "${org.name}" has been rejected. Reason: ${reason}`,
        entityType: 'Organization',
        entityId: organizationId,
      })

      await createAuditLog({
        actorId: session.user.id,
        action: 'ORGANIZATION_REJECTED',
        entityType: 'Organization',
        entityId: organizationId,
        metadata: { organizationName: org.name, reason },
      })
    } else if (adminAction === 'suspend') {
      await prisma.organization.update({
        where: { id: organizationId },
        data: { status: 'SUSPENDED' },
      })

      await createAuditLog({
        actorId: session.user.id,
        action: 'ORGANIZATION_SUSPENDED',
        entityType: 'Organization',
        entityId: organizationId,
        metadata: { organizationName: org.name },
      })
    }

    return successResponse({ message: `Organization ${adminAction}ed successfully` })
  } catch (error) {
    return handleApiError(error)
  }
}
