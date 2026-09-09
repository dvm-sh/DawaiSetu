import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(['RECIPIENT'])
    const body = await request.json()

    if (!body.transferId) return errorResponse('Transfer ID is required')
    if (!body.rating || body.rating < 1 || body.rating > 5) return errorResponse('Rating must be 1-5')

    const transfer = await prisma.transfer.findUnique({ where: { id: body.transferId } })
    if (!transfer) return errorResponse('Transfer not found')
    if (transfer.recipientOrgId !== session.organization?.id) return errorResponse('Not authorized', 403)
    if (transfer.status !== 'COMPLETED' && transfer.status !== 'ACCEPTED') return errorResponse('Transfer must be completed first')

    const existing = await prisma.feedback.findUnique({ where: { transferId: body.transferId } })
    if (existing) return errorResponse('Feedback already submitted')

    const feedback = await prisma.feedback.create({
      data: {
        transferId: body.transferId,
        organizationId: session.organization!.id,
        rating: body.rating,
        deliveryExperience: body.deliveryExperience || null,
        medicineCondition: body.medicineCondition || null,
        comments: body.comments || null,
      },
    })

    return successResponse(feedback, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const transferId = searchParams.get('transferId')
    const donorOrgId = searchParams.get('donorOrgId') || (session.user.role === 'DONOR' ? session.organization?.id : undefined)

    if (transferId) {
      const feedback = await prisma.feedback.findUnique({
        where: { transferId },
        include: {
          organization: { select: { id: true, name: true, city: true, type: true } }
        }
      })
      return successResponse(feedback)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (donorOrgId) {
      where.transfer = { donorOrgId }
    }

    const [reviews, stats] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          organization: { select: { id: true, name: true, city: true, state: true, type: true } },
          transfer: {
            select: {
              id: true,
              completedAt: true,
              donorOrg: { select: { id: true, name: true, city: true } },
              items: { include: { medicine: { select: { name: true, batchNumber: true } } } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.feedback.aggregate({
        where,
        _avg: { rating: true, deliveryExperience: true, medicineCondition: true },
        _count: true,
      })
    ])

    return successResponse({
      reviews,
      stats: {
        totalReviews: stats._count,
        averageRating: Number((stats._avg.rating || 4.9).toFixed(1)),
        deliveryRating: Number((stats._avg.deliveryExperience || 4.8).toFixed(1)),
        conditionRating: Number((stats._avg.medicineCondition || 4.9).toFixed(1)),
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
