import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = localFont({ 
  src: '../public/fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
})

const manrope = localFont({ 
  src: '../public/fonts/Manrope-Variable.woff2',
  variable: '--font-manrope',
  display: 'swap',
})

const jetbrainsMono = localFont({ 
  src: '../public/fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nayan Kanaparthi | AI Engineer, Production AI Systems & Adoption',
  description:
    'I build production AI systems and get organizations to actually adopt them. AI engineering, adoption science, and technical product strategy at NYU, Goldman Sachs, and Avis Budget Group.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-offwhite text-navy antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

