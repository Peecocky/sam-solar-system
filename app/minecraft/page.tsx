'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

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

const VIDEO_CLIPS = [
  { src: '/minecraft loop video.mp4', start: 0, duration: 10 },
  { src: '/minecraft loop video.mp4', start: 10, duration: 10 },
  { src: '/minecraft loop video.mp4', start: 20, duration: 10 },
  { src: '/minecraft loop video.mp4', start: 30, duration: 10 },
  { src: '/minecraft loop video.mp4', start: 40, duration: 10 },
]

export default function MinecraftPage() {
  const router = useRouter()
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [showDeathScreen, setShowDeathScreen] = useState(false)
  const [killInput, setKillInput] = useState('')
  const [isKillMode, setIsKillMode] = useState(false)

  const scenesRef = useRef<(THREE.Scene | null)[]>([])
  const renderersRef = useRef<(THREE.WebGLRenderer | null)[]>([])
  const materialsRef = useRef<(THREE.ShaderMaterial | null)[]>([])
  const clocksRef = useRef<(THREE.Clock | null)[]>([])

  // Initialize canvas refs array
  useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, MINECRAFT_IMAGES.length)
    videoRefs.current = videoRefs.current.slice(0, VIDEO_CLIPS.length)
    scenesRef.current = scenesRef.current.slice(0, MINECRAFT_IMAGES.length)
    renderersRef.current = renderersRef.current.slice(0, MINECRAFT_IMAGES.length)
    materialsRef.current = materialsRef.current.slice(0, MINECRAFT_IMAGES.length)
    clocksRef.current = clocksRef.current.slice(0, MINECRAFT_IMAGES.length)
  }, [])

  // Initialize all scenes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const cleanupFunctions: (() => void)[] = []

    const initShaderScene = (index: number, canvas: HTMLCanvasElement) => {
      // Scene setup
      const scene = new THREE.Scene()
      scenesRef.current[index] = scene

      const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / 2) / (window.innerHeight / 2), 0.1, 1000)
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: false })
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
      renderersRef.current[index] = renderer

      const clock = new THREE.Clock()
      clocksRef.current[index] = clock

      // Load texture
      const textureLoader = new THREE.TextureLoader()
      const texture = textureLoader.load(MINECRAFT_IMAGES[index])

      // Shader uniforms
      const uniforms = {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0.0 },
      }

      // Vertex shader
      const vertexShader = `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;

        void main() {
          vUv = uv;

          vec3 pos = position;

          // Calculate distance to mouse
          float distToMouse = distance(uv, uMouse);

          // Create ripple effect
          float ripple = sin(distToMouse * 28.0 - uTime * 4.0) * 0.08;
          float falloff = smoothstep(0.42, 0.0, distToMouse);

          // Apply z displacement
          pos.z += ripple * falloff * uHover * 1.8;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `

      // Fragment shader
      const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;

        void main() {
          vec2 uv = vUv;

          // Calculate distance to mouse
          float distToMouse = distance(uv, uMouse);

          // Create wave distortion
          float wave = sin(distToMouse * 35.0 - uTime * 5.0) * 0.012;
          float falloff = smoothstep(0.36, 0.0, distToMouse);

          // Direction from mouse to current pixel
          vec2 dir = normalize(uv - uMouse + 0.0001);

          // Apply UV distortion
          uv += dir * wave * falloff * uHover * 2.0;

          // Sample texture
          vec4 tex = texture2D(uTexture, uv);

          gl_FragColor = tex;
        }
      `

      // Create material
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      })
      materialsRef.current[index] = material

      // Create plane geometry
      const geometry = new THREE.PlaneGeometry(7.6, 4.7, 220, 220)
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // Mouse tracking
      let mouse = new THREE.Vector2(0.5, 0.5)

      const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        mouse.x = (event.clientX - rect.left) / rect.width
        mouse.y = (event.clientY - rect.top) / rect.height
        uniforms.uMouse.value.set(mouse.x, 1.0 - mouse.y)
        uniforms.uHover.value = 1.0
      }

      const handleMouseLeave = () => {
        uniforms.uHover.value = 0.0
      }

      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate)

        uniforms.uTime.value = clock.getElapsedTime()

        renderer.render(scene, camera)
      }
      animate()

      // Handle resize
      const handleResize = () => {
        camera.aspect = (window.innerWidth / 2) / (window.innerHeight / 2)
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
      }
      window.addEventListener('resize', handleResize)

      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
        window.removeEventListener('resize', handleResize)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        texture.dispose()
      }
    }

    MINECRAFT_IMAGES.forEach((_, index) => {
      const canvas = canvasRefs.current[index]
      if (canvas) {
        const cleanup = initShaderScene(index, canvas)
        cleanupFunctions.push(cleanup)
      }
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [])

  // Handle kill command
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 't' && !isKillMode && !showDeathScreen) {
        e.preventDefault()
        setIsKillMode(true)
      }

      if (isKillMode) {
        if (e.key === 'Enter') {
          if (killInput === '/kill') {
            setShowDeathScreen(true)
            setIsKillMode(false)
            setKillInput('')
          }
          setKillInput('')
        } else if (e.key === 'Escape') {
          setIsKillMode(false)
          setKillInput('')
        } else if (e.key === 'Backspace') {
          setKillInput(killInput.slice(0, -1))
        } else if (e.key.length === 1) {
          setKillInput(killInput + e.key)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isKillMode, killInput, showDeathScreen])

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #000;
        }

        .minecraft-page {
          min-height: 100vh;
          background: #000;
        }

        .section {
          position: relative;
          width: 100%;
          height: 50vh;
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
        }

        .canvas-container {
          position: relative;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        canvas {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-section {
          position: relative;
          width: 100%;
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .back-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid #7bc259;
          color: #7bc259;
          padding: 8px 12px;
          font: 500 11px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .back-btn:hover {
          background: rgba(123, 194, 89, 0.2);
          box-shadow: 0 0 8px rgba(123, 194, 89, 0.5);
        }

        .hint {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: rgba(123, 194, 89, 0.6);
          font: 11px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 1000;
          opacity: ${isKillMode ? 0 : 1};
          transition: opacity 0.3s ease;
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
          z-index: 1000;
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
          z-index: 2000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          opacity: ${showDeathScreen ? 1 : 0};
          visibility: ${showDeathScreen ? 'visible' : 'hidden'};
          transition: opacity 0.3s ease;
          pointer-events: ${showDeathScreen ? 'auto' : 'none'};
        }

        .death-image {
          width: 80vw;
          max-width: 600px;
          height: auto;
          border: 2px solid #7bc259;
          border-radius: 8px;
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

        .respawn-tooltip,
        .title-tooltip {
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
          color: #7bc259;
          padding: 8px 12px;
          border-radius: 4px;
          font: 10px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2001;
        }

        .respawn-tooltip {
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
        }

        .title-tooltip {
          bottom: 120px;
          right: 50%;
          transform: translateX(50%);
        }
      `}</style>

      <div className="minecraft-page">
        <button className="back-btn" onClick={() => router.push('/')}>
          ← BACK
        </button>

        {!isKillMode && !showDeathScreen && (
          <div className="hint">
            press T to enter command
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

        {/* Image sections with shader effects - grouped in 2x2 grids */}
        {Array.from({ length: Math.ceil(MINECRAFT_IMAGES.length / 4) }, (_, groupIndex) => (
          <div key={`group-${groupIndex}`} className="section">
            {MINECRAFT_IMAGES.slice(groupIndex * 4, (groupIndex + 1) * 4).map((image, index) => {
              const globalIndex = groupIndex * 4 + index
              return (
                <div key={`image-${globalIndex}`} className="canvas-container">
                  <canvas
                    ref={(el) => {
                      if (el) canvasRefs.current[globalIndex] = el
                    }}
                    width={typeof window !== 'undefined' ? window.innerWidth / 2 : 960}
                    height={typeof window !== 'undefined' ? window.innerHeight / 2 : 540}
                  />
                </div>
              )
            })}
          </div>
        ))}

        {/* Video sections */}
        {VIDEO_CLIPS.map((video, index) => (
          <div key={`video-${index}`} className="video-section">
            <video
              ref={(el) => {
                if (el) videoRefs.current[index] = el
              }}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => {
                const videoEl = videoRefs.current[index]
                if (videoEl) {
                  videoEl.currentTime = video.start
                }
              }}
            >
              <source src={video.src} type="video/mp4" />
            </video>
          </div>
        ))}

        <div className="death-screen">
          {showDeathScreen && (
            <>
              <img
                src="/minecraft_you_died.jpg"
                alt="You Died"
                className="death-image"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const respawnBtn = document.querySelector('.death-btn:first-child') as HTMLElement
                  const titleBtn = document.querySelector('.death-btn:last-child') as HTMLElement

                  if (respawnBtn && titleBtn) {
                    const respawnRect = respawnBtn.getBoundingClientRect()
                    const titleRect = titleBtn.getBoundingClientRect()

                    // Check if mouse is over respawn button area
                    if (e.clientX >= respawnRect.left && e.clientX <= respawnRect.right &&
                        e.clientY >= respawnRect.top && e.clientY <= respawnRect.bottom) {
                      document.querySelector('.respawn-tooltip')?.classList.add('show')
                    } else {
                      document.querySelector('.respawn-tooltip')?.classList.remove('show')
                    }

                    // Check if mouse is over title screen button area
                    if (e.clientX >= titleRect.left && e.clientX <= titleRect.right &&
                        e.clientY >= titleRect.top && e.clientY <= titleRect.bottom) {
                      document.querySelector('.title-tooltip')?.classList.add('show')
                    } else {
                      document.querySelector('.title-tooltip')?.classList.remove('show')
                    }
                  }
                }}
                onMouseLeave={() => {
                  document.querySelector('.respawn-tooltip')?.classList.remove('show')
                  document.querySelector('.title-tooltip')?.classList.remove('show')
                }}
              />
              <div className="death-buttons">
                <button
                  className="death-btn"
                  onClick={() => {
                    setShowDeathScreen(false)
                    setKillInput('')
                    setIsKillMode(false)
                  }}
                  onMouseEnter={() => {
                    document.querySelector('.respawn-tooltip')?.classList.add('show')
                  }}
                  onMouseLeave={() => {
                    document.querySelector('.respawn-tooltip')?.classList.remove('show')
                  }}
                >
                  RESPAWN
                </button>
                <button
                  className="death-btn"
                  onClick={() => router.push('/')}
                  onMouseEnter={() => {
                    document.querySelector('.title-tooltip')?.classList.add('show')
                  }}
                  onMouseLeave={() => {
                    document.querySelector('.title-tooltip')?.classList.remove('show')
                  }}
                >
                  TITLE SCREEN
                </button>
              </div>
              <div className="respawn-tooltip">
                Continue your adventure
              </div>
              <div className="title-tooltip">
                Return to main menu
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
