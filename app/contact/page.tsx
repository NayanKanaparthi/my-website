'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    // Client-side validation
    if (!formData.name.trim()) {
      setStatus('error')
      setErrorMessage('Name is required')
      return
    }

    if (formData.name.trim().length < 2) {
      setStatus('error')
      setErrorMessage('Name must be at least 2 characters long')
      return
    }

    if (!formData.email.trim()) {
      setStatus('error')
      setErrorMessage('Email is required')
      return
    }

    if (!validateEmail(formData.email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address')
      return
    }

    if (!formData.message.trim()) {
      setStatus('error')
      setErrorMessage('Message is required')
      return
    }

    if (formData.message.trim().length < 10) {
      setStatus('error')
      setErrorMessage('Message must be at least 10 characters long')
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Contact</h1>
        <p className="text-xl text-navy/70 max-w-2xl">
          Get in touch for collaborations, speaking opportunities, or just to connect.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 border border-navy/10">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-navy mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={6}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-violet text-white px-6 py-3 rounded-lg font-medium hover:bg-violet/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
          </button>

          {status === 'error' && errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}

          {status === 'success' && (
            <p className="text-green-600 text-sm">Thank you! Your message has been sent successfully.</p>
          )}
        </div>
      </form>
    </div>
  )
}


