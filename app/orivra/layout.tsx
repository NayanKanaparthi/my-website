import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { OrivraNavigation } from '@/components/orivra/Navigation'
import { orivraSite } from './site'
import styles from './orivra.module.css'

const description =
  'Help AI agents navigate large information spaces, find what matters and bring back evidence you can check. Starting with MailWeave for Gmail.'

export const metadata: Metadata = {
  metadataBase: new URL(orivraSite.origin),
  title: {
    default: 'Orivra — Help your AI find what matters',
    template: '%s | Orivra',
  },
  description,
  robots: { index: orivraSite.indexable, follow: orivraSite.indexable },
  icons: { icon: '/orivra-assets/orivra-symbol.svg' },
  openGraph: {
    title: 'Orivra — Help your AI find what matters',
    description,
    url: '/orivra',
    siteName: 'Orivra',
    type: 'website',
    images: [
      {
        url: '/orivra-assets/teaser-poster.png?v=e206c01e',
        width: 1920,
        height: 1080,
        alt: 'Orivra — Find the answer. Follow the evidence.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orivra — Help your AI find what matters',
    description,
    images: ['/orivra-assets/teaser-poster.png?v=e206c01e'],
  },
}

export default function OrivraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#orivra-main">
        Skip to content
      </a>
      <OrivraNavigation />
      <main id="orivra-main" tabIndex={-1}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link
            href="/orivra"
            className={styles.wordmark}
            aria-label="Orivra home"
          >
            <Image
              src="/orivra-assets/orivra-symbol-inverse.svg"
              width={36}
              height={36}
              alt=""
            />{' '}
            Orivra
          </Link>
          <p>
            Find what matters.
            <br />
            Understand why it matters.
          </p>
          <nav aria-label="Orivra footer">
            <Link href="/orivra/setup">Getting started</Link>
            <Link href="/orivra/privacy">Privacy</Link>
            <Link href="/orivra/terms">Terms</Link>
            <a href={orivraSite.contactHref}>Contact</a>
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <span>
            © {new Date().getFullYear()} Orivra · Built by{' '}
            <Link href="/">Nayan Kanaparthi</Link>
          </span>
          <span>Independent software. MailWeave preview in development.</span>
        </div>
      </footer>
    </div>
  )
}
