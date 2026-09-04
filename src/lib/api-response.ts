import { NextResponse } from 'next/server'

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({ success: false, error: message }, { status: 401 })
}

export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json({ success: false, error: message }, { status: 403 })
}

export function notFoundResponse(message = 'Not found') {
  return NextResponse.json({ success: false, error: message }, { status: 404 })
}

export function validationErrorResponse(errors: Record<string, string>) {
  return NextResponse.json({ success: false, error: 'Validation failed', errors }, { status: 422 })
}

export function serverErrorResponse(message = 'Internal server error') {
  return NextResponse.json({ success: false, error: message }, { status: 500 })
}

export async function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') return unauthorizedResponse()
    if (error.message === 'FORBIDDEN') return forbiddenResponse()
    if (error.message === 'ORGANIZATION_NOT_APPROVED') {
      return forbiddenResponse('Your organization is not approved yet')
    }
    if ('code' in error && (error as { code: string }).code === 'P1001') {
      return serverErrorResponse('Cannot connect to database server. Please verify PostgreSQL is running.')
    }
    if (error.name === 'PrismaClientInitializationError') {
      if (error.message.includes("Can't reach database server")) {
        return serverErrorResponse('Database server unreachable. Please verify PostgreSQL is running and accessible.')
      }
      return serverErrorResponse('Database initialization error. Please verify your DATABASE_URL.')
    }
  }
  
  return serverErrorResponse()
}
