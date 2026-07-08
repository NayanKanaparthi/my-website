// Seeds Upstash Redis with the committed content/*.json files during the Vercel build.
// Guarded by content/sync-version.json: it only writes when the committed version
// differs from the version stored in Redis, so admin-panel edits made after a sync
// are never clobbered by later deploys. To publish file content, bump the version.
import fs from 'fs'
import path from 'path'

const CONTENT_FILES = [
  'home.json',
  'about.json',
  'ventures.json',
  'projects.json',
  'work.json',
  'talks.json',
  'experiments.json',
]

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

if (!url || !token) {
  console.log('[content-sync] No Redis credentials in env — skipping (expected on local builds).')
  process.exit(0)
}

const { Redis } = await import('@upstash/redis')
const redis = new Redis({ url, token })

const versionPath = path.join(process.cwd(), 'content', 'sync-version.json')
if (!fs.existsSync(versionPath)) {
  console.log('[content-sync] No content/sync-version.json — skipping.')
  process.exit(0)
}

const { version } = JSON.parse(fs.readFileSync(versionPath, 'utf8'))
const deployedVersion = await redis.get('content:sync-version')

if (deployedVersion === version) {
  console.log(`[content-sync] Redis already at version "${version}" — nothing to do.`)
  process.exit(0)
}

console.log(`[content-sync] Syncing content to Redis: "${deployedVersion}" -> "${version}"`)

for (const filename of CONTENT_FILES) {
  const filePath = path.join(process.cwd(), 'content', filename)
  if (!fs.existsSync(filePath)) {
    console.log(`[content-sync]   ${filename}: not found, skipped`)
    continue
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  await redis.set(`content:${filename}`, JSON.stringify(data))
  console.log(`[content-sync]   ${filename}: synced`)
}

await redis.set('content:sync-version', version)
console.log('[content-sync] Done.')
