'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminNav() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        // Clear any client-side state if needed
        // Force a hard redirect to ensure cookie is cleared
        window.location.href = '/admin-login'
      } else {
        console.error('Logout failed:', response.statusText)
        // Still redirect even if API call fails
        window.location.href = '/admin-login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if API call fails
      window.location.href = '/admin-login'
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <nav className="bg-white border-b border-navy/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-lg font-semibold text-navy">
              Admin Portal
            </Link>
            <Link href="/admin/posts" className="text-sm text-navy/70 hover:text-navy">
              Posts
            </Link>
            <Link href="/admin/new" className="text-sm text-navy/70 hover:text-navy">
              New Post
            </Link>
                  <Link href="/admin/content" className="text-sm text-navy/70 hover:text-navy">
                    Content
                  </Link>
                  <Link href="/admin/messages" className="text-sm text-navy/70 hover:text-navy">
                    Messages
                  </Link>
                  <Link href="/admin/settings" className="text-sm text-navy/70 hover:text-navy">
                    Settings
                  </Link>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-sm text-navy/70 hover:text-navy disabled:opacity-50"
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  )
}

