'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import styles from './stocks.module.css'

type HistoryPoint = { date: string; close: number }
type Quote = {
  symbol: string
  name: string
  currency: string
  latestPrice: number
  latestDate: string
  dayChangePct: number | null
  trackedReturnPct: number | null
  trackedFrom: string
  fiftyTwoWeekHigh: number | null
  fiftyTwoWeekLow: number | null
  history: HistoryPoint[]
}

const pillars = [
  {
    code: '01',
    title: 'Data infrastructure',
    body: 'Track whether AI-related data-centre demand is converting into durable revenue rather than a short hardware cycle.',
    signal: 'DEMAND',
  },
  {
    code: '02',
    title: 'Custom silicon',
    body: 'Watch design-win timing, customer concentration and the gap between programme announcements and production volume.',
    signal: 'EXECUTION',
  },
  {
    code: '03',
    title: 'Operating leverage',
    body: 'Compare revenue growth with gross margin, operating expense discipline and free-cash-flow conversion.',
    signal: 'QUALITY',
  },
]

function formatPct(value: number | null) {
  if (value === null || Number.isNaN(value)) return '—'
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function PriceChart({ points }: { points: HistoryPoint[] }) {
  const chart = useMemo(() => {
    if (points.length < 2) return null
    const closes = points.map((point) => point.close)
    const min = Math.min(...closes)
    const max = Math.max(...closes)
    const range = Math.max(max - min, 0.01)
    const coordinates = points.map((point, index) => {
      const x = (index / (points.length - 1)) * 1000
      const y = 250 - ((point.close - min) / range) * 210
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    const positive = closes.at(-1)! >= closes[0]
    return { coordinates: coordinates.join(' '), min, max, positive }
  }, [points])

  if (!chart) {
    return <div className={styles.chartEmpty}>LIVE CHART CONNECTING…</div>
  }

  return (
    <div className={styles.chartWrap}>
      <svg viewBox="0 0 1000 290" preserveAspectRatio="none" role="img" aria-label="MRVL 90-session price history">
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={chart.positive ? '#78f4bd' : '#ff967e'} stopOpacity=".3" />
            <stop offset="1" stopColor={chart.positive ? '#78f4bd' : '#ff967e'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" x2="1000" y1="40" y2="40" />
        <line x1="0" x2="1000" y1="145" y2="145" />
        <line x1="0" x2="1000" y1="250" y2="250" />
        <polygon points={`0,250 ${chart.coordinates} 1000,250`} fill="url(#chartArea)" />
        <polyline className={chart.positive ? styles.upLine : styles.downLine} points={chart.coordinates} />
      </svg>
      <span className={styles.chartHigh}>${chart.max.toFixed(2)}</span>
      <span className={styles.chartLow}>${chart.min.toFixed(2)}</span>
      <small>90 SESSIONS</small>
    </div>
  )
}

export default function StocksPage() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'offline'>('loading')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/stocks/mrvl', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Quote unavailable')
        return response.json()
      })
      .then((payload: Quote) => {
        setQuote(payload)
        setStatus('ready')
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('offline')
      })
    return () => controller.abort()
  }, [])

  const dayPositive = (quote?.dayChangePct ?? 0) >= 0

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a href="#top" className={styles.brand}>SAM / MARKET NOTES</a>
        <nav>
          <a href="#thesis">Thesis</a>
          <a href="#process">Process</a>
          <Link href="/">Orbit ↗</Link>
        </nav>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p>INDEPENDENT RESEARCH NOTEBOOK · 2026</p>
          <h1>Markets reward<br />better questions.</h1>
          <span>One company at a time. Evidence before narrative.</span>
        </div>

        <aside className={styles.tape}>
          <div>
            <span className={styles.liveDot} />
            {status === 'ready' ? 'LIVE / DELAYED MARKET DATA' : status === 'offline' ? 'DATA SOURCE OFFLINE' : 'CONNECTING TO MARKET DATA'}
          </div>
          <strong>MRVL</strong>
          <p>Marvell Technology</p>
          <b>{quote ? `$${quote.latestPrice.toFixed(2)}` : '—'}</b>
          <small className={dayPositive ? styles.positive : styles.negative}>{formatPct(quote?.dayChangePct ?? null)} DAY</small>
        </aside>
      </section>

      <section className={styles.dashboard}>
        <header>
          <div>
            <p>WATCH LOG / MRVL</p>
            <h2>{quote?.name || 'Marvell Technology, Inc.'}</h2>
          </div>
          <time>{quote?.latestDate || 'LATEST SESSION'}</time>
        </header>

        <div className={styles.metrics}>
          <article><span>LAST</span><b>{quote ? `$${quote.latestPrice.toFixed(2)}` : '—'}</b><small>{quote?.currency || 'USD'}</small></article>
          <article><span>SINCE WATCH</span><b className={(quote?.trackedReturnPct ?? 0) >= 0 ? styles.positive : styles.negative}>{formatPct(quote?.trackedReturnPct ?? null)}</b><small>{quote?.trackedFrom || '—'}</small></article>
          <article><span>52W RANGE</span><b>{quote?.fiftyTwoWeekLow ? `$${quote.fiftyTwoWeekLow.toFixed(0)} — $${quote.fiftyTwoWeekHigh?.toFixed(0)}` : '—'}</b><small>LOW / HIGH</small></article>
        </div>

        <PriceChart points={quote?.history || []} />
        {status === 'offline' && <p className={styles.offline}>The live quote source is temporarily unavailable. The research framework below remains accessible.</p>}
      </section>

      <section className={styles.thesis} id="thesis">
        <header className={styles.sectionHead}>
          <p>01 / RESEARCH FRAME</p>
          <h2>What has to<br />be true?</h2>
        </header>
        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <article key={pillar.code}>
              <span>{pillar.code}</span>
              <small>{pillar.signal}</small>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.scenarios}>
        <div className={styles.scenarioIntro}>
          <p>SCENARIO MAP</p>
          <h2>A thesis is a set of conditions—not a price target.</h2>
        </div>
        <div className={styles.scenarioRows}>
          <article><span>BEAR</span><p>AI infrastructure demand normalises faster than expected; programme ramps slip; margins fail to scale.</p><b>RE-UNDERWRITE</b></article>
          <article><span>BASE</span><p>Design wins convert on schedule; data-centre growth offsets weaker end markets; cash conversion improves.</p><b>KEEP TESTING</b></article>
          <article><span>BULL</span><p>Custom silicon and interconnect demand compound together while customer concentration gradually declines.</p><b>LOOK FOR PROOF</b></article>
        </div>
      </section>

      <section className={styles.process} id="process">
        <header className={styles.sectionHead}>
          <p>02 / METHOD</p>
          <h2>The repeatable<br />part.</h2>
        </header>
        <ol>
          <li><span>01</span><div><h3>Collect</h3><p>Filings, earnings calls, investor presentations, industry data and competitor commentary.</p></div></li>
          <li><span>02</span><div><h3>Separate</h3><p>Facts from management claims; leading indicators from lagging results; cycle from structure.</p></div></li>
          <li><span>03</span><div><h3>Model</h3><p>Build scenarios around revenue drivers, margins, capital intensity and cash conversion.</p></div></li>
          <li><span>04</span><div><h3>Invalidate</h3><p>Write down what would prove the thesis wrong before the market makes the decision emotional.</p></div></li>
        </ol>
      </section>

      <footer className={styles.footer}>
        <p>RESEARCH LOG · NOT INVESTMENT ADVICE</p>
        <h2>Stay curious.<br />Stay falsifiable.</h2>
        <div>
          <span>Market data may be delayed or unavailable. All notes are educational and reflect a personal research process.</span>
          <Link href="/">Return to the solar system →</Link>
        </div>
      </footer>
    </main>
  )
}
