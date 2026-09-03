import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireApprovedOrg } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError, validationErrorResponse } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'
import { runMatchingForRequirement } from '@/lib/matching'

export async function GET(request: NextRequest) {
  try {
    const session = await requireApprovedOrg()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = { organizationId: session.organization!.id }

    const [requirements, total] = await Promise.all([
      prisma.medicineRequirement.findMany({
        where,
        include: {
          matches: {
            where: { isActive: true },
            include: {
              medicine: { select: { id: true, name: true, quantity: true, expiryDate: true, status: true } },
              donorOrg: { select: { id: true, name: true, city: true } },
            },
            orderBy: { matchScore: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.medicineRequirement.count({ where }),
    ])

    return successResponse({ requirements, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApprovedOrg()
    if (session.user.role !== 'RECIPIENT') return errorResponse('Only recipients can create requirements', 403)

    const body = await request.json()
    const errors: Record<string, string> = {}
    if (!body.medicineName) errors.medicineName = 'Medicine name is required'
    if (!body.quantityNeeded || body.quantityNeeded <= 0) errors.quantityNeeded = 'Valid quantity is required'
    if (Object.keys(errors).length > 0) return validationErrorResponse(errors)

    const requirement = await prisma.medicineRequirement.create({
      data: {
        organizationId: session.organization!.id,
        medicineName: body.medicineName,
        genericName: body.genericName || null,
        category: body.category || null,
        dosageForm: body.dosageForm || null,
        strength: body.strength || null,
        quantityNeeded: parseInt(body.quantityNeeded),
        urgency: body.urgency || 'MEDIUM',
        notes: body.notes || null,
        prescriptionRequired: body.prescriptionRequired || null,
      },
    })

    await createAuditLog({
      actorId: session.user.id,
      action: 'REQUIREMENT_CREATED',
      entityType: 'MedicineRequirement',
      entityId: requirement.id,
      metadata: { medicineName: body.medicineName },
    })

    // Run matching
    try {
      await runMatchingForRequirement(requirement.id)
    } catch (e) {
      console.error('Matching engine error:', e)
    }

    return successResponse(requirement, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
