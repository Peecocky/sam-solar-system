'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BirthdayGate from '@/components/BirthdayGate'

type Artwork = {
  id: string
  url: string
  title: string
  description: string
  accent: string
}

const DEFAULT_ARTWORKS: Artwork[] = [
  {
    id: 'slot-1',
    url: '',
    title: 'Artwork Slot 01',
    description: 'Reserved for your uploaded painting. This frame is waiting for the real piece.',
    accent: '#ff8ab7',
  },
  {
    id: 'slot-2',
    url: '',
    title: 'Artwork Slot 02',
    description: 'A second reserved frame, ready for another drawing once you send the file.',
    accent: '#8fb6ff',
  },
  {
    id: 'slot-3',
    url: '',
    title: 'Artwork Slot 03',
    description: 'Prepared for a work that deserves a slightly louder spotlight.',
    accent: '#8ce7ca',
  },
  {
    id: 'slot-4',
    url: '',
    title: 'Artwork Slot 04',
    description: 'Works well as a companion piece, series continuation, or detail crop.',
    accent: '#ffd585',
  },
  {
    id: 'slot-5',
    url: '',
    title: 'Artwork Slot 05',
    description: 'Reserved as the final anchor piece for the gallery wall.',
    accent: '#c7a2ff',
  },
]

const ADMIN_PASSWORD = 'sam2024'

function normalizeArtworks(items: Artwork[]) {
  return items.map((item, index) => ({
    ...item,
    accent: item.accent || DEFAULT_ARTWORKS[index % DEFAULT_ARTWORKS.length]?.accent || '#8fb6ff',
  }))
}

function loadStoredArtworks() {
  if (typeof window === 'undefined') return DEFAULT_ARTWORKS

  try {
    const saved = localStorage.getItem('sam-gallery-artworks')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeArtworks(parsed as Artwork[])
      }
    }
  } catch {
    // Ignore malformed local data and fall back to defaults.
  }

  return normalizeArtworks(DEFAULT_ARTWORKS)
}

