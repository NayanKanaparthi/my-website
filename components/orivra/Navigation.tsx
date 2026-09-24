'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import styles from '@/app/orivra/orivra.module.css'

export function OrivraNavigation() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  function dismissMenu(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      setOpen(false)
      menuButton.current?.focus()
    }
  }
  return (
    <header className={styles.header}>
      <div className={styles.navInner}>
        <Link
          href="/orivra"
          className={styles.wordmark}
          onClick={() => setOpen(false)}
          aria-label="Orivra home"
        >
          <Image
            src="/orivra-assets/orivra-symbol.svg"
            width={34}
            height={34}
            alt=""
            priority
          />{' '}
          Orivra
        </Link>
        <button
          ref={menuButton}
          className={styles.menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="orivra-navigation"
          onClick={() => setOpen(!open)}
          onKeyDown={dismissMenu}
        >
          {open ? 'Close' : 'Menu'}{' '}
          <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
        <nav
          id="orivra-navigation"
          aria-label="Orivra navigation"
          className={`${styles.navLinks} ${open ? styles.navOpen : ''}`}
          onKeyDown={dismissMenu}
        >
          <Link href="/orivra#approach" onClick={() => setOpen(false)}>
            The approach
          </Link>
          <Link href="/orivra#mailweave" onClick={() => setOpen(false)}>
            MailWeave
          </Link>
          <Link
            href="/orivra/privacy"
            aria-current={pathname === '/orivra/privacy' ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            Privacy
          </Link>
          <Link
            href="/orivra/setup"
            className={styles.navCta}
            aria-current={pathname === '/orivra/setup' ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            Download beta <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
