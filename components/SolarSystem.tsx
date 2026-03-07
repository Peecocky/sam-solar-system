'use client'

import { useLoader, useFrame } from '@react-three/fiber'
import {
  TextureLoader,
  MeshBasicMaterial,
  AdditiveBlending,
  Color,
} from 'three'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Planet from './Planet'

export default function SolarSystem({
  setHoverText,
}: {
  setHoverText: (t: string | null) => void
}) {
  const router = useRouter()

  /* ===== Infinite lottery state ===== */
  const [infiniteLottery, setInfiniteLottery] = useState(false)
  useEffect(() => {
    setInfiniteLottery(localStorage.getItem('infinite-lottery') === 'true')
  }, [])

  /* ===== Slow-motion system ===== */
  const timeScale = useRef(1)
  const targetTimeScale = useRef(1)

  /* ===== Sun glow ===== */
  const glowRef = useRef<MeshBasicMaterial>(null!)
  const pulseTime = useRef(0)

  const sunTexture = useLoader(TextureLoader, '/avatar.jpg')

  useFrame((_, delta) => {
    timeScale.current +=
      (targetTimeScale.current - timeScale.current) * 0.08
    pulseTime.current += delta

    const pulse = 0.5 + Math.sin(pulseTime.current * 2) * 0.5
    if (glowRef.current) {
      glowRef.current.opacity = 0.15 + pulse * 0.18
      const hue = 30 + Math.sin(pulseTime.current * 0.5) * 15
      glowRef.current.color = new Color(`hsl(${hue}, 100%, 70%)`)
    }
  })

  return (
    <>
      {/* ===== ☀️ Sun (Avatar) ===== */}
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
        <sphereGeometry args={[2.6, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#fcff44"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* ===== Sun glow aura ===== */}
      <mesh scale={1.5}>
        <sphereGeometry args={[2.6, 64, 64]} />
        <meshBasicMaterial
          ref={glowRef}
          color="#d0ff00"
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          opacity={0.05}
        />
      </mesh>

      {/* ===== Planet 1: Art Gallery ===== */}
      <Planet
        textureUrl="/planet1.jpg"
        size={1}
        a={7}
        b={5.5}
        speed={0.1}
        timeScale={timeScale}
        orbitTiltX={0.12}
        orbitTiltZ={0.08}
        orbitColor="#8855cc"
        orbitOpacity={0.07}
        glowColor="#aa77ee"
        glowIntensity={0.1}
        onHoverIn={() => {
          targetTimeScale.current = 0.15
          setHoverText('Art Gallery')
        }}
        onHoverOut={() => {
          targetTimeScale.current = 1
          setHoverText(null)
        }}
        onClick={() => router.push('/art')}
      />

      {/* ===== Planet 2: My CV ===== */}
      <Planet
        textureUrl="/planet2.jpg"
        size={2}
        a={11}
        b={7}
        speed={0.16}
        timeScale={timeScale}
        orbitTiltX={-0.15}
        orbitTiltZ={0.05}
        orbitColor="#4488aa"
        orbitOpacity={0.06}
        glowColor="#66aacc"
        glowIntensity={0.08}
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

      {/* ===== Planet 3: Mini Game (star orbit) ===== */}
      <Planet
        textureUrl="/planet3.jpg"
        size={1.4}
        orbitType="star"
        starOuterR={16}
        starInnerR={7}
        speed={0.1}
        timeScale={timeScale}
        orbitTiltX={0.2}
        orbitTiltZ={-0.1}
        orbitColor="#cc6644"
        orbitOpacity={0.08}
        glowColor="#ff8866"
        glowIntensity={0.12}
        rainbow={infiniteLottery}
        onHoverIn={() => {
          targetTimeScale.current = 0.15
          setHoverText('Mini Game !!!')
        }}
        onHoverOut={() => {
          targetTimeScale.current = 1
          setHoverText(null)
        }}
        onClick={() => router.push('/games')}
      />

      {/* ===== Planet 4: Message Wall ===== */}
      <Planet
        textureUrl="/planet4.jpg"
        size={2}
        a={20}
        b={11}
        speed={0.09}
        timeScale={timeScale}
        orbitTiltX={-0.08}
        orbitTiltZ={-0.14}
        orbitColor="#44aa88"
        orbitOpacity={0.05}
        glowColor="#66ccaa"
        glowIntensity={0.5}
        onHoverIn={() => {
          targetTimeScale.current = 0.15
          setHoverText('Message Wall')
        }}
        onHoverOut={() => {
          targetTimeScale.current = 1
          setHoverText(null)
        }}
        onClick={() => router.push('/interactive')}
      />

      {/* ===== Planet 5: Cooking ===== */}
      <Planet
        textureUrl="/planet2.jpg"
        size={0.9}
        a={15}
        b={9}
        speed={0.13}
        timeScale={timeScale}
        orbitTiltX={0.18}
        orbitTiltZ={0.12}
        orbitColor="#cc8844"
        orbitOpacity={0.06}
        glowColor="#ffaa66"
        glowIntensity={0.1}
        onHoverIn={() => {
          targetTimeScale.current = 0.15
          setHoverText("Sam's Kitchen")
        }}
        onHoverOut={() => {
          targetTimeScale.current = 1
          setHoverText(null)
        }}
        onClick={() => router.push('/cooking')}
      />

      {/* ===== 🌑 Distant Mystery Asteroid ===== */}
      <group position={[42, 3, -25]}>
        <Planet
          textureUrl="/planet3.jpg"
          size={0.55}
          a={3}
          b={2}
          speed={0.06}
          timeScale={timeScale}
          orbitTiltX={0.4}
          orbitTiltZ={-0.3}
          orbitColor="#9944ff"
          orbitOpacity={0.04}
          glowColor="#bb66ff"
          glowIntensity={0.2}
          rainbow
          onHoverIn={() => {
            targetTimeScale.current = 0.15
            setHoverText('??? Mystery Vision')
          }}
          onHoverOut={() => {
            targetTimeScale.current = 1
            setHoverText(null)
          }}
          onClick={() => router.push('/vision')}
        />
      </group>
    </>
  )
}
