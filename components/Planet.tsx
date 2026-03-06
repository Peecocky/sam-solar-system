'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import {
  TextureLoader,
  Mesh,
  Vector3,
  MeshBasicMaterial,
  AdditiveBlending,
  Color,
} from 'three'
import { Line } from '@react-three/drei'

type OrbitType = 'ellipse' | 'star'

interface PlanetProps {
  textureUrl: string
  size: number
  orbitType?: OrbitType
  a?: number
  b?: number
  starOuterR?: number
  starInnerR?: number
  starSegmentsPerEdge?: number
  speed: number
  timeScale: React.MutableRefObject<number>
  onHoverIn: () => void
  onHoverOut: () => void
  onClick?: () => void
  showOrbit?: boolean
  orbitColor?: string
  orbitOpacity?: number
  glowColor?: string
  glowIntensity?: number
  rainbow?: boolean
  /** Tilt the orbit plane around X axis (radians) */
  orbitTiltX?: number
  /** Tilt the orbit plane around Z axis (radians) */
  orbitTiltZ?: number
}

function makeEllipsePoints(a: number, b: number, segments = 512) {
  const pts: Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    pts.push(new Vector3(a * Math.cos(t), 0, b * Math.sin(t)))
  }
  return pts
}

function makeStarPoints(outerR: number, innerR: number, seg = 50) {
  const verts: Vector3[] = []
  const start = -Math.PI / 2
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = start + (i * Math.PI) / 5
    verts.push(new Vector3(r * Math.cos(angle), 0, r * Math.sin(angle)))
  }
  const pts: Vector3[] = []
  for (let i = 0; i < verts.length; i++) {
    const p0 = verts[i]
    const p1 = verts[(i + 1) % verts.length]
    for (let s = 0; s < seg; s++) {
      pts.push(new Vector3().lerpVectors(p0, p1, s / seg))
    }
  }
  pts.push(pts[0].clone())
  return pts
}

export default function Planet({
  textureUrl,
  size,
  orbitType = 'ellipse',
  a = 10,
  b = 7,
  starOuterR = 12,
  starInnerR = 5,
  starSegmentsPerEdge = 50,
  speed,
  timeScale,
  onHoverIn,
  onHoverOut,
  onClick,
  showOrbit = true,
  orbitColor = '#4466aa',
  orbitOpacity = 0.09,
  glowColor = '#6688cc',
  glowIntensity = 0.12,
  rainbow = false,
  orbitTiltX = 0,
  orbitTiltZ = 0,
}: PlanetProps) {
  const planetRef = useRef<Mesh>(null!)
  const glowRef = useRef<MeshBasicMaterial>(null!)
  const texture = useLoader(TextureLoader, textureUrl)
  const [hovered, setHovered] = useState(false)

  const orbitPoints = useMemo(() => {
    return orbitType === 'star'
      ? makeStarPoints(starOuterR, starInnerR, starSegmentsPerEdge)
      : makeEllipsePoints(a, b)
  }, [orbitType, a, b, starOuterR, starInnerR, starSegmentsPerEdge])

  const phase = useRef(Math.random())
  const glowPulse = useRef(0)

  useFrame((_, delta) => {
    phase.current = (phase.current + delta * speed * timeScale.current) % 1
    const total = orbitPoints.length - 1
    const f = phase.current * total
    const i0 = Math.floor(f)
    const i1 = Math.min(i0 + 1, total)
    const u = f - i0
    planetRef.current.position.lerpVectors(orbitPoints[i0], orbitPoints[i1], u)
    planetRef.current.rotation.y += 0.5 * delta * timeScale.current

    glowPulse.current += delta
    if (glowRef.current) {
      const pulse = 0.5 + Math.sin(glowPulse.current * 1.5) * 0.5
      const baseOpacity = hovered ? glowIntensity * 2.5 : glowIntensity
      glowRef.current.opacity = baseOpacity + pulse * glowIntensity * 0.6

      if (rainbow) {
        const hue = (glowPulse.current * 60) % 360
        glowRef.current.color = new Color(`hsl(${hue}, 100%, 60%)`)
      }
    }
  })

  return (
    <group rotation={[orbitTiltX, 0, orbitTiltZ]}>
      {/* Orbit line */}
      {showOrbit && (
        <Line
          points={orbitPoints}
          color={orbitColor}
          transparent
          opacity={orbitOpacity}
          lineWidth={0.5}
        />
      )}

      {/* Planet mesh */}
      <mesh
        ref={planetRef}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          setHovered(true)
          onHoverIn()
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
          setHovered(false)
          onHoverOut()
        }}
        onClick={onClick}
      >
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial map={texture} />

        {/* Glow aura */}
        <mesh scale={1.35}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial
            ref={glowRef}
            color={rainbow ? '#ff66aa' : glowColor}
            transparent
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            opacity={glowIntensity}
          />
        </mesh>
      </mesh>
    </group>
  )
}
