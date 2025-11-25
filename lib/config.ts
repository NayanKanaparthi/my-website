// Development config - in production, use environment variables
const DEV_PASSWORD_HASH = '$2a$10$9KQVl24BG3HuHkCFGgfm9eSSWPOBFhbkCpZJ5u7Idw0n.bm7Uw2Ay'

export function getAdminPasswordHash(): string {
  // Try environment variable first, fall back to dev hash
  const envHash = process.env.ADMIN_PASSWORD_HASH
  if (envHash && envHash.length > 50) {
    // Remove quotes if present
    return envHash.replace(/^["']|["']$/g, '')
  }
  return DEV_PASSWORD_HASH
}

export function getJwtSecret(): string {
  // Use a consistent secret - check env first, then use dev default
  const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
  return secret
}

