import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { isAuthenticated } from '@/lib/auth'
import { put } from '@vercel/blob'

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file type
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'
    
    if (!isImage && !isPdf) {
      return NextResponse.json({ error: 'File must be an image or PDF' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${originalName}`

    // Use Vercel Blob Storage in production, file system in development
    if (isProduction) {
      try {
        // Upload to Vercel Blob Storage
        const blob = await put(`uploads/${filename}`, buffer, {
          access: 'public',
          contentType: file.type,
        })
        
        return NextResponse.json({ url: blob.url, success: true })
      } catch (blobError) {
        console.error('Blob upload error:', blobError)
        // If BLOB_READ_WRITE_TOKEN is not set, provide helpful error
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error(
            'Vercel Blob Storage is not configured. Please add Blob storage in your Vercel project. ' +
            'Go to your Vercel project → Storage → Create Database → Blob. ' +
            'The BLOB_READ_WRITE_TOKEN will be automatically added.'
          )
        }
        throw blobError
      }
    } else {
      // Development: Save to local file system
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      const filePath = path.join(uploadsDir, filename)

      // Ensure directory exists
      const fs = require('fs')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      await writeFile(filePath, buffer)

      // Return the public URL
      const url = `/uploads/${filename}`
      return NextResponse.json({ url, success: true })
    }
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

