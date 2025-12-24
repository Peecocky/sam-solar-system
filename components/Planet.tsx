'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, Mesh, Vector3 } from 'three'
import { Line, Html } from '@react-three/drei'

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
  hoverLabel?: string   // ✅ 新增
}

function makeEllipsePoints(a: number, b: number, segments = 360) {
  const pts: Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    pts.push(new Vector3(a * Math.cos(t), 0, b * Math.sin(t)))
  }
  return pts
}

function makeStarPoints(outerR: number, innerR: number, seg = 30) {
  const verts: Vector3[] = []
  const start = -Math.PI / 2
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const a = start + (i * Math.PI) / 5
    verts.push(new Vector3(r * Math.cos(a), 0, r * Math.sin(a)))
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
  starSegmentsPerEdge = 30,
  speed,
  timeScale,
  onHoverIn,
  onHoverOut,
  onClick,
  showOrbit = true,
  hoverLabel,
}: PlanetProps) {
  const planetRef = useRef<Mesh>(null!)
  const texture = useLoader(TextureLoader, textureUrl)
  const [hovered, setHovered] = useState(false)

  const orbitPoints = useMemo(() => {
    return orbitType === 'star'
      ? makeStarPoints(starOuterR, starInnerR, starSegmentsPerEdge)
      : makeEllipsePoints(a, b)
  }, [orbitType, a, b, starOuterR, starInnerR, starSegmentsPerEdge])

  const phase = useRef(0)

  useFrame((_, delta) => {
    phase.current = (phase.current + delta * speed * timeScale.current) % 1
    const total = orbitPoints.length - 1
    const f = phase.current * total
    const i0 = Math.floor(f)
    const i1 = Math.min(i0 + 1, total)
    const u = f - i0

    planetRef.current.position.lerpVectors(
      orbitPoints[i0],
      orbitPoints[i1],
      u
    )
    planetRef.current.rotation.y += 0.6 * delta * timeScale.current
  })

  return (
    <group>
      {showOrbit && <Line points={orbitPoints} transparent opacity={0.25} />}

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
      </mesh>

      {/* 🏷 Hover Label */}
      {hovered && hoverLabel && (
        <Html
          position={[0, size + 0.8, 0]}
          center
          distanceFactor={8}
          style={{
            background: 'rgba(0,0,0,0.65)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: 6,
            fontSize: 14,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {hoverLabel}
        </Html>
      )}
    </group>
  )
}
