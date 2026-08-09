'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './art.module.css'

const RIBBON_PATH = 'M-60 50 C380 150 135 370 505 414 C810 450 1040 390 990 650 C955 842 750 758 710 617 C675 485 917 500 1012 668 C1090 810 1020 990 1510 1090'

const PALM_LAYOUT = [
  { bx: -0.03, by: 1.07, ang: -1.10, len: 1.08, curl: 0.012, leaf: 0.58, hue: 132, sat: 40, lit: 54 },
  { bx: -0.07, by: 0.55, ang: -0.30, len: 0.58, curl: 0.020, leaf: 0.50, hue: 92, sat: 52, lit: 60 },
  { bx: 0.15, by: 1.12, ang: -1.46, len: 0.92, curl: 0.010, leaf: 0.54, hue: 112, sat: 46, lit: 56 },
  { bx: 0.68, by: 1.10, ang: -1.74, len: 0.50, curl: 0.012, leaf: 0.46, hue: 78, sat: 56, lit: 62 },
  { bx: 1.06, by: 0.94, ang: -2.10, len: 0.84, curl: -0.013, leaf: 0.55, hue: 138, sat: 38, lit: 50 },
]

type PalmFrond = {
  bx: number
  by: number
  ang: number
  len: number
  curl: number
  leaf: number
  segs: number
  phase: number
  bend: number
  vel: number
  leafFill: string
  stemFill: string
}

const gallerySlots = [
  { file: 'art-01.jpg', title: 'First Light', ratio: 'portrait' },
  { file: 'art-02.jpg', title: 'Soft Geometry', ratio: 'landscape' },
  { file: 'art-03.jpg', title: 'Afterimage', ratio: 'square' },
  { file: 'art-04.jpg', title: 'Blue Hour', ratio: 'landscape' },
  { file: 'art-05.jpg', title: 'Material Study', ratio: 'portrait' },
  { file: 'art-06.jpg', title: 'Uncatalogued', ratio: 'square' },
]

const dimensions = [
  { name: 'Villas', note: 'Interactive architectural map', shape: 'villa', open: true },
  { name: 'Form Study 02', note: '3D experiment', shape: 'orb' },
  { name: 'Form Study 03', note: '3D experiment', shape: 'prism' },
  { name: 'Form Study 04', note: '3D experiment', shape: 'ring' },
  { name: 'Form Study 05', note: '3D experiment', shape: 'arch' },
  { name: 'Form Study 06', note: '3D experiment', shape: 'stack' },
]

function ImageSlot({
  file,
  label,
  className = '',
}: {
  file: string
  label: string
  className?: string
}) {
  return (
    <div className={`${styles.imageSlot} ${className}`} data-art-hover>
      <div className={styles.slotGuide}>
        <span>{label}</span>
        <code>public/gallery/{file}</code>
      </div>
      {/* A missing CSS background stays transparent; adding the file covers the guide. */}
      <span
        className={styles.slotImage}
        style={{ backgroundImage: `url('/gallery/${file}')` }}
        role="img"
        aria-label={label}
      />
    </div>
  )
}

