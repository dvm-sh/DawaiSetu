import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, handleApiError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId: session.user.id }
    if (unreadOnly) where.isRead = false

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
    ])

    return successResponse({ notifications, unreadCount, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()

    if (body.action === 'markAllRead') {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true },
      })
    } else if (body.notificationId) {
      await prisma.notification.update({
        where: { id: body.notificationId },
        data: { isRead: true },
      })
    }

    return successResponse({ message: 'Notifications updated' })
  } catch (error) {
    return handleApiError(error)
  }
}
