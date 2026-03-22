'use client'

import { useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader, Vector3, Mesh, MeshBasicMaterial, AdditiveBlending } from 'three'
import { useMemo, useRef, useState } from 'react'

function randomEdgePoint() {
  const side = Math.floor(Math.random() * 4)
  const spread = () => (Math.random() - 0.5) * 26

  switch (side) {
    case 0:
      return new Vector3(-44, spread(), -20 - Math.random() * 10)
    case 1:
      return new Vector3(44, spread(), -20 - Math.random() * 10)
    case 2:
      return new Vector3(spread() * 1.5, 24, -20 - Math.random() * 10)
    default:
      return new Vector3(spread() * 1.5, -24, -20 - Math.random() * 10)
  }
}

export default function TransientComet({
  setHoverText,
  href,
}: {
  setHoverText: (t: string | null) => void
  href: string
}) {
  const texture = useLoader(TextureLoader, '/planet-internship.svg')
  const headRef = useRef<Mesh>(null!)
  const auraRef = useRef<MeshBasicMaterial>(null!)
  const trailRefs = useRef<MeshBasicMaterial[]>([])
  const trailMeshRefs = useRef<Mesh[]>([])
  const activeRef = useRef(false)
  const hoveredRef = useRef(false)
  const timerRef = useRef(7)
  const visibleForRef = useRef(0)
  const startRef = useRef(new Vector3())
  const velocityRef = useRef(new Vector3())
  const driftRef = useRef(new Vector3())
  const ageRef = useRef(0)
  const [renderTrail] = useState(() => Array.from({ length: 7 }, (_, i) => i))
  const scratch = useMemo(() => new Vector3(), [])

  function despawn() {
    activeRef.current = false
    ageRef.current = 0
    timerRef.current = 8 + Math.random() * 8
    if (headRef.current) {
      headRef.current.visible = false
    }
    trailMeshRefs.current.forEach((mesh) => {
      if (mesh) mesh.visible = false
    })
    if (hoveredRef.current) {
      hoveredRef.current = false
      document.body.style.cursor = 'default'
      setHoverText(null)
    }
  }

  function spawn() {
    const start = randomEdgePoint()
    const end = randomEdgePoint()
    const direction = end.clone().sub(start).normalize()

    startRef.current.copy(start)
    velocityRef.current.copy(direction.multiplyScalar(7 + Math.random() * 2.5))
    driftRef.current.set(
      (Math.random() - 0.5) * 2.2,
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.5) * 0.8
    )
    visibleForRef.current = 4.5 + Math.random() * 2.5
    ageRef.current = 0
    activeRef.current = true

    if (headRef.current) {
      headRef.current.visible = true
    }
    trailMeshRefs.current.forEach((mesh) => {
      if (mesh) mesh.visible = true
    })
  }

  useFrame((_, delta) => {
    if (!activeRef.current) {
      timerRef.current -= delta
      if (timerRef.current <= 0) {
        spawn()
      }
      return
    }

    ageRef.current += delta

    scratch
      .copy(startRef.current)
      .addScaledVector(velocityRef.current, ageRef.current)
      .addScaledVector(driftRef.current, Math.sin(ageRef.current * 1.7) * 1.2)

    if (headRef.current) {
      headRef.current.position.copy(scratch)
      headRef.current.rotation.y += delta * 0.6
      headRef.current.rotation.x += delta * 0.35
    }

    const direction = velocityRef.current.clone().normalize()
    trailMeshRefs.current.forEach((mesh, index) => {
      if (!mesh) return
      mesh.visible = activeRef.current
      mesh.position
        .copy(scratch)
        .addScaledVector(direction, -(index + 1) * 1.35)
        .addScaledVector(driftRef.current, -0.25 * index)
      mesh.scale.setScalar(Math.max(0.45, 1 - index * 0.08))
    })

    if (auraRef.current) {
      auraRef.current.opacity = 0.42 + Math.sin(ageRef.current * 5.2) * 0.16
    }

    trailRefs.current.forEach((mat, index) => {
      if (!mat) return
      mat.opacity = Math.max(0, 0.34 - index * 0.04)
    })

    if (ageRef.current >= visibleForRef.current) {
      despawn()
    }
  })

  return (
    <group>
      {renderTrail.map((i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          visible={false}
          ref={(node) => {
            if (node) trailMeshRefs.current[i] = node
          }}
        >
          <sphereGeometry args={[0.54 - i * 0.05, 18, 18]} />
          <meshBasicMaterial
            ref={(node) => {
              if (node) trailRefs.current[i] = node
            }}
            color={i === 0 ? '#d2f9ff' : '#88dfff'}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            opacity={0.2}
          />
        </mesh>
      ))}

      <mesh
        ref={headRef}
        visible={false}
        onPointerOver={() => {
          if (!activeRef.current) return
          hoveredRef.current = true
          document.body.style.cursor = 'pointer'
          setHoverText('Internship Project / TimeLimit')
        }}
        onPointerOut={() => {
          hoveredRef.current = false
          document.body.style.cursor = 'default'
          setHoverText(null)
        }}
        onClick={() => {
          if (!activeRef.current) return
          window.open(href, '_blank', 'noopener,noreferrer')
        }}
      >
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshStandardMaterial map={texture} emissive="#c4f7ff" emissiveIntensity={0.3} />

        <mesh scale={1.85}>
          <sphereGeometry args={[0.78, 24, 24]} />
          <meshBasicMaterial
            ref={auraRef}
            color="#84e4ff"
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            opacity={0.4}
          />
        </mesh>
      </mesh>
    </group>
  )
}
