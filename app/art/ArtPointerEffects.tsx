'use client'

import { useEffect, useRef } from 'react'
import styles from './art.module.css'

const RIBBON_START = 0.05

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

export default function ArtPointerEffects() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const canvas = document.getElementById('art-foliage-canvas') as HTMLCanvasElement | null
    const context = canvas?.getContext('2d') ?? null
    if (!cursor) return

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
      if (!canvas) return
      width = Math.max(1, canvas.clientWidth)
      height = Math.max(1, canvas.clientHeight)
      canvas.width = width
      canvas.height = height
      buildFronds()
    }

    const drawFoliage = (now: number) => {
      // Subpages have no foliage screen; they only use the cursor.
      if (!canvas || !context) return
      const t = now / 1000
      context.clearRect(0, 0, width, height)
      const canvasBounds = canvas.getBoundingClientRect()
      const mouseX = pointer.x - canvasBounds.left
      const mouseY = pointer.y - canvasBounds.top

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
      if (ribbon && Math.abs(ribbonProgress.target - ribbonProgress.current) > 0.0005) {
        ribbonProgress.current += (ribbonProgress.target - ribbonProgress.current) * 0.12
        ribbon.style.setProperty('--ribbon-progress', ribbonProgress.current.toFixed(4))
      }
      if (!reducedMotion) drawFoliage(now)
      frame = requestAnimationFrame(animate)
    }

    // The ribbon draws itself along its path as the hero scrolls away.
    const ribbon = document.getElementById('art-ribbon')
    const ribbonProgress = { current: RIBBON_START, target: RIBBON_START }
    const updateRibbon = () => {
      if (!ribbon) return
      if (reducedMotion) {
        ribbon.style.setProperty('--ribbon-progress', '1')
        return
      }
      const distance = ribbon.getBoundingClientRect().height * 0.7
      const scrolled = Math.min(1, Math.max(0, window.scrollY / distance))
      ribbonProgress.target = RIBBON_START + (1 - RIBBON_START) * scrolled
    }

    resize()
    if (reducedMotion) drawFoliage(0)

    const foliage = document.getElementById('foliage')
    const updateSoloFoliage = () => {
      updateRibbon()
      if (!foliage) return
      const bounds = foliage.getBoundingClientRect()
      const soloFoliage = bounds.top <= window.innerHeight * 0.2
        && bounds.bottom >= window.innerHeight * 0.8
      document.documentElement.toggleAttribute('data-art-foliage', soloFoliage)
      window.dispatchEvent(new CustomEvent('art-foliage-mode', { detail: soloFoliage }))
    }

    frame = requestAnimationFrame(animate)
    updateSoloFoliage()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', updateSoloFoliage, { passive: true })
    if (!coarsePointer) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerover', onOver, { passive: true })
      window.addEventListener('pointerout', onOut, { passive: true })
    }

    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.removeAttribute('data-art-foliage')
      window.dispatchEvent(new CustomEvent('art-foliage-mode', { detail: false }))
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', updateSoloFoliage)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />
  )
}

