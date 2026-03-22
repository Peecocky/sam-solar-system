'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Realm = {
  id: string
  name: string
  subtitle: string
  description: string
  route: string | null
  accent: string
  fill: string
  path: string
  labelX: number
  labelY: number
  sparks: Array<[number, number]>
  locked: boolean
}

const REALMS: Realm[] = [
  {
    id: 'lottery',
    name: 'Lottery Isles',
    subtitle: 'Ball-drop fortunes in windy coves',
    description: 'A bright little archipelago where luck is a profession.',
    route: '/games/lottery',
    accent: '#5577a6',
    fill: '#dbe8f1',
    path: 'M140,180 L195,155 L240,170 L260,200 L250,250 L270,290 L240,320 L200,310 L170,330 L130,300 L110,260 L100,220 L120,190 Z',
    labelX: 182,
    labelY: 248,
    sparks: [
      [148, 190],
      [214, 176],
      [238, 258],
      [154, 298],
    ],
    locked: false,
  },
  {
    id: 'aim',
    name: 'Scoop Republic',
    subtitle: 'Precision drills, dignity optional',
    description: 'The province of heroic aim and deeply unserious training.',
    route: '/games/aim',
    accent: '#9b6a42',
    fill: '#ead9c6',
    path: 'M420,120 L490,100 L560,115 L590,160 L600,220 L580,270 L540,290 L490,300 L440,280 L400,240 L390,190 L400,150 Z',
    labelX: 495,
    labelY: 200,
    sparks: [
      [434, 138],
      [566, 132],
      [582, 234],
      [432, 262],
    ],
    locked: false,
  },
  {
    id: 'sound',
    name: 'Echoing Isles',
    subtitle: 'A hunt guided by sound alone',
    description: 'Mist, whispers, and directional audio doing all the flirting.',
    route: '/games/sound',
    accent: '#7b62a6',
    fill: '#ddd4ef',
    path: 'M750,80 L820,70 L880,90 L910,140 L900,200 L860,230 L810,240 L760,220 L730,180 L720,130 Z',
    labelX: 814,
    labelY: 156,
    sparks: [
      [748, 104],
      [886, 108],
      [888, 204],
      [754, 208],
    ],
    locked: false,
  },
  {
    id: 'puzzle',
    name: 'Enigma Reach',
    subtitle: 'A seal still keeps the riddles in',
    description: 'Not yet open. Even the doors want a clever answer first.',
    route: null,
    accent: '#5f8a67',
    fill: '#dce8db',
    path: 'M680,340 L740,310 L810,320 L860,360 L870,420 L840,470 L790,490 L730,480 L690,450 L660,400 L670,360 Z',
    labelX: 770,
    labelY: 404,
    sparks: [
      [698, 336],
      [840, 370],
      [826, 460],
      [694, 446],
    ],
    locked: true,
  },
  {
    id: 'racing',
    name: 'Velocity Plains',
    subtitle: 'Fast enough to offend the horses',
    description: 'Wide grasslands reserved for future reckless behavior.',
    route: null,
    accent: '#a65f5f',
    fill: '#edd2d2',
    path: 'M300,410 L370,380 L440,390 L480,430 L490,480 L470,530 L420,560 L360,550 L310,520 L280,470 L290,430 Z',
    labelX: 386,
    labelY: 474,
    sparks: [
      [320, 404],
      [458, 418],
      [456, 518],
      [318, 524],
    ],
    locked: true,
  },
  {
    id: 'memory',
    name: 'Mnemos Atoll',
    subtitle: 'Where your memory will be tested politely',
    description: 'A calm-looking atoll with no intention of staying calm.',
    route: null,
    accent: '#4e8388',
    fill: '#d4eaec',
    path: 'M100,420 L150,400 L200,410 L230,450 L225,500 L195,530 L145,540 L105,510 L80,470 L85,440 Z',
    labelX: 156,
    labelY: 470,
    sparks: [
      [108, 414],
      [208, 424],
      [204, 516],
      [104, 504],
    ],
    locked: true,
  },
  {
    id: 'battle',
    name: 'The Warfields',
    subtitle: 'Future skirmishes, future chaos',
    description: 'Currently under tactical fog and paperwork.',
    route: null,
    accent: '#8d7b43',
    fill: '#ebe1c4',
    path: 'M520,460 L580,440 L640,455 L660,500 L650,550 L610,580 L560,575 L520,545 L500,500 Z',
    labelX: 578,
    labelY: 510,
    sparks: [
      [532, 452],
      [636, 470],
      [626, 556],
      [532, 540],
    ],
    locked: true,
  },
  {
    id: 'stealth',
    name: 'Shadow Depths',
    subtitle: 'A locked zone that refuses witnesses',
    description: 'One day it will open. It still has trust issues.',
    route: null,
    accent: '#5c6c8f',
    fill: '#d7deeb',
    path: 'M880,300 L940,280 L990,300 L1010,350 L1000,400 L960,430 L910,420 L870,390 L860,340 Z',
    labelX: 934,
    labelY: 356,
    sparks: [
      [886, 298],
      [994, 318],
      [982, 404],
      [890, 404],
    ],
    locked: true,
  },
]

