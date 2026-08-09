'use client'

import { useMemo, useState } from 'react'
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
  labelLines: string[]
  sparkles: Array<[number, number]>
  locked: boolean
}

const REALMS: Realm[] = [
  {
    id: 'lottery',
    name: 'Lottery Isles',
    subtitle: 'A bright coast for luck-driven adventures',
    description: 'The most optimistic territory on the parchment: wind, water, and irresponsible confidence.',
    route: '/games/lottery',
    accent: '#8b5e33',
    fill: '#ead8bb',
    path: 'M132 188 C157 150 204 141 242 158 C274 172 293 201 291 238 C289 269 304 291 293 319 C279 354 248 361 216 352 C189 344 168 361 143 348 C116 333 95 300 94 264 C92 232 107 212 132 188 Z',
    labelX: 205,
    labelY: 257,
    labelLines: ['Lottery', 'Isles'],
    sparkles: [
      [146, 194],
      [246, 174],
      [276, 302],
      [152, 324],
    ],
    locked: false,
  },
  {
    id: 'aim',
    name: 'Scoop Republic',
    subtitle: 'Precision trials inside a very proud city-state',
    description: 'Stone walls, tidy streets, and a population unreasonably committed to accuracy.',
    route: '/games/aim',
    accent: '#6c4b2d',
    fill: '#e6d1b0',
    path: 'M934 328 C980 307 1033 316 1068 348 C1104 382 1113 427 1090 466 C1068 503 1024 516 979 503 C940 492 910 463 901 426 C892 390 900 346 934 328 Z',
    labelX: 1000,
    labelY: 414,
    labelLines: ['Scoop', 'Republic'],
    sparkles: [
      [926, 346],
      [1082, 366],
      [1074, 478],
      [924, 472],
    ],
    locked: false,
  },
  {
    id: 'sound',
    name: 'Echoing Isles',
    subtitle: 'Misty islands navigated by sound alone',
    description: 'A northeastern chain where direction is a rumor and listening is survival.',
    route: '/games/sound',
    accent: '#7a5a3f',
    fill: '#eadbc2',
    path: 'M1048 152 C1084 134 1130 139 1166 164 C1198 188 1207 228 1188 261 C1170 293 1130 309 1088 299 C1048 290 1014 264 1006 228 C998 198 1018 168 1048 152 Z',
    labelX: 1099,
    labelY: 222,
    labelLines: ['Echoing', 'Isles'],
    sparkles: [
      [1026, 168],
      [1168, 180],
      [1170, 278],
      [1028, 278],
    ],
    locked: false,
  },
  {
    id: 'puzzle',
    name: 'Enigma Reach',
    subtitle: 'Still sealed under a patient old spell',
    description: 'The region of riddles is not open yet. Even the signpost looks smug about it.',
    route: null,
    accent: '#6d6d44',
    fill: '#e4dbba',
    path: 'M922 594 C964 566 1016 563 1063 579 C1110 595 1138 632 1136 678 C1133 726 1096 760 1048 770 C999 781 946 768 910 737 C875 707 874 626 922 594 Z',
    labelX: 1004,
    labelY: 672,
    labelLines: ['Enigma', 'Reach'],
    sparkles: [
      [920, 602],
      [1108, 612],
      [1088, 748],
      [916, 730],
    ],
    locked: true,
  },
  {
    id: 'racing',
    name: 'Velocity Plains',
    subtitle: 'Reserved for future bad decisions at speed',
    description: 'Open grass and implied danger. The horses have already filed a complaint.',
    route: null,
    accent: '#8a643b',
    fill: '#e6d2ad',
    path: 'M398 676 C448 642 512 638 571 648 C635 660 672 699 669 746 C665 792 625 824 566 832 C499 841 430 819 388 780 C350 745 350 706 398 676 Z',
    labelX: 511,
    labelY: 744,
    labelLines: ['Velocity', 'Plains'],
    sparkles: [
      [404, 688],
      [632, 688],
      [618, 808],
      [402, 798],
    ],
    locked: true,
  },
  {
    id: 'memory',
    name: 'Mnemos Atoll',
    subtitle: 'Calm surf, suspiciously challenging memories',
    description: 'It looks peaceful, which is exactly why nobody trusts it.',
    route: null,
    accent: '#5a6c54',
    fill: '#dde2c9',
    path: 'M148 604 C182 577 232 569 275 580 C317 592 342 624 340 665 C337 706 307 735 265 744 C223 752 178 739 147 710 C118 682 112 635 148 604 Z',
    labelX: 228,
    labelY: 664,
    labelLines: ['Mnemos', 'Atoll'],
    sparkles: [
      [154, 606],
      [318, 612],
      [300, 726],
      [146, 714],
    ],
    locked: true,
  },
  {
    id: 'battle',
    name: 'The Warfields',
    subtitle: 'Under tactical fog until further notice',
    description: 'A future combat province currently occupied by paperwork and ominous weather.',
    route: null,
    accent: '#7b5632',
    fill: '#e3d0b1',
    path: 'M692 660 C731 633 782 628 830 637 C877 645 905 676 904 714 C904 755 875 786 831 796 C783 806 729 795 694 767 C660 740 652 688 692 660 Z',
    labelX: 780,
    labelY: 718,
    labelLines: ['The', 'Warfields'],
    sparkles: [
      [698, 664],
      [888, 670],
      [874, 780],
      [694, 774],
    ],
    locked: true,
  },
  {
    id: 'stealth',
    name: 'Shadow Depths',
    subtitle: 'An eastern seal for unseen things',
    description: 'Still locked. Still brooding. Still absolutely convinced it should remain mysterious.',
    route: null,
    accent: '#5c5f6e',
    fill: '#dbdce0',
    path: 'M1184 430 C1218 406 1264 408 1296 432 C1328 456 1339 494 1324 530 C1308 569 1268 593 1224 591 C1181 589 1148 565 1141 530 C1134 495 1149 455 1184 430 Z',
    labelX: 1234,
    labelY: 508,
    labelLines: ['Shadow', 'Depths'],
    sparkles: [
      [1180, 438],
      [1318, 452],
      [1300, 572],
      [1172, 572],
    ],
    locked: true,
  },
]

