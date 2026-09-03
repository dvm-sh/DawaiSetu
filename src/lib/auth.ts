import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { $Enums } from '@prisma/client'

export type UserRole = $Enums.UserRole
export const UserRole = $Enums.UserRole

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me')
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  organizationId?: string
  organizationStatus?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(payload: JWTPayload): Promise<string> {
  const expiresIn = JWT_EXPIRES_IN
  let expirationTime = '7d'
  
  if (expiresIn.endsWith('d')) {
    expirationTime = expiresIn
  } else if (expiresIn.endsWith('h')) {
    expirationTime = expiresIn
  }

  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string, token: string) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })
}

export async function deleteSession(token: string) {
  await prisma.session.deleteMany({ where: { token } })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  
  const payload = await verifyToken(token)
  if (!payload) return null
  
  // Verify session exists in DB
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { include: { organization: true } } },
  })
  
  if (!session || session.expiresAt < new Date()) {
    if (session) await deleteSession(token)
    return null
  }
  
  return {
    user: session.user,
    organization: session.user.organization,
    token,
  }
}

export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await getSession()
  
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new Error('FORBIDDEN')
  }
  
  return session
}

export async function requireApprovedOrg() {
  const session = await requireAuth(['DONOR', 'RECIPIENT'])
  
  if (!session.organization || session.organization.status !== 'APPROVED') {
    throw new Error('ORGANIZATION_NOT_APPROVED')
  }
  
  return session
}

export function setAuthCookie(token: string) {
  return {
    'Set-Cookie': `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  }
}

export function clearAuthCookie() {
  return {
    'Set-Cookie': 'auth-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
  }
}
