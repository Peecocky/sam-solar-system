'use client'

import { useEffect, useRef } from 'react'

export default function SamPage() {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let angle = 0
    const el = imgRef.current!

    function animate() {
      angle += 0.3
      el.style.transform = `rotate(${angle}deg)`
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        ref={imgRef}
        src="/avatar.jpg"
        alt="sam"
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          marginBottom: 20,
        }}
      />
      <div style={{ fontSize: 24, letterSpacing: 2 }}>sam</div>
    </div>
  )
}