export default function ArtPage() {
  const router = useRouter()
  const [artworks, setArtworks] = useState<Artwork[]>(loadStoredArtworks)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newArt, setNewArt] = useState({
    url: '',
    title: '',
    description: '',
    accent: '#8fb6ff',
  })
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (artworks.length > 0) {
      localStorage.setItem('sam-gallery-artworks', JSON.stringify(artworks))
    }
  }, [artworks])

  const currentArt = artworks[currentIdx] || null

  const goNext = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % artworks.length)
  }, [artworks.length])

  const goPrev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + artworks.length) % artworks.length)
  }, [artworks.length])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'Escape') {
        setLightbox(false)
        setShowLogin(false)
        setShowAddForm(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setShowLogin(false)
      setPassword('')
      return
    }

    alert('Wrong password')
  }

  function handleAddArt() {
    if (!newArt.title) return
    const art: Artwork = {
      id: Date.now().toString(),
      url: newArt.url,
      title: newArt.title,
      description: newArt.description,
      accent: newArt.accent,
    }
    setArtworks((prev) => [...prev, art])
    setNewArt({
      url: '',
      title: '',
      description: '',
      accent: '#8fb6ff',
    })
    setShowAddForm(false)
  }

  function handleDeleteArt(id: string) {
    setArtworks((prev) => {
      const next = prev.filter((art) => art.id !== id)
      if (currentIdx >= next.length) setCurrentIdx(Math.max(0, next.length - 1))
      return next
    })
  }

  return (
    <BirthdayGate backHref="/" prompt="When is Sam's birthday?">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Space+Mono:wght@400;700&display=swap');

        .gallery-page {
          --bg: #070709;
          --text: #f0ece8;
          --muted: #6b6870;
          font-family: 'Cormorant Garamond', serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .bg-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .bg-img,
        .bg-placeholder {
          position: absolute;
          width: 42%;
          aspect-ratio: 4 / 3;
          opacity: 0.08;
          filter: blur(1px) saturate(0.8);
          animation: drift 40s ease-in-out infinite alternate;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .bg-img {
          object-fit: cover;
        }
        .bg-placeholder {
          background:
            radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 30%),
            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
        }
        .bg-layer > *:nth-child(1) { top: -5%; left: -5%; animation-delay: 0s; }
        .bg-layer > *:nth-child(2) { top: 30%; right: -10%; animation-delay: -8s; animation-direction: alternate-reverse; }
        .bg-layer > *:nth-child(3) { bottom: -10%; left: 20%; animation-delay: -16s; }
        .bg-layer > *:nth-child(4) { top: 10%; left: 40%; animation-delay: -24s; animation-direction: alternate-reverse; }
        .bg-layer > *:nth-child(5) { bottom: 5%; right: 5%; animation-delay: -32s; }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, -10px) scale(1.02); }
          66% { transform: translate(-10px, 15px) scale(0.98); }
          100% { transform: translate(5px, 5px) scale(1.01); }
        }

        .frame-container {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }
        .frame-container > * {
          pointer-events: all;
        }

        .art-frame {
          position: relative;
          width: min(75vw, 700px);
          aspect-ratio: 4 / 3;
          border-radius: 4px;
          padding: 4px;
          background: conic-gradient(
            from var(--frame-angle, 0deg),
            #ff006e, #8338ec, #3a86ff, #06d6a0, #ffbe0b, #ff006e
          );
          animation: rotate-gradient 4s linear infinite;
        }
        @property --frame-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes rotate-gradient {
          to { --frame-angle: 360deg; }
        }

        .art-frame-inner {
          width: 100%;
          height: 100%;
          background: var(--bg);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .art-frame-inner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 0.5s ease;
        }

        .art-placeholder {
          width: calc(100% - 44px);
          height: calc(100% - 44px);
          border: 1px dashed rgba(255,255,255,0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
          background:
            radial-gradient(circle at top right, rgba(255,255,255,0.06), transparent 35%),
            linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
        }

        .art-placeholder .slot {
          font-size: 34px;
          font-weight: 400;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        .art-placeholder p {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(240,236,232,0.62);
        }

        .art-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px 28px;
          background: linear-gradient(transparent, rgba(7, 7, 9, 0.92));
        }
        .art-info h3 {
          font-size: 24px;
          font-weight: 300;
          margin: 0 0 4px;
          letter-spacing: 1px;
        }
        .art-info p {
          font-size: 14px;
          color: var(--muted);
          margin: 0;
          font-style: italic;
        }

        .gallery-title {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 50;
          padding: 28px 0 20px;
          background: linear-gradient(var(--bg), transparent);
        }
        .gallery-title h1 {
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 12px;
          text-transform: uppercase;
          margin: 0;
          background: linear-gradient(90deg, #ff006e, #8338ec, #3a86ff, #06d6a0, #ffbe0b);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .nav-arrow {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          background: none;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.6);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
        }
        .nav-arrow:hover {
          border-color: rgba(255,255,255,0.4);
          color: white;
          background: rgba(255,255,255,0.05);
        }
        .nav-arrow.left { left: 24px; }
        .nav-arrow.right { right: 24px; }

        .counter {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 3px;
          color: var(--muted);
        }

        .bottom-bar {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 30;
          display: flex;
          gap: 12px;
        }
        .bar-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--muted);
          padding: 8px 16px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
          transition: all 0.3s;
          border-radius: 2px;
        }
        .bar-btn:hover {
          border-color: rgba(255,255,255,0.3);
          color: white;
        }
        .bar-btn.danger:hover {
          border-color: #ff4444;
          color: #ff4444;
        }

        .back-link {
          position: fixed;
          bottom: 28px;
          left: 24px;
          z-index: 30;
          background: none;
          border: none;
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 2px;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
          transition: color 0.2s;
        }
        .back-link:hover { color: white; }

        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
          animation: fadeIn 0.3s ease;
        }
        .lightbox-overlay img {
          max-width: 92vw;
          max-height: 88vh;
          object-fit: contain;
          border-radius: 4px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal {
          background: #1a1a1e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 36px;
          min-width: 340px;
          max-width: 440px;
        }
        .modal h3 {
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 2px;
          margin: 0 0 24px;
        }
        .modal input, .modal textarea {
          display: block;
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 12px 14px;
          border-radius: 4px;
          margin-bottom: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .modal input:focus, .modal textarea:focus {
          border-color: rgba(131, 56, 236, 0.5);
        }
        .modal textarea { resize: vertical; min-height: 80px; }
        .modal .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 8px;
        }
        .modal .modal-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          padding: 10px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: 'Space Mono', monospace;
          transition: all 0.2s;
        }
        .modal .modal-btn:hover { background: rgba(255,255,255,0.1); }
        .modal .modal-btn.primary {
          background: rgba(131, 56, 236, 0.3);
          border-color: rgba(131, 56, 236, 0.5);
        }
      `}</style>

      <div className="gallery-page">
        <div className="bg-layer">
          {artworks.slice(0, 5).map((art) =>
            art.url ? (
              <img key={art.id} className="bg-img" src={art.url} alt="" />
            ) : (
              <div
                key={art.id}
                className="bg-placeholder"
                style={{
                  background: `radial-gradient(circle at top right, ${art.accent}30, transparent 32%), linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
                }}
              />
            )
          )}
        </div>

        <div className="gallery-title">
          <h1>Sam&apos;s Gallery</h1>
        </div>

        {artworks.length > 1 && (
          <>
            <button className="nav-arrow left" onClick={goPrev}>
              {'<'}
            </button>
            <button className="nav-arrow right" onClick={goNext}>
              {'>'}
            </button>
          </>
        )}

        {currentArt && (
          <div className="frame-container">
            <div className="art-frame" ref={frameRef}>
              <div className="art-frame-inner">
                {currentArt.url ? (
                  <img
                    src={currentArt.url}
                    alt={currentArt.title}
                    onClick={() => setLightbox(true)}
                    style={{ cursor: 'zoom-in' }}
                  />
                ) : (
                  <div className="art-placeholder">
                    <div>
                      <div
                        className="slot"
                        style={{ color: currentArt.accent }}
                      >
                        {currentArt.title}
                      </div>
                      <p>{currentArt.description}</p>
                    </div>
                  </div>
                )}
                <div className="art-info">
                  <h3>{currentArt.title}</h3>
                  <p>{currentArt.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {artworks.length > 0 && (
          <div className="counter">
            {String(currentIdx + 1).padStart(2, '0')} /{' '}
            {String(artworks.length).padStart(2, '0')}
          </div>
        )}

        <div className="bottom-bar">
          {!isAdmin ? (
            <button className="bar-btn" onClick={() => setShowLogin(true)}>
              Admin
            </button>
          ) : (
            <>
              <button className="bar-btn" onClick={() => setShowAddForm(true)}>
                + Add
              </button>
              {currentArt && (
                <button
                  className="bar-btn danger"
                  onClick={() => handleDeleteArt(currentArt.id)}
                >
                  Delete
                </button>
              )}
              <button className="bar-btn" onClick={() => setIsAdmin(false)}>
                Lock
              </button>
            </>
          )}
        </div>

        <button className="back-link" onClick={() => router.push('/')}>
          Back
        </button>

        {lightbox && currentArt?.url && (
          <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
            <img src={currentArt.url} alt={currentArt.title} />
          </div>
        )}

        {showLogin && (
          <div className="modal-overlay" onClick={() => setShowLogin(false)}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
              <h3>Admin Login</h3>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
                autoFocus
              />
              <div className="modal-actions">
                <button className="modal-btn" onClick={() => setShowLogin(false)}>
                  Cancel
                </button>
                <button className="modal-btn primary" onClick={handleLogin}>
                  Enter
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
              <h3>Add Artwork</h3>
              <input
                placeholder="Image URL (optional)"
                value={newArt.url}
                onChange={(event) =>
                  setNewArt((prev) => ({ ...prev, url: event.target.value }))
                }
                autoFocus
              />
              <input
                placeholder="Title"
                value={newArt.title}
                onChange={(event) =>
                  setNewArt((prev) => ({ ...prev, title: event.target.value }))
                }
              />
              <textarea
                placeholder="Description"
                value={newArt.description}
                onChange={(event) =>
                  setNewArt((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
              <input
                placeholder="Accent color"
                value={newArt.accent}
                onChange={(event) =>
                  setNewArt((prev) => ({ ...prev, accent: event.target.value }))
                }
              />
              <div className="modal-actions">
                <button
                  className="modal-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button className="modal-btn primary" onClick={handleAddArt}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BirthdayGate>
  )
}
