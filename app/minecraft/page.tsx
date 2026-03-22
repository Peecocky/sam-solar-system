'use client'

import { useRouter } from 'next/navigation'

const FEATURES = [
  {
    title: 'Live world viewport',
    description: 'Target version: a Google Maps style render that lets your builds be explored like territory, not screenshots.',
  },
  {
    title: 'Chunk-aware navigation',
    description: 'Planned markers for districts, builds, secret projects, and whatever suspiciously large redstone contraption appears next.',
  },
  {
    title: 'Planet-scale bragging rights',
    description: 'A dedicated planet is the correct amount of seriousness for a world made of cubes and questionable late-night ambition.',
  },
]

export default function MinecraftPage() {
  const router = useRouter()

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .mc-page {
          --bg: #9fe3ff;
          --grass: #7bc259;
          --dirt: #7a5731;
          --stone: #cdd6dd;
          --ink: #162018;
          min-height: 100vh;
          background:
            linear-gradient(180deg, #9fe3ff 0%, #d8f7ff 36%, #c0ebb4 36%, #9fd27d 100%);
          color: var(--ink);
          font-family: 'IBM Plex Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .mc-page::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.26;
        }

        .topbar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
        }

        .back-btn {
          border: 3px solid #26351f;
          background: #f2f8ec;
          color: #26351f;
          padding: 10px 14px;
          font: 500 12px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          cursor: pointer;
          box-shadow: 0 4px 0 #26351f;
        }

        .title {
          font-family: 'Press Start 2P', cursive;
          font-size: 12px;
          text-transform: uppercase;
        }

        .hero {
          max-width: 1180px;
          margin: 0 auto;
          padding: 34px 24px 72px;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          gap: 34px;
          align-items: center;
        }

        .hero-copy h1 {
          margin: 0;
          font-family: 'Press Start 2P', cursive;
          font-size: clamp(30px, 5vw, 56px);
          line-height: 1.3;
          text-transform: uppercase;
        }

        .hero-copy p {
          margin: 22px 0 0;
          max-width: 620px;
          font-size: 17px;
          line-height: 1.8;
          color: rgba(22, 32, 24, 0.82);
        }

        .chip-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .chip {
          padding: 10px 12px;
          background: rgba(255,255,255,0.5);
          border: 2px solid rgba(38, 53, 31, 0.2);
          font: 500 11px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1.4px;
        }

        .viewport {
          background: linear-gradient(180deg, #dff6ff 0%, #b6e5ff 45%, #80c85b 45%, #699f49 100%);
          border: 4px solid #26351f;
          box-shadow: 0 8px 0 #26351f;
          min-height: 440px;
          position: relative;
          overflow: hidden;
        }

        .viewport::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.3;
        }

        .block {
          position: absolute;
          width: 72px;
          height: 72px;
          box-shadow: inset 0 -8px 0 rgba(0,0,0,0.12);
        }

        .block.grass {
          background: linear-gradient(180deg, #7fd55b 0 24%, #8a6337 24% 100%);
          border: 3px solid rgba(34, 54, 23, 0.25);
        }

        .block.stone {
          background: #cfd7de;
          border: 3px solid rgba(57, 69, 82, 0.18);
        }

        .block.water {
          background: linear-gradient(180deg, #6fcaff, #4595df);
          border: 3px solid rgba(23, 56, 102, 0.12);
        }

        .floating-panel {
          position: absolute;
          right: 18px;
          bottom: 18px;
          width: min(280px, calc(100% - 36px));
          background: rgba(242, 248, 236, 0.92);
          border: 3px solid #26351f;
          padding: 16px 18px;
          box-shadow: 0 6px 0 #26351f;
        }

        .floating-panel .eyebrow {
          font: 500 11px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          margin-bottom: 8px;
          color: rgba(22, 32, 24, 0.7);
        }

        .floating-panel strong {
          display: block;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .floating-panel p {
          margin: 0;
          color: rgba(22, 32, 24, 0.76);
          line-height: 1.7;
          font-size: 14px;
        }

        .feature-grid {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px 80px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .feature-card {
          background: rgba(242, 248, 236, 0.88);
          border: 3px solid rgba(38, 53, 31, 0.2);
          box-shadow: 0 8px 0 rgba(38, 53, 31, 0.22);
          padding: 20px 18px;
        }

        .feature-card h2 {
          margin: 0 0 10px;
          font-family: 'Press Start 2P', cursive;
          font-size: 13px;
          line-height: 1.7;
          text-transform: uppercase;
        }

        .feature-card p {
          margin: 0;
          line-height: 1.8;
          color: rgba(22, 32, 24, 0.78);
          font-size: 15px;
        }

        @media (max-width: 980px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="mc-page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.push('/')}>
            Back to Solar System
          </button>
          <div className="title">Minecraft Planet</div>
          <div style={{ width: 150 }} />
        </div>

        <section className="hero">
          <div className="hero-copy">
            <h1>Minecraft Planet</h1>
            <p>
              这是新加的方块星球，先作为概念页入轨。目标不是普通截图相册，
              而是做成一个像 Google Maps 一样可以浏览你 MC 建筑的实时渲染视图，
              让每座建筑都像地标一样被看见。
            </p>
            <div className="chip-row">
              <span className="chip">Concept online</span>
              <span className="chip">Renderer pending</span>
              <span className="chip">World scan later</span>
            </div>
          </div>

          <div className="viewport">
            <div className="block grass" style={{ left: 42, bottom: 54 }} />
            <div className="block grass" style={{ left: 118, bottom: 54 }} />
            <div className="block grass" style={{ left: 194, bottom: 54 }} />
            <div className="block grass" style={{ left: 270, bottom: 54 }} />
            <div className="block grass" style={{ left: 346, bottom: 54 }} />
            <div className="block stone" style={{ left: 118, bottom: 126, height: 144 }} />
            <div className="block stone" style={{ left: 194, bottom: 126, height: 212 }} />
            <div className="block stone" style={{ left: 270, bottom: 126, height: 168 }} />
            <div className="block water" style={{ left: 402, bottom: 54, width: 96 }} />
            <div className="block grass" style={{ left: 518, bottom: 54, width: 88 }} />
            <div className="block stone" style={{ left: 518, bottom: 126, width: 88, height: 96 }} />

            <div className="floating-panel">
              <div className="eyebrow">Future interaction</div>
              <strong>Zoom, pan, jump to builds.</strong>
              <p>
                The long-term version should feel like a city browser for blocks:
                districts, landmarks, hidden corners, and the occasional
                suspiciously over-engineered farm.
              </p>
            </div>
          </div>
        </section>

        <section className="feature-grid">
          {FEATURES.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>
      </div>
    </>
  )
}
