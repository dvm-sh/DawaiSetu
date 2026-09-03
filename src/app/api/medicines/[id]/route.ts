import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError, notFoundResponse } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true, name: true, city: true, state: true, type: true, status: true,
          },
        },
        matches: {
          where: { isActive: true },
          include: {
            recipientOrg: { select: { id: true, name: true, city: true, type: true } },
            requirement: true,
          },
          orderBy: { matchScore: 'desc' },
        },
        transferItems: {
          include: {
            transfer: {
              include: {
                recipientOrg: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    })

    if (!medicine) return notFoundResponse('Medicine not found')

    // Authorization check
    if (session.user.role === 'DONOR' && medicine.organizationId !== session.organization?.id) {
      return errorResponse('Not authorized', 403)
    }

    if (session.user.role === 'RECIPIENT' && medicine.status !== 'AVAILABLE') {
      return errorResponse('Medicine is not available', 403)
    }

    return successResponse(medicine)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth(['DONOR', 'ADMIN'])
    const { id } = await params
    const body = await request.json()

    const medicine = await prisma.medicine.findUnique({ where: { id } })
    if (!medicine) return notFoundResponse('Medicine not found')

    if (session.user.role === 'DONOR' && medicine.organizationId !== session.organization?.id) {
      return errorResponse('Not authorized', 403)
    }

    // Prevent editing if in transit or completed
    if (['IN_TRANSIT', 'RECEIVED', 'DISTRIBUTED', 'COMPLETED'].includes(medicine.status)) {
      return errorResponse('Cannot edit medicine in current status')
    }

    // Recalculate expiry if date changed
    let expiryData = {}
    if (body.expiryDate) {
      const expiryDate = new Date(body.expiryDate)
      if (expiryDate <= new Date()) {
        return errorResponse('Cannot set expiry date in the past')
      }
      const daysRemaining = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      let expiryCategory: string
      if (daysRemaining < 30) expiryCategory = 'CRITICAL'
      else if (daysRemaining < 90) expiryCategory = 'HIGH_RISK'
      else if (daysRemaining < 180) expiryCategory = 'ATTENTION'
      else expiryCategory = 'HEALTHY'
      expiryData = { expiryDate, daysRemaining, expiryCategory }
    }

    const updated = await prisma.medicine.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.genericName !== undefined && { genericName: body.genericName }),
        ...(body.brandName !== undefined && { brandName: body.brandName }),
        ...(body.category && { category: body.category }),
        ...(body.strength !== undefined && { strength: body.strength }),
        ...(body.dosageForm && { dosageForm: body.dosageForm }),
        ...(body.batchNumber !== undefined && { batchNumber: body.batchNumber }),
        ...(body.manufacturer !== undefined && { manufacturer: body.manufacturer }),
        ...(body.quantity && { quantity: parseInt(body.quantity) }),
        ...(body.unit && { unit: body.unit }),
        ...(body.storageRequirement && { storageRequirement: body.storageRequirement }),
        ...(body.prescriptionRequired !== undefined && { prescriptionRequired: body.prescriptionRequired }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.estimatedValue !== undefined && { estimatedValue: body.estimatedValue ? parseFloat(body.estimatedValue) : null }),
        ...(body.isPaused !== undefined && { isPaused: body.isPaused }),
        ...(body.status && session.user.role === 'ADMIN' && { status: body.status }),
        ...(body.flagReason !== undefined && session.user.role === 'ADMIN' && { flagReason: body.flagReason }),
        ...(body.flagNote !== undefined && session.user.role === 'ADMIN' && { flagNote: body.flagNote }),
        ...expiryData,
      },
      include: { organization: true },
    })

    await createAuditLog({
      actorId: session.user.id,
      action: 'MEDICINE_UPDATED',
      entityType: 'Medicine',
      entityId: id,
      metadata: { changes: Object.keys(body) },
    })

    return successResponse(updated)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth(['DONOR', 'ADMIN'])
    const { id } = await params

    const medicine = await prisma.medicine.findUnique({ where: { id } })
    if (!medicine) return notFoundResponse('Medicine not found')

    if (session.user.role === 'DONOR' && medicine.organizationId !== session.organization?.id) {
      return errorResponse('Not authorized', 403)
    }

    if (['IN_TRANSIT', 'TRANSFER_PENDING'].includes(medicine.status)) {
      return errorResponse('Cannot delete medicine with active transfer')
    }

    await prisma.medicine.delete({ where: { id } })

    await createAuditLog({
      actorId: session.user.id,
      action: 'MEDICINE_DELETED',
      entityType: 'Medicine',
      entityId: id,
      metadata: { name: medicine.name },
    })

    return successResponse({ message: 'Medicine deleted' })
  } catch (error) {
    return handleApiError(error)
  }
}
