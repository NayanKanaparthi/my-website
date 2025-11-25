'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSendingOtp(true)

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setSendingOtp(false)
      return
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      setSendingOtp(false)
      return
    }

    try {
      const response = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setShowOtpInput(true)
        setSuccess('OTP sent to your email. Please check your inbox.')
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validate all fields
    if (!newPassword || !confirmPassword || !otp) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          confirmPassword,
          otp,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password changed successfully!')
        // Reset form
        setNewPassword('')
        setConfirmPassword('')
        setOtp('')
        setShowOtpInput(false)
        setOtpSent(false)
      } else {
        setError(data.error || 'Failed to change password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-navy mb-2">Settings</h1>
        <p className="text-navy/70">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-lg border border-navy/10 p-8 max-w-2xl">
        <h2 className="text-xl font-semibold text-navy mb-6">Change Password</h2>

        <form onSubmit={showOtpInput ? handleChangePassword : handleSendOTP} className="space-y-6">
          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-navy mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={showOtpInput}
              minLength={8}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent disabled:bg-navy/5 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-navy/60 mt-1">Must be at least 8 characters long</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy mb-2">
              Re-enter New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (newPassword && e.target.value !== newPassword) {
                  setError('Passwords do not match')
                } else {
                  setError('')
                }
              }}
              required
              disabled={showOtpInput}
              minLength={8}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent disabled:bg-navy/5 disabled:cursor-not-allowed"
            />
            {newPassword && confirmPassword && newPassword !== confirmPassword && !showOtpInput && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* OTP Input - shown after OTP is sent */}
          {showOtpInput && (
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
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            {!showOtpInput ? (
              <button
                type="submit"
                disabled={sendingOtp || !newPassword || !confirmPassword}
                className="px-6 py-3 bg-violet text-white rounded-lg font-medium hover:bg-violet/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !otp || otp.length !== 6}
                className="px-6 py-3 bg-violet text-white rounded-lg font-medium hover:bg-violet/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            )}
            {showOtpInput && (
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false)
                  setOtp('')
                  setOtpSent(false)
                  setError('')
                  setSuccess('')
                }}
                className="px-6 py-3 border border-navy/20 text-navy rounded-lg font-medium hover:bg-navy/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

