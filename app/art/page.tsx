'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Artwork = {
  id: string
  url: string
  title: string
  description: string
}

const DEFAULT_ARTWORKS: Artwork[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    title: 'Abstract Flow',
    description: 'Exploring the intersection of color and motion.',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80',
    title: 'Digital Dreamscape',
    description: 'A generative piece inspired by neural networks and nature.',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80',
    title: 'Neon Geometry',
    description: 'Hard edges meet soft gradients in this digital composition.',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    title: 'Canvas Study #7',
    description: 'Oil on canvas — an exercise in texture and light.',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
    title: 'Watercolor Morning',
    description: 'Captured the feeling of early mist on paper.',
  },
]

const ADMIN_PASSWORD = 'sam2024'

export default function ArtPage() {
  const router = useRouter()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newArt, setNewArt] = useState({ url: '', title: '', description: '' })
  const frameRef = useRef<HTMLDivElement>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sam-gallery-artworks')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArtworks(parsed)
          return
        }
      }
    } catch { /* ignore */ }
    setArtworks(DEFAULT_ARTWORKS)
  }, [])

  // Save to localStorage
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

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') {
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
    } else {
      alert('Wrong password')
    }
  }

  function handleAddArt() {
    if (!newArt.url || !newArt.title) return
    const art: Artwork = {
      id: Date.now().toString(),
      ...newArt,
    }
    setArtworks((prev) => [...prev, art])
    setNewArt({ url: '', title: '', description: '' })
    setShowAddForm(false)
  }

  function handleDeleteArt(id: string) {
    setArtworks((prev) => {
      const next = prev.filter((a) => a.id !== id)
      if (currentIdx >= next.length) setCurrentIdx(Math.max(0, next.length - 1))
      return next
    })
  }

  return (
    <>
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

        /* ===== Floating background images ===== */
        .bg-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .bg-img {
          position: absolute;
          object-fit: cover;
          opacity: 0.06;
          filter: blur(1px) saturate(0.6);
          animation: drift 40s ease-in-out infinite alternate;
        }
        .bg-img:nth-child(1) { top: -5%; left: -5%; width: 55%; animation-delay: 0s; }
        .bg-img:nth-child(2) { top: 30%; right: -10%; width: 45%; animation-delay: -8s; animation-direction: alternate-reverse; }
        .bg-img:nth-child(3) { bottom: -10%; left: 20%; width: 50%; animation-delay: -16s; }
        .bg-img:nth-child(4) { top: 10%; left: 40%; width: 35%; animation-delay: -24s; animation-direction: alternate-reverse; }
        .bg-img:nth-child(5) { bottom: 5%; right: 5%; width: 40%; animation-delay: -32s; }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, -10px) scale(1.02); }
          66% { transform: translate(-10px, 15px) scale(0.98); }
          100% { transform: translate(5px, 5px) scale(1.01); }
        }

        /* ===== Gradient animated frame ===== */
        .frame-container {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }
        .frame-container > * { pointer-events: all; }

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

        /* ===== Title ===== */
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

        /* ===== Nav arrows ===== */
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

        /* ===== Counter ===== */
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

        /* ===== Bottom bar ===== */
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

        /* ===== Lightbox ===== */
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

        /* ===== Modal ===== */
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
        {/* Floating background */}
        <div className="bg-layer">
          {artworks.slice(0, 5).map((art, i) => (
            <img key={art.id} className="bg-img" src={art.url} alt="" />
          ))}
        </div>

        {/* Title */}
        <div className="gallery-title">
          <h1>Sam&apos;s Gallery</h1>
        </div>

        {/* Navigation arrows */}
        {artworks.length > 1 && (
          <>
            <button className="nav-arrow left" onClick={goPrev}>
              ‹
            </button>
            <button className="nav-arrow right" onClick={goNext}>
              ›
            </button>
          </>
        )}

        {/* Main frame */}
        {currentArt && (
          <div className="frame-container">
            <div className="art-frame" ref={frameRef}>
              <div className="art-frame-inner">
                <img
                  src={currentArt.url}
                  alt={currentArt.title}
                  onClick={() => setLightbox(true)}
                  style={{ cursor: 'zoom-in' }}
                />
                <div className="art-info">
                  <h3>{currentArt.title}</h3>
                  <p>{currentArt.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Counter */}
        {artworks.length > 0 && (
          <div className="counter">
            {String(currentIdx + 1).padStart(2, '0')} / {String(artworks.length).padStart(2, '0')}
          </div>
        )}

        {/* Bottom bar */}
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
              <button
                className="bar-btn"
                onClick={() => setIsAdmin(false)}
              >
                Lock
              </button>
            </>
          )}
        </div>

        <button className="back-link" onClick={() => router.push('/')}>
          ← Back
        </button>

        {/* Lightbox */}
        {lightbox && currentArt && (
          <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
            <img src={currentArt.url} alt={currentArt.title} />
          </div>
        )}

        {/* Login modal */}
        {showLogin && (
          <div className="modal-overlay" onClick={() => setShowLogin(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Admin Login</h3>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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

        {/* Add artwork modal */}
        {showAddForm && (
          <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Add Artwork</h3>
              <input
                placeholder="Image URL"
                value={newArt.url}
                onChange={(e) =>
                  setNewArt((prev) => ({ ...prev, url: e.target.value }))
                }
                autoFocus
              />
              <input
                placeholder="Title"
                value={newArt.title}
                onChange={(e) =>
                  setNewArt((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <textarea
                placeholder="Description (optional)"
                value={newArt.description}
                onChange={(e) =>
                  setNewArt((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
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
    </>
  )
}
