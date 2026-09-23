'use client'

import { useRef, useState } from 'react'
import styles from '@/app/orivra/orivra.module.css'

const revision = 'e206c01e'

export function Teaser() {
  const video = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState(false)
  async function play() {
    setStarted(true)
    try {
      await video.current?.play()
    } catch {
      setError(true)
    }
  }
  return (
    <figure className={styles.film}>
      <div className={styles.filmFrame}>
        <video
          ref={video}
          controls={started}
          playsInline
          preload="none"
          poster={`/orivra-assets/teaser-poster.png?v=${revision}`}
          aria-label="Orivra cinematic product vision teaser, 7.5 seconds"
          aria-describedby="teaser-description"
          onError={() => setError(true)}
        >
          <source
            src={`/orivra-assets/orivra-teaser.mp4?v=${revision}`}
            type="video/mp4"
          />
          <track
            kind="captions"
            src={`/orivra-assets/teaser-en.vtt?v=${revision}`}
            srcLang="en"
            label="English descriptions"
          />
          Your browser cannot play this video. Its description follows below.
        </video>
        {!started && (
          <button
            className={styles.filmPlay}
            onClick={play}
            type="button"
            aria-label="Play the Orivra cinematic teaser, 7.5 seconds, with music"
          >
            <span aria-hidden="true">▶</span> Watch the vision{' '}
            <span className={styles.mono}>7.5s · 4K</span>
          </button>
        )}
      </div>
      <figcaption>
        <span className={styles.mono}>A FIRST LOOK / THE ORIVRA VISION</span>
        <span>Gmail first. Slack and Drive are planned, not available.</span>
      </figcaption>
      {error && (
        <p role="status">
          The video could not start.{' '}
          <a href={`/orivra-assets/orivra-teaser.mp4?v=${revision}`}>
            Open the teaser directly
          </a>
          , or read its description below.
        </p>
      )}
      <details className={styles.filmDescription}>
        <summary>Video description</summary>
        <p id="teaser-description">
          A 7.5-second cinematic animation on a light background: the Orivra
          symbol assembles, Gmail, Slack and Drive connect to it, and a context
          graph unfolds. Highlighted paths trace the evidence before the graph
          resolves into the Orivra name and symbol. The closing words are “Find
          the answer. Follow the evidence.” Piano and strings, no speech. The
          final card names MailWeave and marks Slack and Drive connectors as in
          development. This illustrates the product vision, not shipping support
          for all three sources.
        </p>
      </details>
    </figure>
  )
}
