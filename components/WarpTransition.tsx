'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

type Warp = { x: number; y: number; color: string; phase: 'cover' | 'reveal' }

const COVER_MS = 1050

/**
 * Lives in the root layout so it survives navigation. A planet click covers the
 * screen from the click point; once the new route has rendered, the cover fades
 * while the page settles from a zoomed-in state, as if the visitor was pulled in.
 */
export default function WarpTransition() {
  const pathname = usePathname()
  const [warp, setWarp] = useState<Warp | null>(null)
  const startPath = useRef<string | null>(null)
  const coveredAt = useRef(0)

  useEffect(() => {
    const onWarp = (event: Event) => {
      const { x, y, color } = (event as CustomEvent<{ x: number; y: number; color: string }>).detail
      startPath.current = window.location.pathname
      coveredAt.current = performance.now() + COVER_MS
      setWarp({ x, y, color, phase: 'cover' })
    }
    window.addEventListener('planet-warp', onWarp)
    return () => window.removeEventListener('planet-warp', onWarp)
  }, [])

  useEffect(() => {
    if (!warp || warp.phase !== 'cover') return
    if (pathname === startPath.current) {
      // Navigation failed or stalled: never leave the screen covered.
      const giveUp = window.setTimeout(() => setWarp(null), 6000)
      return () => window.clearTimeout(giveUp)
    }
    const reveal = window.setTimeout(() => {
      document.documentElement.dataset.warp = 'arrive'
      setWarp((current) => current && { ...current, phase: 'reveal' })
    }, Math.max(0, coveredAt.current - performance.now()))
    return () => window.clearTimeout(reveal)
  }, [pathname, warp])

  useEffect(() => {
    if (warp?.phase !== 'reveal') return
    const finish = window.setTimeout(() => {
      delete document.documentElement.dataset.warp
      setWarp(null)
    }, 1100)
    return () => window.clearTimeout(finish)
  }, [warp])

  if (!warp) return null
  return (
    <div
      className="warp-overlay"
      data-phase={warp.phase}
      aria-hidden="true"
      style={{
        '--warp-x': `${warp.x}px`,
        '--warp-y': `${warp.y}px`,
        '--warp-color': warp.color,
      } as React.CSSProperties}
    />
  )
}
