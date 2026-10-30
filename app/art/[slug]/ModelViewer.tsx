'use client'

import { Suspense, useMemo, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { DoubleSide, Vector3 } from 'three'
import styles from '../art.module.css'

type Part = { label: string; url: string }

function Mesh({ url }: { url: string }) {
  const loaded = useLoader(STLLoader, url)
  const geometry = useMemo(() => {
    const copy = loaded.clone()
    copy.computeBoundingBox()
    const box = copy.boundingBox
    if (box) {
      const center = box.getCenter(new Vector3())
      const size = box.getSize(new Vector3())
      copy.translate(-center.x, -center.y, -center.z)
      copy.scale(3 / Math.max(size.x, size.y, size.z), 3 / Math.max(size.x, size.y, size.z), 3 / Math.max(size.x, size.y, size.z))
    }
    copy.computeVertexNormals()
    return copy
  }, [loaded])

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#c5a27f" metalness={0.5} roughness={0.45} side={DoubleSide} />
    </mesh>
  )
}

export default function ModelViewer({ parts, note }: { parts: Part[]; note?: string }) {
  const [selected, setSelected] = useState(0)
  return (
    <div className={styles.viewerShell}>
      <div className={styles.viewerHeader}>
        <span>INTERACTIVE 3D / STL</span>
        <span>DRAG TO ROTATE · SCROLL TO ZOOM</span>
      </div>
      <div className={styles.viewerCanvas}>
        <Canvas camera={{ position: [4, 3, 4], fov: 42 }} dpr={[1, 1.8]} frameloop="demand">
          <color attach="background" args={['#171719']} />
          <ambientLight intensity={1.8} />
          <directionalLight position={[4, 6, 5]} intensity={3} />
          <directionalLight position={[-3, 2, -4]} intensity={1.2} color="#a5a9e8" />
          <Suspense fallback={null}>
            <Mesh key={parts[selected].url} url={parts[selected].url} />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={2.6} maxDistance={12} />
        </Canvas>
      </div>
      <div className={styles.viewerParts} aria-label="Select model part">
        {parts.map((part, index) => (
          <button
            className={index === selected ? styles.activePart : ''}
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
            key={part.url}
          >
            {part.label}
          </button>
        ))}
      </div>
      {note && <p className={styles.viewerNote}>{note}</p>}
    </div>
  )
}
