import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me')

const PUBLIC_PATHS = ['/', '/login', '/register', '/about', '/how-it-works', '/contact', '/api/auth/login', '/api/auth/register', '/terms', '/faq', '/privacy']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check auth token
  const token = request.cookies.get('auth-token')?.value

  // Allow public paths (except auth pages for logged-in users)
  const isAuthPage = pathname === '/login' || pathname === '/register'
  if (PUBLIC_PATHS.some(p => pathname === p) || pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/api/auth/')) {
    if (isAuthPage && token) {
      // Don't return next() if they have a token and hit an auth page, fall through to token verification
    } else {
      return NextResponse.next()
    }
  }

  // Check auth token
  // const token = request.cookies.get('auth-token')?.value
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const role = payload.role as string
    const orgStatus = payload.organizationStatus as string

    // Handle rejected organizations
    if (orgStatus === 'REJECTED' && pathname !== '/fix-documents' && !pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/fix-documents', request.url))
    }

    // Role-based routing protection
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(role === 'DONOR' ? '/donor' : '/recipient', request.url))
    }
    if (pathname.startsWith('/donor') && role !== 'DONOR') {
      return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/recipient', request.url))
    }
    if (pathname.startsWith('/recipient') && role !== 'RECIPIENT') {
      return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/donor', request.url))
    }

    // Redirect logged in users away from auth pages
    if (isAuthPage) {
      const dashboard = role === 'ADMIN' ? '/admin' : role === 'DONOR' ? '/donor' : '/recipient'
      return NextResponse.redirect(new URL(dashboard, request.url))
    }

    return NextResponse.next()
  } catch {
    // Invalid token
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
