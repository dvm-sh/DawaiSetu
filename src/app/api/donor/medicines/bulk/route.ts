import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireApprovedOrg } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'
import { getDaysRemaining, getExpiryCategory } from '@/lib/utils'
import { ExpiryCategory } from '@prisma/client'
import { runMatchingEngine } from '@/lib/matching'

export async function POST(req: NextRequest) {
  try {
    const session = await requireApprovedOrg()
    if (session.user.role !== 'DONOR') return errorResponse('Forbidden: Donors only', 403)

    const data = await req.json()
    const { medicines } = data

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return errorResponse('No medicines provided in bulk upload')
    }

    const createdMedicines = []
    
    // Process each medicine
    for (const med of medicines) {
      const manufacturingDate = med.manufacturingDate ? new Date(med.manufacturingDate) : null
      const expiryDate = new Date(med.expiryDate)
      
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      
      if (isNaN(expiryDate.getTime()) || expiryDate < now) {
        // Skip expired medicines
        continue;
      }
      
      const daysRemaining = getDaysRemaining(expiryDate)
      const expiryCategory = getExpiryCategory(daysRemaining).label.toUpperCase().replace(' ', '_') as ExpiryCategory

      const medicine = await prisma.medicine.create({
        data: {
          organizationId: session.organization!.id,
          name: med.name,
          genericName: med.genericName || null,
          brandName: med.brandName || null,
          category: med.category || 'OTHER',
          strength: med.strength || null,
          dosageForm: med.dosageForm || 'OTHER',
          batchNumber: med.batchNumber || null,
          manufacturer: med.manufacturer || null,
          quantity: parseInt(med.quantity),
          unit: med.unit || 'units',
          originalQuantity: parseInt(med.quantity),
          manufacturingDate,
          expiryDate,
          daysRemaining,
          expiryCategory,
          storageRequirement: med.storageRequirement || 'ROOM_TEMPERATURE',
          prescriptionRequired: Boolean(med.prescriptionRequired),
          location: med.location || session.organization!.city,
          estimatedValue: med.estimatedValue ? parseFloat(med.estimatedValue) : null,
          notes: med.notes || null,
          status: 'AVAILABLE',
        },
      })
      
      createdMedicines.push(medicine)
      
      // Run match asynchronously
      runMatchingEngine(medicine.id).catch(console.error)
    }

    return successResponse({ 
      message: `Successfully added ${createdMedicines.length} medicines.`,
      addedCount: createdMedicines.length 
    })
  } catch (error) {
    return handleApiError(error)
  }
}
