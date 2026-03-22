'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANET_DEFS = [
  { texture: '/planet-art.svg', label: 'Art Gallery', route: '/art', color: '#ff9fcd' },
  { texture: '/planet-cv.svg', label: 'My CV', route: '/cv', color: '#8ec8f2' },
  { texture: '/planet-games.svg', label: 'Mini Game', route: '/games', color: '#ffbc85' },
  { texture: '/planet-messages.svg', label: 'Message Wall', route: '/interactive', color: '#a5ffe1' },
  { texture: '/avatar.jpg', label: 'About Me', route: '/sam', color: '#ffaa44' },
  { texture: '/planet-kitchen.svg', label: "Sam's Kitchen", route: '/cooking', color: '#ffd09c' },
  { texture: '/planet-minecraft.svg', label: 'Minecraft Planet', route: '/minecraft', color: '#bcff8a' },
  { texture: '/planet-stocks.svg', label: 'Stock Research', route: '/stocks', color: '#90f6c4' },
]

export default function VisionPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [noCamera, setNoCamera] = useState(false)
  const [hitPlanet, setHitPlanet] = useState<string | null>(null)
  const [pureMode, setPureMode] = useState(false)
  const pureModeRef = useRef(false)

  useEffect(() => { pureModeRef.current = pureMode }, [pureMode])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const video = videoRef.current!
    let animId: number
    let destroyed = false

    const sampleW = 80, sampleH = 60
    const offscreen = document.createElement('canvas')
    offscreen.width = sampleW; offscreen.height = sampleH
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true })!

    const face = {
      skinRatio: 0, smoothRatio: 0.12,
      centerX: 0.5, centerY: 0.5,
      smoothCX: 0.5, smoothCY: 0.5,
      baselineRatio: 0,
      calibrated: false, calibFrames: 0, calibSum: 0,
      active: false,
    }

    let W = window.innerWidth, H = window.innerHeight
    function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H }
    resize()
    window.addEventListener('resize', resize)

    const STAR_COUNT = 1500
    type Star = { x: number; y: number; z: number; pz: number }
    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random() * 1600
      stars.push({ x: (Math.random() - 0.5) * 3000, y: (Math.random() - 0.5) * 3000, z, pz: z })
    }

    const RING_COUNT = 22
    const rings: { z: number }[] = []
    for (let i = 0; i < RING_COUNT; i++) rings.push({ z: i * 60 })

    type FlyingPlanet = {
      def: typeof PLANET_DEFS[0]; x: number; y: number; z: number
      size: number; img: HTMLImageElement; alive: boolean; flash: number
    }
    const planets: FlyingPlanet[] = []
    const planetImages: Map<string, HTMLImageElement> = new Map()
    PLANET_DEFS.forEach(def => { const img = new Image(); img.src = def.texture; planetImages.set(def.texture, img) })

    let planetSpawnTimer = 0
    const PLANET_SPAWN_INTERVAL = 420 // ~7 seconds

    function spawnPlanet() {
      const def = PLANET_DEFS[Math.floor(Math.random() * PLANET_DEFS.length)]
      const img = planetImages.get(def.texture)!
      const angle = Math.random() * Math.PI * 2
      const dist = 250 + Math.random() * 500
      planets.push({
        def, x: W / 2 + Math.cos(angle) * dist, y: H / 2 + Math.sin(angle) * dist,
        z: 1400 + Math.random() * 200, size: 50 + Math.random() * 30,
        img, alive: true, flash: 0,
      })
      while (planets.length > 4) planets.shift()
    }

    const ship = { x: W / 2, y: H / 2, targetX: W / 2, targetY: H / 2, size: 36 }

    function isSkin(r: number, g: number, b: number): boolean {
      const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min
      if (max < 40 || min > 230) return false
      let h = 0
      if (delta > 0) { if (max === r) h = 60 * (((g - b) / delta) % 6); else if (max === g) h = 60 * ((b - r) / delta + 2); else h = 60 * ((r - g) / delta + 4) }
      if (h < 0) h += 360
      const s = max === 0 ? 0 : delta / max
      return ((h >= 0 && h <= 50) || h >= 340) && s >= 0.08 && s <= 0.72 && max >= 50 && max <= 240 && r > g && g > b && (r - b) > 20
    }

    function analyzeFrame() {
      if (video.readyState < 2) return
      offCtx.drawImage(video, 0, 0, sampleW, sampleH)
      const data = offCtx.getImageData(0, 0, sampleW, sampleH).data
      let skinCount = 0, sumX = 0, sumY = 0
      const mx = Math.floor(sampleW * 0.1), my = Math.floor(sampleH * 0.05)
      for (let y = my; y < sampleH - my; y++) {
        for (let x = mx; x < sampleW - mx; x++) {
          const idx = (y * sampleW + x) * 4
          if (isSkin(data[idx], data[idx + 1], data[idx + 2])) { skinCount++; sumX += x; sumY += y }
        }
      }
      const centerPixels = (sampleW - 2 * mx) * (sampleH - 2 * my)
      face.skinRatio = skinCount / centerPixels
      if (skinCount > 10) { face.centerX = 1 - (sumX / skinCount) / sampleW; face.centerY = (sumY / skinCount) / sampleH }
      if (!face.calibrated && face.skinRatio > 0.02) {
        face.calibSum += face.skinRatio; face.calibFrames++
        if (face.calibFrames >= 50) { face.baselineRatio = face.calibSum / face.calibFrames; face.calibrated = true }
      }
    }

    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } } })
        if (destroyed) { stream.getTracks().forEach(t => t.stop()); return }
        video.srcObject = stream; await video.play(); face.active = true
      } catch { if (!destroyed) setNoCamera(true) }
    })()

    let warpSpeed = 1.5, targetWarp = 1.5, hue = 220, frameCount = 0
    let collisionRoute: string | null = null

    /* ===== Wireframe ship ===== */
    function drawShip(x: number, y: number, s: number) {
      ctx.save()
      ctx.strokeStyle = `hsla(${hue}, 50%, 65%, 0.6)`
      ctx.lineWidth = 1.2
      ctx.lineJoin = 'round'

      // Main fuselage — elongated pointed shape
      ctx.beginPath()
      ctx.moveTo(x, y - s * 0.9)        // nose
      ctx.lineTo(x + s * 0.12, y - s * 0.3)
      ctx.lineTo(x + s * 0.15, y + s * 0.3)
      ctx.lineTo(x + s * 0.08, y + s * 0.5)  // tail
      ctx.lineTo(x - s * 0.08, y + s * 0.5)
      ctx.lineTo(x - s * 0.15, y + s * 0.3)
      ctx.lineTo(x - s * 0.12, y - s * 0.3)
      ctx.closePath()
      ctx.stroke()

      // Left wing
      ctx.beginPath()
      ctx.moveTo(x - s * 0.12, y - s * 0.1)
      ctx.lineTo(x - s * 0.55, y + s * 0.25)
      ctx.lineTo(x - s * 0.5, y + s * 0.4)
      ctx.lineTo(x - s * 0.15, y + s * 0.25)
      ctx.stroke()

      // Right wing
      ctx.beginPath()
      ctx.moveTo(x + s * 0.12, y - s * 0.1)
      ctx.lineTo(x + s * 0.55, y + s * 0.25)
      ctx.lineTo(x + s * 0.5, y + s * 0.4)
      ctx.lineTo(x + s * 0.15, y + s * 0.25)
      ctx.stroke()

      // Cockpit line
      ctx.beginPath()
      ctx.moveTo(x - s * 0.06, y - s * 0.45)
      ctx.lineTo(x + s * 0.06, y - s * 0.45)
      ctx.lineTo(x + s * 0.04, y - s * 0.2)
      ctx.lineTo(x - s * 0.04, y - s * 0.2)
      ctx.closePath()
      ctx.strokeStyle = `hsla(${hue}, 60%, 75%, 0.4)`
      ctx.stroke()

      // Engine glow — subtle
      const trailLen = 6 + warpSpeed * 0.5
      const trailAlpha = Math.min(0.4, warpSpeed / 40)
      ctx.beginPath()
      ctx.moveTo(x - s * 0.04, y + s * 0.5)
      ctx.lineTo(x + s * 0.04, y + s * 0.5)
      ctx.lineTo(x, y + s * 0.5 + trailLen)
      ctx.closePath()
      ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${trailAlpha})`
      ctx.fill()

      ctx.restore()
    }

    function drawPlanet(p: FlyingPlanet) {
      const scale = Math.max(0.01, 800 / p.z)
      const screenR = p.size * scale
      if (screenR < 2) return null
      const screenX = (p.x - W / 2) * scale + W / 2
      const screenY = (p.y - H / 2) * scale + H / 2

      if (screenR > 8) {
        const grd = ctx.createRadialGradient(screenX, screenY, screenR * 0.5, screenX, screenY, screenR * 2.2)
        grd.addColorStop(0, p.def.color + '30'); grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(screenX, screenY, screenR * 2.2, 0, Math.PI * 2); ctx.fill()
      }

      ctx.save(); ctx.beginPath(); ctx.arc(screenX, screenY, screenR, 0, Math.PI * 2); ctx.clip()
      if (p.img.complete && p.img.naturalWidth > 0) {
        ctx.drawImage(p.img, screenX - screenR, screenY - screenR, screenR * 2, screenR * 2)
      } else { ctx.fillStyle = p.def.color; ctx.fill() }
      ctx.restore()

      ctx.beginPath(); ctx.arc(screenX, screenY, screenR, 0, Math.PI * 2)
      ctx.strokeStyle = p.def.color + '55'; ctx.lineWidth = 1; ctx.stroke()

      if (screenR > 20) {
        const la = Math.min(1, (screenR - 20) / 30)
        ctx.fillStyle = `rgba(255,255,255,${la * 0.7})`
        ctx.font = `${Math.min(13, Math.max(9, screenR * 0.25))}px monospace`
        ctx.textAlign = 'center'; ctx.fillText(p.def.label, screenX, screenY + screenR + 14)
      }
      return { screenX, screenY, screenR }
    }

    function render() {
      if (collisionRoute) return
      frameCount++
      const cx = W / 2, cy = H / 2
      const pure = pureModeRef.current

      if (face.active && frameCount % 3 === 0) analyzeFrame()

      if (face.active && face.skinRatio > 0.02) {
        face.smoothRatio += (face.skinRatio - face.smoothRatio) * 0.1
        face.smoothCX += (face.centerX - face.smoothCX) * 0.08
        face.smoothCY += (face.centerY - face.smoothCY) * 0.08
        ship.targetX = W * 0.15 + face.smoothCX * W * 0.7
        ship.targetY = H * 0.2 + face.smoothCY * H * 0.6
        if (face.calibrated) {
          const dev = face.smoothRatio - face.baselineRatio
          const norm = Math.max(-1, Math.min(1.5, dev / 0.15))
          targetWarp = norm > 0 ? 2 + norm * norm * norm * 80 : 0.3 + Math.max(0, 1 + norm * 1.5) * 1.5
        } else { targetWarp = 1.5 }
      } else { ship.targetX = cx; ship.targetY = cy; targetWarp = 1.5 }

      warpSpeed += ((targetWarp > warpSpeed ? 0.08 : 0.04) * (targetWarp - warpSpeed))
      warpSpeed = Math.max(0.2, Math.min(82, warpSpeed))
      hue = (hue + warpSpeed * 0.12) % 360
      ship.x += (ship.targetX - ship.x) * 0.06
      ship.y += (ship.targetY - ship.y) * 0.06

      const alpha = warpSpeed > 30 ? 0.08 : warpSpeed > 12 ? 0.15 : warpSpeed > 4 ? 0.3 : 0.5
      ctx.fillStyle = `rgba(2,2,8,${alpha})`; ctx.fillRect(0, 0, W, H)

      // Tunnel rings
      for (const ring of rings) {
        ring.z -= warpSpeed * 1.5; if (ring.z < 1) ring.z += RING_COUNT * 60
        const sc = 800 / ring.z, r = 600 * sc, d = 1 - ring.z / (RING_COUNT * 60)
        if (r > 1 && warpSpeed > 2) {
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${(hue + ring.z * 0.2) % 360},70%,55%,${d * Math.min(1, warpSpeed / 6) * 0.14})`
          ctx.lineWidth = Math.max(0.5, 3 * sc * Math.min(1, warpSpeed / 10)); ctx.stroke()
        }
      }

      // Stars
      for (const star of stars) {
        star.pz = star.z; star.z -= warpSpeed
        if (star.z < 1) { star.x = (Math.random() - 0.5) * 3000; star.y = (Math.random() - 0.5) * 3000; star.z = 1600; star.pz = 1600 }
        const sx = (star.x / star.z) * 800 + cx, sy = (star.y / star.z) * 800 + cy
        const px = (star.x / star.pz) * 800 + cx, py = (star.y / star.pz) * 800 + cy
        const br = 1 - star.z / 1600, sz = Math.max(0.3, br * 3)
        if (warpSpeed > 3) {
          const sa = br * Math.min(1, warpSpeed / 10) * 0.7
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy)
          ctx.strokeStyle = warpSpeed > 20 ? `hsla(${(hue + star.x * 0.08) % 360},70%,${45 + br * 45}%,${sa})` : `rgba(${160 + br * 95},${175 + br * 80},${220 + br * 35},${sa})`
          ctx.lineWidth = sz * (warpSpeed > 20 ? 1.5 : 1); ctx.stroke()
        } else {
          ctx.beginPath(); ctx.arc(sx, sy, sz * 0.6, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,210,240,${br * 0.5})`; ctx.fill()
        }
      }

      // Planets (game mode only)
      if (!pure) {
        planetSpawnTimer++
        if (planetSpawnTimer >= PLANET_SPAWN_INTERVAL) { planetSpawnTimer = 0; spawnPlanet() }
        for (const p of planets) {
          if (!p.alive) continue; p.z -= warpSpeed * 0.8; p.flash++
          if (p.z < 5) { p.alive = false; continue }
          const res = drawPlanet(p); if (!res) continue
          const dx = res.screenX - ship.x, dy = res.screenY - ship.y
          if (Math.hypot(dx, dy) < res.screenR + ship.size * 0.4 && res.screenR > 12) {
            collisionRoute = p.def.route; setHitPlanet(p.def.label)
            ctx.fillStyle = p.def.color + '55'; ctx.fillRect(0, 0, W, H)
            setTimeout(() => router.push(p.def.route), 800); return
          }
        }
        for (let i = planets.length - 1; i >= 0; i--) { if (!planets[i].alive) planets.splice(i, 1) }
      }

      // Center glow
      if (warpSpeed > 6) {
        const int = Math.min(1, (warpSpeed - 6) / 40), gr = 80 + warpSpeed * 4
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr)
        grd.addColorStop(0, `hsla(${hue},80%,85%,${int * 0.15})`); grd.addColorStop(0.5, `hsla(${(hue + 30) % 360},70%,60%,${int * 0.05})`); grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, gr, 0, Math.PI * 2); ctx.fill()
      }

      // Vignette
      const vg = ctx.createRadialGradient(cx, cy, H * 0.2, cx, cy, H * 0.9)
      vg.addColorStop(0, 'transparent'); vg.addColorStop(1, 'rgba(2,2,8,0.5)')
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)

      // Ship (game mode only)
      if (!pure) drawShip(ship.x, ship.y, ship.size)

      // HUD
      const pct = Math.min(100, Math.round((warpSpeed / 82) * 100))
      ctx.fillStyle = `rgba(255,255,255,${warpSpeed > 8 ? 0.3 : 0.12})`
      ctx.font = '11px monospace'; ctx.textAlign = 'right'
      ctx.fillText(`WARP ${pct}%`, W - 16, H - 16)

      if (face.active && !face.calibrated && face.calibFrames > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '12px monospace'; ctx.textAlign = 'center'
        ctx.fillText('calibrating... hold still', cx, H - 40)
      }

      if (!destroyed) animId = requestAnimationFrame(render)
    }

    ctx.fillStyle = '#020208'; ctx.fillRect(0, 0, W, H)
    render()

    return () => {
      destroyed = true; cancelAnimationFrame(animId); window.removeEventListener('resize', resize)
      const stream = video.srcObject as MediaStream | null; stream?.getTracks().forEach(t => t.stop())
    }
  }, [router])

  return (
    <div style={{ margin: 0, overflow: 'hidden', background: '#020208' }}>
      <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
      <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />

      <button onClick={() => router.push('/')} style={{
        position: 'absolute', top: 12, left: 12, zIndex: 200,
        background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px',
        borderRadius: 4, cursor: 'pointer', fontSize: 13,
      }}>← Back</button>

      {/* Pure mode toggle */}
      <button
        onClick={() => setPureMode(p => !p)}
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 200,
          background: pureMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.4)',
          color: pureMode ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
          border: `1px solid ${pureMode ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
          padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
          fontSize: 11, fontFamily: 'monospace', letterSpacing: 1,
        }}
      >
        {pureMode ? '◉ PURE' : '○ PURE'}
      </button>

      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, color: 'rgba(255,255,255,0.2)', fontSize: 11,
        letterSpacing: 6, fontFamily: 'monospace', textTransform: 'uppercase', pointerEvents: 'none',
      }}>Mystery Vision</div>

      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, color: 'rgba(255,255,255,0.15)', fontSize: 11,
        fontFamily: 'monospace', textAlign: 'center', letterSpacing: 1, pointerEvents: 'none', lineHeight: 1.8,
      }}>
        {pureMode ? 'lean closer → warp · pull back → drift' : 'lean closer → warp · move head → steer · hit a planet → enter'}
      </div>

      {hitPlanet && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 400,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', animation: 'fadeIn 0.2s ease', pointerEvents: 'none',
        }}>
          <div style={{ color: 'white', fontSize: 28, fontFamily: 'monospace', letterSpacing: 4, textTransform: 'uppercase', textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>
            → {hitPlanet}
          </div>
        </div>
      )}

      {noCamera && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12, background: 'rgba(2,2,8,0.95)',
        }}>
          <div style={{ fontSize: 40 }}>📷</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.8 }}>no camera available</div>
          <button onClick={() => router.push('/')} style={{
            marginTop: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)', padding: '8px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
          }}>return to solar system</button>
        </div>
      )}

      <style jsx global>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  )
}
