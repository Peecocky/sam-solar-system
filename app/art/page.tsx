'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type ArtworkSlot = {
  id: string
  title: string
  subtitle: string
  note: string
  image?: string
  accent: string
}

const ARTWORKS: ArtworkSlot[] = [
  {
    id: 'slot-01',
    title: 'Artwork Slot 01',
    subtitle: 'Reserved for uploaded painting',
    note: 'The wall is ready. Your first attached piece can replace this frame directly.',
    accent: '#d16b56',
  },
  {
    id: 'slot-02',
    title: 'Artwork Slot 02',
    subtitle: 'Reserved for uploaded painting',
    note: 'Prepared for another piece from the same series or a completely different mood.',
    accent: '#7d76cf',
  },
  {
    id: 'slot-03',
    title: 'Artwork Slot 03',
    subtitle: 'Reserved for uploaded painting',
    note: 'A second wall light is waiting here for whichever work deserves extra drama.',
    accent: '#3d9a87',
  },
  {
    id: 'slot-04',
    title: 'Artwork Slot 04',
    subtitle: 'Reserved for uploaded painting',
    note: 'This frame works well for a vertical piece or a tighter crop detail shot.',
    accent: '#cc9b45',
  },
  {
    id: 'slot-05',
    title: 'Artwork Slot 05',
    subtitle: 'Reserved for uploaded painting',
    note: 'Built as the final anchor piece so the gallery can end with some authority.',
    accent: '#5f7ec2',
  },
]

export default function ArtPage() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeArtwork = ARTWORKS[activeIndex]

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .art-page {
          --bg: #f6f1e7;
          --wall: #ece4d7;
          --ink: #28303d;
          --muted: #6f7684;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.8), transparent 28%),
            linear-gradient(180deg, #f8f4ed 0%, #f1e9de 100%);
          color: var(--ink);
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .art-page::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(rgba(80, 65, 50, 0.08) 1px, transparent 1px),
            linear-gradient(120deg, rgba(255,255,255,0.24), transparent 48%);
          background-size: 18px 18px, 100% 100%;
          opacity: 0.38;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: rgba(248, 244, 237, 0.82);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(40, 48, 61, 0.08);
        }

        .back-btn {
          border: 1px solid rgba(40, 48, 61, 0.18);
          background: rgba(255,255,255,0.44);
          color: var(--ink);
          padding: 10px 14px;
          font: 500 12px 'IBM Plex Mono', monospace;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          cursor: pointer;
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .gallery-shell {
          max-width: 1220px;
          margin: 0 auto;
          padding: 54px 24px 60px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 34px;
        }

        .showcase {
          background: rgba(255,255,255,0.34);
          border: 1px solid rgba(40, 48, 61, 0.08);
          padding: 28px;
          box-shadow: 0 24px 50px rgba(70, 53, 39, 0.08);
        }

        .showcase .eyebrow {
          font: 500 11px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(40, 48, 61, 0.52);
        }

        .showcase h1 {
          margin: 12px 0 10px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(46px, 7vw, 86px);
          line-height: 0.95;
        }

        .showcase p {
          margin: 0;
          max-width: 620px;
          color: var(--muted);
          line-height: 1.8;
          font-size: 16px;
        }

        .frame {
          margin-top: 28px;
          padding: 18px;
          background: linear-gradient(145deg, #6a5442, #392c21);
          box-shadow:
            0 14px 30px rgba(48, 33, 20, 0.22),
            inset 0 0 0 1px rgba(255,255,255,0.12);
        }

        .frame-inner {
          aspect-ratio: 4 / 3;
          background: var(--wall);
          border: 1px solid rgba(40,48,61,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .frame-inner::before {
          content: '';
          position: absolute;
          inset: 20px;
          border: 1px dashed rgba(40,48,61,0.14);
        }

        .frame-inner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .placeholder {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 24px;
        }

        .placeholder .slot {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          margin-bottom: 12px;
        }

        .placeholder p {
          max-width: 360px;
          color: var(--muted);
          line-height: 1.8;
          margin: 0 auto;
        }

        .showcase-meta {
          margin-top: 22px;
          display: grid;
          gap: 10px;
        }

        .showcase-meta h2 {
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
        }

        .showcase-meta .sub {
          color: var(--muted);
          font-size: 15px;
        }

        .showcase-meta .note {
          color: rgba(40,48,61,0.76);
          line-height: 1.75;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sidebar-intro {
          padding: 20px 22px;
          background: rgba(255,255,255,0.3);
          border: 1px solid rgba(40,48,61,0.08);
          color: var(--muted);
          line-height: 1.8;
        }

        .slot-card {
          border: 1px solid rgba(40,48,61,0.1);
          background: rgba(255,255,255,0.28);
          padding: 18px 18px 16px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .slot-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 32px rgba(70, 53, 39, 0.08);
        }

        .slot-card.active {
          border-color: currentColor;
          box-shadow: 0 22px 34px rgba(70, 53, 39, 0.1);
        }

        .slot-card .eyebrow {
          font: 500 10px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          opacity: 0.75;
          margin-bottom: 8px;
        }

        .slot-card h3 {
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
        }

        .slot-card p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        @media (max-width: 980px) {
          .gallery-shell {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="art-page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.push('/')}>
            Back to Solar System
          </button>
          <div className="title">Sam&apos;s Art Gallery</div>
          <div style={{ width: 150 }} />
        </div>

        <div className="gallery-shell">
          <section className="showcase">
            <div className="eyebrow">Personal collection</div>
            <h1>Gallery Wall</h1>
            <p>
              这里已经从“默认网上图片轮播”切换成了适合个人作品展示的展墙结构。
              当前工作区没有你实际绘画文件，所以先保留了高质量占位框，等你把画作发来之后直接替换即可。
            </p>

            <div className="frame">
              <div className="frame-inner">
                {activeArtwork.image ? (
                  <Image
                    src={activeArtwork.image}
                    alt={activeArtwork.title}
                    fill
                    unoptimized
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="placeholder">
                    <div
                      className="slot"
                      style={{ color: activeArtwork.accent }}
                    >
                      {activeArtwork.title}
                    </div>
                    <p>
                      Reserved for your painting upload.
                      <br />
                      This frame is ready to switch from placeholder to actual work.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="showcase-meta">
              <h2>{activeArtwork.title}</h2>
              <div className="sub">{activeArtwork.subtitle}</div>
              <div className="note">{activeArtwork.note}</div>
            </div>
          </section>

          <aside className="sidebar">
            <div className="sidebar-intro">
              右侧这些卡片现在就是你的展陈位。后续拿到实际作品图之后，只需要把对应图片接进来，
              不用再重做页面结构。
            </div>

            {ARTWORKS.map((artwork, index) => (
              <button
                key={artwork.id}
                type="button"
                className={`slot-card ${index === activeIndex ? 'active' : ''}`}
                style={{ color: artwork.accent }}
                onClick={() => setActiveIndex(index)}
              >
                <div className="eyebrow">Frame {String(index + 1).padStart(2, '0')}</div>
                <h3>{artwork.title}</h3>
                <p>{artwork.note}</p>
              </button>
            ))}
          </aside>
        </div>
      </div>
    </>
  )
}
