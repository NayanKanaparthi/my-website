'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'

/** Keep the product microsite independent without changing portfolio routes. */
export default function SiteShell({
  children,
  footer,
}: {
  children: React.ReactNode
  footer: React.ReactNode
}) {
  const pathname = usePathname()
  if (pathname === '/orivra' || pathname.startsWith('/orivra/'))
    return <>{children}</>

  return (
    <>
      <Navigation />
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  )
}
