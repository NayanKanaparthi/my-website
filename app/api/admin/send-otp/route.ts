import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { verifyPassword } from '@/lib/auth'
import { getAdminPasswordHash } from '@/lib/config'
import { generateOTP, storeOTP } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'

const ADMIN_EMAIL = 'kanaparthinayan@gmail.com'

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { oldPassword } = await request.json()

    if (!oldPassword) {
      return NextResponse.json({ error: 'Old password is required' }, { status: 400 })
    }

    // Verify old password
    const ADMIN_PASSWORD_HASH = getAdminPasswordHash()
    const isValid = await verifyPassword(oldPassword, ADMIN_PASSWORD_HASH)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid old password' }, { status: 401 })
    }

    // Generate and store OTP
    const otp = generateOTP()
    storeOTP(ADMIN_EMAIL, otp)

    // Send OTP email
    try {
      await sendOTPEmail(ADMIN_EMAIL, otp)
      return NextResponse.json({ success: true, message: 'OTP sent to your email' })
    } catch (emailError: any) {
      console.error('Error sending OTP email:', emailError)
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send OTP email. '
      const errorMsg = emailError?.message || ''
      
      if (errorMsg.includes('SMTP_PASS') || errorMsg.includes('not set')) {
        errorMessage += 'SMTP_PASS is not set in .env.local. Please add your Gmail App Password.'
      } else if (errorMsg.includes('Invalid login') || errorMsg.includes('BadCredentials') || errorMsg.includes('Username and Password not accepted')) {
        errorMessage += 'Gmail authentication failed. Please make sure you are using a Gmail App Password (not your regular password). Generate one at: https://myaccount.google.com/apppasswords'
      } else if (errorMsg.includes('Failed to connect') || errorMsg.includes('ECONNREFUSED')) {
        errorMessage += 'Could not connect to email server. Please check your SMTP_HOST and SMTP_PORT settings.'
      } else if (errorMsg) {
        errorMessage += errorMsg
      } else {
        errorMessage += 'Please check your SMTP settings in .env.local file.'
      }
      
      return NextResponse.json({ 
        error: errorMessage
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

