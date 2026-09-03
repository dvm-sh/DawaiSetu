import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, createToken, createSession, setAuthCookie } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse('Email and password are required')
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    })

    if (!user) {
      return errorResponse('Invalid email or password', 401)
    }

    if (!user.isActive) {
      return errorResponse('Your account has been deactivated', 403)
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return errorResponse('Invalid email or password', 401)
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization?.id,
      organizationStatus: user.organization?.status,
    })

    await createSession(user.id, token)

    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        organization: user.organization ? {
          id: user.organization.id,
          name: user.organization.name,
          status: user.organization.status,
          type: user.organization.type,
          role: user.organization.role,
        } : null,
      },
    }

    const response = NextResponse.json({ success: true, data: responseData })
    response.headers.set('Set-Cookie', setAuthCookie(token)['Set-Cookie'])
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
