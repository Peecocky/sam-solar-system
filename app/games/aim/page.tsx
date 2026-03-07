'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const TOTAL_TARGETS = 30
const TARGET_SIZE = 64
const ARENA_PADDING = 40

type Target = { x: number; y: number; id: number; spawned: number }

export default function AimPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle')
  const [target, setTarget] = useState<Target | null>(null)
  const [hits, setHits] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const [misses, setMisses] = useState(0)
  const arenaRef = useRef<HTMLDivElement>(null)
  const hitsRef = useRef(0)
  const timesRef = useRef<number[]>([])
  const missesRef = useRef(0)

  const spawnTarget = useCallback(() => {
    const arena = arenaRef.current
    if (!arena) return
    const rect = arena.getBoundingClientRect()
    const maxX = rect.width - TARGET_SIZE - ARENA_PADDING * 2
    const maxY = rect.height - TARGET_SIZE - ARENA_PADDING * 2
    const x = ARENA_PADDING + Math.random() * maxX
    const y = ARENA_PADDING + Math.random() * maxY
    setTarget({ x, y, id: Date.now(), spawned: performance.now() })
  }, [])

  function startGame() {
    setPhase('playing')
    setHits(0)
    setTimes([])
    setMisses(0)
    hitsRef.current = 0
    timesRef.current = []
    missesRef.current = 0
    setTimeout(() => spawnTarget(), 300)
  }

  function handleTargetClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!target) return
    const reaction = performance.now() - target.spawned
    const newHits = hitsRef.current + 1
    hitsRef.current = newHits
    timesRef.current = [...timesRef.current, reaction]
    setHits(newHits)
    setTimes(timesRef.current)
    if (newHits >= TOTAL_TARGETS) {
      setTarget(null)
      setPhase('done')
    } else {
      spawnTarget()
    }
  }

  function handleArenaMiss() {
    if (phase !== 'playing' || !target) return
    missesRef.current++
    setMisses(missesRef.current)
  }

  const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
  const bestTime = times.length > 0 ? Math.round(Math.min(...times)) : 0
  const worstTime = times.length > 0 ? Math.round(Math.max(...times)) : 0
  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0

  function getRating(avg: number) {
    if (avg === 0) return { label: '', color: '' }
    if (avg < 250) return { label: 'GODLIKE', color: '#ff006e' }
    if (avg < 350) return { label: 'EXCELLENT', color: '#06d6a0' }
    if (avg < 450) return { label: 'GREAT', color: '#3a86ff' }
    if (avg < 600) return { label: 'GOOD', color: '#ffbe0b' }
    if (avg < 800) return { label: 'AVERAGE', color: '#8a8690' }
    return { label: 'SLOW', color: '#ff5252' }
  }
  const rating = getRating(avgTime)

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        html, body { margin: 0; padding: 0; overflow: hidden; height: 100vh; }

        .aim-page {
          font-family: 'Space Mono', monospace;
          background: #0a0a12;
          color: white;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: row;
          user-select: none;
          overflow: hidden;
        }

        /* Left sidebar */
        .aim-sidebar {
          width: 220px;
          min-width: 220px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px 18px;
          border-right: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.01);
          z-index: 10;
        }
        .aim-sidebar .logo {
          font-size: 11px;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.12);
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .aim-sidebar .logo span {
          font-size: 24px;
          display: block;
          margin-bottom: 6px;
        }

        .aim-back {
          background: none;
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.25);
          padding: 6px 14px;
          font: 11px 'Space Mono', monospace;
          letter-spacing: 1px;
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
        }
        .aim-back:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.5);
        }

        .sidebar-stats {
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
          justify-content: center;
        }
        .sidebar-stat {
          border-left: 2px solid rgba(255,255,255,0.04);
          padding-left: 12px;
        }
        .sidebar-stat .val {
          font-size: 20px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
        }
        .sidebar-stat .lbl {
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.12);
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* Arena */
        .aim-arena {
          flex: 1;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.008) 0%, transparent 70%),
            #0a0a12;
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text y='24' font-size='24'>🪣</text></svg>") 16 16, crosshair;
        }

        /* Target */
        .poop-target {
          position: absolute;
          width: ${TARGET_SIZE}px;
          height: ${TARGET_SIZE}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 44px;
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text y='24' font-size='24'>🪣</text></svg>") 16 16, pointer;
          animation: poopIn 0.12s cubic-bezier(0.16,1,0.3,1);
          filter: drop-shadow(0 0 12px rgba(139,90,43,0.4));
          transition: transform 0.06s;
          z-index: 5;
        }
        .poop-target:hover { transform: scale(1.1); }
        .poop-target:active { transform: scale(0.8); }
        @keyframes poopIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .poop-target::after {
          content: '';
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(139,90,43,0.15);
          animation: ringPulse 1.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 0; }
        }

        /* Progress */
        .aim-progress {
          position: absolute;
          top: 0; left: 0;
          height: 2px;
          background: rgba(255,255,255,0.06);
          transition: width 0.12s ease;
          z-index: 8;
        }

        /* Center overlay */
        .aim-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .aim-big-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          font: 14px 'Space Mono', monospace;
          letter-spacing: 3px;
          padding: 12px 36px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
          text-transform: uppercase;
        }
        .aim-big-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          color: white;
        }

        /* Results - horizontal layout */
        .results-wrap {
          display: flex;
          align-items: center;
          gap: 50px;
          max-width: 800px;
        }
        .results-main {
          text-align: center;
          min-width: 220px;
        }
        .results-avg {
          font-size: 72px;
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1;
          margin: 6px 0;
        }
        .results-unit {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 4px;
          text-transform: uppercase;
        }
        .results-rating {
          font-size: 13px;
          letter-spacing: 5px;
          margin-top: 8px;
        }
        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .results-stat {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 4px;
          padding: 14px 18px;
          min-width: 110px;
        }
        .results-stat .val {
          font-size: 20px;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
        }
        .results-stat .lbl {
          font-size: 9px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 2px;
          margin-top: 3px;
          text-transform: uppercase;
        }
        .results-btns {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
      `}</style>

      <div className="aim-page">
        {/* Sidebar */}
        <div className="aim-sidebar">
          <div>
            <div className="logo">
              <span>💩🪣</span>
              Poop Scooper
            </div>
            <button className="aim-back" onClick={() => router.push('/')}>
              ← Back
            </button>
          </div>

          {phase === 'playing' ? (
            <div className="sidebar-stats">
              <div className="sidebar-stat">
                <div className="val">{hits}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>/{TOTAL_TARGETS}</span></div>
                <div className="lbl">Hits</div>
              </div>
              {times.length > 0 && (
                <div className="sidebar-stat">
                  <div className="val">{Math.round(times[times.length - 1])}<span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>ms</span></div>
                  <div className="lbl">Last</div>
                </div>
              )}
              {times.length > 1 && (
                <div className="sidebar-stat">
                  <div className="val">{Math.round(times.reduce((a, b) => a + b, 0) / times.length)}<span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>ms</span></div>
                  <div className="lbl">Avg</div>
                </div>
              )}
              {misses > 0 && (
                <div className="sidebar-stat" style={{ borderColor: 'rgba(255,80,80,0.15)' }}>
                  <div className="val" style={{ color: 'rgba(255,80,80,0.5)' }}>{misses}</div>
                  <div className="lbl">Miss</div>
                </div>
              )}
            </div>
          ) : (
            <div className="sidebar-stats">
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.08)', letterSpacing: 2, lineHeight: 2 }}>
                CLICK {TOTAL_TARGETS} TARGETS
                <br />AS FAST AS YOU CAN
              </div>
            </div>
          )}

          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.06)', letterSpacing: 1 }}>
            SAM&apos;S SOLAR SYSTEM
          </div>
        </div>

        {/* Arena */}
        <div
          className="aim-arena"
          ref={arenaRef}
          onClick={handleArenaMiss}
        >
          {phase === 'playing' && (
            <div className="aim-progress" style={{ width: `${(hits / TOTAL_TARGETS) * 100}%` }} />
          )}

          {/* Idle */}
          {phase === 'idle' && (
            <div className="aim-center">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.1)', letterSpacing: 4, marginBottom: 20, textTransform: 'uppercase' }}>
                  Reaction Speed Test
                </div>
                <button className="aim-big-btn" onClick={startGame}>
                  Start
                </button>
              </div>
            </div>
          )}

          {/* Target */}
          {phase === 'playing' && target && (
            <div
              key={target.id}
              className="poop-target"
              style={{ left: target.x, top: target.y }}
              onClick={handleTargetClick}
            >
              💩
            </div>
          )}

          {/* Results */}
          {phase === 'done' && (
            <div className="aim-center">
              <div className="results-wrap">
                <div className="results-main">
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🪣💩</div>
                  <div className="results-unit">Average Reaction</div>
                  <div className="results-avg" style={{ color: rating.color }}>
                    {avgTime}
                    <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>ms</span>
                  </div>
                  <div className="results-rating" style={{ color: rating.color }}>
                    {rating.label}
                  </div>
                </div>

                <div>
                  <div className="results-grid">
                    <div className="results-stat">
                      <div className="val">{bestTime}ms</div>
                      <div className="lbl">Best</div>
                    </div>
                    <div className="results-stat">
                      <div className="val">{worstTime}ms</div>
                      <div className="lbl">Worst</div>
                    </div>
                    <div className="results-stat">
                      <div className="val">{accuracy}%</div>
                      <div className="lbl">Accuracy</div>
                    </div>
                    <div className="results-stat">
                      <div className="val">{misses}</div>
                      <div className="lbl">Misses</div>
                    </div>
                  </div>
                  <div className="results-btns">
                    <button className="aim-big-btn" onClick={startGame}>Again</button>
                    <button className="aim-big-btn" onClick={() => router.push('/')} style={{ color: 'rgba(255,255,255,0.2)' }}>Home</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