function ArtPointerEffects() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const palmRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const canvas = palmRef.current
    const context = canvas?.getContext('2d')
    if (!cursor || !canvas || !context) return

    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      vx: 0,
      vy: 0,
    }

    let width = 0
    let height = 0
    let fronds: PalmFrond[] = []
    let active = true
    let frame = 0

    const buildFronds = () => {
      fronds = PALM_LAYOUT.map((item) => ({
        bx: item.bx * width,
        by: item.by * height,
        ang: item.ang,
        len: item.len * height,
        curl: item.curl,
        leaf: item.leaf,
        segs: Math.round(18 + item.len * 8),
        phase: Math.random() * Math.PI * 2,
        bend: 0,
        vel: 0,
        leafFill: `hsla(${item.hue}, ${item.sat}%, ${item.lit}%, 0.20)`,
        stemFill: `hsla(${item.hue}, ${item.sat}%, ${Math.round(item.lit * 0.8)}%, 0.40)`,
      }))
    }

    const resize = () => {
      width = Math.max(1, canvas.clientWidth)
      height = Math.max(1, canvas.clientHeight)
      canvas.width = width
      canvas.height = height
      buildFronds()
    }

    const drawFoliage = (now: number) => {
      const t = now / 1000
      context.clearRect(0, 0, width, height)
      const mouseX = pointer.x
      const mouseY = pointer.y + window.scrollY

      context.lineCap = 'round'
      context.lineJoin = 'round'

      for (const frond of fronds) {
        const breeze = 0.12 * Math.sin(t * 0.8 + frond.phase)
        const middleX = frond.bx + Math.cos(frond.ang) * frond.len * 0.5
        const middleY = frond.by + Math.sin(frond.ang) * frond.len * 0.5
        const proximity = Math.max(
          0,
          1 - Math.hypot(mouseX - middleX, mouseY - middleY) / (frond.len * 0.75),
        )

        frond.vel += proximity * pointer.vx * 0.0008
        frond.vel += (breeze - frond.bend) * 0.02
        frond.vel *= 0.92
        frond.bend += frond.vel

        let x = frond.bx
        let y = frond.by
        let direction = frond.ang
        const segmentLength = frond.len / frond.segs
        const pointsX = [x]
        const pointsY = [y]
        const directions = [direction]
        const stem = new Path2D()
        stem.moveTo(x, y)

        for (let index = 1; index <= frond.segs; index += 1) {
          const progress = index / frond.segs
          direction += frond.curl + frond.bend * progress * 0.14
          x += Math.cos(direction) * segmentLength
          y += Math.sin(direction) * segmentLength
          stem.lineTo(x, y)
          pointsX.push(x)
          pointsY.push(y)
          directions.push(direction)
        }

        const blades = new Path2D()
        const leafBase = frond.len * frond.leaf * 0.4
        for (let index = 2; index < frond.segs; index += 1) {
          const progress = index / frond.segs
          const leafLength = leafBase * (1 - progress * 0.5)
          const leafAngle = 0.6 * (1 - progress * 0.2)
          const leafWidth = leafLength * 0.22
          const shimmer = Math.sin(t * 1.8 + index * 0.5 + frond.phase) * 0.06
            + frond.bend * 0.3 * progress

          for (const side of [-1, 1]) {
            const angle = directions[index] + side * leafAngle + shimmer * side
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            const perpendicularX = -sin
            const perpendicularY = cos
            const baseX = pointsX[index]
            const baseY = pointsY[index]
            const tipX = baseX + cos * leafLength
            const tipY = baseY + sin * leafLength
            const controlOneX = baseX + cos * leafLength * 0.5 + perpendicularX * leafWidth
            const controlOneY = baseY + sin * leafLength * 0.5 + perpendicularY * leafWidth
            const controlTwoX = baseX + cos * leafLength * 0.5 - perpendicularX * leafWidth
            const controlTwoY = baseY + sin * leafLength * 0.5 - perpendicularY * leafWidth

            blades.moveTo(baseX, baseY)
            blades.quadraticCurveTo(controlOneX, controlOneY, tipX, tipY)
            blades.quadraticCurveTo(controlTwoX, controlTwoY, baseX, baseY)
          }
        }

        context.fillStyle = frond.leafFill
        context.fill(blades)
        context.strokeStyle = frond.stemFill
        context.lineWidth = 2.2
        context.stroke(stem)
      }
    }

    const onMove = (event: PointerEvent) => {
      pointer.tx = event.clientX
      pointer.ty = event.clientY
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const interactive = target?.closest('a, button, [role="button"], [data-art-hover]')
      cursor.toggleAttribute('data-active', Boolean(interactive))
    }

    const onOut = (event: PointerEvent) => {
      const next = event.relatedTarget instanceof Element ? event.relatedTarget : null
      if (!next?.closest('a, button, [role="button"], [data-art-hover]')) {
        cursor.removeAttribute('data-active')
      }
    }

    const animate = (now: number) => {
      const previousX = pointer.x
      const previousY = pointer.y
      pointer.x += (pointer.tx - pointer.x) * 0.18
      pointer.y += (pointer.ty - pointer.y) * 0.18
      pointer.vx = pointer.x - previousX
      pointer.vy = pointer.y - previousY

      if (!coarsePointer) {
        cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
      }
      if (active && !reducedMotion) drawFoliage(now)
      frame = requestAnimationFrame(animate)
    }

    resize()
    if (reducedMotion) drawFoliage(0)

    const hero = document.getElementById('top')
    const observer = hero && 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          active = entries[0]?.isIntersecting ?? true
        })
      : null
    if (hero && observer) observer.observe(hero)

    frame = requestAnimationFrame(animate)
    window.addEventListener('resize', resize)
    if (!coarsePointer) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerover', onOver, { passive: true })
      window.addEventListener('pointerout', onOut, { passive: true })
    }

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <>
      <canvas ref={palmRef} className={styles.palmCanvas} aria-hidden="true" />
      <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />
    </>
  )
}

