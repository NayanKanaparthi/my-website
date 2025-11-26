import { NextRequest, NextResponse } from 'next/server'
import { saveMessage } from '@/lib/content'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Trim and validate name
    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      )
    }

    // Trim and validate message
    const trimmedMessage = message.trim()
    if (trimmedMessage.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Create message object
    const messageObj = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: trimmedName,
      email: email.trim().toLowerCase(),
      message: trimmedMessage,
      date: new Date().toISOString(),
      read: false,
    }

    // Save message
    await saveMessage(messageObj)

    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}

