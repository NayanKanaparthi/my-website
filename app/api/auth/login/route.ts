import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken, checkBruteForce, recordFailedAttempt, clearAttempts } from '@/lib/auth'
import { getAdminPasswordHash } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    // Get password hash from config
    const ADMIN_PASSWORD_HASH = getAdminPasswordHash()
    
    const { password } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Check brute force protection
    const bruteForceCheck = await checkBruteForce(ip)
    if (!bruteForceCheck.allowed) {
      return NextResponse.json(
        { error: `Too many failed attempts. Please try again in ${bruteForceCheck.remainingTime} minutes.` },
        { status: 429 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH)

    if (!isValid) {
      recordFailedAttempt(ip)
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Clear failed attempts on successful login
    clearAttempts(ip)

    // Generate token
    const token = generateToken('admin')

    // Return JSON response with cookie set
    // Client will handle redirect after cookie is set
    const response = NextResponse.json({ success: true, redirect: '/admin' })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


