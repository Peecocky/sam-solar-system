'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Country = {
  id: string
  name: string
  subtitle: string
  route: string | null
  color: string
  hoverColor: string
  // SVG path data for the country shape
  path: string
  // Label position
  labelX: number
  labelY: number
  // Icon
  icon: string
  locked: boolean
}

const COUNTRIES: Country[] = [
  {
    id: 'lottery',
    name: 'Lottery Isles',
    subtitle: 'Ball-drop casino archipelago',
    route: '/games/lottery',
    color: '#1a3a4a',
    hoverColor: '#00e5ff',
    path: 'M140,180 L195,155 L240,170 L260,200 L250,250 L270,290 L240,320 L200,310 L170,330 L130,300 L110,260 L100,220 L120,190 Z',
    labelX: 175,
    labelY: 250,
    icon: '🎰',
    locked: false,
  },
  {
    id: 'aim',
    name: 'Scoop Republic',
    subtitle: 'Poop scooper training grounds',
    route: '/games/aim',
    color: '#3a2a1a',
    hoverColor: '#ffaa44',
    path: 'M420,120 L490,100 L560,115 L590,160 L600,220 L580,270 L540,290 L490,300 L440,280 L400,240 L390,190 L400,150 Z',
    labelX: 495,
    labelY: 200,
    icon: '💩',
    locked: false,
  },
  {
    id: 'rhythm',
    name: 'Rhythmia',
    subtitle: 'Coming soon...',
    route: null,
    color: '#2a1a3a',
    hoverColor: '#aa66ff',
    path: 'M750,80 L820,70 L880,90 L910,140 L900,200 L860,230 L810,240 L760,220 L730,180 L720,130 Z',
    labelX: 815,
    labelY: 155,
    icon: '🎵',
    locked: true,
  },
  {
    id: 'puzzle',
    name: 'Enigma Reach',
    subtitle: 'Coming soon...',
    route: null,
    color: '#1a2a1a',
    hoverColor: '#66ff88',
    path: 'M680,340 L740,310 L810,320 L860,360 L870,420 L840,470 L790,490 L730,480 L690,450 L660,400 L670,360 Z',
    labelX: 770,
    labelY: 400,
    icon: '🧩',
    locked: true,
  },
  {
    id: 'racing',
    name: 'Velocity Plains',
    subtitle: 'Coming soon...',
    route: null,
    color: '#3a1a1a',
    hoverColor: '#ff6666',
    path: 'M300,410 L370,380 L440,390 L480,430 L490,480 L470,530 L420,560 L360,550 L310,520 L280,470 L290,430 Z',
    labelX: 385,
    labelY: 475,
    icon: '🏎️',
    locked: true,
  },
  {
    id: 'memory',
    name: 'Mnemos Atoll',
    subtitle: 'Coming soon...',
    route: null,
    color: '#1a3a3a',
    hoverColor: '#44dddd',
    path: 'M100,420 L150,400 L200,410 L230,450 L225,500 L195,530 L145,540 L105,510 L80,470 L85,440 Z',
    labelX: 155,
    labelY: 470,
    icon: '🧠',
    locked: true,
  },
  {
    id: 'battle',
    name: 'The Warfields',
    subtitle: 'Coming soon...',
    route: null,
    color: '#2a2a1a',
    hoverColor: '#ddaa44',
    path: 'M520,460 L580,440 L640,455 L660,500 L650,550 L610,580 L560,575 L520,545 L500,500 Z',
    labelX: 578,
    labelY: 510,
    icon: '⚔️',
    locked: true,
  },
  {
    id: 'stealth',
    name: 'Shadow Depths',
    subtitle: 'Coming soon...',
    route: null,
    color: '#151520',
    hoverColor: '#8888cc',
    path: 'M880,300 L940,280 L990,300 L1010,350 L1000,400 L960,430 L910,420 L870,390 L860,340 Z',
    labelX: 935,
    labelY: 355,
    icon: '🥷',
    locked: true,
  },
]

