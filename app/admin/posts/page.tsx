'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/posts'

export default function AdminPostsPage() {
  const router = useRouter()
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts', {
        credentials: 'include',
      })
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/admin-login'
          return
        }
        throw new Error(`Failed to fetch posts: ${response.statusText}`)
      }
      const data = await response.json()
      setAllPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      alert('Failed to load posts. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(slug)
    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        // Remove from local state
        setAllPosts(allPosts.filter((post) => post.slug !== slug))
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('An error occurred while deleting the post')
    } finally {
      setDeleting(null)
    }
  }

  const publishedPosts = allPosts.filter((p) => p.published)
  const drafts = allPosts.filter((p) => !p.published)

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-navy mb-2">All Posts</h1>
          <p className="text-navy/70">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-navy mb-2">All Posts</h1>
        <p className="text-navy/70">Manage your blog posts</p>
      </div>

      <div className="mb-6">
        <Link
          href="/admin/new"
          className="inline-block bg-violet text-white px-6 py-3 rounded-lg font-medium hover:bg-violet/90 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      {publishedPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-navy mb-4">Published</h2>
          <div className="bg-white rounded-lg border border-navy/10 overflow-hidden">
            <div className="divide-y divide-navy/10">
              {publishedPosts.map((post) => (
                <div
                  key={post.slug}
                  className="px-6 py-4 hover:bg-offwhite transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="flex-1"
                    >
                      <div>
                        <h3 className="font-semibold text-navy mb-1 hover:text-violet transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-navy/60">{formatDate(post.date)}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-sm text-green-600 font-medium">Published</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(post.slug, post.title)
                        }}
                        disabled={deleting === post.slug}
                        className="text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {deleting === post.slug ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {drafts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-navy mb-4">Drafts</h2>
          <div className="bg-white rounded-lg border border-navy/10 overflow-hidden">
            <div className="divide-y divide-navy/10">
              {drafts.map((post) => (
                <div
                  key={post.slug}
                  className="px-6 py-4 hover:bg-offwhite transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="flex-1"
                    >
                      <div>
                        <h3 className="font-semibold text-navy mb-1 hover:text-violet transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-navy/60">{formatDate(post.date)}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-sm text-yellow-600 font-medium">Draft</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(post.slug, post.title)
                        }}
                        disabled={deleting === post.slug}
                        className="text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {deleting === post.slug ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {allPosts.length === 0 && (
        <div className="bg-white rounded-lg border border-navy/10 p-12 text-center">
          <p className="text-navy/60 mb-4">No posts yet.</p>
          <Link
            href="/admin/new"
            className="inline-block bg-violet text-white px-6 py-3 rounded-lg font-medium hover:bg-violet/90 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      )}
    </div>
  )
}
