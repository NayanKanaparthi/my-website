// OTP storage with expiration - using file-based storage for persistence
import fs from 'fs'
import path from 'path'

interface OTPData {
  code: string
  expiresAt: number
  email: string
}

const otpStoreFile = path.join(process.cwd(), '.otp-store.json')

// OTP expires in 10 minutes
const OTP_EXPIRY = 10 * 60 * 1000

// In-memory cache with file backup
let otpStore = new Map<string, OTPData>()

// Load OTPs from file
function loadOTPsFromFile(): void {
  try {
    if (fs.existsSync(otpStoreFile)) {
      const data = fs.readFileSync(otpStoreFile, 'utf8')
      const parsed = JSON.parse(data)
      const now = Date.now()
      
      // Only load non-expired OTPs
      for (const [email, otpData] of Object.entries(parsed)) {
        const data = otpData as OTPData
        if (now < data.expiresAt) {
          otpStore.set(email, data)
        }
      }
    }
  } catch (error) {
    console.error('Error loading OTPs from file:', error)
  }
}

// Save OTPs to file
function saveOTPsToFile(): void {
  try {
    const data: Record<string, OTPData> = {}
    otpStore.forEach((otpData, email) => {
      data[email] = otpData
    })
    fs.writeFileSync(otpStoreFile, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving OTPs to file:', error)
  }
}

// Load on module load
loadOTPsFromFile()

export function generateOTP(): string {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeOTP(email: string, code: string): void {
  const expiresAt = Date.now() + OTP_EXPIRY
  const cleanCode = code.toString().trim()
  otpStore.set(email, { code: cleanCode, expiresAt, email })
  console.log(`[OTP] Stored OTP for email: ${email}, Code: ${cleanCode}, Expires at: ${new Date(expiresAt).toISOString()}`)
  
  // Save to file
  saveOTPsToFile()
  
  // Clean up expired OTPs periodically
  cleanupExpiredOTPs()
}

export function verifyOTP(email: string, code: string): boolean {
  // Reload from file in case of server restart/recompile
  loadOTPsFromFile()
  
  const otpData = otpStore.get(email)
  
  if (!otpData) {
    console.log(`[OTP] No OTP found for email: ${email}`)
    return false
  }
  
  // Check if expired
  if (Date.now() > otpData.expiresAt) {
    console.log(`[OTP] OTP expired for email: ${email}. Expired at: ${new Date(otpData.expiresAt).toISOString()}, Current: ${new Date().toISOString()}`)
    otpStore.delete(email)
    saveOTPsToFile()
    return false
  }
  
  // Verify code (trim and compare as strings)
  const storedCode = otpData.code.toString().trim()
  const providedCode = code.toString().trim()
  
  if (storedCode !== providedCode) {
    console.log(`[OTP] Code mismatch for email: ${email}. Stored: "${storedCode}", Provided: "${providedCode}"`)
    return false
  }
  
  // Delete OTP after successful verification
  otpStore.delete(email)
  saveOTPsToFile()
  console.log(`[OTP] Successfully verified OTP for email: ${email}`)
  return true
}

export function deleteOTP(email: string): void {
  otpStore.delete(email)
  saveOTPsToFile()
}

function cleanupExpiredOTPs(): void {
  const now = Date.now()
  let cleaned = false
  otpStore.forEach((data, email) => {
    if (now > data.expiresAt) {
      otpStore.delete(email)
      cleaned = true
    }
  })
  if (cleaned) {
    saveOTPsToFile()
  }
}