export default function ArtPage() {
  return (
    <main className={styles.page}>
      <ArtPointerEffects />
      <header className={styles.nav}>
        <a className={styles.logo} href="#top">SAM / ART</a>
        <nav>
          <a href="#gallery">Gallery</a>
          <a href="#dimensions">3D</a>
          <Link href="/">Back to orbit ↗</Link>
        </nav>
      </header>

      <section className={styles.hero} id="top">
        <svg className={styles.ribbon} viewBox="0 0 1440 1100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="artRibbonGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ef4b31">
                <animate attributeName="stop-color" values="#ef4b31;#aa321d;#ef4b31" dur="7s" repeatCount="indefinite" />
              </stop>
              <stop offset="0.56" stopColor="#d63a25">
                <animate attributeName="stop-color" values="#d63a25;#6f2012;#d63a25" dur="8.4s" repeatCount="indefinite" />
              </stop>
              <stop offset="1" stopColor="#43170d">
                <animate attributeName="stop-color" values="#43170d;#bd321e;#43170d" dur="6.2s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <g className={styles.ribbonFlow}>
            <path className={styles.ribbonMain} d={RIBBON_PATH} />
            <path className={styles.ribbonSheen} d={RIBBON_PATH} />
          </g>
        </svg>
        <div className={styles.heroCopy}>
          <p>PERSONAL ARCHIVE · 2026</p>
          <h1>Things I made<br />to understand things.</h1>
          <div className={styles.heroIntro}>
            <span>ART, VISUAL NOTES &amp; HALF-FINISHED OBJECTS</span>
            <p>
              A growing field of images, models, small obsessions and experiments.
              The empty frames are intentional—for now.
            </p>
            <a href="#gallery">Enter the archive ↓</a>
          </div>
        </div>

        <ImageSlot file="hero.jpg" label="HERO ARTWORK" className={styles.heroImage} />

        <div className={styles.ticker} aria-hidden="true">
          <span>DRAWING · LIGHT · SPACE · MOTION · DRAWING · LIGHT · SPACE · MOTION ·</span>
        </div>
      </section>

      <section className={styles.gallery} id="gallery">
        <div className={styles.sectionHead}>
          <div>
            <p>01 / IMAGE ARCHIVE</p>
            <h2>Selected<br />works</h2>
          </div>
          <p className={styles.sectionNote}>
            将图片按卡片标注的文件名放进 <code>public/gallery</code>，占位框会自动被图片覆盖。
          </p>
        </div>

        <div className={styles.galleryGrid}>
          {gallerySlots.map((item, index) => (
            <article className={`${styles.artwork} ${styles[item.ratio]}`} key={item.file}>
              <ImageSlot file={item.file} label={`IMAGE SLOT ${String(index + 1).padStart(2, '0')}`} />
              <div className={styles.caption}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <small>IMAGE / OPEN MEDIUM</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.manifesto}>
        <p>AN UNFINISHED MANIFESTO</p>
        <h2>
          Keep the edges visible.<br />
          Leave room for the accident.<br />
          Make the system feel alive.
        </h2>
      </section>

      <section className={styles.dimensions} id="dimensions">
        <div className={styles.dimensionTitle}>
          <p>02 / SPATIAL WORK</p>
          <h2>Other<br />dimensions</h2>
          <span>One door is open. The rest are still being built.</span>
        </div>

        <div className={styles.dimensionGrid}>
          {dimensions.map((item, index) => {
            const content = (
              <>
                <div className={styles.objectStage}>
                  <i className={styles[item.shape]} aria-hidden="true" />
                  {!item.open && <span className={styles.lock}>LOCKED</span>}
                  {item.open && <span className={styles.enter}>ENTER ↗</span>}
                </div>
                <p>{String(index + 1).padStart(2, '0')} · {item.note}</p>
                <h3>{item.name}</h3>
              </>
            )

            return item.open ? (
              <a
                className={`${styles.dimensionCard} ${styles.unlocked}`}
                href="https://villa-map.samsamsam.workers.dev/"
                target="_blank"
                rel="noreferrer"
                key={item.name}
              >
                {content}
              </a>
            ) : (
              <article className={`${styles.dimensionCard} ${styles.locked}`} key={item.name}>
                {content}
              </article>
            )
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>SAM ARCHIVE</span>
        <strong>More work will land here.</strong>
        <Link href="/">Return to the solar system →</Link>
      </footer>
    </main>
  )
}
