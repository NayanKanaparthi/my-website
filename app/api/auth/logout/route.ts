import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  // Delete cookie with same settings as when it was set
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  })
  return response
}