export default function GamesHub() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  const hoveredCountry = hovered ? COUNTRIES.find(c => c.id === hovered) : null

  function handleClick(country: Country) {
    if (country.locked || !country.route) return
    router.push(country.route)
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');

        .map-page {
          --bg: #0a0c10;
          font-family: 'Cinzel', serif;
          background: var(--bg);
          color: white;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
          user-select: none;
        }

        /* Top bar */
        .map-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: linear-gradient(var(--bg), transparent);
        }
        .map-back {
          background: none;
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.25);
          padding: 6px 14px;
          font: 11px 'Space Mono', monospace;
          letter-spacing: 1px;
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.2s;
        }
        .map-back:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.5);
        }

        .map-title-bar {
          text-align: center;
        }
        .map-title-bar h1 {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 8px;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          margin: 0;
        }
        .map-title-bar p {
          font: 10px 'Space Mono', monospace;
          color: rgba(255,255,255,0.08);
          letter-spacing: 3px;
          margin: 4px 0 0;
        }

        /* SVG map */
        .map-svg {
          width: 100%;
          height: 100%;
        }

        .country-path {
          transition: fill 0.3s, filter 0.3s, stroke 0.3s;
          stroke: rgba(255,255,255,0.04);
          stroke-width: 1.5;
        }
        .country-path:hover {
          stroke-width: 2;
        }
        .country-path.active {
          cursor: pointer;
        }
        .country-path.locked {
          cursor: default;
        }

        /* Grid lines */
        .grid-line {
          stroke: rgba(255,255,255,0.015);
          stroke-width: 0.5;
        }

        /* Country label */
        .country-label {
          pointer-events: none;
          transition: opacity 0.3s;
        }

        /* Tooltip */
        .map-tooltip {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 40;
          background: rgba(10,12,16,0.92);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border-radius: 6px;
          padding: 16px 24px;
          text-align: center;
          min-width: 240px;
          animation: tooltipIn 0.2s ease;
          pointer-events: none;
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .map-tooltip .tt-icon {
          font-size: 28px;
          margin-bottom: 6px;
        }
        .map-tooltip .tt-name {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 3px;
          margin-bottom: 4px;
        }
        .map-tooltip .tt-sub {
          font: 11px 'Space Mono', monospace;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
        }
        .map-tooltip .tt-action {
          font: 10px 'Space Mono', monospace;
          letter-spacing: 2px;
          margin-top: 10px;
          text-transform: uppercase;
        }

        /* Compass rose */
        .compass {
          position: absolute;
          bottom: 24px;
          right: 24px;
          z-index: 30;
          opacity: 0.06;
          font-size: 11px;
          letter-spacing: 3px;
          color: white;
          font-family: 'Space Mono', monospace;
        }

        /* Sea texture dots */
        .sea-dots {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.01) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        /* Decorative borders */
        .map-border {
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(255,255,255,0.025);
          border-radius: 4px;
          pointer-events: none;
          z-index: 20;
        }
      `}</style>

      <div className="map-page">
        <div className="sea-dots" />
        <div className="map-border" />

        {/* Top bar */}
        <div className="map-topbar">
          <button className="map-back" onClick={() => router.push('/')}>
            ← Solar System
          </button>
          <div className="map-title-bar">
            <h1>Sam&apos;s Realm</h1>
            <p>Choose your arena</p>
          </div>
          <div style={{ width: 100 }} />
        </div>

        {/* SVG Map */}
        <svg
          className="map-svg"
          viewBox="0 0 1100 620"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`gv${i}`} className="grid-line" x1={i * 100} y1={0} x2={i * 100} y2={620} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`gh${i}`} className="grid-line" x1={0} y1={i * 100} x2={1100} y2={i * 100} />
          ))}

          {/* Sea route dashed lines connecting countries */}
          <line x1={250} y1={260} x2={420} y2={190} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="6 8" />
          <line x1={560} y1={270} x2={750} y2={160} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="6 8" />
          <line x1={490} y1={300} x2={500} y2={440} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="6 8" />
          <line x1={240} y1={320} x2={200} y2={410} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="6 8" />
          <line x1={660} y1={450} x2={880} y2={350} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="6 8" />

          {/* Countries */}
          {COUNTRIES.map((c) => {
            const isHov = hovered === c.id
            return (
              <g key={c.id}>
                {/* Shadow / glow */}
                {isHov && (
                  <path
                    d={c.path}
                    fill={c.hoverColor}
                    opacity={0.08}
                    filter="url(#glow)"
                    transform="translate(0,2)"
                  />
                )}

                {/* Country shape */}
                <path
                  d={c.path}
                  fill={isHov ? c.hoverColor + '30' : c.color}
                  stroke={isHov ? c.hoverColor + '80' : 'rgba(255,255,255,0.04)'}
                  strokeWidth={isHov ? 2.5 : 1.5}
                  className={`country-path ${c.locked ? 'locked' : 'active'}`}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleClick(c)}
                  style={{
                    filter: isHov ? `drop-shadow(0 0 20px ${c.hoverColor}40)` : 'none',
                  }}
                />

                {/* Inland texture lines */}
                <path
                  d={c.path}
                  fill="none"
                  stroke={isHov ? c.hoverColor + '15' : 'rgba(255,255,255,0.01)'}
                  strokeWidth={0.5}
                  strokeDasharray="2 6"
                  pointerEvents="none"
                  transform={`translate(3,3) scale(0.96)`}
                  style={{ transformOrigin: `${c.labelX}px ${c.labelY}px` }}
                />

                {/* Icon */}
                <text
                  x={c.labelX}
                  y={c.labelY - 14}
                  textAnchor="middle"
                  fontSize={isHov ? 26 : 20}
                  className="country-label"
                  style={{
                    opacity: isHov ? 1 : 0.5,
                    transition: 'font-size 0.2s, opacity 0.2s',
                  }}
                >
                  {c.icon}
                </text>

                {/* Name */}
                <text
                  x={c.labelX}
                  y={c.labelY + 10}
                  textAnchor="middle"
                  fontSize={isHov ? 11 : 9}
                  fontFamily="'Cinzel', serif"
                  fontWeight={isHov ? 700 : 400}
                  letterSpacing={isHov ? 2 : 1}
                  fill={isHov ? c.hoverColor : 'rgba(255,255,255,0.15)'}
                  className="country-label"
                  style={{ transition: 'all 0.2s' }}
                >
                  {c.name}
                </text>

                {/* Lock indicator */}
                {c.locked && (
                  <text
                    x={c.labelX}
                    y={c.labelY + 26}
                    textAnchor="middle"
                    fontSize={8}
                    fontFamily="'Space Mono', monospace"
                    fill="rgba(255,255,255,0.08)"
                    letterSpacing={1}
                    className="country-label"
                  >
                    LOCKED
                  </text>
                )}
              </g>
            )
          })}

          {/* Glow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Tooltip */}
        {hoveredCountry && (
          <div className="map-tooltip">
            <div className="tt-icon">{hoveredCountry.icon}</div>
            <div className="tt-name" style={{ color: hoveredCountry.hoverColor }}>
              {hoveredCountry.name}
            </div>
            <div className="tt-sub">{hoveredCountry.subtitle}</div>
            <div
              className="tt-action"
              style={{
                color: hoveredCountry.locked
                  ? 'rgba(255,255,255,0.1)'
                  : hoveredCountry.hoverColor,
              }}
            >
              {hoveredCountry.locked ? '🔒 coming soon' : '▶ click to enter'}
            </div>
          </div>
        )}

        {/* Compass */}
        <div className="compass">
          N<br />
          W · E<br />
          S
        </div>
      </div>
    </>
  )
}
