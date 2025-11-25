import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { hashPassword } from '@/lib/auth'
import { verifyOTP } from '@/lib/otp'
import fs from 'fs'
import path from 'path'

const ADMIN_EMAIL = 'kanaparthinayan@gmail.com'

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { newPassword, confirmPassword, otp } = await request.json()

    // Validate inputs
    if (!newPassword || !confirmPassword || !otp) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 })
    }

    // Check password length
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // Verify OTP
    const isValidOTP = verifyOTP(ADMIN_EMAIL, otp)
    if (!isValidOTP) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password hash in config
    // We'll update the .env.local file or config file
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = ''
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }

    // Update or add ADMIN_PASSWORD_HASH
    // Handle both quoted and unquoted formats
    if (envContent.includes('ADMIN_PASSWORD_HASH=')) {
      envContent = envContent.replace(
        /ADMIN_PASSWORD_HASH=.*/,
        `ADMIN_PASSWORD_HASH="${newPasswordHash}"`
      )
    } else {
      envContent += `\nADMIN_PASSWORD_HASH="${newPasswordHash}"\n`
    }

    fs.writeFileSync(envPath, envContent, 'utf8')

    // Also update lib/config.ts for development fallback
    const configPath = path.join(process.cwd(), 'lib', 'config.ts')
    let configContent = fs.readFileSync(configPath, 'utf8')
    // Escape single quotes in the hash for the string literal
    const escapedHash = newPasswordHash.replace(/'/g, "\\'")
    configContent = configContent.replace(
      /const DEV_PASSWORD_HASH = '.*'/,
      `const DEV_PASSWORD_HASH = '${escapedHash}'`
    )
    fs.writeFileSync(configPath, configContent, 'utf8')

    return NextResponse.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

