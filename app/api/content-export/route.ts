import { NextRequest, NextResponse } from 'next/server'
import {
  getWorkItems,
  getVentures,
  getProjects,
  getAboutContent,
  getHomeContent,
  getTalks,
  getExperiments,
} from '@/lib/content'

export const dynamic = 'force-dynamic'

// Temporary read-only export of publicly rendered content (no messages, no posts).
// Used once to snapshot live Redis content for a bulk update; removed afterwards.
const EXPORT_KEY = '73c3f3f3563a62a905c8972bf6b250e3a75908dc'

export async function GET(request: NextRequest) {
  const key = new URL(request.url).searchParams.get('key')
  if (key !== EXPORT_KEY) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const [work, ventures, projects, about, home, talks, experiments] = await Promise.all([
    getWorkItems(),
    getVentures(),
    getProjects(),
    getAboutContent(),
    getHomeContent(),
    getTalks(),
    getExperiments(),
  ])

  return NextResponse.json({ work, ventures, projects, about, home, talks, experiments })
}