const MOUNTAIN_PATHS = [
  'M445 260 L500 136 L542 238 L590 116 L640 258',
  'M488 266 L540 154 L572 220 L616 140 L664 270',
  'M536 272 L584 174 L624 238 L678 156 L728 276',
]

const FOREST_TREES = [
  [120, 520],
  [148, 538],
  [182, 560],
  [206, 532],
  [236, 560],
  [258, 522],
  [292, 552],
  [320, 532],
  [346, 566],
  [380, 546],
]

export default function GamesHub() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  const hoveredRealm = hovered ? REALMS.find((realm) => realm.id === hovered) : null

  function enterRealm(realm: Realm) {
    if (realm.locked || !realm.route) return
    router.push(realm.route)
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@500;600;700&family=Spectral:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .realm-page {
          --ink: #324863;
          --ink-soft: rgba(50, 72, 99, 0.7);
          --paper: #f5eed8;
          --paper-warm: #ead7ae;
          --line: rgba(68, 91, 116, 0.72);
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(255, 247, 222, 0.9) 0%, rgba(249, 238, 205, 0.96) 28%, rgba(233, 214, 173, 0.98) 100%);
          color: var(--ink);
          overflow: hidden;
          position: relative;
          font-family: 'Spectral', serif;
        }

        .paper-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(rgba(97, 73, 36, 0.08) 1px, transparent 1px),
            radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
            linear-gradient(120deg, rgba(255,255,255,0.1), transparent 45%);
          background-size: 18px 18px, 24px 24px, 100% 100%;
          mix-blend-mode: multiply;
          opacity: 0.55;
        }

        .page-frame {
          position: absolute;
          inset: 18px;
          border: 1px solid rgba(67, 84, 99, 0.26);
          box-shadow: inset 0 0 0 2px rgba(255, 252, 238, 0.45);
          pointer-events: none;
        }

        .map-topbar {
          position: absolute;
          top: 18px;
          left: 26px;
          right: 26px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          z-index: 10;
        }

        .map-back {
          background: rgba(255, 251, 236, 0.66);
          border: 1px solid rgba(73, 94, 120, 0.3);
          color: var(--ink);
          padding: 10px 16px;
          font: 500 12px 'IBM Plex Mono', monospace;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          backdrop-filter: blur(3px);
        }

        .map-back:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(107, 83, 43, 0.12);
        }

        .map-title {
          text-align: center;
          padding-top: 6px;
        }

        .map-title h1 {
          margin: 0;
          font-family: 'Cormorant SC', serif;
          font-size: clamp(34px, 4vw, 56px);
          letter-spacing: 7px;
          color: #455a74;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .map-title p {
          margin: 6px 0 0;
          font: 500 12px 'IBM Plex Mono', monospace;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(69, 90, 116, 0.78);
        }

        .map-wrap {
          width: 100%;
          height: 100vh;
          padding: 88px 34px 34px;
          box-sizing: border-box;
        }

        .map-svg {
          width: 100%;
          height: 100%;
          display: block;
          filter: drop-shadow(0 16px 30px rgba(95, 68, 24, 0.1));
        }

        .realm-shape {
          stroke: rgba(65, 88, 114, 0.85);
          stroke-width: 2.2;
          transition: fill 0.25s ease, stroke 0.25s ease, filter 0.25s ease, transform 0.25s ease;
        }

        .realm-shape.active {
          cursor: pointer;
        }

        .realm-shape.locked {
          cursor: default;
        }

        .realm-border {
          fill: none;
          stroke: rgba(255, 248, 222, 0.55);
          stroke-width: 1;
          stroke-dasharray: 6 9;
          animation: borderShift 10s linear infinite;
        }

        .realm-label {
          pointer-events: none;
        }

        .realm-name {
          font-family: 'Cormorant SC', serif;
          letter-spacing: 1.5px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .realm-sub {
          font: 500 8px 'IBM Plex Mono', monospace;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .hover-rings {
          pointer-events: none;
          animation: floatHalo 2.2s ease-in-out infinite;
        }

        .hover-rings circle {
          fill: none;
          stroke-width: 1.5;
          opacity: 0.9;
        }

        .spark {
          animation: sparkPulse 1.6s ease-in-out infinite;
          transform-origin: center;
        }

        .map-tooltip {
          position: absolute;
          right: 30px;
          bottom: 30px;
          width: min(360px, calc(100vw - 60px));
          background: rgba(255, 248, 228, 0.85);
          border: 1px solid rgba(70, 89, 109, 0.22);
          box-shadow: 0 18px 40px rgba(112, 85, 43, 0.12);
          padding: 18px 20px;
          backdrop-filter: blur(6px);
        }

        .map-tooltip .eyebrow {
          font: 500 10px 'IBM Plex Mono', monospace;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          color: rgba(69, 90, 116, 0.7);
          margin-bottom: 8px;
        }

        .map-tooltip h2 {
          margin: 0;
          font-family: 'Cormorant SC', serif;
          font-size: 28px;
          color: var(--ink);
          letter-spacing: 1px;
        }

        .map-tooltip .sub {
          margin-top: 4px;
          color: rgba(56, 76, 99, 0.86);
          font-size: 15px;
        }

        .map-tooltip .desc {
          margin-top: 10px;
          color: rgba(56, 76, 99, 0.8);
          line-height: 1.6;
          font-size: 14px;
        }

        .map-tooltip .status {
          margin-top: 14px;
          font: 500 11px 'IBM Plex Mono', monospace;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .map-caption {
          position: absolute;
          left: 34px;
          bottom: 30px;
          max-width: 280px;
          color: rgba(64, 82, 103, 0.8);
          font-size: 14px;
          line-height: 1.65;
          text-shadow: 0 1px 0 rgba(255,255,255,0.45);
        }

        @keyframes sparkPulse {
          0%, 100% {
            opacity: 0.42;
            transform: scale(0.94);
          }
          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @keyframes borderShift {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -60;
          }
        }

        @keyframes floatHalo {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @media (max-width: 920px) {
          .map-wrap {
            padding: 94px 12px 12px;
          }

          .map-topbar {
            left: 14px;
            right: 14px;
          }

          .map-tooltip {
            left: 16px;
            right: 16px;
            width: auto;
            bottom: 16px;
          }

          .map-caption {
            display: none;
          }

          .map-title h1 {
            letter-spacing: 4px;
          }
        }
      `}</style>

      <div className="realm-page">
        <div className="paper-grain" />
        <div className="page-frame" />

        <div className="map-topbar">
          <button className="map-back" onClick={() => router.push('/')}>
            Back to Solar System
          </button>
          <div className="map-title">
            <h1>The Playful Atlas</h1>
            <p>Choose a realm and tempt fate</p>
          </div>
          <div style={{ width: 170 }} />
        </div>

        <div className="map-wrap">
          <svg
            className="map-svg"
            viewBox="0 0 1100 620"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="realmGlow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M50,122 C95,58 186,42 291,55 C392,68 438,47 536,38 C678,25 736,46 826,74 C944,111 1022,189 1038,281 C1052,362 1022,444 960,512 C906,571 825,594 699,594 C587,594 522,572 432,566 C314,559 228,584 148,545 C83,514 44,438 36,362 C29,292 8,181 50,122 Z"
              fill="#efe2be"
              stroke="rgba(68, 91, 116, 0.75)"
              strokeWidth="3"
            />

            <path
              d="M56,134 C101,72 188,57 292,69 C392,82 441,60 542,51 C676,40 732,59 820,86 C933,121 1004,192 1018,282 C1031,358 1001,433 942,493 C889,547 814,571 697,574 C589,576 526,554 436,549 C326,542 236,566 164,530 C104,500 70,430 63,358 C56,292 37,195 56,134 Z"
              fill="none"
              stroke="rgba(255, 248, 226, 0.74)"
              strokeWidth="1.5"
            />

            {MOUNTAIN_PATHS.map((path) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke="#6c7f97"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.72"
              />
            ))}

            <path
              d="M667 103C695 118 707 142 703 173C700 203 679 224 673 256C666 290 681 320 711 340"
              fill="none"
              stroke="#7b92aa"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="3 9"
              opacity="0.75"
            />

            <path
              d="M592 300C632 302 666 317 696 344C721 367 737 401 741 435C709 448 671 450 637 439C598 425 574 399 554 370C559 337 574 313 592 300Z"
              fill="#d9e5ef"
              stroke="#6d839d"
              strokeWidth="2.2"
              opacity="0.88"
            />

            <path
              d="M256 196C324 183 381 197 430 229"
              fill="none"
              stroke="#778ea5"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.55"
              strokeDasharray="6 10"
            />
            <path
              d="M586 487C654 477 720 468 818 430"
              fill="none"
              stroke="#778ea5"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.55"
              strokeDasharray="6 10"
            />

            {FOREST_TREES.map(([x, y]) => (
              <g key={`${x}-${y}`} opacity="0.72">
                <path d={`M${x} ${y} l10 -18 l10 18 z`} fill="#7d9378" stroke="#61745e" strokeWidth="1.3" />
                <path d={`M${x + 6} ${y - 10} l8 -14 l8 14 z`} fill="#8aa281" stroke="#61745e" strokeWidth="1.2" />
                <line x1={x + 10} y1={y} x2={x + 10} y2={y + 9} stroke="#6f6557" strokeWidth="1.6" />
              </g>
            ))}

            <g opacity="0.78">
              <circle cx="845" cy="282" r="58" fill="#d8dfeb" stroke="#69809a" strokeWidth="2.4" />
              <path d="M800 282h90M845 237v90M815 250l60 60M875 250l-60 60" stroke="#69809a" strokeWidth="1.8" fill="none" />
              <circle cx="845" cy="282" r="25" fill="none" stroke="#69809a" strokeWidth="1.6" />
            </g>

            {REALMS.map((realm) => {
              const isHovered = hovered === realm.id

              return (
                <g key={realm.id}>
                  {isHovered && (
                    <path
                      d={realm.path}
                      fill={realm.accent}
                      opacity="0.16"
                      filter="url(#realmGlow)"
                    />
                  )}

                  <path
                    d={realm.path}
                    fill={isHovered ? `${realm.accent}55` : realm.fill}
                    className={`realm-shape ${realm.locked ? 'locked' : 'active'}`}
                    onMouseEnter={() => setHovered(realm.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => enterRealm(realm)}
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 14px ${realm.accent})` : 'none',
                      stroke: isHovered ? realm.accent : 'rgba(65, 88, 114, 0.85)',
                    }}
                  />

                  <path
                    d={realm.path}
                    className="realm-border"
                    transform={`translate(3 4) scale(0.97)`}
                    style={{
                      opacity: isHovered ? 0.8 : 0.26,
                    }}
                  />

                  {isHovered && (
                    <g className="hover-rings">
                      <circle cx={realm.labelX} cy={realm.labelY - 24} r="18" stroke={realm.accent} />
                      <circle cx={realm.labelX} cy={realm.labelY - 24} r="29" stroke={realm.accent} opacity="0.45" />
                    </g>
                  )}

                  {realm.sparks.map(([x, y], index) => (
                    <circle
                      key={`${realm.id}-${x}-${y}`}
                      cx={x}
                      cy={y}
                      r={isHovered ? (index % 2 === 0 ? 3.4 : 2.4) : 1.5}
                      fill={realm.accent}
                      opacity={isHovered ? 0.95 : 0.34}
                      className={isHovered ? 'spark' : undefined}
                      style={{ animationDelay: `${index * 0.18}s` }}
                    />
                  ))}

                  <g className="realm-label">
                    <text
                      x={realm.labelX}
                      y={realm.labelY}
                      textAnchor="middle"
                      className="realm-name"
                      style={{
                        fill: isHovered ? realm.accent : '#475c76',
                        fontSize: isHovered ? 28 : 24,
                        opacity: isHovered ? 1 : 0.88,
                      }}
                    >
                      {realm.name}
                    </text>
                    <text
                      x={realm.labelX}
                      y={realm.labelY + 18}
                      textAnchor="middle"
                      className="realm-sub"
                      style={{
                        fill: 'rgba(67, 89, 113, 0.78)',
                        opacity: isHovered ? 1 : 0.7,
                      }}
                    >
                      {realm.locked ? 'sealed for later' : 'click to enter'}
                    </text>
                  </g>
                </g>
              )
            })}

            <g transform="translate(966 488)" opacity="0.82">
              <circle cx="0" cy="0" r="46" fill="none" stroke="#5f7692" strokeWidth="2.3" />
              <circle cx="0" cy="0" r="34" fill="none" stroke="#5f7692" strokeWidth="1.3" />
              <path d="M0 -36 L9 0 L0 36 L-9 0 Z" fill="#5f7692" />
              <path d="M-36 0 L0 9 L36 0 L0 -9 Z" fill="none" stroke="#5f7692" strokeWidth="2" />
              <text x="0" y="-54" textAnchor="middle" fontSize="10" fill="#5f7692" fontFamily="'IBM Plex Mono', monospace">N</text>
              <text x="0" y="65" textAnchor="middle" fontSize="10" fill="#5f7692" fontFamily="'IBM Plex Mono', monospace">S</text>
              <text x="-54" y="4" textAnchor="middle" fontSize="10" fill="#5f7692" fontFamily="'IBM Plex Mono', monospace">W</text>
              <text x="54" y="4" textAnchor="middle" fontSize="10" fill="#5f7692" fontFamily="'IBM Plex Mono', monospace">E</text>
            </g>

            <g transform="translate(66 574)" opacity="0.76">
              <line x1="0" y1="0" x2="112" y2="0" stroke="#5f7692" strokeWidth="3" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#5f7692" strokeWidth="3" />
              <line x1="56" y1="-8" x2="56" y2="8" stroke="#5f7692" strokeWidth="3" />
              <line x1="112" y1="-8" x2="112" y2="8" stroke="#5f7692" strokeWidth="3" />
              <text x="0" y="-16" fontSize="10" fill="#5f7692" fontFamily="'IBM Plex Mono', monospace">0</text>
              <text x="48" y="-16" fontSize="10" fill="#5f7692" fontFamily="'IBM Plex Mono', monospace">16</text>
              <text x="100" y="-16" fontSize="10" fill="#5f7692" fontFamily="'IBM Plex Mono', monospace">32</text>
              <text x="120" y="4" fontSize="10" fill="#5f7692" fontFamily="'IBM Plex Mono', monospace">miles</text>
            </g>
          </svg>
        </div>

        <div className="map-caption">
          A brighter parchment, clearer labels, and a little magic on hover.
          The map is now meant to feel discoverable, not merely clickable.
        </div>

        {hoveredRealm && (
          <div className="map-tooltip">
            <div className="eyebrow">Realm dossier</div>
            <h2 style={{ color: hoveredRealm.accent }}>{hoveredRealm.name}</h2>
            <div className="sub">{hoveredRealm.subtitle}</div>
            <div className="desc">{hoveredRealm.description}</div>
            <div
              className="status"
              style={{
                color: hoveredRealm.locked ? 'rgba(71, 92, 118, 0.72)' : hoveredRealm.accent,
              }}
            >
              {hoveredRealm.locked ? 'Locked for future mischief' : 'Open now'}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
