'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BIRTHDAY = '2001-09-11'

export default function BirthdayGate({
  children,
  backHref = '/',
  prompt = "When is Sam's birthday?",
}: {
  children: ReactNode
  backHref?: string
  prompt?: string
}) {
  const router = useRouter()
  const [unlocked, setUnlocked] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleUnlock() {
    if (value === BIRTHDAY) {
      setUnlocked(true)
      setError(false)
      return
    }

    setError(true)
  }

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(76,109,170,0.15), transparent 30%), #090b12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
        color: 'white',
        padding: 24,
      }}
    >
      <div
        style={{
          width: 'min(420px, 100%)',
          background: 'rgba(10, 14, 24, 0.9)',
          border: `1px solid ${
            error ? 'rgba(255,90,90,0.32)' : 'rgba(255,255,255,0.1)'
          }`,
          boxShadow: '0 24px 50px rgba(0,0,0,0.35)',
          padding: '30px 28px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
            marginBottom: 24,
          }}
        >
          Access Restricted
        </div>

        <div
          style={{
            fontSize: 22,
            lineHeight: 1.5,
            marginBottom: 10,
            fontFamily: "'Cormorant Garamond', serif",
            color: 'rgba(255,255,255,0.84)',
          }}
        >
          {prompt}
        </div>

        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.28)',
            marginBottom: 18,
          }}
        >
          format: YYYY-MM-DD
        </div>

        <input
          type="date"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(false)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleUnlock()
          }}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${
              error ? 'rgba(255,90,90,0.4)' : 'rgba(255,255,255,0.12)'
            }`,
            color: 'white',
            fontSize: 15,
            fontFamily: 'inherit',
            outline: 'none',
            marginBottom: 14,
          }}
        />

        {error && (
          <div
            style={{
              color: 'rgba(255,120,120,0.75)',
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            wrong answer
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleUnlock}
            style={{
              flex: 1,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.84)',
              padding: '12px 16px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Unlock
          </button>
          <button
            onClick={() => router.push(backHref)}
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.46)',
              padding: '12px 16px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
