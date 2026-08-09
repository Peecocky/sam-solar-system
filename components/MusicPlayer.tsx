'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

function getStoredMusicPreference() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('sam-music-pref')
}

export default function MusicPlayer() {
  const pathname = usePathname()
  const isArt = pathname === '/art'
  const source = isArt ? '/playlist/song7.mp3' : '/music.mp3'
  const audioRef = useRef<HTMLAudioElement>(null)
  const sourceRef = useRef(source)
  const [playing, setPlaying] = useState(() => getStoredMusicPreference() === 'on')
  const [visibleByPreference, setVisibleByPreference] = useState(() => getStoredMusicPreference() !== null)
  const visible = isArt || visibleByPreference
  const volume = 0.35

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    if (sourceRef.current !== source) {
      sourceRef.current = source
      audio.load()
    }

    const hasSavedPreference = getStoredMusicPreference() !== null
    const shouldPlay = hasSavedPreference ? playing : isArt
    if (shouldPlay) {
      let cancelled = false
      audio.play()
        .then(() => {
          if (!cancelled && isArt && !hasSavedPreference) setPlaying(true)
        })
        .catch(() => {
          if (!cancelled) setPlaying(false)
        })
      return () => {
        cancelled = true
      }
    }

    audio.pause()
  }, [isArt, playing, source, volume])

  useEffect(() => {
    function onMusicChoice(e: Event) {
      const detail = (e as CustomEvent<'on' | 'off'>).detail
      setVisibleByPreference(true)
      if (detail === 'on') {
        setPlaying(true)
        localStorage.setItem('sam-music-pref', 'on')
        return
      }

      setPlaying(false)
      localStorage.setItem('sam-music-pref', 'off')
    }

    window.addEventListener('sam-music-choice', onMusicChoice)
    return () => window.removeEventListener('sam-music-choice', onMusicChoice)
  }, [])

  function toggle() {
    const next = !playing
    setVisibleByPreference(true)
    setPlaying(next)
    localStorage.setItem('sam-music-pref', next ? 'on' : 'off')
  }

  if (!visible) return <audio ref={audioRef} src={source} loop preload="none" />

  return (
    <>
      <audio ref={audioRef} src={source} loop preload="auto" />
      <div
        onClick={toggle}
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 9999,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: isArt
            ? (playing ? 'rgba(16,16,20,0.86)' : 'rgba(16,16,20,0.68)')
            : (playing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'),
          border: `1px solid ${isArt ? 'rgba(255,255,255,0.5)' : (playing ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)')}`,
          color: isArt ? '#fff' : 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isArt ? 'none' : 'pointer',
          transition: 'all 0.3s',
          fontSize: 14,
        }}
        title={isArt ? (playing ? 'Mute song7.mp3' : 'Play song7.mp3') : (playing ? 'Mute' : 'Play music')}
      >
        {playing ? (
          <span style={{ animation: 'musicPulse 1.5s ease-in-out infinite' }}>||</span>
        ) : (
          <span style={{ opacity: 0.3 }}>{'>'}</span>
        )}
      </div>
      <style>{`
        @keyframes musicPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </>
  )
}
