'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const MINECRAFT_IMAGES = [
  '011998d2df857ae99f454ec380543eba.jpg',
  '05d15e0d262c4a54003b1085e99aae8b.jpg',
  '0ff8b1223b101f863772c9933c8b4bac.jpg',
  '3cead4fa4b38a59b95b4a1049a053609.jpg',
  '3ebae28d4c33c17e5d86ad307e0f619e.jpg',
  '62a0a549a9e1a180f62e394c0698984c.jpg',
  '7937325f2098cc9a1edf0753538982ab.jpg',
  '9584ca857a78f6e005e4f01c5e6e2cc0.jpg',
  '9df88141db3adce65234224c9a071dbe.jpg',
  'b638089530812968e71d42b1571df974.jpg',
  'cc4802b5d4acf43f7bec84a279fc0d6d.jpg',
  'e64ab5bde8444d33cb9de50d6b30199a.jpg',
  'e96642160701753482821371423973c8.jpg',
  'f8908d4997710e35b1a1a849a5982f59.jpg',
]

// Generate scattered positions for images
const generateImageLayout = () => {
  const positions = MINECRAFT_IMAGES.map((_, idx) => ({
    id: idx,
    top: Math.random() * 200 + 100 + idx * 200,
    left: Math.random() * 50 + (idx % 3) * 30,
    rotation: Math.random() * 3 - 1.5,
    delay: idx * 0.1,
  }))
  return positions
}

