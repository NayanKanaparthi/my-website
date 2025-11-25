import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for login page entirely
  if (pathname === '/admin-login' || pathname.startsWith('/admin-login/')) {
    return NextResponse.next()
  }

  // Simple check: if accessing admin routes, ensure cookie exists
  // Actual token verification happens in the layout (Node.js runtime)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  const response = NextResponse.next()
  // Add pathname to headers so layout can check it
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: '/admin/:path*',
}
