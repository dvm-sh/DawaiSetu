import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { successResponse, handleApiError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    await requireAuth(['ADMIN'])
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const entityType = searchParams.get('entityType') || ''
    const action = searchParams.get('action') || ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (entityType) where.entityType = entityType
    if (action) where.action = { contains: action, mode: 'insensitive' }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          actor: { select: { id: true, email: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ])

    return successResponse({ logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return handleApiError(error)
  }
}
