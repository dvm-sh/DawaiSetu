import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'
import { createNotification } from '@/lib/notifications'

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth(['ADMIN'])
    const body = await request.json()
    const { documentId, status, rejectionReason } = body

    if (!documentId) return errorResponse('Document ID is required')
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return errorResponse('Status must be APPROVED or REJECTED')
    }
    if (status === 'REJECTED' && !rejectionReason) {
      return errorResponse('Rejection reason is required when rejecting a document')
    }

    const doc = await prisma.organizationDocument.findUnique({
      where: { id: documentId },
      include: {
        organization: {
          include: { user: true }
        }
      }
    })

    if (!doc) return errorResponse('Organization document not found')

    const updatedDoc = await prisma.organizationDocument.update({
      where: { id: documentId },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null
      }
    })

    // Log the verification action
    await createAuditLog({
      actorId: session.user.id,
      action: status === 'APPROVED' ? 'DOCUMENT_APPROVED' : 'DOCUMENT_REJECTED',
      entityType: 'OrganizationDocument',
      entityId: documentId,
      metadata: {
        documentName: doc.name,
        organizationName: doc.organization.name,
        rejectionReason
      }
    })

    // Notify organization
    await createNotification({
      userId: doc.organization.userId,
      type: status === 'APPROVED' ? 'ORG_APPROVED' : 'ORG_REJECTED',
      title: status === 'APPROVED' ? `Document Verified: ${doc.name}` : `Document Rejected: ${doc.name}`,
      message: status === 'APPROVED'
        ? `Your document "${doc.name}" has been verified by the compliance committee.`
        : `Your document "${doc.name}" was rejected. Reason: ${rejectionReason}`,
      entityType: 'OrganizationDocument',
      entityId: documentId,
      actionUrl: '/donor/profile'
    })

    // Check if all documents are approved and potentially update organization
    const allDocs = await prisma.organizationDocument.findMany({
      where: { organizationId: doc.organizationId }
    })

    const allApproved = allDocs.length > 0 && allDocs.every(d => d.status === 'APPROVED')
    const anyRejected = allDocs.some(d => d.status === 'REJECTED')

    return successResponse({
      document: updatedDoc,
      summary: {
        total: allDocs.length,
        approved: allDocs.filter(d => d.status === 'APPROVED').length,
        allApproved,
        anyRejected
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
