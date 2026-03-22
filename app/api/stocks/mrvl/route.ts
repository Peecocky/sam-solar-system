import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const WATCH_LOG_DATE = '2026-03-23'

type QuotePoint = {
  close: number
  date: string
}

function toIsoDate(timestamp: number) {
  return new Date(timestamp * 1000).toISOString().slice(0, 10)
}

export async function GET() {
  try {
    const response = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/MRVL?range=6mo&interval=1d&includePrePost=false',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(`Quote request failed with ${response.status}`)
    }

    const payload = await response.json()
    const result = payload.chart?.result?.[0]

    if (!result) {
      throw new Error('Missing chart result')
    }

    const timestamps: number[] = result.timestamp ?? []
    const closes: Array<number | null> =
      result.indicators?.adjclose?.[0]?.adjclose ??
      result.indicators?.quote?.[0]?.close ??
      []

    const points: QuotePoint[] = timestamps
      .map((timestamp, index) => ({
        close: closes[index],
        date: toIsoDate(timestamp),
      }))
      .filter((point): point is QuotePoint => typeof point.close === 'number')

    const latest = points.at(-1)
    const previous = points.at(-2)
    const trackedPoint =
      [...points].reverse().find((point) => point.date <= WATCH_LOG_DATE) ?? latest

    if (!latest) {
      throw new Error('Missing latest close')
    }

    const dayChangePct =
      previous && previous.close !== 0
        ? ((latest.close - previous.close) / previous.close) * 100
        : null

    const trackedReturnPct =
      trackedPoint && trackedPoint.close !== 0
        ? ((latest.close - trackedPoint.close) / trackedPoint.close) * 100
        : null

    return NextResponse.json({
      symbol: result.meta?.symbol ?? 'MRVL',
      name: result.meta?.longName ?? 'Marvell Technology, Inc.',
      currency: result.meta?.currency ?? 'USD',
      latestPrice: latest.close,
      latestDate: latest.date,
      dayChangePct,
      trackedReturnPct,
      trackedFrom: trackedPoint?.date ?? WATCH_LOG_DATE,
      watchLogDate: WATCH_LOG_DATE,
      fiftyTwoWeekHigh: result.meta?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: result.meta?.fiftyTwoWeekLow ?? null,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to load MRVL quote right now.',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
