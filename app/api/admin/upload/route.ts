import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { isAuthenticated } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

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

    // Use Supabase Storage in production, file system in development
    if (isProduction) {
      const supabase = getSupabaseClient()
      
      if (!supabase) {
        return NextResponse.json(
          { 
            error: 'Supabase Storage is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables. ' +
                   'See MIGRATION.md for setup instructions.'
          },
          { status: 500 }
        )
      }

      try {
        // Upload to Supabase Storage
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-assets'
        const filePath = `uploads/${filename}`
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false, // Don't overwrite existing files
          })

        if (error) {
          console.error('Supabase upload error:', error)
          return NextResponse.json(
            { 
              error: `Failed to upload to Supabase Storage: ${error.message}. ` +
                     'Please verify that Supabase Storage is properly configured.'
            },
            { status: 500 }
          )
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath)

        return NextResponse.json({ url: urlData.publicUrl, success: true })
      } catch (uploadError) {
        console.error('Upload error:', uploadError)
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error'
        return NextResponse.json(
          { 
            error: `Failed to upload file: ${errorMessage}. ` +
                   'Please verify that Supabase Storage is properly configured.'
          },
          { status: 500 }
        )
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