type Point = [number, number]

function createForest(startX: number, startY: number, cols: number, rows: number, dx: number, dy: number) {
  const points: Point[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      points.push([
        startX + col * dx + (row % 2) * 8,
        startY + row * dy + ((col + row) % 3) * 2,
      ])
    }
  }
  return points
}

const WHISPERWOOD_TREES = [
  ...createForest(148, 464, 13, 6, 32, 26),
  ...createForest(248, 604, 8, 3, 34, 24),
]

const EASTWOOD_TREES = createForest(1034, 116, 4, 5, 26, 24)

const NORTHWOOD_TREES = createForest(372, 104, 7, 3, 27, 22)

const ASHEN_PEAKS = [
  [1068, 504, 0.68],
  [1110, 478, 0.82],
  [1162, 462, 0.94],
  [1218, 474, 0.84],
  [1262, 504, 0.7],
] as const

const SOUTHERN_PEAKS = [
  [676, 744, 0.58],
  [718, 756, 0.68],
  [766, 750, 0.61],
] as const

const MOUNTAINS = [
  [504, 254, 0.84],
  [552, 226, 1.04],
  [608, 198, 1.2],
  [672, 216, 1.1],
  [726, 248, 0.92],
  [566, 302, 0.82],
  [624, 278, 0.88],
  [682, 304, 0.82],
] as const

const LAKE_WAVES = [
  [742, 556],
  [784, 538],
  [824, 560],
  [774, 596],
  [838, 612],
]

