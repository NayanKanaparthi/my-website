import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

import { getJwtSecret } from './config'

const JWT_SECRET = getJwtSecret()

// Brute force protection
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const secret = getJwtSecret()
    const decoded = jwt.verify(token, secret) as { userId: string }
    return decoded
  } catch (error: any) {
    console.error('Token verification failed:', error.message)
    return null
  }
}

export async function checkBruteForce(ip: string): Promise<{ allowed: boolean; remainingTime?: number }> {
  const attempt = loginAttempts.get(ip)
  
  if (!attempt) {
    return { allowed: true }
  }

  const timeSinceLastAttempt = Date.now() - attempt.lastAttempt

  if (attempt.count >= MAX_ATTEMPTS) {
    if (timeSinceLastAttempt < LOCKOUT_DURATION) {
      return {
        allowed: false,
        remainingTime: Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60),
      }
    } else {
      // Reset after lockout duration
      loginAttempts.delete(ip)
      return { allowed: true }
    }
  }

  return { allowed: true }
}

export function recordFailedAttempt(ip: string): void {
  const attempt = loginAttempts.get(ip)
  
  if (attempt) {
    attempt.count += 1
    attempt.lastAttempt = Date.now()
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() })
  }
}

export function clearAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) {
    return false
  }

  const decoded = verifyToken(token)
  return decoded !== null
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value || null
}


