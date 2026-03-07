'use client'

import { useEffect, useRef, useState } from 'react'

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const [volume, setVolume] = useState(0.35)

  // Only show player if user has made a choice
  useEffect(() => {
    const pref = localStorage.getItem('sam-music-pref')
    if (pref === 'on') {
      setVisible(true)
      setPlaying(true)
    } else if (pref === 'off') {
      setVisible(true)
      setPlaying(false)
    }
    // If no pref yet, stay hidden — notification will handle first choice
  }, [])

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    if (playing) {
      audio.play().catch(() => {
        // Autoplay blocked — user needs to interact first
        setPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [playing, volume])

  // Listen for custom event from notification
  useEffect(() => {
    function onMusicChoice(e: Event) {
      const detail = (e as CustomEvent).detail
      setVisible(true)
      if (detail === 'on') {
        setPlaying(true)
        localStorage.setItem('sam-music-pref', 'on')
      } else {
        setPlaying(false)
        localStorage.setItem('sam-music-pref', 'off')
      }
    }
    window.addEventListener('sam-music-choice', onMusicChoice)
    return () => window.removeEventListener('sam-music-choice', onMusicChoice)
  }, [])

  function toggle() {
    const next = !playing
    setPlaying(next)
    localStorage.setItem('sam-music-pref', next ? 'on' : 'off')
  }

  if (!visible) return <audio ref={audioRef} src="/music.mp3" loop preload="none" />

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
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
          background: playing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${playing ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          fontSize: 14,
        }}
        title={playing ? 'Mute' : 'Play music'}
      >
        {playing ? (
          <span style={{ animation: 'musicPulse 1.5s ease-in-out infinite' }}>♪</span>
        ) : (
          <span style={{ opacity: 0.3 }}>♪</span>
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
