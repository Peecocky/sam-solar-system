'use client'

import { useLoader, useFrame } from '@react-three/fiber'
import {
  TextureLoader,
  MeshBasicMaterial,
  AdditiveBlending,
  Color,
} from 'three'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Planet from './Planet'
import TransientComet from './TransientComet'

export default function SolarSystem({
  setHoverText,
}: {
  setHoverText: (t: string | null) => void
}) {
  const router = useRouter()

  const [infiniteLottery] = useState(
    () =>
      typeof window !== 'undefined' &&
      localStorage.getItem('infinite-lottery') === 'true'
  )

  const timeScale = useRef(1)
  const targetTimeScale = useRef(1)
  const glowRef = useRef<MeshBasicMaterial>(null!)
  const pulseTime = useRef(0)
  const sunTexture = useLoader(TextureLoader, '/avatar.jpg')

  useFrame((_, delta) => {
    timeScale.current +=
      (targetTimeScale.current - timeScale.current) * 0.08
    pulseTime.current += delta

    const pulse = 0.5 + Math.sin(pulseTime.current * 2) * 0.5
    if (glowRef.current) {
      glowRef.current.opacity = 0.2 + pulse * 0.22
      const hue = 42 + Math.sin(pulseTime.current * 0.45) * 18
      glowRef.current.color = new Color(`hsl(${hue}, 100%, 72%)`)
    }
  })

  function slowOrbit(label: string) {
    targetTimeScale.current = 0.16
    setHoverText(label)
  }

  function resumeOrbit() {
    targetTimeScale.current = 1
    setHoverText(null)
  }

  return (
    <>
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
        <sphereGeometry args={[2.7, 72, 72]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#fff377"
          emissiveIntensity={0.09}
          roughness={0.98}
          metalness={0.02}
        />
      </mesh>

      <mesh scale={1.55}>
        <sphereGeometry args={[2.7, 64, 64]} />
        <meshBasicMaterial
          ref={glowRef}
          color="#fff07a"
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          opacity={0.08}
        />
      </mesh>

      <Planet
        textureUrl="/planet-art.svg"
        size={1.02}
        a={7.2}
        b={5.6}
        speed={0.098}
        timeScale={timeScale}
        orbitTiltX={0.12}
        orbitTiltZ={0.08}
        orbitColor="#e58adb"
        orbitOpacity={0.1}
        glowColor="#ffb3d9"
        glowIntensity={0.14}
        onHoverIn={() => slowOrbit('Art Gallery')}
        onHoverOut={resumeOrbit}
        onClick={() => router.push('/art')}
      />

      <Planet
        textureUrl="/planet-cv.svg"
        size={1.9}
        a={11.5}
        b={7.2}
        speed={0.16}
        timeScale={timeScale}
        orbitTiltX={-0.16}
        orbitTiltZ={0.05}
        orbitColor="#6aa6d9"
        orbitOpacity={0.08}
        glowColor="#9cd2f3"
        glowIntensity={0.1}
        onHoverIn={() => slowOrbit('My CV')}
        onHoverOut={resumeOrbit}
        onClick={() => router.push('/cv')}
      />

      <Planet
        textureUrl="/planet-games.svg"
        size={1.45}
        orbitType="star"
        starOuterR={16.2}
        starInnerR={7.2}
        speed={0.1}
        timeScale={timeScale}
        orbitTiltX={0.22}
        orbitTiltZ={-0.12}
        orbitColor="#d78b55"
        orbitOpacity={0.1}
        glowColor="#f4b37f"
        glowIntensity={0.16}
        rainbow={infiniteLottery}
        onHoverIn={() => slowOrbit('Mini Game / Fantasy Map')}
        onHoverOut={resumeOrbit}
        onClick={() => router.push('/games')}
      />

      <Planet
        textureUrl="/planet-kitchen.svg"
        size={1}
        a={14.8}
        b={9.1}
        speed={0.13}
        timeScale={timeScale}
        orbitTiltX={0.19}
        orbitTiltZ={0.13}
        orbitColor="#f3a969"
        orbitOpacity={0.08}
        glowColor="#ffd09c"
        glowIntensity={0.12}
        onHoverIn={() => slowOrbit("Sam's Kitchen")}
        onHoverOut={resumeOrbit}
        onClick={() => router.push('/cooking')}
      />

      <Planet
        textureUrl="/planet-stocks.svg"
        size={0.98}
        a={18.2}
        b={13.1}
        speed={0.104}
        timeScale={timeScale}
        orbitTiltX={-0.1}
        orbitTiltZ={0.18}
        orbitColor="#74dfb8"
        orbitOpacity={0.08}
        glowColor="#c9ffd1"
        glowIntensity={0.12}
        onHoverIn={() => slowOrbit('Stock Research')}
        onHoverOut={resumeOrbit}
        onClick={() => router.push('/stocks')}
      />

      <Planet
        textureUrl="/planet-messages.svg"
        size={1.85}
        a={20.3}
        b={11.6}
        speed={0.09}
        timeScale={timeScale}
        orbitTiltX={-0.06}
        orbitTiltZ={-0.14}
        orbitColor="#77d6c3"
        orbitOpacity={0.07}
        glowColor="#aff6ea"
        glowIntensity={0.18}
        onHoverIn={() => slowOrbit('Message Wall')}
        onHoverOut={resumeOrbit}
        onClick={() => router.push('/interactive')}
      />

      <Planet
        textureUrl="/planet-minecraft.svg"
        size={1.12}
        a={24.6}
        b={15.4}
        speed={0.073}
        timeScale={timeScale}
        orbitTiltX={0.08}
        orbitTiltZ={-0.22}
        orbitColor="#8ddf6b"
        orbitOpacity={0.08}
        glowColor="#c6ff9f"
        glowIntensity={0.14}
        onHoverIn={() => slowOrbit('Minecraft Planet')}
        onHoverOut={resumeOrbit}
        onClick={() => router.push('/minecraft')}
      />

      <group position={[42, 4, -25]}>
        <Planet
          textureUrl="/planet-vision.svg"
          size={0.64}
          a={3.4}
          b={2.2}
          speed={0.06}
          timeScale={timeScale}
          orbitTiltX={0.35}
          orbitTiltZ={-0.3}
          orbitColor="#b66dff"
          orbitOpacity={0.06}
          glowColor="#deb8ff"
          glowIntensity={0.22}
          rainbow
          onHoverIn={() => slowOrbit('Mystery Vision')}
          onHoverOut={resumeOrbit}
          onClick={() => router.push('/vision')}
        />
      </group>

      <TransientComet
        href="https://jiaotong-university-koguan-law-scho.vercel.app/"
        setHoverText={setHoverText}
      />
    </>
  )
}
