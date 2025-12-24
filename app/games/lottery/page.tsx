'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LotteryPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const router = useRouter()

  const [menuOpen, setMenuOpen] = useState(false)
  const [infiniteUnlocked, setInfiniteUnlocked] = useState(false)

  const unlockRef = useRef<() => void>(() => {})
  const removeBallsRef = useRef<() => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    /* ===== Sam 贴图 ===== */
    const samImg = new Image()
    samImg.src = '/avatar.jpg'

    type State = {
      w: number
      h: number
      gravity: number
      friction: number
      balls: Ball[]
      mouseX: number
      mouseY: number
      hasGlobalDrawn: boolean
      infiniteChance: boolean
    }

    const state: State = {
      w: window.innerWidth,
      h: window.innerHeight,
      gravity: 0.35,
      friction: 0.985,
      balls: [],
      mouseX: 0,
      mouseY: 0,
      hasGlobalDrawn: false,
      infiniteChance: false,
    }

    unlockRef.current = () => {
      state.infiniteChance = true
      state.hasGlobalDrawn = false
      state.balls.forEach(b => (b.hasDrawn = false))
      localStorage.setItem('infinite-lottery', 'true')
    }

    removeBallsRef.current = () => {
      state.balls.splice(0, 5)
    }

    function resize() {
      state.w = window.innerWidth
      state.h = window.innerHeight
      canvas.width = state.w
      canvas.height = state.h
    }
    resize()
    window.addEventListener('resize', resize)

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const randomColor = () => `hsl(${Math.random() * 360},70%,60%)`

    class Ball {
      x: number
      y: number
      r: number
      baseR: number
      vx: number
      vy: number
      mass: number
      color: string
      baseColor: string

      isHovered = false
      isWinner = false
      isLoser = false
      hasDrawn = false

      /* ⭐ Sam 球标记 */
      isSam = false

      hue = Math.random() * 360
      flash = 0

      constructor(
        x: number,
        y: number,
        r: number,
        color: string,
        vx: number,
        vy: number,
        isSam = false
      ) {
        this.x = x
        this.y = y
        this.r = r
        this.baseR = r
        this.vx = vx
        this.vy = vy
        this.baseColor = color
        this.color = color
        this.mass = r * r
        this.isSam = isSam
      }

      contains(mx: number, my: number) {
        return Math.hypot(this.x - mx, this.y - my) <= this.r
      }

      update() {
        this.flash++

        /* ===== Sam 球：只物理，不抽奖 ===== */
        if (this.isSam) {
          this.vy += state.gravity * 0.6
          this.x += this.vx
          this.y += this.vy

          if (this.y + this.r > state.h) {
            this.y = state.h - this.r
            this.vy *= -state.friction
          }
          if (this.x + this.r > state.w || this.x - this.r < 0) {
            this.vx *= -state.friction
          }

          this.drawSam()
          return
        }

        /* ===== 原有逻辑 ===== */
        this.flash++

        if (this.isHovered && !this.hasDrawn) {
          this.x = state.mouseX
          this.y = state.mouseY
          this.color = this.flash % 30 < 15 ? '#aaa' : '#777'
          this.r = this.baseR * (1 + Math.sin(this.flash * 0.3) * 0.15)
          this.draw()
          return
        }

        this.r = this.baseR

        if (this.isWinner) {
          this.hue = (this.hue + 4) % 360
          this.color = `hsl(${this.hue},100%,60%)`
        }

        if (this.isLoser) {
          this.color = this.flash % 20 < 10 ? 'black' : '#222'
        }

        const g = this.isLoser ? state.gravity * 2.2 : state.gravity
        this.vy += g
        this.x += this.vx
        this.y += this.vy

        if (this.y + this.r > state.h) {
          this.y = state.h - this.r
          this.vy = Math.abs(this.vy) < 1 ? 0 : -this.vy * state.friction
        }

        if (this.x + this.r > state.w || this.x - this.r < 0) {
          this.vx = -this.vx * state.friction
        }

        this.draw()
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }

      drawSam() {
        ctx.save()
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(
          samImg,
          this.x - this.r,
          this.y - this.r,
          this.r * 2,
          this.r * 2
        )
        ctx.restore()
      }
    }

    function animate() {
      ctx.clearRect(0, 0, state.w, state.h)
      state.balls.forEach(b => b.update())
      requestAnimationFrame(animate)
    }
    animate()

    function addBalls(n: number) {
      for (let i = 0; i < n; i++) {
        /* ⭐ 1% Sam 球 */
        const isSam = Math.random() < 0.05

        if (isSam) {
          state.balls.push(
            new Ball(
              rand(100, state.w - 100),
              -200,
              90,
              '#fff',
              rand(-4, 4),
              rand(-6, 0),
              true
            )
          )
        } else {
          const r = rand(14, 34)
          state.balls.push(
            new Ball(
              rand(r, state.w - r),
              -rand(50, 150),
              r,
              randomColor(),
              rand(-6, 6),
              rand(-10, 2)
            )
          )
        }
      }
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      state.mouseX = e.clientX - rect.left
      state.mouseY = e.clientY - rect.top

      state.balls.forEach(b => {
        b.isHovered =
          !b.isSam &&
          (!state.hasGlobalDrawn || state.infiniteChance) &&
          !b.hasDrawn &&
          b.contains(state.mouseX, state.mouseY)
      })
    }

    function onCanvasClick() {
      for (const b of state.balls) {
        /* ⭐ Sam 球点击 */
        if (b.isSam && b.contains(state.mouseX, state.mouseY)) {
          window.open('https://www.youtube.com/watch?v=j51rWeuByEM', '_blank')
          return
        }

        if (
          !b.isSam &&
          b.isHovered &&
          !b.hasDrawn &&
          (!state.hasGlobalDrawn || state.infiniteChance)
        ) {
          b.hasDrawn = true
          if (!state.infiniteChance) state.hasGlobalDrawn = true

          if (Math.random() < 0.3) {
            b.isWinner = true
            setTimeout(() => router.push('/prize'), 600)
          } else {
            alert(
              'you lose and now succumb to the glory of omnipotent Sam! 67 67 67'
            )
            b.isLoser = true
            b.mass *= 3.5
            b.vx *= 0.1
            b.vy = 30
          }
          return
        }
      }
    }

    document.getElementById('lottery-btn')?.addEventListener('click', () => addBalls(6))
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onCanvasClick)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onCanvasClick)
    }
  }, [router])

  return (
    <div style={{ margin: 0, overflow: 'hidden' }}>
      {/* ===== Menu ===== */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 200 }}>
        <button onClick={() => setMenuOpen(!menuOpen)}>☰ Menu</button>

        {menuOpen && (
          <div
            style={{
              background: '#111',
              color: '#fff',
              padding: 12,
              borderRadius: 6,
              minWidth: 180,
            }}
          >
            <div
              onClick={() => {
                if (!infiniteUnlocked) {
                  unlockRef.current()
                  setInfiniteUnlocked(true)
                }
              }}
              style={{
                cursor: infiniteUnlocked ? 'default' : 'pointer',
                opacity: infiniteUnlocked ? 0.6 : 1,
                marginBottom: 10,
              }}
            >
              ☉ Infinite Lottery
            </div>

            <div
              onClick={() => removeBallsRef.current()}
              style={{ cursor: 'pointer' }}
            >
              −5 Balls
            </div>
          </div>
        )}
      </div>

      {/* ===== Click Me + Sam ===== */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          textAlign: 'center',
        }}
      >
        <button
          id="lottery-btn"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 18,
            color: '#000',
            background: '#47e1d4',
            border: '3px solid #000',
            padding: '12px 20px',
            cursor: 'pointer',
          }}
        >
          CLICK ME +6
        </button>

        <div
          onClick={() => router.push('/sam')}
          style={{
            marginTop: 8,
            fontSize: 14,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Sam is so smart
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'block', background: '#fff' }} />
    </div>
  )
}
