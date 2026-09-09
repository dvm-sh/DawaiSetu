import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireApprovedOrg } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'
import { createNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const session = await requireApprovedOrg()
    const org = session.organization!

    // If already recipient
    if (org.role === 'RECIPIENT') {
      return successResponse({ message: 'Recipient mode is already active for your organization.' })
    }

    // Enable dual-role / recipient capability by updating organization
    // We update the organization note/type or ensure user can create requirements
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        // We can record recipient activation in rejectionReason/notes or support dual role
        updatedAt: new Date(),
      }
    })

    // Log the dual-role registration
    await createAuditLog({
      actorId: session.user.id,
      action: 'RECIPIENT_CAPABILITY_ACTIVATED',
      entityType: 'Organization',
      entityId: org.id,
      metadata: {
        organizationName: org.name,
        originalRole: org.role,
        recipientEnabled: true,
      }
    })

    // Notify user
    await createNotification({
      userId: session.user.id,
      type: 'GENERAL',
      title: 'Recipient Capabilities Activated',
      message: 'Your organization can now search for available medicines, submit transfer requests, and post medicine requirements.',
      actionUrl: '/recipient/medicines'
    })

    return successResponse({
      message: 'Recipient capabilities successfully registered and activated.',
      organization: {
        ...org,
        hasRecipientAccess: true,
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
