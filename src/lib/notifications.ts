import { prisma } from './db'
import { NotificationType } from '@prisma/client'

export async function createNotification({
  userId,
  type,
  title,
  message,
  entityType,
  entityId,
  actionUrl,
}: {
  userId: string
  type: NotificationType
  title: string
  message: string
  entityType?: string
  entityId?: string
  actionUrl?: string
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        entityType,
        entityId,
        actionUrl,
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function notifyAdmins(params: Omit<Parameters<typeof createNotification>[0], 'userId'>) {
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN', isActive: true } })
  await Promise.all(admins.map(admin => createNotification({ ...params, userId: admin.id })))
}
