import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'ALL' // 'EXPIRED', 'DISPOSED', 'ALL'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (session.user.role === 'DONOR') {
      where.organizationId = session.organization?.id
    } else if (session.user.role === 'RECIPIENT') {
      where.organizationId = session.organization?.id
    }
    // Admin sees all

    const now = new Date()

    if (status === 'DISPOSED') {
      where.status = 'DISPOSED'
    } else if (status === 'EXPIRED') {
      where.OR = [
        { status: 'EXPIRED' },
        { expiryDate: { lte: now }, status: { not: 'DISPOSED' } },
        { daysRemaining: { lte: 0 }, status: { not: 'DISPOSED' } },
      ]
    } else {
      where.OR = [
        { status: { in: ['EXPIRED', 'DISPOSED'] } },
        { expiryDate: { lte: now } },
        { daysRemaining: { lte: 0 } },
      ]
    }

    const medicines = await prisma.medicine.findMany({
      where,
      include: {
        organization: {
          select: { id: true, name: true, city: true, state: true, type: true }
        }
      },
      orderBy: { expiryDate: 'asc' }
    })

    // Calculate aggregated metrics
    const pendingDisposal = medicines.filter(m => m.status !== 'DISPOSED')
    const completedDisposal = medicines.filter(m => m.status === 'DISPOSED')

    const stats = {
      quarantinedCount: pendingDisposal.length,
      quarantinedQuantity: pendingDisposal.reduce((acc, m) => acc + m.quantity, 0),
      disposedCount: completedDisposal.length,
      disposedQuantity: completedDisposal.reduce((acc, m) => acc + m.quantity, 0),
      complianceRate: '100%',
    }

    return successResponse({
      medicines,
      stats
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const { medicineIds, disposalMethod, wastePartner, notes } = body

    if (!Array.isArray(medicineIds) || medicineIds.length === 0) {
      return errorResponse('At least one medicine ID is required for disposal.')
    }

    // Verify ownership if not admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { id: { in: medicineIds } }
    if (session.user.role !== 'ADMIN') {
      where.organizationId = session.organization?.id
    }

    const medsToDispose = await prisma.medicine.findMany({
      where,
      include: { organization: true }
    })

    if (medsToDispose.length === 0) {
      return errorResponse('No matching medicines found for disposal request.')
    }

    const method = disposalMethod || 'High Temperature Incineration (1100°C)'
    const facility = wastePartner || 'State Authorized Common Bio-medical Waste Treatment Facility (CBWTF)'
    const manifestNumber = `DS-BMW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`

    // Update status of medicines
    await prisma.medicine.updateMany({
      where: { id: { in: medsToDispose.map(m => m.id) } },
      data: {
        status: 'DISPOSED',
        flagReason: 'EXPIRED_MEDICINE',
        notes: `Disposed under Manifest ${manifestNumber} via ${facility} (${method}). ${notes || ''}`.trim()
      }
    })

    // Audit trail
    await createAuditLog({
      actorId: session.user.id,
      action: 'MEDICINE_DISPOSED',
      entityType: 'Medicine',
      metadata: {
        manifestNumber,
        count: medsToDispose.length,
        facility,
        method,
        medicineNames: medsToDispose.map(m => m.name),
      }
    })

    const certificate = {
      manifestNumber,
      issuedAt: new Date().toISOString(),
      authorizedBy: session.organization?.name || session.user.email,
      disposalFacility: facility,
      destructionMethod: method,
      complianceStandard: 'Biomedical Waste Management Rules & CDSCO Guidelines',
      totalItems: medsToDispose.length,
      totalUnits: medsToDispose.reduce((acc, m) => acc + m.quantity, 0),
      items: medsToDispose.map(m => ({
        id: m.id,
        name: m.name,
        batchNumber: m.batchNumber || 'N/A',
        quantity: m.quantity,
        unit: m.unit,
        expiryDate: m.expiryDate,
      }))
    }

    return successResponse({
      message: `Successfully generated disposal manifest for ${medsToDispose.length} medicine batch(es).`,
      certificate
    }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
