'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include', // Important: include cookies
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Wait a moment for cookie to be set, then redirect
        await new Promise(resolve => setTimeout(resolve, 100))
        window.location.href = data.redirect || '/admin'
      } else {
        setError(data.error || 'Invalid password')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault()
    setError('')
    setSendingOtp(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setShowOtpInput(true)
        setError('')
      } else {
        setError(data.error || 'Failed to send OTP')
        setSendingOtp(false)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setSendingOtp(false)
    } finally {
      setSendingOtp(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Clean the OTP - remove any non-digit characters and ensure it's 6 digits
    const cleanOtp = otp.replace(/\D/g, '').slice(0, 6)

    if (cleanOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login-with-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: cleanOtp }),
        credentials: 'include', // Important: include cookies
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Wait a moment for cookie to be set, then redirect
        await new Promise(resolve => setTimeout(resolve, 100))
        window.location.href = data.redirect || '/admin'
      } else {
        setError(data.error || 'Invalid or expired OTP')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite px-6">
      <div className="max-w-md w-full bg-white rounded-lg p-8 border border-navy/10 shadow-lg">
        <h1 className="text-2xl font-semibold text-navy mb-6">Admin Login</h1>
        
        {!showOtpInput ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-violet text-white px-6 py-3 rounded-lg font-medium hover:bg-violet/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={sendingOtp}
                className="text-sm text-violet hover:text-violet/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingOtp ? 'Sending...' : 'Forgot Password?'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-navy mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                placeholder="000000"
                className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-xs text-navy/60 mt-1">Check your email for the 6-digit OTP</p>
            </div>
            {otpSent && (
              <p className="text-green-600 text-sm">OTP sent to your email!</p>
            )}
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading || !otp || otp.length !== 6}
                className="flex-1 bg-violet text-white px-6 py-3 rounded-lg font-medium hover:bg-violet/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login with OTP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false)
                  setOtp('')
                  setOtpSent(false)
                  setError('')
                }}
                className="px-4 py-3 border border-navy/20 text-navy rounded-lg font-medium hover:bg-navy/5 transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
