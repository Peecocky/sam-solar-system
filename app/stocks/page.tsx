'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BirthdayGate from '@/components/BirthdayGate'

type StockSnapshot = {
  symbol: string
  name: string
  currency: string
  latestPrice: number
  latestDate: string
  dayChangePct: number | null
  trackedReturnPct: number | null
  trackedFrom: string
  watchLogDate: string
  fiftyTwoWeekHigh: number | null
  fiftyTwoWeekLow: number | null
}

const THESIS_POINTS = [
  'Marvell sits in the part of the stack where AI excitement has to become actual infrastructure: interconnect, data movement, and custom silicon.',
  'Its exposure to data center and networking demand gives the story more substance than a pure slogan trade.',
  'It is the kind of name that benefits when people remember that chips still need to talk to each other, not just exist dramatically on slides.',
]

function formatPct(value: number | null) {
  if (value == null || Number.isNaN(value)) return 'Pending'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function formatPrice(value: number | null, currency = 'USD') {
  if (value == null || Number.isNaN(value)) return 'Pending'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function StocksPage() {
  const router = useRouter()
  const [snapshot, setSnapshot] = useState<StockSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const response = await fetch('/api/stocks/mrvl', { cache: 'no-store' })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error ?? 'Quote request failed')
        }

        if (!cancelled) {
          setSnapshot(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <BirthdayGate backHref="/" prompt="When is Sam's birthday?">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');

        .stocks-page {
          --bg: #081514;
          --panel: #102523;
          --line: rgba(180, 255, 223, 0.1);
          --ink: #ebfff6;
          --muted: #99c8b7;
          --accent: #90f6c4;
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(62, 143, 112, 0.22), transparent 30%),
            linear-gradient(180deg, #081514 0%, #0d1f1d 100%);
          color: var(--ink);
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .stocks-page::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(180,255,223,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,255,223,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.24;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: rgba(8, 21, 20, 0.78);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line);
        }

        .back-btn {
          border: 1px solid rgba(144, 246, 196, 0.28);
          background: rgba(255,255,255,0.03);
          color: var(--ink);
          padding: 10px 14px;
          font: 500 12px 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          cursor: pointer;
        }

        .title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          letter-spacing: 1px;
        }

        .shell {
          max-width: 1140px;
          margin: 0 auto;
          padding: 54px 24px 80px;
          display: grid;
          gap: 24px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 24px;
        }

        .hero-card,
        .panel {
          background: rgba(16, 37, 35, 0.84);
          border: 1px solid var(--line);
          padding: 24px;
          box-shadow: 0 22px 40px rgba(0, 0, 0, 0.16);
        }

        .eyebrow {
          font: 500 11px 'IBM Plex Mono', monospace;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(153, 200, 183, 0.82);
        }

        .hero-card h1 {
          margin: 10px 0 10px;
          font-family: 'Fraunces', serif;
          font-size: clamp(38px, 6vw, 68px);
          line-height: 1;
        }

        .hero-card p,
        .panel p {
          margin: 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.8;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .stat {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(144, 246, 196, 0.08);
        }

        .stat .label {
          font: 500 11px 'IBM Plex Mono', monospace;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: rgba(153, 200, 183, 0.7);
        }

        .stat .value {
          margin-top: 10px;
          font-family: 'Fraunces', serif;
          font-size: 34px;
          line-height: 1.1;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .thesis-list {
          margin: 16px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 12px;
        }

        .thesis-list li {
          padding: 14px 16px;
          border-left: 3px solid rgba(144, 246, 196, 0.45);
          background: rgba(255,255,255,0.03);
          color: var(--muted);
          line-height: 1.75;
        }

        .research-note {
          margin-top: 14px;
          padding: 14px 16px;
          background: rgba(144, 246, 196, 0.06);
          color: var(--muted);
          line-height: 1.75;
          border: 1px solid rgba(144, 246, 196, 0.08);
        }

        @media (max-width: 940px) {
          .hero,
          .grid {
            grid-template-columns: 1fr;
          }

          .stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="stocks-page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.push('/')}>
            Back to Solar System
          </button>
          <div className="title">Stock Research Planet</div>
          <div style={{ width: 150 }} />
        </div>

        <div className="shell">
          <section className="hero">
            <div className="hero-card">
              <div className="eyebrow">Current favorite name</div>
              <h1>Marvell Technology</h1>
              <p>
                目前先把这颗星球接入你提到的 Marvell Technology，代码用的是它的实际 ticker
                `MRVL`。页面结构按“可继续扩展的研究卡片”设计，后面加更多股票会比较顺手。
              </p>
            </div>

            <div className="panel">
              <div className="eyebrow">Live snapshot</div>
              {loading && <p>Loading quote...</p>}
              {!loading && error && <p>{error}</p>}
              {!loading && snapshot && (
                <div className="stats">
                  <div className="stat">
                    <div className="label">Latest price</div>
                    <div className="value">
                      {formatPrice(snapshot.latestPrice, snapshot.currency)}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="label">Daily move</div>
                    <div className="value">{formatPct(snapshot.dayChangePct)}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Tracked return</div>
                    <div className="value">{formatPct(snapshot.trackedReturnPct)}</div>
                  </div>
                  <div className="stat">
                    <div className="label">52 week range</div>
                    <div className="value" style={{ fontSize: 22 }}>
                      {formatPrice(snapshot.fiftyTwoWeekLow, snapshot.currency)} -{' '}
                      {formatPrice(snapshot.fiftyTwoWeekHigh, snapshot.currency)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="grid">
            <div className="panel">
              <div className="eyebrow">Research reason</div>
              <ul className="thesis-list">
                {THESIS_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="panel">
              <div className="eyebrow">Tracking record</div>
              <div className="stats">
                <div className="stat">
                  <div className="label">Ticker</div>
                  <div className="value" style={{ fontSize: 28 }}>
                    {snapshot?.symbol ?? 'MRVL'}
                  </div>
                </div>
                <div className="stat">
                  <div className="label">看好时间</div>
                  <div className="value" style={{ fontSize: 24 }}>
                    {snapshot?.watchLogDate ?? '2026-03-23'}
                  </div>
                </div>
                <div className="stat">
                  <div className="label">Tracked from</div>
                  <div className="value" style={{ fontSize: 24 }}>
                    {snapshot?.trackedFrom ?? 'Pending'}
                  </div>
                </div>
                <div className="stat">
                  <div className="label">Latest market date</div>
                  <div className="value" style={{ fontSize: 24 }}>
                    {snapshot?.latestDate ?? 'Pending'}
                  </div>
                </div>
              </div>

              <div className="research-note">
                这里的“看好时间”先用站内首次记录时间占位。等你给出真实看好日期或成本之后，
                这张卡就可以继续往精确累计涨幅、笔记、以及多股票 watchlist 扩展。
              </div>
            </div>
          </section>
        </div>
      </div>
    </BirthdayGate>
  )
}
