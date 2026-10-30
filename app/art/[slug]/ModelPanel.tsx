'use client'

import dynamic from 'next/dynamic'
import styles from '../art.module.css'

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
  loading: () => <div className={styles.viewerLoading}>Loading 3D model…</div>,
})

export default function ModelPanel({ parts, note }: { parts: { label: string; url: string }[]; note?: string }) {
  return <ModelViewer parts={parts} note={note} />
}
