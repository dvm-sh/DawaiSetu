import { getSession } from '@/lib/auth'
import { successResponse, unauthorizedResponse, handleApiError } from '@/lib/api-response'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return unauthorizedResponse()

    return successResponse({
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      isActive: session.user.isActive,
      organization: session.organization ? {
        id: session.organization.id,
        name: session.organization.name,
        status: session.organization.status,
        type: session.organization.type,
        role: session.organization.role,
      } : null,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
