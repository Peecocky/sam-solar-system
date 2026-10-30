'use client'

import { useLoader, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import {
  TextureLoader,
  MeshBasicMaterial,
  AdditiveBlending,
  Color,
  Mesh,
  PerspectiveCamera,
  Vector3,
} from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Planet from './Planet'
import TransientComet from './TransientComet'

export default function SolarSystem({
  setHoverText,
  onSunClick,
}: {
  setHoverText: (t: string | null) => void
  onSunClick: () => void
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
  const getThree = useThree((state) => state.get)
  const warp = useRef<{
    start: number
    from: Vector3
    to: Vector3
    fromTarget: Vector3
    planet: Vector3
    fromFov: number
  } | null>(null)

  /** Fly the camera into the clicked planet, then hand over to the warp overlay and the next page. */
  function warpTo(event: ThreeEvent<MouseEvent>, route: string, color: string) {
    event.stopPropagation()
    if (warp.current) return
    router.prefetch(route)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push(route)
      return
    }
    const { camera, controls } = getThree() as { camera: PerspectiveCamera; controls: OrbitControlsImpl | null }
    const mesh = event.eventObject as Mesh
    const planet = mesh.getWorldPosition(new Vector3())
    if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere()
    const radius = mesh.geometry.boundingSphere?.radius ?? 1
    const toward = camera.position.clone().sub(planet).normalize()
    warp.current = {
      start: performance.now(),
      from: camera.position.clone(),
      to: planet.clone().add(toward.multiplyScalar(radius * 1.15)),
      fromTarget: controls ? controls.target.clone() : new Vector3(),
      planet,
      fromFov: camera.fov,
    }
    timeScale.current = 0
    targetTimeScale.current = 0
    if (controls) controls.enabled = false
    document.body.style.cursor = 'default'
    setHoverText(null)
    window.dispatchEvent(new CustomEvent('planet-warp', {
      detail: { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY, color },
    }))
    window.setTimeout(() => router.push(route), 760)
  }

  useFrame((state, delta) => {
    const w = warp.current
    if (w) {
      const camera = state.camera as PerspectiveCamera
      const controls = state.controls as OrbitControlsImpl | null
      const t = Math.min(1, (performance.now() - w.start) / 950)
      const ease = t * t * t
      camera.position.lerpVectors(w.from, w.to, ease)
      const look = w.fromTarget.clone().lerp(w.planet, Math.min(1, t * 2.4))
      if (controls) controls.target.copy(look)
      camera.lookAt(look)
      camera.fov = w.fromFov + (82 - w.fromFov) * ease
      camera.updateProjectionMatrix()
    }
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
    if (warp.current) return
    targetTimeScale.current = 0.16
    setHoverText(label)
  }

  function resumeOrbit() {
    if (warp.current) return
    targetTimeScale.current = 1
    setHoverText(null)
  }

  return (
    <>
      <mesh
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          setHoverText('Guide')
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
          setHoverText(null)
        }}
        onClick={() => {
          // The guide overlay covers the canvas, so pointer-out never fires.
          document.body.style.cursor = 'default'
          setHoverText(null)
          onSunClick()
        }}
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
        onClick={(event) => warpTo(event, '/art', '#ffb3d9')}
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
        onClick={(event) => warpTo(event, '/cv', '#9cd2f3')}
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
        onClick={(event) => warpTo(event, '/games', '#f4b37f')}
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
        onClick={(event) => warpTo(event, '/cooking', '#ffd09c')}
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
        onClick={(event) => warpTo(event, '/stocks', '#c9ffd1')}
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
        onClick={(event) => warpTo(event, '/interactive', '#aff6ea')}
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
        onClick={(event) => warpTo(event, '/minecraft', '#c6ff9f')}
      />

      <Planet
        textureUrl="/planet-villas.svg"
        size={1.25}
        a={21.8}
        b={16.8}
        speed={0.082}
        timeScale={timeScale}
        orbitTiltX={-0.14}
        orbitTiltZ={0.1}
        orbitColor="#d9a066"
        orbitOpacity={0.08}
        glowColor="#ffd8a8"
        glowIntensity={0.14}
        onHoverIn={() => slowOrbit("前往 Sam's villas")}
        onHoverOut={resumeOrbit}
        onClick={() => window.open('https://villa-map.samsamsam.workers.dev/', '_blank', 'noopener,noreferrer')}
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
          onClick={(event) => warpTo(event, '/vision', '#deb8ff')}
        />
      </group>

      <TransientComet
        href="https://jiaotong-university-koguan-law-scho.vercel.app/"
        label="Internship Project / TimeLimit"
        setHoverText={setHoverText}
      />

      <TransientComet
        href={process.env.NEXT_PUBLIC_LAB_SHOWCASE_URL || 'https://sjtu-smart-judiciary-showcase.vercel.app/'}
        label="实验室项目展示中台 / Lab Showcase"
        glowColor="#ffb36f"
        initialDelay={13}
        setHoverText={setHoverText}
      />
    </>
  )
}
