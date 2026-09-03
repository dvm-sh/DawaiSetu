import { prisma } from './db'

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
  metadata?: Record<string, unknown>
  ipAddress?: string
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        metadata: metadata || {},
        ipAddress,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}
