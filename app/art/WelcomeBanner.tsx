'use client'

import { useEffect, useState } from 'react'
import styles from './art.module.css'

const OWNER_KEY = 'sam-owner-device'
const SEEN_KEY = 'art-welcome-seen'
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)$/

/**
 * Greets visitors once per browser session. Sam's own machine never sees it:
 * local hosts are skipped, and visiting /art?owner=1 marks a browser as Sam's
 * (?owner=0 clears the mark).
 */
export default function WelcomeBanner() {
  const [phase, setPhase] = useState<'hidden' | 'in' | 'out'>('hidden')

  useEffect(() => {
    const owner = new URLSearchParams(window.location.search).get('owner')
    if (owner === '1') localStorage.setItem(OWNER_KEY, 'true')
    if (owner === '0') localStorage.removeItem(OWNER_KEY)
    if (LOCAL_HOST.test(window.location.hostname)) return
    if (localStorage.getItem(OWNER_KEY) === 'true') return
    if (sessionStorage.getItem(SEEN_KEY)) return
    sessionStorage.setItem(SEEN_KEY, 'true')

    const timers = [
      window.setTimeout(() => setPhase('in'), 350),
      window.setTimeout(() => setPhase('out'), 4600),
      window.setTimeout(() => setPhase('hidden'), 5400),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [])

  if (phase === 'hidden') return null
  return (
    <div className={styles.welcome} data-phase={phase} role="status">
      <span>ART &amp; 3D COURSE ARCHIVE</span>
      <strong>Welcome Xuedi</strong>
    </div>
  )
}