const COAST_WAVES = [
  [103, 202],
  [80, 236],
  [73, 270],
  [87, 694],
  [111, 732],
  [1202, 198],
  [1240, 224],
  [1252, 260],
  [1280, 518],
]

function MountainGlyph({
  x,
  y,
  scale,
}: {
  x: number
  y: number
  scale: number
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.92">
      <path
        d="M0 44 L26 -30 L45 4 L68 -50 L92 44"
        fill="none"
        stroke="#5f5a50"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M26 -30 L35 -4 L44 -18 M68 -50 L56 -8 L74 -18"
        fill="none"
        stroke="#5f5a50"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 10 L26 -30 L36 -4 M57 14 L68 -50 L82 0"
        fill="none"
        stroke="#f7f0dc"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.76"
      />
      <path
        d="M8 44 C28 31 43 34 61 44 M39 44 C57 29 72 31 88 44"
        fill="none"
        stroke="#6b655b"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>
  )
}

function TreeGlyph({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.86">
      <path
        d="M0 16 L8 -2 L16 16 Z"
        fill="#6d7d5e"
        stroke="#5d6952"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M5 10 L12 -6 L19 10 Z"
        fill="#7f8d6d"
        stroke="#5d6952"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <line x1="10" y1="16" x2="10" y2="23" stroke="#695741" strokeWidth="1.5" />
    </g>
  )
}

function SettlementGlyph({
  x,
  y,
  kind = 'village',
}: {
  x: number
  y: number
  kind?: 'village' | 'city'
}) {
  if (kind === 'city') {
    return (
      <g transform={`translate(${x} ${y})`} opacity="0.9">
        <circle cx="0" cy="0" r="42" fill="none" stroke="#5b5042" strokeWidth="2.2" />
        <circle cx="0" cy="0" r="26" fill="none" stroke="#5b5042" strokeWidth="1.5" />
        <path d="M-18 -10h36M-14 4h28M-8 18h16" stroke="#5b5042" strokeWidth="1.4" />
        <path d="M-8 -18v36M8 -18v36" stroke="#5b5042" strokeWidth="1.4" />
      </g>
    )
  }

  return (
    <g transform={`translate(${x} ${y})`} opacity="0.88">
      <path
        d="M-14 10 h28 M-8 10 v-16 h16 v16"
        fill="none"
        stroke="#5b5042"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M-10 -6 L0 -18 L10 -6" fill="none" stroke="#5b5042" strokeWidth="1.8" strokeLinejoin="round" />
    </g>
  )
}

function WaveGlyph({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <path
      d={`M ${x} ${y} q 12 ${-9 * scale} 24 0 q 12 ${9 * scale} 24 0`}
      fill="none"
      stroke="#6f6556"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.72"
    />
  )
}

function HillGlyph({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.58">
      <path d="M0 18 C12 -8 32 -8 46 18 C58 -2 76 0 88 18" fill="none" stroke="#786950" strokeWidth="1.5" />
      <path d="M8 22 C26 12 50 13 80 22" fill="none" stroke="#9a896a" strokeWidth="1" strokeDasharray="3 5" />
    </g>
  )
}

function RuinGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity="0.74">
      <path d="M-13 11 L-10 -11 L-3 -7 L1 -18 L7 -10 L12 11" fill="none" stroke="#5f513f" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M-17 12 H17 M-7 3 H7" fill="none" stroke="#5f513f" strokeWidth="1.3" />
      <circle cx="0" cy="-1" r="2.4" fill="none" stroke="#5f513f" strokeWidth="1" />
    </g>
  )
}

function Sparkle({
  x,
  y,
  accent,
  index,
}: {
  x: number
  y: number
  accent: string
  index: number
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      className="map-sparkle"
      style={{ animationDelay: `${index * 0.18}s` }}
    >
      <path
        d="M0 -6 L3 0 L0 6 L-3 0 Z"
        fill={accent}
        opacity="0.95"
      />
      <circle cx="0" cy="0" r="1.3" fill="#fff9ec" opacity="0.9" />
    </g>
  )
}

