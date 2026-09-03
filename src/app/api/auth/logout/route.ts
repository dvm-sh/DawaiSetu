import { NextResponse } from 'next/server'
import { getSession, clearAuthCookie, deleteSession } from '@/lib/auth'
import { handleApiError } from '@/lib/api-response'

export async function POST() {
  try {
    const session = await getSession()
    if (session) {
      await deleteSession(session.token)
    }
    const response = NextResponse.json({ success: true })
    response.headers.set('Set-Cookie', clearAuthCookie()['Set-Cookie'])
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
