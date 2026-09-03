import { prisma } from './db'
import { Prisma } from '@prisma/client'

export async function createAuditLog({
  actorId,
  action,
  entityType,
  entityId,
  metadata,
  ipAddress,
}: {
  actorId?: string
  action: string
  entityType: string
  entityId?: string
  metadata?: Record<string, any> | null
  ipAddress?: string
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        metadata: metadata ?? Prisma.NullableJsonNullValueInput.DbNull,
        ipAddress,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}
