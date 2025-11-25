import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP, deleteOTP } from '@/lib/otp'
import { generateToken } from '@/lib/auth'

const ADMIN_EMAIL = 'kanaparthinayan@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const { otp } = await request.json()

    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 })
    }

    // Trim and ensure OTP is 6 digits
    const cleanOtp = otp.toString().trim().replace(/\D/g, '')
    
    if (cleanOtp.length !== 6) {
      return NextResponse.json({ error: 'OTP must be 6 digits' }, { status: 400 })
    }

    // Verify OTP
    const isValidOTP = verifyOTP(ADMIN_EMAIL, cleanOtp)
    if (!isValidOTP) {
      return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new OTP.' }, { status: 401 })
    }

    // Generate token
    const token = generateToken('admin')

    // Return JSON response with cookie set
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
    console.error('Login with OTP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

