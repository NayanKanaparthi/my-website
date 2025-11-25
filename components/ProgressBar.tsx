'use client'

import { useEffect } from 'react'

export default function ProgressBar() {
  useEffect(() => {
    const progressBar = document.getElementById('progress-bar')
    if (!progressBar) return

    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      progressBar.style.width = `${Math.min(progress, 100)}%`
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return null
}