export default function MinecraftPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [isKillMode, setIsKillMode] = useState(false)
  const [killInput, setKillInput] = useState('')
  const [showDeathScreen, setShowDeathScreen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const imageLayoutRef = useRef(generateImageLayout())
  const killInputRef = useRef('')

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 100)
    
    // Show gallery after animation
    setTimeout(() => setShowGallery(true), 3200)
    
    // Handle scroll
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    // Handle keyboard for kill command
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 't' && !isKillMode && showGallery) {
        e.preventDefault()
        setIsKillMode(true)
      }
      
      if (isKillMode) {
        if (e.key === 'Enter') {
          if (killInputRef.current === '/kill') {
            setShowDeathScreen(true)
            setIsKillMode(false)
          }
          killInputRef.current = ''
          setKillInput('')
        } else if (e.key === 'Escape') {
          setIsKillMode(false)
          killInputRef.current = ''
          setKillInput('')
        } else if (e.key === 'Backspace') {
          killInputRef.current = killInputRef.current.slice(0, -1)
          setKillInput(killInputRef.current)
        } else if (e.key.length === 1) {
          killInputRef.current += e.key
          setKillInput(killInputRef.current)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isKillMode, showGallery])

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          overflow-x: hidden;
        }

        .mc-world {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #020202;
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .bg-video {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.15;
          z-index: 1;
        }

        .entrance-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          color: #7bc259;
          font-family: 'Press Start 2P', cursive;
          font-size: clamp(32px, 10vw, 120px);
          text-align: center;
          z-index: 100;
          letter-spacing: 8px;
          opacity: ${isLoaded ? 0 : 1};
          visibility: ${isLoaded ? 'hidden' : 'visible'};
          transition: opacity 2s ease-out, visibility 2s ease-out;
          text-shadow: 0 0 20px #7bc259;
          pointer-events: none;
        }

        .content-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          min-height: 300vh;
          padding-top: 100vh;
        }

        .topbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: rgba(2, 2, 2, 0.7);
          backdrop-filter: blur(10px);
          z-index: 50;
          border-bottom: 1px solid rgba(123, 194, 89, 0.2);
          opacity: ${showGallery ? 1 : 0};
          transition: opacity 0.5s ease;
          pointer-events: ${showGallery ? 'auto' : 'none'};
        }

        .back-btn {
          border: 2px solid #7bc259;
          background: transparent;
          color: #7bc259;
          padding: 8px 12px;
          font: 500 11px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(123, 194, 89, 0.2);
          box-shadow: 0 0 8px rgba(123, 194, 89, 0.5);
        }

        .title {
          font-family: 'Press Start 2P', cursive;
          font-size: 11px;
          text-transform: uppercase;
          color: #7bc259;
          letter-spacing: 2px;
        }

        .gallery-container {
          position: relative;
          width: 100%;
          height: 200vh;
        }

        .gallery-item {
          position: fixed;
          width: 280px;
          height: 200px;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(123, 194, 89, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
          opacity: 0;
          animation: slideIn 0.6s ease-out forwards;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .gallery-item:hover {
          transform: translateZ(10px) scale(1.02);
          border-color: rgba(123, 194, 89, 0.6);
          box-shadow: 0 12px 48px rgba(123, 194, 89, 0.2);
        }

        .gallery-item:hover img {
          transform: scale(1.08);
        }

        .exit-hint {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: rgba(123, 194, 89, 0.6);
          font: 11px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 40;
          opacity: ${showGallery ? 1 : 0};
          transition: opacity 0.5s ease;
          animation: pulse 2s infinite;
          pointer-events: none;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .kill-mode-overlay {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid #7bc259;
          padding: 12px 16px;
          font: 12px 'IBM Plex Mono', monospace;
          color: #7bc259;
          z-index: 60;
          min-width: 300px;
          text-transform: uppercase;
          letter-spacing: 2px;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .death-screen {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 40px;
          opacity: ${showDeathScreen ? 1 : 0};
          visibility: ${showDeathScreen ? 'visible' : 'hidden'};
          transition: opacity 0.3s ease;
          pointer-events: ${showDeathScreen ? 'auto' : 'none'};
        }

        .death-title {
          font-family: 'Press Start 2P', cursive;
          font-size: clamp(32px, 8vw, 72px);
          color: #7bc259;
          text-align: center;
          text-shadow: 0 0 20px rgba(123, 194, 89, 0.5);
          letter-spacing: 3px;
          animation: fadeInScale 0.5s ease-out;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .death-subtitle {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          color: rgba(123, 194, 89, 0.7);
          letter-spacing: 2px;
        }

        .death-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .death-btn {
          border: 2px solid #7bc259;
          background: rgba(123, 194, 89, 0.1);
          color: #7bc259;
          padding: 12px 24px;
          font: 12px 'IBM Plex Mono', monospace;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: all 0.3s ease;
          pointer-events: auto;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .death-btn:hover {
          background: rgba(123, 194, 89, 0.2);
          box-shadow: 0 0 12px rgba(123, 194, 89, 0.4);
        }

        @media (max-width: 768px) {
          .gallery-item {
            width: 200px;
            height: 140px;
          }

          .exit-hint {
            bottom: 10px;
            right: 10px;
            font-size: 10px;
          }

          .title {
            font-size: 10px;
          }

          .back-btn {
            padding: 6px 10px;
            font-size: 9px;
          }

          .kill-mode-overlay {
            font-size: 10px;
            min-width: 250px;
            bottom: 10px;
            left: 10px;
            padding: 10px 14px;
          }
        }
      `}</style>

      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={(e) => console.error('Video failed to load:', e)}
      >
        <source src="/minecraft loop video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="mc-world">
        <div className="entrance-screen">MINECRAFT</div>

        <div className="topbar">
          <button className="back-btn" onClick={() => router.push('/')}>
            {isMobile ? '← BACK' : '← BACK'}
          </button>
          <div className="title">MINECRAFT</div>
          <div />
        </div>

        <div className="content-wrapper">
          <div className="gallery-container">
            {imageLayoutRef.current.map((layout) => {
              const offsetY = scrollY * (0.3 + layout.id * 0.02)
              return (
                <div
                  key={layout.id}
                  className="gallery-item"
                  style={{
                    top: `${layout.top - offsetY}px`,
                    left: `${layout.left}%`,
                    transform: `rotate(${layout.rotation}deg)`,
                    animationDelay: `${layout.delay}s`,
                    opacity: showGallery ? 1 : 0,
                  }}
                >
                  <img
                    src={`/${MINECRAFT_IMAGES[layout.id]}`}
                    alt={`Build ${layout.id + 1}`}
                    loading="lazy"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {showGallery && (
          <div className="exit-hint">
            press T to {isKillMode ? 'enter command' : 'exit'}
          </div>
        )}

        {isKillMode && (
          <div className="kill-mode-overlay">
            &gt; {killInput}_
            <div style={{ fontSize: '10px', marginTop: '8px', color: 'rgba(123, 194, 89, 0.5)' }}>
              (type /kill to exit)
            </div>
          </div>
        )}

        <div className="death-screen">
          {showDeathScreen && (
            <>
              <div className="death-title">YOU DIED</div>
              <div className="death-subtitle">
                {isMobile ? 'Continue?' : 'Respawn or return to Solar System?'}
              </div>
              <div className="death-buttons">
                <button
                  className="death-btn"
                  onClick={() => {
                    console.log('RESPAWN clicked')
                    setShowDeathScreen(false)
                    // Reset scroll position immediately
                    window.scrollTo(0, 0)
                    setScrollY(0)
                    // Reset entrance animation
                    setIsLoaded(false)
                    setTimeout(() => {
                      setIsLoaded(true)
                      setTimeout(() => setShowGallery(true), 3000)
                    }, 100)
                  }}
                >
                  {isMobile ? 'CONTINUE' : 'RESPAWN'}
                </button>
                {!isMobile && (
                  <button
                    className="death-btn"
                    onClick={() => {
                      console.log('MAIN MENU clicked')
                      router.push('/')
                    }}
                  >
                    MAIN MENU
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
