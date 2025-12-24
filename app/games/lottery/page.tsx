'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function LotteryPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    type State = {
      w: number
      h: number
      gravity: number
      friction: number
      balls: Ball[]
      mouseX: number
      mouseY: number
      hasGlobalDrawn: boolean
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
    }

    function resize(): void {
      state.w = window.innerWidth
      state.h = window.innerHeight
      canvas.width = state.w
      canvas.height = state.h
    }
    resize()
    window.addEventListener('resize', resize)

    const rand = (a: number, b: number): number =>
      a + Math.random() * (b - a)

    const randomColor = (): string =>
      `hsl(${Math.random() * 360}, 70%, 60%)`

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
      hue = Math.random() * 360
      flash = 0

      constructor(
        x: number,
        y: number,
        r: number,
        color: string,
        vx: number,
        vy: number
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
      }

      contains(mx: number, my: number): boolean {
        const dx = this.x - mx
        const dy = this.y - my
        return Math.hypot(dx, dy) <= this.r
      }

      update(): void {
        this.flash++

        if (this.isHovered && !this.hasDrawn) {
          this.x = state.mouseX
          this.y = state.mouseY
          this.color = this.flash % 30 < 15 ? '#aaa' : '#777'
          this.r =
            this.baseR * (1 + Math.sin(this.flash * 0.3) * 0.15)
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
          this.vy =
            Math.abs(this.vy) < 1 ? 0 : -this.vy * state.friction
        }

        if (this.x + this.r > state.w) {
          this.x = state.w - this.r
          this.vx = -this.vx * state.friction
        }
        if (this.x - this.r < 0) {
          this.x = this.r
          this.vx = -this.vx * state.friction
        }

        this.draw()
      }

      draw(): void {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    function resolveCollision(b1: Ball, b2: Ball): void {
      const dx = b2.x - b1.x
      const dy = b2.y - b1.y
      const dist = Math.hypot(dx, dy) || 0.001
      const min = b1.r + b2.r
      if (dist >= min) return

      const nx = dx / dist
      const ny = dy / dist
      const overlap = min - dist
      const total = b1.mass + b2.mass

      b1.x -= nx * overlap * (b2.mass / total)
      b1.y -= ny * overlap * (b2.mass / total)
      b2.x += nx * overlap * (b1.mass / total)
      b2.y += ny * overlap * (b1.mass / total)

      const rvx = b2.vx - b1.vx
      const rvy = b2.vy - b1.vy
      const vel = rvx * nx + rvy * ny
      if (vel > 0) return

      const j = -(1.1 * vel) / (1 / b1.mass + 1 / b2.mass)
      b1.vx -= (j * nx) / b1.mass
      b1.vy -= (j * ny) / b1.mass
      b2.vx += (j * nx) / b2.mass
      b2.vy += (j * ny) / b2.mass
    }

    function animate(): void {
      ctx.clearRect(0, 0, state.w, state.h)
      for (let i = 0; i < state.balls.length; i++) {
        for (let j = i + 1; j < state.balls.length; j++) {
          resolveCollision(state.balls[i], state.balls[j])
        }
      }
      state.balls.forEach((b: Ball) => b.update())
      requestAnimationFrame(animate)
    }
    animate()

    function addBalls(n: number): void {
      for (let i = 0; i < n; i++) {
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

    function onMouseMove(e: MouseEvent): void {
      const rect = canvas.getBoundingClientRect()
      state.mouseX = e.clientX - rect.left
      state.mouseY = e.clientY - rect.top
      state.balls.forEach((b: Ball) => {
        b.isHovered =
          !state.hasGlobalDrawn &&
          !b.hasDrawn &&
          b.contains(state.mouseX, state.mouseY)
      })
    }

    function onCanvasClick(): void {
      if (state.hasGlobalDrawn) return
      for (const b of state.balls) {
        if (b.isHovered && !b.hasDrawn) {
          b.hasDrawn = true
          state.hasGlobalDrawn = true
          if (Math.random() < 0.3) {
            alert('恭喜你中奖了！')
            b.isWinner = true
            const k = 30 + Math.random() * 20
            b.vx += (Math.random() - 0.5) * k
            b.vy -= 20 + Math.random() * 20
          } else {
            alert('运气太差,球球生气了！')
            b.isLoser = true
            b.mass *= 3.5
            b.vx *= 0.1
            b.vy = 30
          }
          break
        }
      }
    }

    function onButtonClick(): void {
      addBalls(6)
    }

    function onKeyDown(e: KeyboardEvent): void {
      if (e.key === 'x' || e.key === 'X') {
        state.balls.splice(0, 5)
      }
    }

    document
      .getElementById('lottery-btn')
      ?.addEventListener('click', onButtonClick)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onCanvasClick)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onCanvasClick)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div style={{ margin: 0, overflow: 'hidden' }}>
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
            padding: '10px 20px',
            fontSize: 16,
            background: '#47e1d4',
            borderRadius: 5,
            border: '2px solid aqua',
            boxShadow: '5px 5px 10px skyblue',
            cursor: 'pointer',
          }}
        >
          Click Me (+6)
        </button>

        <div
          onClick={() => router.push('/sam')}
          style={{
            marginTop: 6,
            fontSize: 14,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Sam is so smart
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ display: 'block', background: '#fff' }}
      />
    </div>
  )
}
