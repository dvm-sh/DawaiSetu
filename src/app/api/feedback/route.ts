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

    if (transferId) {
      const feedback = await prisma.feedback.findUnique({ where: { transferId } })
      return successResponse(feedback)
    }

    // Get aggregate stats
    const stats = await prisma.feedback.aggregate({
      _avg: { rating: true, deliveryExperience: true, medicineCondition: true },
      _count: true,
    })

    return successResponse(stats)
  } catch (error) {
    return handleApiError(error)
  }
}
