'use client'

import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { Stars, OrbitControls } from '@react-three/drei'
import SolarSystem from '@/components/SolarSystem'

export default function Home() {
  const [hoverText, setHoverText] = useState<string | null>(null)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'black',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 🧭 HUD */}
      <div
        style={{
          position: 'fixed',
          top: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: 3,
          color: 'white',
          pointerEvents: 'none',
          opacity: hoverText ? 1 : 0,
          transition: 'opacity 0.25s ease',
          textShadow: '0 6px 24px rgba(0,0,0,0.65)',
          zIndex: 999,
        }}
      >
        {hoverText}
      </div>

      <Canvas camera={{ position: [0, 10, 30], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 0]} intensity={2} />

        {/* 🌌 宇宙背景 */}
        <Stars
          radius={300}
          depth={60}
          count={20000}
          factor={7}
          saturation={0}
          fade
          speed={1}
        />

        {/* 🎥 相机控制 */}
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={15}
          maxDistance={60}
        />

        <SolarSystem setHoverText={setHoverText} />
      </Canvas>
    </div>
  )
}
