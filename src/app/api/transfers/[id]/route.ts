import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError, notFoundResponse } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'
import { createNotification } from '@/lib/notifications'

const VALID_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['AWAITING_CONFIRMATION', 'CANCELLED'],
  AWAITING_CONFIRMATION: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED'],
  DELIVERED: ['UNDER_INSPECTION'],
  UNDER_INSPECTION: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['COMPLETED'],
  REJECTED: [],
  CANCELLED: [],
  COMPLETED: [],
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        match: { include: { medicine: true, requirement: true } },
        donorOrg: { select: { id: true, name: true, city: true, state: true, type: true, address: true, contactPerson: true, phone: true } },
        recipientOrg: { select: { id: true, name: true, city: true, state: true, type: true, address: true, contactPerson: true, phone: true } },
        items: { include: { medicine: true } },
        shipment: true,
        inspection: true,
        feedback: true,
      },
    })

    if (!transfer) return notFoundResponse('Transfer not found')

    // Authorization
    if (session.user.role === 'DONOR' && transfer.donorOrgId !== session.organization?.id) {
      return errorResponse('Not authorized', 403)
    }
    if (session.user.role === 'RECIPIENT' && transfer.recipientOrgId !== session.organization?.id) {
      return errorResponse('Not authorized', 403)
    }

    return successResponse(transfer)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth()
    const { id } = await params
    const body = await request.json()

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        items: { include: { medicine: true } },
        donorOrg: { include: { user: true } },
        recipientOrg: { include: { user: true } },
        match: { include: { medicine: true } },
      },
    })

    if (!transfer) return notFoundResponse('Transfer not found')

    const { action } = body

    // Validate state transition
    if (action === 'updateStatus') {
      const newStatus = body.status
      if (!VALID_TRANSITIONS[transfer.status]?.includes(newStatus)) {
        return errorResponse(`Cannot transition from ${transfer.status} to ${newStatus}`)
      }

      // Authorization for specific transitions
      if (['APPROVED', 'REJECTED'].includes(newStatus) && transfer.status === 'REQUESTED') {
        if (session.user.role !== 'DONOR' || transfer.donorOrgId !== session.organization?.id) {
          if (session.user.role !== 'ADMIN') return errorResponse('Only the donor can approve/reject requests', 403)
        }
      }

      const updateData: Record<string, unknown> = { status: newStatus }
      
      if (newStatus === 'APPROVED') updateData.approvedAt = new Date()
      if (newStatus === 'AWAITING_CONFIRMATION') updateData.confirmedAt = new Date()
      if (newStatus === 'READY_FOR_PICKUP') updateData.readyAt = new Date()
      if (newStatus === 'IN_TRANSIT') updateData.inTransitAt = new Date()
      if (newStatus === 'DELIVERED') updateData.deliveredAt = new Date()
      if (newStatus === 'COMPLETED') updateData.completedAt = new Date()
      if (newStatus === 'CANCELLED') {
        updateData.cancelledAt = new Date()
        updateData.cancellationReason = body.reason || null
      }
      if (newStatus === 'REJECTED' && transfer.status === 'REQUESTED') {
        updateData.cancellationReason = body.reason || 'Request rejected'
      }

      const updated = await prisma.transfer.update({
        where: { id },
        data: updateData,
        include: { items: { include: { medicine: true } }, donorOrg: true, recipientOrg: true },
      })

      // Update medicine status based on transfer status
      for (const item of transfer.items) {
        if (newStatus === 'APPROVED') {
          await prisma.medicine.update({ where: { id: item.medicineId }, data: { status: 'TRANSFER_PENDING' } })
        } else if (newStatus === 'IN_TRANSIT') {
          await prisma.medicine.update({ where: { id: item.medicineId }, data: { status: 'IN_TRANSIT' } })
        } else if (newStatus === 'DELIVERED' || newStatus === 'UNDER_INSPECTION') {
          await prisma.medicine.update({ where: { id: item.medicineId }, data: { status: 'RECEIVED' } })
        } else if (newStatus === 'COMPLETED') {
          await prisma.medicine.update({ where: { id: item.medicineId }, data: { status: 'DISTRIBUTED' } })
        } else if (newStatus === 'CANCELLED' || (newStatus === 'REJECTED' && transfer.status === 'REQUESTED')) {
          await prisma.medicine.update({ where: { id: item.medicineId }, data: { status: 'AVAILABLE' } })
        }
      }

      // Notifications
      const notifyUserId = session.user.role === 'DONOR' ? transfer.recipientOrg.user?.id || transfer.recipientOrg.userId : transfer.donorOrg.user?.id || transfer.donorOrg.userId
      if (notifyUserId) {
        await createNotification({
          userId: notifyUserId,
          type: 'TRANSFER_STATUS_CHANGED',
          title: `Transfer ${newStatus.replace(/_/g, ' ').toLowerCase()}`,
          message: `Transfer #${id.slice(-6)} has been updated to ${newStatus.replace(/_/g, ' ').toLowerCase()}`,
          entityType: 'Transfer',
          entityId: id,
          actionUrl: session.user.role === 'DONOR' ? `/recipient/transfers/${id}` : `/donor/transfers/${id}`,
        })
      }

      await createAuditLog({
        actorId: session.user.id,
        action: `TRANSFER_${newStatus}`,
        entityType: 'Transfer',
        entityId: id,
        metadata: { previousStatus: transfer.status, newStatus, reason: body.reason },
      })

      return successResponse(updated)
    }

    // Handle shipment creation
    if (action === 'createShipment') {
      const shipment = await prisma.shipment.create({
        data: {
          transferId: id,
          method: body.method || 'PICKUP',
          carrier: body.carrier || null,
          trackingNumber: body.trackingNumber || null,
          pickupAddress: body.pickupAddress || `${transfer.donorOrg.address}, ${transfer.donorOrg.city}`,
          deliveryAddress: body.deliveryAddress || `${transfer.recipientOrg.address}, ${transfer.recipientOrg.city}`,
          pickupDate: body.pickupDate ? new Date(body.pickupDate) : null,
          expectedDelivery: body.expectedDelivery ? new Date(body.expectedDelivery) : null,
          notes: body.notes || null,
        },
      })
      return successResponse(shipment, 201)
    }

    // Handle inspection
    if (action === 'createInspection') {
      if (session.user.role !== 'RECIPIENT' && session.user.role !== 'ADMIN') {
        return errorResponse('Only recipients can inspect', 403)
      }

      const inspection = await prisma.inspection.create({
        data: {
          transferId: id,
          packagingCondition: body.packagingCondition || null,
          temperatureOk: body.temperatureOk ?? true,
          quantityVerified: body.quantityVerified ?? true,
          expiryVerified: body.expiryVerified ?? true,
          isAccepted: body.isAccepted,
          rejectionReason: body.isAccepted ? null : body.rejectionReason,
          notes: body.notes || null,
        },
      })

      // Update transfer status
      const newStatus = body.isAccepted ? 'ACCEPTED' : 'REJECTED'
      await prisma.transfer.update({
        where: { id },
        data: { status: newStatus, inspectedAt: new Date() },
      })

      // Update medicine status
      for (const item of transfer.items) {
        if (!body.isAccepted) {
          await prisma.medicine.update({ where: { id: item.medicineId }, data: { status: 'REJECTED' } })
        }
      }

      // Notify donor
      await createNotification({
        userId: transfer.donorOrg.user?.id || transfer.donorOrg.userId,
        type: body.isAccepted ? 'TRANSFER_COMPLETED' : 'TRANSFER_STATUS_CHANGED',
        title: body.isAccepted ? 'Transfer Accepted' : 'Transfer Rejected',
        message: body.isAccepted
          ? `${transfer.recipientOrg.name} has accepted the medicine delivery`
          : `${transfer.recipientOrg.name} has rejected the delivery: ${body.rejectionReason}`,
        entityType: 'Transfer',
        entityId: id,
        actionUrl: `/donor/transfers/${id}`,
      })

      await createAuditLog({
        actorId: session.user.id,
        action: body.isAccepted ? 'INSPECTION_ACCEPTED' : 'INSPECTION_REJECTED',
        entityType: 'Transfer',
        entityId: id,
        metadata: { isAccepted: body.isAccepted, rejectionReason: body.rejectionReason },
      })

      return successResponse(inspection, 201)
    }

    return errorResponse('Invalid action')
  } catch (error) {
    return handleApiError(error)
  }
}
