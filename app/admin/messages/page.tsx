'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import AdminNav from '@/components/admin/AdminNav'

interface Message {
  id: string
  name: string
  email: string
  message: string
  date: string
  read?: boolean
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages', {
        credentials: 'include',
      })
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/admin-login'
          return
        }
        setError('Failed to load messages')
        return
      }
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError('An error occurred while loading messages')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, read: true } : msg
    )
    setMessages(updatedMessages)

    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
        credentials: 'include',
      })
    } catch (err) {
      console.error('Error updating message:', err)
      // Revert on error
      fetchMessages()
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    const updatedMessages = messages.filter((msg) => msg.id !== messageId)
    setMessages(updatedMessages)

    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
        credentials: 'include',
      })
    } catch (err) {
      console.error('Error deleting message:', err)
      // Revert on error
      fetchMessages()
    }
  }

  const unreadCount = messages.filter((msg) => !msg.read).length

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <p className="text-navy/70">Loading messages...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-navy mb-2">Messages</h1>
          <p className="text-navy/70">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            {unreadCount > 0 && (
              <span className="ml-2 text-violet font-medium">
                ({unreadCount} unread)
              </span>
            )}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="bg-white rounded-lg border border-navy/10 p-12 text-center">
            <p className="text-navy/70 text-lg">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg border ${
                  message.read ? 'border-navy/10' : 'border-violet/30 shadow-sm'
                } p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-navy">
                        {message.name}
                      </h3>
                      {!message.read && (
                        <span className="bg-violet text-white text-xs font-medium px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-violet hover:text-violet/80 text-sm font-medium"
                    >
                      {message.email}
                    </a>
                    <p className="text-sm text-navy/60 mt-1">
                      {formatDate(message.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!message.read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="text-sm text-navy/70 hover:text-navy px-3 py-1 rounded hover:bg-navy/5 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="border-t border-navy/10 pt-4">
                  <p className="text-navy/80 whitespace-pre-wrap leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

