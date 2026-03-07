'use client'

import { Canvas } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import { Stars, OrbitControls } from '@react-three/drei'
import SolarSystem from '@/components/SolarSystem'

/* ===== Notifications ===== */
const NOTIFICATIONS = [
  { id: 'v1-notice', text: 'New: Notification system added.' },
  { id: 'v1-kitchen', text: "Sam's Kitchen is still under construction." },
  { id: 'v1-art', text: 'Art Gallery is still under construction.' },
]

export default function Home() {
  const [hoverText, setHoverText] = useState<string | null>(null)
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('sam-notices-seen')
    if (!seen) {
      setShowNotice(true)
    }
  }, [])

  function dismissNotice() {
    localStorage.setItem('sam-notices-seen', 'true')
    setShowNotice(false)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#010108',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ===== HUD ===== */}
      <div
        style={{
          position: 'fixed',
          top: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 28,
          fontWeight: 300,
          letterSpacing: 8,
          fontFamily: "'Courier New', monospace",
          color: 'rgba(255,255,255,0.9)',
          pointerEvents: 'none',
          opacity: hoverText ? 1 : 0,
          transition: 'opacity 0.35s ease',
          textShadow:
            '0 0 20px rgba(100,150,255,0.4), 0 0 60px rgba(80,120,255,0.15)',
          zIndex: 999,
          textTransform: 'uppercase',
        }}
      >
        {hoverText}
      </div>

      {/* ===== Vignette ===== */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,10,0.6) 100%)',
          zIndex: 10,
        }}
      />

      <Canvas camera={{ position: [0, 12, 35], fov: 45 }}>
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffddaa" />
        <pointLight position={[0, 20, 0]} intensity={0.3} color="#4466ff" />

        <Stars
          radius={400}
          depth={80}
          count={15000}
          factor={5}
          saturation={0.2}
          fade
          speed={0.5}
        />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          enableDamping
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={80}
          maxPolarAngle={Math.PI * 0.85}
          panSpeed={0.5}
          rotateSpeed={0.6}
        />

        <SolarSystem setHoverText={setHoverText} />
      </Canvas>

      {/* ===== Notification Overlay ===== */}
      {showNotice && (
        <>
          <style jsx global>{`
            @keyframes noticeFadeIn {
              from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            @keyframes borderPulse {
              0%, 100% { border-color: rgba(255,255,255,0.12); }
              50% { border-color: rgba(255,255,255,0.3); }
            }
          `}</style>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('sam-music-choice', { detail: 'off' }))
              dismissNotice()
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2001,
              background: 'rgba(8,8,16,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 2,
              padding: '36px 44px',
              maxWidth: 420,
              width: '90vw',
              animation: 'noticeFadeIn 0.3s ease, borderPulse 3s ease-in-out infinite',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#fff',
                  animation: 'blink 1.5s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                Notice
              </span>
            </div>

            {/* Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {NOTIFICATIONS.map((n, i) => (
                <div
                  key={n.id}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.7,
                    paddingLeft: 16,
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  {n.text}
                </div>
              ))}
            </div>

            {/* Music choice + Enter */}
            <div style={{
              marginTop: 28,
              borderTop: '1px solid rgba(255,255,255,0.04)',
              paddingTop: 20,
            }}>
              <div style={{
                fontFamily: 'monospace',
                fontSize: 10,
                letterSpacing: 3,
                color: 'rgba(255,255,255,0.15)',
                textAlign: 'center',
                marginBottom: 14,
                textTransform: 'uppercase',
              }}>
                background music?
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('sam-music-choice', { detail: 'on' }))
                    dismissNotice()
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.5)',
                    padding: '8px 24px',
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: 2,
                    cursor: 'pointer',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                  }}
                >
                  ♪ Enter
                </button>
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('sam-music-choice', { detail: 'off' }))
                    dismissNotice()
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.2)',
                    padding: '8px 24px',
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: 2,
                    cursor: 'pointer',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.2)'
                  }}
                >
                  Silent
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
