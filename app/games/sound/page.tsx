'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function SoundHuntPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'intro' | 'requesting' | 'denied' | 'hunting' | 'found' | 'desktop'>('intro')
  const [proximity, setProximity] = useState(0) // 0..1, 1 = right on top
  const [direction, setDirection] = useState<'left' | 'right' | 'center'>('center')
  const [pulseSpeed, setPulseSpeed] = useState(2) // seconds per pulse

  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const pannerRef = useRef<StereoPannerNode | null>(null)
  const targetAngleRef = useRef(0)
  const proximityRef = useRef(0)
  const foundRef = useRef(false)

  // Check if mobile
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 0 && window.innerWidth < 1024)
    if (!isMobile) {
      setPhase('desktop')
    }
  }, [])

  const startHunt = useCallback(async () => {
    setPhase('requesting')

    // Request device orientation permission (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const perm = await (DeviceOrientationEvent as any).requestPermission()
        if (perm !== 'granted') {
          setPhase('denied')
          return
        }
      } catch {
        setPhase('denied')
        return
      }
    }

    // Random target angle 0..360
    targetAngleRef.current = Math.random() * 360
    foundRef.current = false

    // Setup Web Audio
    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    // Create a ping sound chain
    const gain = ctx.createGain()
    gain.gain.value = 0
    gainRef.current = gain

    const panner = ctx.createStereoPanner()
    panner.pan.value = 0
    pannerRef.current = panner

    // Use oscillator for the "ping" — ethereal tone
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 440
    oscillatorRef.current = osc

    // Second oscillator for harmonic
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 660

    const gain2 = ctx.createGain()
    gain2.gain.value = 0.3

    osc.connect(gain)
    osc2.connect(gain2)
    gain2.connect(gain)
    gain.connect(panner)
    panner.connect(ctx.destination)

    osc.start()
    osc2.start()

    // Ping pattern — periodic volume swells
    function ping() {
      if (foundRef.current) return
      const g = gainRef.current
      if (!g || !ctx) return

      const baseVol = proximityRef.current
      const t = ctx.currentTime

      // Swell in and out
      g.gain.cancelScheduledValues(t)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(baseVol * 0.8, t + 0.15)
      g.gain.linearRampToValueAtTime(baseVol * 0.5, t + 0.4)
      g.gain.linearRampToValueAtTime(0, t + 0.8)

      // Schedule next ping — faster when closer
      const interval = 800 + (1 - proximityRef.current) * 2200 // 800ms..3000ms
      setTimeout(ping, interval)
    }

    setTimeout(ping, 500)

    // Listen to device orientation
    function onOrientation(e: DeviceOrientationEvent) {
      if (foundRef.current) return
      const alpha = e.alpha ?? 0 // compass heading 0..360

      const target = targetAngleRef.current
      let diff = alpha - target
      // Normalize to -180..180
      while (diff > 180) diff -= 360
      while (diff < -180) diff += 360

      const absDiff = Math.abs(diff)

      // Proximity: 0 at 180° away, 1 at 0°
      const prox = Math.max(0, 1 - absDiff / 180)
      const smoothProx = prox * prox // exponential for more dramatic effect
      proximityRef.current = smoothProx

      setProximity(smoothProx)
      setPulseSpeed(0.3 + (1 - smoothProx) * 2.5)

      // Direction for UI hint
      if (absDiff < 15) setDirection('center')
      else if (diff > 0) setDirection('right')
      else setDirection('left')

      // Stereo panning
      if (pannerRef.current) {
        const pan = Math.max(-1, Math.min(1, diff / 90))
        pannerRef.current.pan.value = pan
      }

      // Pitch shift — higher when closer
      if (oscillatorRef.current) {
        oscillatorRef.current.frequency.value = 350 + smoothProx * 300
      }

      // Found! (within ~10 degrees)
      if (absDiff < 10 && !foundRef.current) {
        foundRef.current = true
        setPhase('found')

        // Victory sound
        if (gainRef.current && audioCtxRef.current) {
          const t = audioCtxRef.current.currentTime
          gainRef.current.gain.cancelScheduledValues(t)
          gainRef.current.gain.setValueAtTime(0.7, t)
          gainRef.current.gain.linearRampToValueAtTime(0, t + 1.5)
          if (oscillatorRef.current) {
            oscillatorRef.current.frequency.linearRampToValueAtTime(880, t + 0.5)
          }
        }

        // Navigate after delay
        setTimeout(() => {
          cleanup()
          router.push('/music')
        }, 2000)
      }
    }

    window.addEventListener('deviceorientation', onOrientation)

    setPhase('hunting')

    // Cleanup function stored for later
    ;(window as any).__soundHuntCleanup = () => {
      window.removeEventListener('deviceorientation', onOrientation)
      try { osc.stop() } catch {}
      try { osc2.stop() } catch {}
      try { ctx.close() } catch {}
    }
  }, [router])

  function cleanup() {
    if ((window as any).__soundHuntCleanup) {
      (window as any).__soundHuntCleanup()
      delete (window as any).__soundHuntCleanup
    }
  }

  useEffect(() => {
    return () => cleanup()
  }, [])

  // Proximity bar color
  function getColor(p: number) {
    if (p > 0.8) return '#06d6a0'
    if (p > 0.5) return '#ffbe0b'
    if (p > 0.2) return '#ff8c00'
    return '#ff006e'
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

        .sound-page {
          font-family: 'Space Mono', monospace;
          background: #050508;
          color: white;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          text-align: center;
          padding: 24px;
        }

        .sound-back {
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 100;
          background: none;
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.2);
          padding: 6px 14px;
          font: 11px 'Space Mono', monospace;
          letter-spacing: 1px;
          cursor: pointer;
          border-radius: 3px;
        }

        .radar-ring {
          width: 240px;
          height: 240px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 24px auto;
        }
        .radar-ring::before {
          content: '';
          position: absolute;
          inset: 20px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .radar-ring::after {
          content: '';
          position: absolute;
          inset: 50px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .radar-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          animation: radarPulse var(--pulse-speed) ease-in-out infinite;
        }
        @keyframes radarPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; box-shadow: 0 0 20px currentColor; }
          50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 40px currentColor, 0 0 80px currentColor; }
        }

        .prox-bar-bg {
          width: 200px;
          height: 4px;
          background: rgba(255,255,255,0.04);
          border-radius: 2px;
          margin: 16px auto;
          overflow: hidden;
        }
        .prox-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.15s, background 0.3s;
        }

        .direction-arrow {
          font-size: 24px;
          opacity: 0.4;
          margin: 8px 0;
          transition: opacity 0.2s;
        }

        .found-flash {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle, rgba(6,214,160,0.3), transparent 70%);
          animation: foundFlash 1.5s ease-out;
          pointer-events: none;
          z-index: 50;
        }
        @keyframes foundFlash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        .start-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          font: 14px 'Space Mono', monospace;
          letter-spacing: 3px;
          padding: 14px 36px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
          text-transform: uppercase;
          margin-top: 20px;
        }
        .start-btn:hover, .start-btn:active {
          background: rgba(255,255,255,0.08);
          color: white;
        }
      `}</style>

      <div className="sound-page">
        <button className="sound-back" onClick={() => { cleanup(); router.push('/games') }}>
          ← Back
        </button>

        {/* Desktop warning */}
        {phase === 'desktop' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📱</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 12, textTransform: 'uppercase' }}>
              Mobile Only
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)', lineHeight: 2, maxWidth: 300 }}>
              This experience uses your phone&apos;s gyroscope to track rotation.
              <br />Please visit on a mobile device.
            </div>
            <button className="start-btn" onClick={() => router.push('/games')} style={{ marginTop: 24 }}>
              Back to Map
            </button>
          </>
        )}

        {/* Intro */}
        {phase === 'intro' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎧</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>
              Sound Hunt
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', lineHeight: 2.2, maxWidth: 300, marginBottom: 6 }}>
              A sound is hidden somewhere around you.
              <br />Rotate your phone to find it.
              <br />The closer you face the source, the louder it gets.
            </div>
            <div style={{
              fontSize: 11, color: '#ffbe0b', letterSpacing: 2,
              marginTop: 16, marginBottom: 4,
              padding: '8px 16px',
              border: '1px solid rgba(255,190,11,0.15)',
              borderRadius: 4,
              background: 'rgba(255,190,11,0.04)',
            }}>
              🎧 Wear headphones for best experience
            </div>
            <button className="start-btn" onClick={startHunt}>
              Begin
            </button>
          </>
        )}

        {/* Permission denied */}
        {phase === 'denied' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, lineHeight: 2, maxWidth: 300 }}>
              Motion sensor access is required.
              <br />Please allow access and try again.
            </div>
            <button className="start-btn" onClick={startHunt}>
              Retry
            </button>
          </>
        )}

        {/* Requesting */}
        {phase === 'requesting' && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', letterSpacing: 3, animation: 'radarPulse 1.5s infinite' }}>
            requesting access...
          </div>
        )}

        {/* Hunting */}
        {phase === 'hunting' && (
          <>
            <div style={{
              fontSize: 10, letterSpacing: 4, color: 'rgba(255,255,255,0.1)',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              Searching...
            </div>

            {/* Direction hint */}
            <div className="direction-arrow" style={{
              opacity: proximity < 0.85 ? 0.4 : 0,
            }}>
              {direction === 'left' ? '← turn left' : direction === 'right' ? 'turn right →' : '·'}
            </div>

            {/* Radar visualization */}
            <div className="radar-ring">
              <div
                className="radar-dot"
                style={{
                  background: getColor(proximity),
                  color: getColor(proximity),
                  '--pulse-speed': `${pulseSpeed}s`,
                } as React.CSSProperties}
              />
            </div>

            {/* Proximity bar */}
            <div className="prox-bar-bg">
              <div
                className="prox-bar-fill"
                style={{
                  width: `${proximity * 100}%`,
                  background: getColor(proximity),
                }}
              />
            </div>

            <div style={{
              fontSize: 28, fontWeight: 700, color: getColor(proximity),
              margin: '8px 0',
              transition: 'color 0.3s',
            }}>
              {Math.round(proximity * 100)}%
            </div>

            <div style={{
              fontSize: 9, color: 'rgba(255,255,255,0.08)', letterSpacing: 2,
              marginTop: 8,
            }}>
              ROTATE YOUR PHONE SLOWLY
            </div>
          </>
        )}

        {/* Found */}
        {phase === 'found' && (
          <>
            <div className="found-flash" />
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
            <div style={{
              fontSize: 16, letterSpacing: 6, color: '#06d6a0',
              textTransform: 'uppercase',
              animation: 'radarPulse 1s ease infinite',
            }}>
              Found it!
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.15)',
              marginTop: 12, letterSpacing: 2,
            }}>
              entering playlist...
            </div>
          </>
        )}
      </div>
    </>
  )
}
