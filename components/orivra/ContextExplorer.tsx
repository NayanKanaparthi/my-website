'use client'

import { useState } from 'react'
import styles from '@/app/orivra/orivra.module.css'

const stages = [
  {
    label: 'Find what matters',
    title: 'Get to the information the question needs.',
    body: 'Search for relevant evidence and bring useful pieces into view. Your agent can start with those pieces instead of reading every conversation in full.',
    detail: 'Two relevant messages · one conversation',
    active: 'find',
  },
  {
    label: 'Explore what matters next',
    title: 'Read deeper without starting over.',
    body: 'Open a reply, recover an omitted message or follow a relationship. Give the agent a next step when a search result alone cannot explain what happened.',
    detail: 'The later message explicitly replaces the earlier plan',
    active: 'connect',
  },
  {
    label: 'Bring back the evidence',
    title: 'An explanation you can check.',
    body: 'Keep the sources behind a decision and its reasons. Show what has been read and what is missing, so you can tell a supported answer from an open question.',
    detail: 'The plan is supported · attendance is still unknown',
    active: 'inspect',
  },
] as const

export function ContextExplorer() {
  const [selected, setSelected] = useState(0)
  const stage = stages[selected]
  return (
    <div className={styles.explorer}>
      <div className={styles.explorerControls}>
        <div
          className={styles.stageButtons}
          aria-label="Explore how an agent finds and navigates information"
        >
          {stages.map((item, index) => (
            <button
              key={item.active}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={selected === index ? styles.stageActive : ''}
            >
              <span className={styles.mono}>0{index + 1}</span>
              {item.label}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className={styles.stageCopy} aria-live="polite">
          <h3>{stage.title}</h3>
          <p>{stage.body}</p>
        </div>
      </div>
      <div className={styles.evidenceBoard} data-stage={stage.active}>
        <div className={styles.boardHeading}>
          <span className={styles.mono}>ILLUSTRATIVE EXAMPLE</span>
          <span className={styles.mono}>NOT A LIVE SEARCH</span>
        </div>
        <p className={styles.boardQuestion}>
          “Is the workshop still in person?”
        </p>
        <article className={styles.evidenceCard}>
          <div>
            <span className={styles.mono}>MESSAGE A</span>
            <span>Initial plan</span>
          </div>
          <p>“The workshop will be hybrid, with a group at the venue.”</p>
        </article>
        <div className={styles.relationship}>
          <span aria-hidden="true">↓</span>
          <span>
            {selected === 0 ? 'Read the follow-up' : 'Explicitly replaced by'}
          </span>
          <span aria-hidden="true">↓</span>
        </div>
        <article className={`${styles.evidenceCard} ${styles.evidenceCurrent}`}>
          <div>
            <span className={styles.mono}>MESSAGE B</span>
            <span>Updated plan</span>
          </div>
          <p>
            “The venue lost step-free access. The final format is remote-only.
            This replaces the hybrid plan.”
          </p>
        </article>
        <div className={styles.evidenceConclusion} aria-live="polite">
          <span aria-hidden="true">{selected === 2 ? '◌' : '↳'}</span>
          <p>{stage.detail}</p>
        </div>
        <p className={styles.boardFootnote}>
          Fictional messages illustrating the workflow—not a measured result or
          a product screenshot.
        </p>
      </div>
    </div>
  )
}
