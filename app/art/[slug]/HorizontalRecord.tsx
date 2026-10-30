'use client'

import { useEffect, useRef } from 'react'
import styles from '../art.module.css'

// Horizontal travel per pixel of vertical scroll.
const SPEED = 1.5

type Block = { type: string; text?: string; src?: string; number?: number; width?: number; height?: number }

/** Consecutive text blocks share one column; each image stands on its own. */
function groupRuns(panel: Block[]) {
  const runs: (Block | Block[])[] = []
  for (const block of panel) {
    if (block.type === 'image' && block.src) runs.push(block)
    else if (block.text) {
      const last = runs[runs.length - 1]
      if (Array.isArray(last)) last.push(block)
      else runs.push([block])
    }
  }
  return runs
}

/**
 * Pins the final project's original document and turns vertical scrolling into a
 * left-moving row of modules. Behind them, a Blender camera path around the
 * helmet is scrubbed frame by frame with the same progress.
 */
export default function HorizontalRecord({
  title,
  docHref,
  panels,
  frames,
}: {
  title: string
  docHref: string
  panels: Block[][]
  frames: string[]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!section || !track || !canvas || !context) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const images = frames.map((src) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = src
      return image
    })

    let distance = 0
    let target = 0
    let current = 0
    let drawnFrame = -1
    let frame = 0
    let active = false

    const draw = (index: number) => {
      const image = images[index]
      if (!image?.complete || !image.naturalWidth) return false
      const { width, height } = canvas
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const w = image.naturalWidth * scale
      const h = image.naturalHeight * scale
      context.clearRect(0, 0, width, height)
      context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h)
      return true
    }

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth)
      section.style.height = reducedMotion ? '' : `${distance / SPEED + window.innerHeight}px`
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      drawnFrame = -1
    }

    const readScroll = () => {
      if (!distance) return
      target = Math.min(1, Math.max(0, (-section.getBoundingClientRect().top * SPEED) / distance))
    }

    const tick = () => {
      current += (target - current) * 0.14
      if (Math.abs(target - current) < 0.0004) current = target
      if (!reducedMotion) track.style.transform = `translate3d(${-current * distance}px, 0, 0)`
      const index = Math.round(current * (images.length - 1))
      if (index !== drawnFrame && draw(index)) drawnFrame = index
      frame = active ? requestAnimationFrame(tick) : 0
    }

    const panelsShown = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) (entry.target as HTMLElement).dataset.shown = ''
      })
    }, { threshold: 0.12 })
    track.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => panelsShown.observe(panel))

    const nearby = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      if (active && !frame) frame = requestAnimationFrame(tick)
    }, { rootMargin: '200px 0px' })
    nearby.observe(section)

    const resize = new ResizeObserver(() => {
      measure()
      readScroll()
    })
    resize.observe(track)
    images[0].onload = () => draw(0)

    measure()
    readScroll()
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      active = false
      panelsShown.disconnect()
      nearby.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', measure)
    }
  }, [frames])

  return (
    <section className={styles.hrSection} id="original-record" ref={sectionRef}>
      <div className={styles.hrSticky}>
        <canvas className={styles.hrCanvas} ref={canvasRef} aria-hidden="true" />
        <div className={styles.hrTrack} ref={trackRef}>
          <div className={`${styles.hrPanel} ${styles.hrIntro}`} data-panel>
            <h2>{title}</h2>
            <a href={docHref} target="_blank" rel="noreferrer">OPEN ORIGINAL DOCX ↗</a>
          </div>
          {panels.map((panel, panelIndex) => (
            <div className={styles.hrPanel} data-panel data-count={panel.filter((block) => block.type === 'image').length} key={panelIndex}>
              {groupRuns(panel).map((run, runIndex) => Array.isArray(run) ? (
                <div className={styles.hrText} key={runIndex}>
                  {run.map((block, blockIndex) => <p key={blockIndex}>{block.text}</p>)}
                </div>
              ) : (
                <a href={run.src} target="_blank" rel="noreferrer" key={runIndex} aria-label={`Open original document image ${run.number}`}>
                  <img src={run.src} width={run.width} height={run.height} style={{ '--ratio': (run.height ?? 1) / (run.width ?? 1) } as React.CSSProperties} alt={`Final project, original document image ${run.number}`} loading="lazy" />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
