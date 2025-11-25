import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import {
  getWorkItems,
  getVentures,
  getProjects,
  getAboutContent,
  getHomeContent,
  saveWorkItems,
  saveVentures,
  saveProjects,
  saveAboutContent,
  saveHomeContent,
} from '@/lib/content'

export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    switch (type) {
      case 'work':
        return NextResponse.json({ data: getWorkItems() })
      case 'ventures':
        return NextResponse.json({ data: getVentures() })
      case 'projects':
        return NextResponse.json({ data: getProjects() })
      case 'about':
        return NextResponse.json({ data: getAboutContent() })
      case 'home':
        return NextResponse.json({ data: getHomeContent() })
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { type, data } = await request.json()

    switch (type) {
      case 'work':
        saveWorkItems(data)
        break
      case 'ventures':
        saveVentures(data)
        break
      case 'projects':
        saveProjects(data)
        break
      case 'about':
        saveAboutContent(data)
        break
      case 'home':
        saveHomeContent(data)
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}