export default function GamesHub() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const hoveredRealm = useMemo(
    () => REALMS.find((realm) => realm.id === hoveredId) ?? null,
    [hoveredId]
  )

  function enterRealm(realm: Realm) {
    if (realm.locked || !realm.route) return
    router.push(realm.route)
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IM+Fell+English+SC&display=swap');

        .fantasy-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 15%, rgba(255,246,218,.9) 0%, rgba(223,198,153,.96) 42%, rgba(125,89,50,1) 132%),
            #c7a978;
          color: #4b4134;
          padding: 22px;
          box-sizing: border-box;
        }

        .fantasy-shell {
          max-width: 1380px;
          margin: 0 auto;
          position: relative;
        }

        .fantasy-topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .fantasy-back {
          border: 1px solid rgba(88, 74, 55, 0.24);
          background: rgba(255,251,239,0.54);
          color: #5c4b38;
          padding: 10px 14px;
          font: 500 11px 'IBM Plex Mono', monospace;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(96, 66, 24, 0.08);
        }

        .fantasy-title {
          text-align: center;
          flex: 1;
        }

        .fantasy-title h1 {
          margin: 0;
          font-family: 'IM Fell English SC', serif;
          font-size: clamp(34px, 5vw, 60px);
          letter-spacing: 3px;
          color: #5b4b39;
          text-shadow: 0 1px 0 rgba(255,255,255,0.62);
        }

        .fantasy-title p {
          margin: 8px 0 0;
          font: 500 11px 'IBM Plex Mono', monospace;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: rgba(84, 70, 52, 0.72);
        }

        .fantasy-map {
          position: relative;
          background:
            radial-gradient(circle at 18% 15%, rgba(255,255,255,.32), transparent 27%),
            radial-gradient(circle at 82% 76%, rgba(91,53,23,.16), transparent 31%),
            linear-gradient(155deg, #eee0bc 0%, #dbc49a 52%, #cfac77 100%);
          border: 5px double rgba(72, 53, 33, .54);
          box-shadow:
            inset 0 0 0 2px rgba(255,248,226,.4),
            inset 0 0 90px rgba(77,46,20,.2),
            0 30px 70px rgba(55,35,14,.28);
          overflow: hidden;
        }

        .fantasy-map::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            repeating-linear-gradient(7deg, rgba(82,54,25,.025) 0 1px, transparent 1px 7px),
            radial-gradient(rgba(78,53,28,.14) .8px, transparent 1px),
            radial-gradient(rgba(255,255,255,.11) .8px, transparent 1px);
          background-size: auto, 17px 19px, 29px 31px;
          opacity: .55;
          mix-blend-mode: multiply;
        }

        .fantasy-map::after {
          content: '';
          position: absolute;
          z-index: 3;
          inset: 13px;
          border: 1px solid rgba(83,61,37,.3);
          box-shadow: inset 0 0 34px rgba(60,38,17,.12);
          pointer-events: none;
        }

        .fantasy-svg {
          width: 100%;
          height: auto;
          display: block;
          position: relative;
          z-index: 1;
          filter: sepia(.08) contrast(1.035) saturate(.88);
        }

        .realm-shape {
          stroke: rgba(79, 66, 50, 0.88);
          stroke-width: 2.3;
          transition: fill 0.24s ease, stroke 0.24s ease, filter 0.24s ease;
        }

        .realm-shape.active {
          cursor: pointer;
        }

        .realm-inline-shade {
          fill: none;
          stroke: rgba(255,247,231,0.56);
          stroke-width: 1.2;
          stroke-dasharray: 5 9;
          opacity: 0.34;
        }

        .realm-label {
          pointer-events: none;
        }

        .realm-label text {
          transition: transform 0.24s ease, opacity 0.24s ease;
        }

        .map-sparkle {
          animation: sparklePulse 1.8s ease-in-out infinite;
          transform-origin: center;
        }

        .hover-ring {
          animation: ringFloat 2.4s ease-in-out infinite;
        }

        .map-info {
          position: absolute;
          right: 22px;
          bottom: 22px;
          width: min(360px, calc(100vw - 68px));
          background: rgba(248,239,220,0.9);
          border: 1px solid rgba(89, 71, 48, 0.18);
          box-shadow: 0 18px 36px rgba(87, 60, 21, 0.1);
          padding: 18px 20px;
          z-index: 2;
          backdrop-filter: blur(3px);
        }

        .map-info .eyebrow {
          font: 500 10px 'IBM Plex Mono', monospace;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(92, 75, 56, 0.68);
          margin-bottom: 8px;
        }

        .map-info h2 {
          margin: 0;
          font-family: 'IM Fell English SC', serif;
          font-size: 28px;
          letter-spacing: 1px;
        }

        .map-info .sub {
          margin-top: 4px;
          color: rgba(88, 74, 55, 0.82);
          font-size: 15px;
          line-height: 1.6;
        }

        .map-info .desc {
          margin-top: 12px;
          color: rgba(88, 74, 55, 0.78);
          font-size: 14px;
          line-height: 1.72;
        }

        .map-info .status {
          margin-top: 14px;
          font: 500 11px 'IBM Plex Mono', monospace;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        @keyframes sparklePulse {
          0%, 100% {
            opacity: 0.48;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.16);
          }
        }

        @keyframes ringFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @media (max-width: 980px) {
          .fantasy-page {
            padding: 10px;
          }

          .fantasy-topbar {
            flex-direction: column;
            align-items: stretch;
          }

          .map-info {
            position: static;
            width: auto;
            max-width: none;
            margin: 14px;
          }
        }
      `}</style>

      <div className="fantasy-page">
        <div className="fantasy-shell">
          <div className="fantasy-topbar">
            <button className="fantasy-back" onClick={() => router.push('/')}>
              Back to Solar System
            </button>

            <div className="fantasy-title">
              <h1>The Cartographer&apos;s Gamebook</h1>
              <p>Hand-drawn provinces, roads, rivers, peaks, and enchanted hover seals</p>
            </div>

            <div style={{ width: 158 }} />
          </div>

          <div className="fantasy-map">
            <svg className="fantasy-svg" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="seaWash" cx="48%" cy="38%" r="72%">
                  <stop offset="0" stopColor="#e7d9b6" />
                  <stop offset=".72" stopColor="#d0b887" />
                  <stop offset="1" stopColor="#b58e59" />
                </radialGradient>
                <linearGradient id="landWash" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#eadcba" />
                  <stop offset=".48" stopColor="#d9c294" />
                  <stop offset="1" stopColor="#c7a46d" />
                </linearGradient>
                <pattern id="terrainHatch" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
                  <path d="M0 2 H22" stroke="#6d5638" strokeWidth=".55" opacity=".18" />
                </pattern>
                <filter id="hoverGlow">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <path id="spine-label" d="M470 190 C560 140 680 140 780 202" />
                <path id="forest-label" d="M164 548 C242 566 350 610 446 700" />
                <path id="lake-label" d="M710 548 C760 528 830 532 888 574" />
                <path id="river-label" d="M824 184 C860 262 858 338 834 430" />
                <path id="road-label" d="M290 336 C482 346 644 370 884 438" />
                <path id="western-sea-label" d="M85 440 C120 388 130 328 120 274" />
                <path id="ashen-label" d="M1080 560 C1150 538 1230 544 1288 582" />
              </defs>

              <rect x="0" y="0" width="1400" height="900" fill="url(#seaWash)" />
              <rect x="18" y="18" width="1364" height="864" rx="2" fill="none" stroke="#5b4934" strokeWidth="1.4" opacity=".58" />
              <path d="M34 92 V34 H92 M1308 34 H1366 V92 M34 808 V866 H92 M1308 866 H1366 V808" fill="none" stroke="#5b4934" strokeWidth="3" opacity=".7" />

              <path
                d="M116 156 C176 82 292 54 426 72 C534 86 623 61 756 59 C900 56 1029 90 1142 160 C1263 234 1330 347 1328 496 C1327 630 1245 741 1112 808 C992 868 850 865 714 835 C601 809 507 800 390 816 C266 834 163 807 104 739 C45 670 43 563 63 473 C82 388 52 246 116 156 Z"
                fill="url(#landWash)"
                stroke="#5a4d3c"
                strokeWidth="4.4"
                filter="url(#hoverGlow)"
              />
              <path
                d="M128 171 C186 98 298 70 427 87 C540 102 626 75 756 73 C895 71 1020 103 1128 172 C1235 241 1311 352 1311 490 C1311 618 1231 726 1100 791 C983 851 847 848 714 820 C601 794 510 786 397 801 C279 816 178 790 121 724 C66 661 64 560 84 477 C104 393 77 255 128 171 Z"
                fill="none"
                stroke="rgba(255,249,236,0.72)"
                strokeWidth="1.7"
              />
              <path
                d="M151 183 C216 121 309 105 422 118 C531 131 633 106 747 105 C877 102 1002 132 1097 194 C1189 254 1258 353 1264 478 C1266 588 1204 682 1082 746"
                fill="none"
                stroke="#6f5d45"
                strokeWidth="1.2"
                strokeDasharray="2 8"
                opacity=".38"
              />
              <path d="M170 408 C300 380 428 402 552 472 C650 528 724 548 820 522" fill="none" stroke="#856f50" strokeWidth="1.1" strokeDasharray="3 10" opacity=".35" />
              <path d="M194 432 C326 408 432 438 544 500" fill="none" stroke="#856f50" strokeWidth="1" strokeDasharray="3 9" opacity=".26" />
              <path d="M930 258 C1054 284 1142 350 1175 420" fill="none" stroke="#856f50" strokeWidth="1.1" strokeDasharray="3 10" opacity=".34" />

              <path
                d="M790 166 C830 225 855 306 852 380 C849 448 828 500 803 550"
                fill="none"
                stroke="#6b604e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="4 10"
                opacity="0.8"
              />
              <path
                d="M804 174 C796 244 764 295 752 360 C744 406 744 452 754 500"
                fill="none"
                stroke="#7a6954"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.72"
              />

              {MOUNTAINS.map(([x, y, scale]) => (
                <MountainGlyph key={`${x}-${y}`} x={x} y={y} scale={scale} />
              ))}
              {ASHEN_PEAKS.map(([x, y, scale]) => (
                <MountainGlyph key={`ash-${x}-${y}`} x={x} y={y} scale={scale} />
              ))}
              {SOUTHERN_PEAKS.map(([x, y, scale]) => (
                <MountainGlyph key={`south-${x}-${y}`} x={x} y={y} scale={scale} />
              ))}
              <HillGlyph x={360} y={392} scale={.85} />
              <HillGlyph x={458} y={424} scale={.72} />
              <HillGlyph x={610} y={548} scale={.88} />
              <HillGlyph x={942} y={542} scale={.82} />

              <path
                d="M714 510 C760 494 824 500 866 530 C905 559 924 612 915 654 C874 674 828 677 784 664 C739 651 696 627 674 588 C678 551 694 523 714 510 Z"
                fill="#d5d9d4"
                stroke="#655a49"
                strokeWidth="2.1"
                opacity="0.9"
              />
              {LAKE_WAVES.map(([x, y]) => (
                <WaveGlyph key={`${x}-${y}`} x={x} y={y} scale={1} />
              ))}

              {COAST_WAVES.map(([x, y]) => (
                <WaveGlyph key={`${x}-${y}`} x={x} y={y} scale={0.72} />
              ))}

              <path
                d="M930 218 C962 228 988 254 1000 282 C1010 308 1009 335 1000 362"
                fill="none"
                stroke="#74614a"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="3 7"
                opacity="0.8"
              />
              <path
                d="M266 322 C446 330 650 366 886 440"
                fill="none"
                stroke="#7a654d"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="5 9"
                opacity="0.78"
              />
              <path
                d="M414 760 C494 732 592 718 688 716"
                fill="none"
                stroke="#7a654d"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="5 9"
                opacity="0.78"
              />

              {WHISPERWOOD_TREES.map(([x, y], index) => (
                <TreeGlyph
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  scale={0.84 + (index % 4) * 0.05}
                />
              ))}
              {EASTWOOD_TREES.map(([x, y], index) => (
                <TreeGlyph
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  scale={0.8 + (index % 3) * 0.04}
                />
              ))}
              {NORTHWOOD_TREES.map(([x, y], index) => (
                <TreeGlyph key={`north-${x}-${y}`} x={x} y={y} scale={0.72 + (index % 3) * .04} />
              ))}

              <SettlementGlyph x={1006} y={414} kind="city" />
              <SettlementGlyph x={265} y={278} />
              <SettlementGlyph x={1128} y={268} />
              <SettlementGlyph x={572} y={760} />
              <RuinGlyph x={492} y={536} />
              <RuinGlyph x={1180} y={618} />
              <RuinGlyph x={882} y={250} />

              <text fill="#5c4d3b" fontFamily="'IM Fell English SC', serif" fontSize="58" letterSpacing="4">
                <textPath href="#spine-label" startOffset="18%">
                  Dragonspine
                </textPath>
              </text>

              <text fill="#64745b" fontFamily="'Cormorant Garamond', serif" fontSize="48" fontStyle="italic" letterSpacing="3">
                <textPath href="#forest-label" startOffset="10%">
                  Whisperwood
                </textPath>
              </text>

              <text fill="#5c4d3b" fontFamily="'Cormorant Garamond', serif" fontSize="42" fontStyle="italic" letterSpacing="3">
                <textPath href="#lake-label" startOffset="14%">
                  Mirrormere
                </textPath>
              </text>

              <text fill="#6b604e" fontFamily="'Cormorant Garamond', serif" fontSize="34" fontStyle="italic" letterSpacing="2">
                <textPath href="#river-label" startOffset="8%">
                  Merchant&apos;s Flow
                </textPath>
              </text>

              <text fill="#6d5c47" fontFamily="'IBM Plex Mono', monospace" fontSize="16" letterSpacing="4">
                <textPath href="#road-label" startOffset="24%">
                  Pilgrim Road
                </textPath>
              </text>

              <text fill="#6b5a43" fontFamily="'Cormorant Garamond', serif" fontSize="28" fontStyle="italic" letterSpacing="5" opacity=".7">
                <textPath href="#western-sea-label" startOffset="5%">The Western Sea</textPath>
              </text>
              <text fill="#5a4938" fontFamily="'IM Fell English SC', serif" fontSize="30" letterSpacing="3" opacity=".8">
                <textPath href="#ashen-label" startOffset="8%">The Ashen March</textPath>
              </text>

              {REALMS.map((realm) => {
                const hovered = realm.id === hoveredId

                return (
                  <g key={realm.id}>
                    {hovered && (
                      <path
                        d={realm.path}
                        fill={realm.accent}
                        opacity="0.14"
                        filter="url(#hoverGlow)"
                      />
                    )}

                    <path
                      d={realm.path}
                      fill={hovered ? `${realm.accent}55` : realm.fill}
                      className={`realm-shape ${realm.locked ? '' : 'active'}`}
                      style={{
                        stroke: hovered ? realm.accent : 'rgba(79, 66, 50, 0.88)',
                        filter: hovered ? `drop-shadow(0 0 14px ${realm.accent})` : 'none',
                      }}
                      onMouseEnter={() => setHoveredId(realm.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => enterRealm(realm)}
                    />

                    <path
                      d={realm.path}
                      className="realm-inline-shade"
                      transform="translate(4 4) scale(0.97)"
                      style={{
                        opacity: hovered ? 0.75 : 0.24,
                        stroke: realm.accent,
                      }}
                    />

                    {hovered && (
                      <g className="hover-ring">
                        <circle
                          cx={realm.labelX}
                          cy={realm.labelY - 18}
                          r="18"
                          fill="none"
                          stroke={realm.accent}
                          strokeWidth="1.6"
                          opacity="0.85"
                        />
                        <circle
                          cx={realm.labelX}
                          cy={realm.labelY - 18}
                          r="30"
                          fill="none"
                          stroke={realm.accent}
                          strokeWidth="1"
                          opacity="0.42"
                        />
                      </g>
                    )}

                    {realm.sparkles.map(([x, y], index) => (
                      <Sparkle
                        key={`${realm.id}-${x}-${y}`}
                        x={x}
                        y={y}
                        accent={realm.accent}
                        index={index}
                      />
                    ))}

                    <g className="realm-label" transform={`translate(${realm.labelX} ${realm.labelY})`}>
                      {realm.labelLines.map((line, index) => (
                        <text
                          key={line}
                          x="0"
                          y={index * 26}
                          textAnchor="middle"
                          fill={hovered ? realm.accent : '#564734'}
                          fontFamily="'IM Fell English SC', serif"
                          fontSize={hovered ? 30 : 27}
                          letterSpacing="1.5"
                          opacity={hovered ? 1 : 0.92}
                        >
                          {line}
                        </text>
                      ))}
                      <text
                        x="0"
                        y={realm.labelLines.length * 26 + 10}
                        textAnchor="middle"
                        fill="rgba(90, 74, 56, 0.72)"
                        fontFamily="'IBM Plex Mono', monospace"
                        fontSize="11"
                        letterSpacing="1.8"
                      >
                        {realm.locked ? 'sealed for later' : 'click to enter'}
                      </text>
                    </g>
                  </g>
                )
              })}

              <g transform="translate(1200 744)" opacity="0.84">
                <circle cx="0" cy="0" r="58" fill="none" stroke="#5a4d3c" strokeWidth="2.4" />
                <circle cx="0" cy="0" r="42" fill="none" stroke="#5a4d3c" strokeWidth="1.4" />
                <path d="M0 -46 L10 0 L0 46 L-10 0 Z" fill="#5a4d3c" />
                <path d="M-46 0 L0 10 L46 0 L0 -10 Z" fill="none" stroke="#5a4d3c" strokeWidth="2" />
                <path d="M-34 -34 L0 -8 L34 -34" fill="none" stroke="#5a4d3c" strokeWidth="1.3" />
                <path d="M-34 34 L0 8 L34 34" fill="none" stroke="#5a4d3c" strokeWidth="1.3" />
                <text x="0" y="-70" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill="#5a4d3c">N</text>
                <text x="0" y="82" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill="#5a4d3c">S</text>
                <text x="-70" y="4" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill="#5a4d3c">W</text>
                <text x="70" y="4" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill="#5a4d3c">E</text>
              </g>

            </svg>

            {hoveredRealm && (
              <div className="map-info">
                <div className="eyebrow">Realm dossier</div>
                <h2 style={{ color: hoveredRealm.accent }}>{hoveredRealm.name}</h2>
                <div className="sub">{hoveredRealm.subtitle}</div>
                <div className="desc">{hoveredRealm.description}</div>
                <div
                  className="status"
                  style={{
                    color: hoveredRealm.locked ? 'rgba(92, 75, 56, 0.72)' : hoveredRealm.accent,
                  }}
                >
                  {hoveredRealm.locked ? 'Locked for later campaigns' : 'Open now'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
