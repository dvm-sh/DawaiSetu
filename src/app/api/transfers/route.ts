import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, requireApprovedOrg } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'
import { createNotification } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (session.user.role === 'DONOR') {
      where.donorOrgId = session.organization?.id
    } else if (session.user.role === 'RECIPIENT') {
      where.recipientOrgId = session.organization?.id
    }
    if (status) where.status = status

    const [transfers, total] = await Promise.all([
      prisma.transfer.findMany({
        where,
        include: {
          match: {
            include: {
              medicine: true,
            },
          },
          donorOrg: { select: { id: true, name: true, city: true, type: true } },
          recipientOrg: { select: { id: true, name: true, city: true, type: true } },
          items: { include: { medicine: true } },
          shipment: true,
          inspection: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transfer.count({ where }),
    ])

    return successResponse({ transfers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApprovedOrg()
    const body = await request.json()

    if (!body.matchId) return errorResponse('Match ID is required')

    const match = await prisma.match.findUnique({
      where: { id: body.matchId },
      include: {
        medicine: { include: { organization: true } },
        recipientOrg: { include: { user: true } },
        donorOrg: { include: { user: true } },
      },
    })

    if (!match) return errorResponse('Match not found')
    if (!match.isActive) return errorResponse('Match is no longer active')

    // Verify the requesting user is the recipient
    if (session.user.role === 'RECIPIENT' && match.recipientOrgId !== session.organization?.id) {
      return errorResponse('Not authorized', 403)
    }

    // Check medicine is still available
    if (match.medicine.status !== 'AVAILABLE') {
      return errorResponse('Medicine is no longer available')
    }

    // Check medicine isn't expired
    if (new Date(match.medicine.expiryDate) <= new Date()) {
      return errorResponse('Medicine has expired')
    }

    // Check if transfer already exists for this match
    const existingTransfer = await prisma.transfer.findUnique({ where: { matchId: match.id } })
    if (existingTransfer) return errorResponse('Transfer already exists for this match')

    const quantity = body.quantity || match.medicine.quantity

    const transfer = await prisma.transfer.create({
      data: {
        matchId: match.id,
        donorOrgId: match.donorOrgId,
        recipientOrgId: match.recipientOrgId,
        status: 'REQUESTED',
        totalValue: match.medicine.estimatedValue ? match.medicine.estimatedValue * quantity / match.medicine.quantity : null,
        items: {
          create: {
            medicineId: match.medicine.id,
            quantity,
          },
        },
      },
      include: {
        items: { include: { medicine: true } },
        donorOrg: true,
        recipientOrg: true,
      },
    })

    // Update medicine status
    await prisma.medicine.update({
      where: { id: match.medicine.id },
      data: { status: 'RESERVED' },
    })

    // Notify donor
    await createNotification({
      userId: match.donorOrg.user?.id || match.donorOrg.userId,
      type: 'MEDICINE_REQUEST_RECEIVED',
      title: 'New Medicine Request',
      message: `${match.recipientOrg.name} has requested ${match.medicine.name}`,
      entityType: 'Transfer',
      entityId: transfer.id,
      actionUrl: `/donor/transfers/${transfer.id}`,
    })

    await createAuditLog({
      actorId: session.user.id,
      action: 'TRANSFER_CREATED',
      entityType: 'Transfer',
      entityId: transfer.id,
      metadata: { medicineId: match.medicine.id, recipientOrgId: match.recipientOrgId },
    })

    return successResponse(transfer, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
