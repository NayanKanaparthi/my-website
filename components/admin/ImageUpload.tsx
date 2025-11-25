'use client'

import { useState } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full px-4 py-2 border border-navy/20 rounded-lg text-sm"
      />
      {value && (
        <div className="mt-2">
          <img src={value} alt="Preview" className="max-w-xs rounded-lg" />
          <button
            onClick={() => onChange('')}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      )}
      {uploading && <p className="text-sm text-navy/60">Uploading...</p>}
    </div>
  )
}

