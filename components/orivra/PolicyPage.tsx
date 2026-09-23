import Link from 'next/link'
import { orivraSite } from '@/app/orivra/site'
import styles from '@/app/orivra/orivra.module.css'

export function PolicyPage({
  title,
  lead,
  sections,
  children,
}: {
  title: string
  lead: string
  sections: { id: string; title: string }[]
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      <header className={styles.policyIntro}>
        <Link href="/orivra" className={styles.backLink}>
          ← Back to Orivra
        </Link>
        <span className={styles.eyebrow}>CLEAR BY DESIGN</span>
        <h1>{title}</h1>
        <p>{lead}</p>
        <span className={styles.policyDate}>
          {orivraSite.policyReviewed ? 'Last updated' : 'Draft prepared'}{' '}
          {orivraSite.updated}
        </span>
      </header>
      {!orivraSite.policyReviewed && (
        <aside className={styles.draftNotice}>
          <strong>Draft for owner review.</strong> This page is not yet an
          effective policy and must be approved before publication or use in a
          Google verification submission.
        </aside>
      )}
      <div className={styles.policyGrid}>
        <nav aria-label={`${title} sections`} className={styles.policyContents}>
          <span className={styles.mono}>ON THIS PAGE</span>
          {sections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}>
              <span>0{index + 1}</span>
              {section.title}
            </a>
          ))}
        </nav>
        <article className={styles.policyBody}>{children}</article>
      </div>
    </div>
  )
}
