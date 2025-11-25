import nodemailer from 'nodemailer'

const ADMIN_EMAIL = 'kanaparthinayan@gmail.com'

// Create transporter - using Gmail SMTP
// In production, you should use environment variables for credentials
export async function createTransporter() {
  // For Gmail, you'll need to use an App Password
  // Set these in your .env.local file:
  // SMTP_HOST=smtp.gmail.com
  // SMTP_PORT=587
  // SMTP_USER=kanaparthinayan@gmail.com
  // SMTP_PASS=your-app-password
  
  const smtpUser = process.env.SMTP_USER || ADMIN_EMAIL
  const smtpPass = process.env.SMTP_PASS

  if (!smtpPass) {
    const error = new Error('SMTP_PASS environment variable is not set. Please configure email settings in .env.local')
    console.error('Email configuration error:', error.message)
    throw error
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass, // App password for Gmail
    },
  })

  // Verify connection
  try {
    await transporter.verify()
  } catch (error: any) {
    console.error('SMTP connection failed:', error)
    throw new Error(`Failed to connect to email server: ${error.message}. Please check your SMTP settings.`)
  }

  return transporter
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const transporter = await createTransporter()
  
  const mailOptions = {
    from: `"Nayan Portfolio Admin" <${process.env.SMTP_USER || ADMIN_EMAIL}>`,
    to: email,
    subject: 'Password Change OTP - Admin Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A0F2C;">Password Change Request</h2>
        <p>You have requested to change your admin password. Use the following OTP to verify your request:</p>
        <div style="background-color: #6A5AE0; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="margin: 0; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you did not request this password change, please ignore this email.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

