import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    if (!session.organization) {
      return errorResponse('No organization found', 404)
    }

    const body = await request.json()
    
    // Allow updating status to PENDING (for rejected orgs submitting docs)
    // and basic info updates
    const updateData: any = {}
    
    if (body.status === 'PENDING' && session.organization.status === 'REJECTED') {
      updateData.status = 'PENDING'
      
      // Notify admins of re-submission
      const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } })
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            type: 'GENERAL',
            title: 'Organization Re-submitted',
            message: `${session.organization.name} has re-submitted documents for verification.`,
            entityType: 'Organization',
            entityId: session.organization.id,
            actionUrl: '/admin/organizations',
          },
        })
      }
    }

    // Handle profile updates
    if (body.contactPerson) updateData.contactPerson = body.contactPerson
    if (body.phone) updateData.phone = body.phone
    if (body.address) updateData.address = body.address
    if (body.city) updateData.city = body.city
    if (body.state) updateData.state = body.state
    if (body.pincode) updateData.pincode = body.pincode
    if (body.website !== undefined) updateData.website = body.website

    if (Object.keys(updateData).length === 0) {
      return successResponse({ message: 'No changes provided' })
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: session.organization.id },
      data: updateData
    })

    return successResponse({ message: 'Organization updated successfully', organization: updatedOrg })
  } catch (error) {
    return handleApiError(error)
  }
}
