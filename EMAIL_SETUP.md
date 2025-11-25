# Email Configuration for OTP Feature

The password change feature requires email configuration to send OTP codes. Follow these steps to set up email sending:

## Gmail Setup (Recommended)

1. **Enable 2-Step Verification** on your Google account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "Portfolio Admin" as the name
   - Click "Generate"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

3. **Update `.env.local` file**:
   Open your `.env.local` file and update the SMTP settings:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=kanaparthinayan@gmail.com
   SMTP_PASS=your-16-character-app-password-here
   ```

   **Important**: Remove spaces from the app password when adding it to `.env.local`

4. **Restart your development server**:
   After updating `.env.local`, restart your Next.js server for changes to take effect.

## Alternative Email Providers

If you're using a different email provider, update the SMTP settings accordingly:

### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP:
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## Testing

After configuration, try changing your password:
1. Go to `/admin/settings`
2. Enter your old password
3. Enter and confirm your new password
4. Click "Send OTP"
5. Check your email for the 6-digit OTP code

## Troubleshooting

- **"SMTP_PASS environment variable is not set"**: Make sure you've added `SMTP_PASS` to your `.env.local` file
- **"Failed to connect to email server"**: Check your SMTP_HOST and SMTP_PORT settings
- **"Authentication failed"**: Verify your SMTP_USER and SMTP_PASS are correct
- **Gmail "Less secure app" error**: Use an App Password instead of your regular password

## Security Note

Never commit your `.env.local` file to version control. It's already in `.gitignore` for your protection.

