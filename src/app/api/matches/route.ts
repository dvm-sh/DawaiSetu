import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, handleApiError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const medicineId = searchParams.get('medicineId') || ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true }

    if (session.user.role === 'DONOR') {
      where.donorOrgId = session.organization?.id
    } else if (session.user.role === 'RECIPIENT') {
      where.recipientOrgId = session.organization?.id
    }
    if (medicineId) where.medicineId = medicineId

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          medicine: {
            select: { id: true, name: true, genericName: true, quantity: true, expiryDate: true, category: true, dosageForm: true, status: true, location: true, estimatedValue: true },
          },
          donorOrg: { select: { id: true, name: true, city: true, state: true, type: true } },
          recipientOrg: { select: { id: true, name: true, city: true, state: true, type: true } },
          requirement: true,
          transfer: { select: { id: true, status: true } },
        },
        orderBy: { matchScore: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.match.count({ where }),
    ])

    return successResponse({ matches, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return handleApiError(error)
  }
}
