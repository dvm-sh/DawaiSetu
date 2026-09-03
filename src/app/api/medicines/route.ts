import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, requireApprovedOrg } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError, validationErrorResponse } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'
import { createNotification } from '@/lib/notifications'
import { runMatchingForMedicine } from '@/lib/matching'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const expiryCategory = searchParams.get('expiryCategory') || ''
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    // Role-based filtering
    if (session.user.role === 'DONOR') {
      where.organizationId = session.organization?.id
    } else if (session.user.role === 'RECIPIENT') {
      where.status = 'AVAILABLE'
      where.isPaused = false
      where.expiryDate = { gt: new Date() }
      where.organization = { status: 'APPROVED' }
    }
    // ADMIN sees all

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { brandName: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) where.category = category
    if (status && session.user.role !== 'RECIPIENT') where.status = status
    if (expiryCategory) where.expiryCategory = expiryCategory

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
              type: true,
            },
          },
          _count: {
            select: {
              transferItems: true,
              matches: true,
            },
          },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.medicine.count({ where }),
    ])

    return successResponse({
      medicines,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApprovedOrg()
    
    if (session.user.role !== 'DONOR') {
      return errorResponse('Only donors can add medicines', 403)
    }

    const body = await request.json()
    const errors: Record<string, string> = {}

    if (!body.name) errors.name = 'Medicine name is required'
    if (!body.category) errors.category = 'Category is required'
    if (!body.dosageForm) errors.dosageForm = 'Dosage form is required'
    if (!body.quantity || body.quantity <= 0) errors.quantity = 'Valid quantity is required'
    if (!body.expiryDate) errors.expiryDate = 'Expiry date is required'

    // Server-side expiry validation
    if (body.expiryDate) {
      const expiryDate = new Date(body.expiryDate)
      if (expiryDate <= new Date()) {
        errors.expiryDate = 'Cannot add expired medicine'
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    const expiryDate = new Date(body.expiryDate)
    const now = new Date()
    const daysRemaining = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    let expiryCategory: string
    if (daysRemaining <= 0) expiryCategory = 'EXPIRED'
    else if (daysRemaining < 30) expiryCategory = 'CRITICAL'
    else if (daysRemaining < 90) expiryCategory = 'HIGH_RISK'
    else if (daysRemaining < 180) expiryCategory = 'ATTENTION'
    else expiryCategory = 'HEALTHY'

    const medicine = await prisma.medicine.create({
      data: {
        organizationId: session.organization!.id,
        name: body.name,
        genericName: body.genericName || null,
        brandName: body.brandName || null,
        category: body.category,
        strength: body.strength || null,
        dosageForm: body.dosageForm,
        batchNumber: body.batchNumber || null,
        manufacturer: body.manufacturer || null,
        quantity: parseInt(body.quantity),
        unit: body.unit || 'units',
        originalQuantity: parseInt(body.quantity),
        manufacturingDate: body.manufacturingDate ? new Date(body.manufacturingDate) : null,
        expiryDate,
        daysRemaining,
        expiryCategory: expiryCategory as 'HEALTHY' | 'ATTENTION' | 'HIGH_RISK' | 'CRITICAL' | 'EXPIRED',
        storageRequirement: body.storageRequirement || 'ROOM_TEMPERATURE',
        prescriptionRequired: body.prescriptionRequired || false,
        barcode: body.barcode || null,
        location: body.location || session.organization!.city,
        notes: body.notes || null,
        estimatedValue: body.estimatedValue ? parseFloat(body.estimatedValue) : null,
        status: 'AVAILABLE',
      },
      include: { organization: true },
    })

    await createAuditLog({
      actorId: session.user.id,
      action: 'MEDICINE_CREATED',
      entityType: 'Medicine',
      entityId: medicine.id,
      metadata: { name: medicine.name, quantity: medicine.quantity },
    })

    // Run matching engine asynchronously
    try {
      await runMatchingForMedicine(medicine.id)
    } catch (e) {
      console.error('Matching engine error:', e)
    }

    return successResponse(medicine, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
