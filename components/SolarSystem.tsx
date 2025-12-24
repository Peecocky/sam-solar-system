'use client'

import { useLoader, useFrame } from '@react-three/fiber'
import {
  TextureLoader,
  MeshBasicMaterial,
  AdditiveBlending,
} from 'three'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Planet from './Planet'

export default function SolarSystem({
  setHoverText,
}: {
  setHoverText: (t: string | null) => void
}) {
  const router = useRouter()

  /* ===== 慢动作系统 ===== */
  const timeScale = useRef(1)
  const targetTimeScale = useRef(1)

  /* ===== 太阳光晕 ===== */
  const glowRef = useRef<MeshBasicMaterial>(null!)
  const pulseTime = useRef(0)

  const sunTexture = useLoader(TextureLoader, '/avatar.jpg')

  useFrame((_, delta) => {
    timeScale.current += (targetTimeScale.current - timeScale.current) * 0.08
    pulseTime.current += delta

    const pulse = 0.5 + Math.sin(pulseTime.current * 2) * 0.5
    if (glowRef.current) {
      glowRef.current.opacity = 0.18 + pulse * 0.22
    }
  })

  return (
    <>
      {/* ===== ☀️ 太阳 ===== */}
      <mesh
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          setHoverText('About Me')
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
          setHoverText(null)
        }}
        onClick={() => router.push('/sam')}
      >
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial map={sunTexture} />
      </mesh>

      {/* ===== 太阳光晕 ===== */}
      <mesh scale={1.3}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial
          ref={glowRef}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* ===== 行星 1 ===== */}
      <Planet
        textureUrl="/planet1.jpg"
        size={1}
        a={8}
        b={6}
        speed={0.25}
        timeScale={timeScale}
        onHoverIn={() => {
          targetTimeScale.current = 0.15
          setHoverText('My Art Work')
        }}
        onHoverOut={() => {
          targetTimeScale.current = 1
          setHoverText(null)
        }}
        onClick={() => router.push('/art')}
      />

      {/* ===== 行星 2 ===== */}
      <Planet
        textureUrl="/planet2.jpg"
        size={1.5}
        a={13}
        b={7}
        speed={0.18}
        timeScale={timeScale}
        onHoverIn={() => {
          targetTimeScale.current = 0.15
          setHoverText('My CV')
        }}
        onHoverOut={() => {
          targetTimeScale.current = 1
          setHoverText(null)
        }}
        onClick={() => router.push('/cv')}
      />

      {/* ===== 行星 3 ===== */}
      <Planet
        textureUrl="/planet3.jpg"
        size={2}
        orbitType="star"
        starOuterR={18}
        starInnerR={8}
        speed={0.12}
        timeScale={timeScale}
        onHoverIn={() => {
          targetTimeScale.current = 0.15
          setHoverText('Mini Game')
        }}
        onHoverOut={() => {
          targetTimeScale.current = 1
          setHoverText(null)
        }}
        onClick={() => router.push('/games/lottery')}
      />
    </>
  )
}

