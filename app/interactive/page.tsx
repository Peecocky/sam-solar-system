'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const COLS      = 12
const CELL      = 46
const VISIBLE_R = 14
const TOTAL_R   = 60
const BW        = COLS * CELL
const VH        = VISIBLE_R * CELL
const DROP_TICK = 46
const ADMIN_PW  = 'sam2024'
const GOL_SZ    = 9
const GOL_MS    = 140

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Msg {
  id: string
  nick: string
  body: string
  ts: number
  shape: string
  col: string
  cells: [number, number][]
  ua: string
  delReq: boolean
  del: boolean
}

// DB row → Msg
type MessageRow = {
  id: string
  nick: string
  body: string
  ts: number
  shape: string
  col: string
  cells: string | [number, number][]
  ua?: string | null
  del_req?: boolean | null
  del?: boolean | null
}

function rowToMsg(row: MessageRow): Msg {
  return {
    id: row.id,
    nick: row.nick,
    body: row.body,
    ts: row.ts,
    shape: row.shape,
    col: row.col,
    cells: typeof row.cells === 'string' ? JSON.parse(row.cells) : row.cells,
    ua: row.ua ?? '',
    delReq: row.del_req ?? false,
    del: row.del ?? false,
  }
}

// Msg → DB row
function msgToRow(m: Msg) {
  return {
    id: m.id,
    nick: m.nick,
    body: m.body,
    ts: m.ts,
    shape: m.shape,
    col: m.col,
    cells: JSON.stringify(m.cells),
    ua: m.ua,
    del_req: m.delReq,
    del: m.del,
  }
}

// ─────────────────────────────────────────────────────────────
// TETROMINOES
// ─────────────────────────────────────────────────────────────
const PIECES: Record<string, { cells: [number, number][]; color: string }> = {
  I: { cells: [[0,0],[0,1],[0,2],[0,3]],        color: '#00e5ff' },
  O: { cells: [[0,0],[0,1],[1,0],[1,1]],         color: '#ffd600' },
  T: { cells: [[0,1],[1,0],[1,1],[1,2]],         color: '#e040fb' },
  S: { cells: [[0,1],[0,2],[1,0],[1,1]],         color: '#69f0ae' },
  Z: { cells: [[0,0],[0,1],[1,1],[1,2]],         color: '#ff5252' },
  J: { cells: [[0,0],[1,0],[1,1],[1,2]],         color: '#448aff' },
  L: { cells: [[0,2],[1,0],[1,1],[1,2]],         color: '#ff8c00' },
}
const PKEYS = Object.keys(PIECES)

// ─────────────────────────────────────────────────────────────
// BOARD HELPERS
// ─────────────────────────────────────────────────────────────
const randKey = () => PKEYS[Math.floor(Math.random() * PKEYS.length)]

function hBounds(cells: [number, number][]) {
  const cs = cells.map(([, c]) => c)
  const lo = -Math.min(...cs)
  const hi =  COLS - 1 - Math.max(...cs)
  return { lo, hi, mid: Math.floor((lo + hi) / 2) }
}

function buildGrid(msgs: Msg[]) {
  const g: (string | null)[][] = Array.from({ length: TOTAL_R }, () => Array(COLS).fill(null))
  for (const m of msgs) {
    if (m.del) continue
    for (const [r, c] of (m.cells ?? [])) {
      if (r >= 0 && r < TOTAL_R && c >= 0 && c < COLS) g[r][c] = m.id
    }
  }
  return g
}

function topRow(grid: (string | null)[][]) {
  for (let r = 0; r < TOTAL_R; r++) if (grid[r].some(Boolean)) return r
  return TOTAL_R
}

function landRow(grid: (string | null)[][], cells: [number, number][], ox: number) {
  let best = -1
  for (let sy = 0; sy <= TOTAL_R; sy++) {
    let ok = true
    for (const [dr, dc] of cells) {
      const r = sy + dr, c = ox + dc
      if (c < 0 || c >= COLS || r >= TOTAL_R) { ok = false; break }
      if (r >= 0 && grid[r]?.[c])             { ok = false; break }
    }
    if (ok) best = sy; else break
  }
  return best
}

function applyGravity(msgs: Msg[]): Msg[] {
  const g = buildGrid(msgs)
  const ng: (string | null)[][] = Array.from({ length: TOTAL_R }, () => Array(COLS).fill(null))
  for (let c = 0; c < COLS; c++) {
    const stack: string[] = []
    for (let r = 0; r < TOTAL_R; r++) if (g[r][c]) stack.push(g[r][c]!)
    let nr = TOTAL_R - 1
    for (let i = stack.length - 1; i >= 0; i--) { ng[nr][c] = stack[i]; nr-- }
  }
  const nb: Record<string, [number, number][]> = {}
  for (let r = 0; r < TOTAL_R; r++)
    for (let c = 0; c < COLS; c++) {
      const id = ng[r][c]
      if (id) (nb[id] ??= []).push([r, c])
    }
  return msgs
    .filter(m => !m.del)
    .map(m => ({ ...m, cells: nb[m.id] ?? m.cells }))
}

// ─────────────────────────────────────────────────────────────
// SUPABASE PERSISTENCE
// ─────────────────────────────────────────────────────────────
async function loadMsgsFromDB(): Promise<Msg[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('ts', { ascending: true })
  if (error || !data) return []
  return data.map(rowToMsg)
}

async function insertMsgToDB(msg: Msg) {
  await supabase.from('messages').insert([msgToRow(msg)])
}

async function updateMsgInDB(msg: Msg) {
  await supabase.from('messages').update(msgToRow(msg)).eq('id', msg.id)
}

async function deleteMsgFromDB(id: string) {
  await supabase.from('messages').delete().eq('id', id)
}

async function bulkUpdateCells(msgs: Msg[]) {
  // Update cells for all surviving messages after gravity
  for (const m of msgs) {
    await supabase.from('messages').update({ cells: JSON.stringify(m.cells) }).eq('id', m.id)
  }
}

// ─────────────────────────────────────────────────────────────
// GAME OF LIFE  (side panels)
// ─────────────────────────────────────────────────────────────
function golCreate(rows: number, cols: number): boolean[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < 0.24)
  )
}

function golStep(g: boolean[][]): boolean[][] {
  const rows = g.length
  const cols = g[0]?.length ?? 0
  return g.map((row, r) =>
    row.map((alive, c) => {
      let n = 0
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          if (g[(r + dr + rows) % rows]?.[(c + dc + cols) % cols]) n++
        }
      if (alive) return n === 2 || n === 3
      if (n === 3) return true
      return Math.random() < 0.0005
    })
  )
}

function GolCanvas({ side }: { side: 'left' | 'right' }) {
  const cvRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0, gcols = 0, grows = 0
    let grid: boolean[][] = []
    let bright: number[][] = []
    let timer: ReturnType<typeof setInterval> | null = null

    function init() {
      w = cv!.offsetWidth
      h = cv!.offsetHeight
      if (w < 1 || h < 1) return
      cv!.width  = w
      cv!.height = h
      gcols = Math.max(1, Math.floor(w / GOL_SZ))
      grows = Math.max(1, Math.floor(h / GOL_SZ))
      grid  = golCreate(grows, gcols)
      bright = Array.from({ length: grows }, () =>
        Array.from({ length: gcols }, () => Math.random())
      )
    }

    function draw() {
      if (w < 1 || h < 1) return
      ctx!.clearRect(0, 0, w, h)
      for (let r = 0; r < grows; r++) {
        for (let c = 0; c < gcols; c++) {
          if (!grid[r]?.[c]) continue
          bright[r][c] += (Math.random() - 0.48) * 0.32
          bright[r][c] = Math.max(0.07, Math.min(1, bright[r][c]))
          const a = bright[r][c]
          ctx!.fillStyle = `rgba(0, 210, 245, ${a * 0.62})`
          ctx!.fillRect(c * GOL_SZ + 1, r * GOL_SZ + 1, GOL_SZ - 2, GOL_SZ - 2)
          if (a > 0.76) {
            ctx!.fillStyle = `rgba(160, 240, 255, ${(a - 0.76) * 2.8})`
            ctx!.fillRect(c * GOL_SZ + 2, r * GOL_SZ + 2, GOL_SZ - 4, GOL_SZ - 4)
          }
        }
      }
    }

    init()
    draw()

    timer = setInterval(() => {
      grid = golStep(grid)
      draw()
    }, GOL_MS)

    function onResize() { init(); draw() }
    window.addEventListener('resize', onResize)

    return () => {
      if (timer) clearInterval(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={cvRef}
      style={{
        position: 'fixed',
        top: 0,
        left:  side === 'left'  ? 0 : undefined,
        right: side === 'right' ? 0 : undefined,
        width:  `calc((100vw - ${BW + 48}px) / 2)`,
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#020507',
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// SHARED MICRO-STYLES
// ─────────────────────────────────────────────────────────────
const INPUT_S: React.CSSProperties = {
  background: '#030810',
  border: '1px solid #0d2035',
  borderRadius: 3,
  color: '#7ab8d4',
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: 13,
  padding: '9px 12px',
  width: '100%',
  outline: 'none',
}
const BTN_S: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #0a1e2e',
  borderRadius: 3,
  color: '#1a4060',
  fontFamily: "'VT323', monospace",
  fontSize: 17,
  padding: '5px 13px',
  cursor: 'pointer',
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function InteractivePage() {
  const router = useRouter()

  const [msgs,      setMsgs]      = useState<Msg[]>([])
  const [ready,     setReady]     = useState(false)
  const [nick,      setNick]      = useState('')
  const [body,      setBody]      = useState('')
  const [phase,     setPhase]     = useState<'idle' | 'placing' | 'dropping'>('idle')
  const [pieceKey,  setPieceKey]  = useState<string | null>(null)
  const [ox,        setOx]        = useState(0)
  const [animRow,   setAnimRow]   = useState(0)
  const [hovId,     setHovId]     = useState<string | null>(null)
  const [selId,     setSelId]     = useState<string | null>(null)
  const [isAdm,     setIsAdm]     = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [admPw,     setAdmPw]     = useState('')

  const pendNick  = useRef('')
  const pendBody  = useRef('')
  const dropTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const boardRef  = useRef<HTMLDivElement>(null)

  // ── mount: load from Supabase ──────────────────────────────
  useEffect(() => {
    loadMsgsFromDB().then(data => {
      setMsgs(data)
      setReady(true)
    })

    // Real-time: listen for new inserts
    const channel = supabase
      .channel('wall-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = rowToMsg(payload.new as MessageRow)
        setMsgs(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev
          return [...prev, newMsg]
        })
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        const delId = (payload.old as Partial<MessageRow>).id
        if (delId) {
          setMsgs(prev => prev.filter(m => m.id !== delId))
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        const updated = rowToMsg(payload.new as MessageRow)
        setMsgs(prev => prev.map(m => m.id === updated.id ? updated : m))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── derived ────────────────────────────────────────────────
  const grid     = useMemo(() => buildGrid(msgs), [msgs])
  const stackTop = useMemo(() => topRow(grid),    [grid])
  const piece    = pieceKey ? PIECES[pieceKey] : null
  const bounds   = piece ? hBounds(piece.cells) : null
  const ghostR   = piece && phase !== 'idle' ? landRow(grid, piece.cells, ox) : null
  const selMsg   = selId ? (msgs.find(m => m.id === selId) ?? null) : null
  const msgMap   = useMemo(() => {
    const m: Record<string, Msg> = {}
    for (const msg of msgs) m[msg.id] = msg
    return m
  }, [msgs])

  // ── auto-scroll ────────────────────────────────────────────
  useEffect(() => {
    const el = boardRef.current
    if (!el) return
    if      (phase === 'placing')  el.scrollTop = 0
    else if (phase === 'dropping') el.scrollTop = Math.max(0, animRow * CELL - VH * 0.2)
    else                           el.scrollTop = Math.max(0, stackTop * CELL - VH * 0.72)
  }, [phase, stackTop, animRow])

  // ── send ───────────────────────────────────────────────────
  const handleSend = () => {
    const n = nick.trim(), b = body.trim()
    if (!n || !b) return
    pendNick.current = n
    pendBody.current = b
    setNick(''); setBody('')
    const k = randKey()
    setPieceKey(k)
    setOx(hBounds(PIECES[k].cells).mid)
    setAnimRow(0)
    setPhase('placing')
  }

  // ── move ───────────────────────────────────────────────────
  const moveLeft  = useCallback(() => bounds && setOx(x => Math.max(bounds.lo, x - 1)), [bounds])
  const moveRight = useCallback(() => bounds && setOx(x => Math.min(bounds.hi, x + 1)), [bounds])

  // ── drop ───────────────────────────────────────────────────
  const handleDrop = useCallback(() => {
    if (ghostR == null || ghostR < 0 || !piece || !pieceKey) return

    const target = ghostR
    const pCells = piece.cells as [number, number][]
    const pColor = piece.color
    const pKey   = pieceKey
    const pOx    = ox
    const pNick  = pendNick.current
    const pBody  = pendBody.current

    if (dropTimer.current) clearInterval(dropTimer.current)

    setAnimRow(0)
    setPhase('dropping')

    let cur = 0

    dropTimer.current = setInterval(() => {
      cur++

      if (cur >= target) {
        clearInterval(dropTimer.current!)
        dropTimer.current = null

        setAnimRow(target)

        const newMsg: Msg = {
          id:     `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          nick:   pNick,
          body:   pBody,
          ts:     Date.now(),
          shape:  pKey,
          col:    pColor,
          cells:  pCells.map(([dr, dc]) => [target + dr, pOx + dc]),
          ua:     navigator.userAgent.slice(0, 300),
          delReq: false,
          del:    false,
        }

        // Save to Supabase (also triggers realtime for other users)
        insertMsgToDB(newMsg)

        setMsgs(prev => [...prev, newMsg])

        setTimeout(() => {
          setPhase('idle')
          setPieceKey(null)
          setAnimRow(0)
        }, 60)

      } else {
        setAnimRow(cur)
      }
    }, DROP_TICK)
  }, [ghostR, piece, pieceKey, ox])

  // ── keyboard ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'placing') return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')                        { e.preventDefault(); moveLeft()  }
      if (e.key === 'ArrowRight')                       { e.preventDefault(); moveRight() }
      if ([' ', 'Enter', 'ArrowDown'].includes(e.key)) { e.preventDefault(); handleDrop() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [phase, moveLeft, moveRight, handleDrop])

  useEffect(() => () => { if (dropTimer.current) clearInterval(dropTimer.current) }, [])

  // ── delete request ─────────────────────────────────────────
  const requestDelete = (id: string) => {
    setMsgs(prev => {
      const u = prev.map(m => m.id === id ? { ...m, delReq: true } : m)
      // Update in DB
      const target = u.find(m => m.id === id)
      if (target) updateMsgInDB(target)
      return u
    })
  }

  // ── admin delete + gravity ─────────────────────────────────
  const adminDelete = (id: string) => {
    setSelId(null)
    setTimeout(async () => {
      // Delete from DB
      await deleteMsgFromDB(id)

      setMsgs(prev => {
        const marked  = prev.map(m => m.id === id ? { ...m, del: true } : m)
        const settled = applyGravity(marked)
        // Update cell positions in DB for surviving messages
        bulkUpdateCells(settled)
        return settled
      })
    }, 0)
  }

  // ── admin login ────────────────────────────────────────────
  const admLogin = () => {
    if (admPw === ADMIN_PW) {
      setIsAdm(true); setShowLogin(false); setShowPanel(true); setAdmPw('')
    } else {
      alert('YOU ARE BANNNNNED!!!!!')
    }
  }

  // ── visual cell lists ──────────────────────────────────────
  const fallCells = (phase === 'placing' || phase === 'dropping') && piece
    ? piece.cells.map(([dr, dc]) => [animRow + dr, ox + dc] as [number, number]) : null
  const ghostCells = phase === 'placing' && ghostR != null && ghostR >= 0 && piece
    ? piece.cells.map(([dr, dc]) => [ghostR + dr, ox + dc] as [number, number]) : null

  // ─────────────────────────────────────────────────────────────
  if (!ready) return (
    <div style={{ background: '#020507', color: '#00e5ff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Share Tech Mono", monospace', fontSize: 20, letterSpacing: 6 }}>
      LOADING...
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020507; overflow-x: hidden; }
        .tw-in { transition: border-color 0.15s; }
        .tw-in:focus { border-color: #1a5070 !important; }
        .tw-in::placeholder { color: #0d1e2a; }
        .tw-sc::-webkit-scrollbar       { width: 4px; }
        .tw-sc::-webkit-scrollbar-track { background: #010204; }
        .tw-sc::-webkit-scrollbar-thumb { background: #0c2535; border-radius: 2px; }
        @keyframes tw-up    { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes tw-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes tw-title { 0%,100% { text-shadow: 0 0 22px #00e5ff, 0 0 55px #00e5ff55; } 50% { text-shadow: 0 0 44px #00e5ff, 0 0 110px #00e5ff77; } }
        @keyframes tw-drop  { 0%,100% { opacity: 0.65; } 50% { opacity: 1; } }
      `}</style>

      <GolCanvas side="left"  />
      <GolCanvas side="right" />

      <button
        onClick={() => router.push('/')}
        style={{ position: 'fixed', top: 14, left: 14, zIndex: 500, background: 'rgba(2,4,7,0.85)', border: '1px solid #0a1e2a', borderRadius: 3, color: '#0a2535', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, padding: '5px 10px', cursor: 'pointer', letterSpacing: 2 }}
      >
        ← BACK
      </button>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 240, fontFamily: "'VT323', monospace" }}>

        <div style={{ textAlign: 'center', padding: '30px 0 20px', userSelect: 'none' }}>
          <div style={{ fontSize: 54, letterSpacing: 10, color: '#00e5ff', animation: 'tw-title 3.5s ease-in-out infinite' }}>
            SAM&apos;S WALL
          </div>
          <div style={{ fontSize: 12, letterSpacing: 4, color: '#0c2030', fontFamily: "'Share Tech Mono'", marginTop: 6 }}>
            PUBLIC · TETRIS MESSAGE BOARD
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 11, marginTop: 12 }}>
            {PKEYS.map(k => (
              <div key={k} style={{ width: 10, height: 10, borderRadius: 2, background: PIECES[k].color, boxShadow: `0 0 9px ${PIECES[k].color}` }} />
            ))}
          </div>
        </div>

        {phase === 'idle' && (
          <div style={{ width: BW, background: '#050b14', border: '1px solid #0d2035', borderRadius: 5, padding: 16, marginBottom: 12, boxShadow: '0 12px 50px rgba(0,0,0,0.7)' }}>
            <input
              className="tw-in"
              style={INPUT_S}
              value={nick}
              onChange={e => setNick(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Nickname"
              maxLength={24}
            />
            <textarea
              className="tw-in"
              style={{ ...INPUT_S, marginTop: 8, resize: 'none' }}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Leave a message for Sam..."
              maxLength={160}
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ color: '#0c1e2a', fontSize: 12, fontFamily: "'Share Tech Mono'" }}>
                {body.length} / 160
              </span>
              <button
                onClick={handleSend}
                disabled={!nick.trim() || !body.trim()}
                style={{
                  background: (!nick.trim() || !body.trim()) ? 'transparent' : '#00e5ff10',
                  border: '1px solid #00e5ff',
                  borderRadius: 3,
                  color: '#00e5ff',
                  fontFamily: "'VT323', monospace",
                  fontSize: 24,
                  padding: '4px 30px',
                  cursor: (!nick.trim() || !body.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (!nick.trim() || !body.trim()) ? 0.15 : 1,
                  textShadow: '0 0 16px #00e5ff',
                  transition: 'opacity 0.2s',
                  letterSpacing: 2,
                }}
              >
                SEND ▶
              </button>
            </div>
          </div>
        )}

        {phase === 'placing' && piece && (
          <div style={{ width: BW, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#050b14', border: `2px solid ${piece.color}66`, borderRadius: 5, padding: '10px 18px', marginBottom: 9, boxShadow: `0 0 40px ${piece.color}1c, inset 0 0 20px ${piece.color}08` }}>
              <button onClick={moveLeft} style={{ background: 'transparent', border: `1px solid ${piece.color}44`, borderRadius: 3, color: piece.color, fontFamily: "'VT323'", fontSize: 38, padding: '0 20px', cursor: 'pointer', textShadow: `0 0 14px ${piece.color}`, lineHeight: 1.1 }}>◀</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: piece.color, fontSize: 28, letterSpacing: 4, textShadow: `0 0 20px ${piece.color}` }}>
                  {pieceKey} · choose a position
                </div>
                <div style={{ color: '#0c2030', fontSize: 11, fontFamily: "'Share Tech Mono'", marginTop: 3, letterSpacing: 2 }}>
                  ← → move &nbsp;·&nbsp; SPACE fall
                </div>
              </div>
              <button onClick={moveRight} style={{ background: 'transparent', border: `1px solid ${piece.color}44`, borderRadius: 3, color: piece.color, fontFamily: "'VT323'", fontSize: 38, padding: '0 20px', cursor: 'pointer', textShadow: `0 0 14px ${piece.color}`, lineHeight: 1.1 }}>▶</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleDrop} style={{ background: `${piece.color}10`, border: `2px solid ${piece.color}`, borderRadius: 4, color: piece.color, fontFamily: "'VT323'", fontSize: 28, padding: '8px 64px', cursor: 'pointer', boxShadow: `0 0 38px ${piece.color}55, 0 4px 20px rgba(0,0,0,0.5)`, textShadow: `0 0 18px ${piece.color}`, letterSpacing: 4 }}>
                ▼ fall
              </button>
            </div>
          </div>
        )}

        {phase === 'dropping' && piece && (
          <div style={{ width: BW, textAlign: 'center', marginBottom: 10 }}>
            <div style={{ color: piece.color, fontSize: 24, letterSpacing: 5, animation: 'tw-drop 0.45s ease infinite', textShadow: `0 0 22px ${piece.color}` }}>
              SENDING...
            </div>
          </div>
        )}

        <div
          ref={boardRef}
          className="tw-sc"
          style={{ width: BW + 2, height: VH, overflowY: 'scroll', overflowX: 'hidden', border: '1px solid #0d1f2e', borderRadius: 3, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 0 70px rgba(0,100,160,0.14)', position: 'relative' }}
        >
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px)' }} />

          <div style={{ width: BW, height: TOTAL_R * CELL, position: 'relative', background: '#030810', backgroundImage: `linear-gradient(rgba(0,229,255,0.034) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.034) 1px, transparent 1px)`, backgroundSize: `${CELL}px ${CELL}px` }}>

            {msgs.length === 0 && phase === 'idle' && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', color: '#0a1e2a', fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 2, lineHeight: 2.4, pointerEvents: 'none' }}>
                <div style={{ fontSize: 48, marginBottom: 14, color: '#0d2535' }}>⠿</div>
                NO MESSAGES YET<br />BE THE FIRST
              </div>
            )}

            {Array.from({ length: TOTAL_R }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => {
                const id = grid[r][c]
                if (!id) return null
                const msg = msgMap[id]
                if (!msg) return null
                const hi = hovId === id || selMsg?.id === id
                const cl = msg.col
                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHovId(id)}
                    onMouseLeave={() => setHovId(null)}
                    onClick={() => setSelId(p => p === id ? null : id)}
                    style={{
                      position: 'absolute',
                      top: r * CELL + 2, left: c * CELL + 2,
                      width: CELL - 4, height: CELL - 4,
                      borderRadius: 3, cursor: 'pointer', zIndex: 2,
                      opacity: msg.delReq ? 0.28 : 1,
                      background: hi ? `${cl}ee` : `${cl}a0`,
                      border: `2px solid ${cl}${hi ? '' : 'cc'}`,
                      boxShadow: hi
                        ? `0 0 26px ${cl}, 0 0 52px ${cl}66, inset 0 0 20px ${cl}77`
                        : `0 0 10px ${cl}55, inset 0 0 8px ${cl}28`,
                      transition: 'background 0.1s, box-shadow 0.1s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {msg.delReq && (
                      <span style={{ fontSize: 7, color: '#ff5252', fontFamily: "'Share Tech Mono'", fontWeight: 700 }}>DEL</span>
                    )}
                  </div>
                )
              })
            )}

            {ghostCells?.map(([r, c], i) => {
              if (grid[r]?.[c]) return null
              return (
                <div key={`gh${i}`} style={{ position: 'absolute', top: r * CELL + 2, left: c * CELL + 2, width: CELL - 4, height: CELL - 4, border: `2px dashed ${piece?.color}44`, borderRadius: 3, pointerEvents: 'none', zIndex: 1 }} />
              )
            })}

            {fallCells?.map(([r, c], i) => (
              <div key={`fp${i}`} style={{ position: 'absolute', top: r * CELL + 2, left: c * CELL + 2, width: CELL - 4, height: CELL - 4, background: `${piece?.color}ee`, border: `2px solid ${piece?.color}`, boxShadow: `0 0 32px ${piece?.color}, 0 0 64px ${piece?.color}55, inset 0 0 20px ${piece?.color}66`, borderRadius: 3, zIndex: 6, pointerEvents: 'none' }} />
            ))}
          </div>
        </div>

        <div style={{ color: '#08182a', fontSize: 11, fontFamily: "'Share Tech Mono'", marginTop: 9, letterSpacing: 2 }}>
          {msgs.length} MESSAGES &nbsp;·&nbsp; HOVER TO GLOW &nbsp;·&nbsp; CLICK TO READ
        </div>

      </div>

      {selMsg && (
        <div
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#03070e', borderTop: `2px solid ${selMsg.col}`, padding: '20px 20px 26px', zIndex: 400, animation: 'tw-up 0.28s ease', boxShadow: `0 -35px 90px ${selMsg.col}18` }}
          onClick={e => { if (e.target === e.currentTarget) setSelId(null) }}
        >
          <div style={{ maxWidth: BW, margin: '0 auto', position: 'relative' }}>
            <button onClick={() => setSelId(null)} style={{ position: 'absolute', top: -2, right: 0, background: 'transparent', border: 'none', color: '#1a3a50', fontFamily: "'VT323'", fontSize: 30, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>✕</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap', paddingRight: 30 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: selMsg.col, boxShadow: `0 0 12px ${selMsg.col}`, flexShrink: 0 }} />
              <span style={{ color: selMsg.col, fontSize: 32, textShadow: `0 0 18px ${selMsg.col}` }}>{selMsg.nick}</span>
              <span style={{ color: '#0a1e2a', fontSize: 11, fontFamily: "'Share Tech Mono'" }}>
                {new Date(selMsg.ts).toLocaleString('zh-CN')}
              </span>
              <span style={{ color: '#0a1e2a', fontSize: 11, fontFamily: "'Share Tech Mono'" }}>
                [{selMsg.shape} type]
              </span>
            </div>

            <div style={{ color: '#7ab8d4', fontFamily: "'Share Tech Mono'", fontSize: 13, lineHeight: 1.85, background: '#020507', padding: '13px 16px', borderRadius: 4, border: '1px solid #0a1828', marginBottom: 14 }}>
              {selMsg.body}
            </div>

            {isAdm && (
              <div style={{ color: '#0a1828', fontSize: 11, fontFamily: "'Share Tech Mono'", padding: '9px 12px', background: '#020507', borderRadius: 4, marginBottom: 12, wordBreak: 'break-all', border: '1px solid #0a1420' }}>
                <div>UA: {selMsg.ua}</div>
                <div style={{ marginTop: 4 }}>TIME: {new Date(selMsg.ts).toISOString()}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {!selMsg.delReq && !isAdm && (
                <button onClick={() => requestDelete(selMsg.id)} style={{ ...BTN_S, background: '#ff52520d', border: '1px solid #ff525444', color: '#ff5252', fontSize: 19, padding: '5px 20px' }}>
                  request for deletion
                </button>
              )}
              {selMsg.delReq && !isAdm && (
                <span style={{ color: '#ff525566', fontSize: 13, fontFamily: "'Share Tech Mono'", animation: 'tw-blink 2s infinite' }}>
                  ⏳ waiting for request to be approved...
                </span>
              )}
              {isAdm && (
                <button onClick={() => adminDelete(selMsg.id)} style={{ ...BTN_S, background: '#ff52521a', border: '1px solid #ff5252', color: '#ff5252', fontSize: 19, padding: '5px 20px' }}>
                  🗑 delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => isAdm ? setShowPanel(true) : setShowLogin(true)}
        style={{ position: 'fixed', bottom: 14, right: 14, zIndex: 500, background: 'rgba(2,4,8,0.8)', border: '1px solid #081520', borderRadius: 3, color: '#081520', fontFamily: "'Share Tech Mono'", fontSize: 11, padding: '3px 8px', cursor: 'pointer', letterSpacing: 1 }}
      >
        {isAdm ? '⚙ ADM' : '⚙'}
      </button>

      {showLogin && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }}
          onClick={e => { if (e.target === e.currentTarget) setShowLogin(false) }}
        >
          <div style={{ background: '#050b14', border: '1px solid #0d2035', borderRadius: 8, padding: 34, width: 320 }}>
            <div style={{ color: '#00e5ff', fontSize: 34, letterSpacing: 6, marginBottom: 22, textShadow: '0 0 28px #00e5ff' }}>ADMIN</div>
            <input className="tw-in" style={{ ...INPUT_S, marginBottom: 14 }} type="password" value={admPw} onChange={e => setAdmPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && admLogin()} placeholder="password..." />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={admLogin} style={{ flex: 1, background: '#00e5ff0d', border: '1px solid #00e5ff55', borderRadius: 3, color: '#00e5ff', fontFamily: "'VT323'", fontSize: 24, padding: '6px 0', cursor: 'pointer', textShadow: '0 0 14px #00e5ff' }}>login</button>
              <button onClick={() => setShowLogin(false)} style={{ background: 'transparent', border: '1px solid #1a2e3a', borderRadius: 3, color: '#2a4055', fontFamily: "'VT323'", fontSize: 24, padding: '6px 18px', cursor: 'pointer' }}>cancel</button>
            </div>
          </div>
        </div>
      )}

      {showPanel && isAdm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }}
          onClick={e => { if (e.target === e.currentTarget) setShowPanel(false) }}
        >
          <div className="tw-sc" style={{ background: '#050b14', border: '1px solid #0d2035', borderRadius: 8, padding: 28, width: 600, maxHeight: '82vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: '#00e5ff', fontSize: 30, letterSpacing: 4 }}>⚙ ADMIN PANEL</span>
              <button onClick={() => setShowPanel(false)} style={{ background: 'transparent', border: 'none', color: '#2a4055', fontFamily: "'VT323'", fontSize: 30, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ color: '#0c2535', fontSize: 12, fontFamily: "'Share Tech Mono'", padding: '9px 12px', background: '#020507', borderRadius: 4, marginBottom: 20, letterSpacing: 1 }}>
              TOTAL: {msgs.length}&nbsp;&nbsp;·&nbsp;&nbsp;
              PENDING DELETE: {msgs.filter(m => m.delReq).length}&nbsp;&nbsp;·&nbsp;&nbsp;
              CELLS: {msgs.reduce((a, m) => a + (m.cells?.length ?? 0), 0)} / {COLS * TOTAL_R}
            </div>

            {msgs.filter(m => m.delReq).length > 0 && (
              <>
                <div style={{ color: '#ff5252', fontSize: 24, marginBottom: 10, letterSpacing: 2 }}>⚠ the peasants wants to delete their messages</div>
                {msgs.filter(m => m.delReq).map(m => (
                  <div key={m.id} style={{ background: '#020507', border: '1px solid #ff525222', borderRadius: 4, padding: '12px 15px', marginBottom: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 15 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: m.col, fontSize: 24 }}>{m.nick}</div>
                      <div style={{ color: '#2a5565', fontSize: 12, fontFamily: "'Share Tech Mono'", margin: '5px 0', lineHeight: 1.6 }}>{m.body.slice(0, 80)}{m.body.length > 80 ? '…' : ''}</div>
                      <div style={{ color: '#0a1825', fontSize: 11, fontFamily: "'Share Tech Mono'" }}>{new Date(m.ts).toLocaleString('zh-CN')}</div>
                    </div>
                    <button onClick={() => adminDelete(m.id)} style={{ ...BTN_S, background: '#ff52521a', border: '1px solid #ff5252', color: '#ff5252', fontSize: 18, padding: '4px 16px', whiteSpace: 'nowrap', flexShrink: 0 }}>approve</button>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #0a1828', margin: '20px 0' }} />
              </>
            )}

            <div style={{ color: '#0c2535', fontSize: 24, marginBottom: 10, letterSpacing: 2 }}>all messages ({msgs.length})</div>
            {msgs.length === 0 && (
              <div style={{ color: '#08101a', fontFamily: "'Share Tech Mono'", fontSize: 12 }}>no message at the time</div>
            )}
            {[...msgs].reverse().map(m => (
              <div key={m.id} style={{ background: '#020507', border: '1px solid #08141e', borderRadius: 4, padding: '9px 12px', marginBottom: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, background: m.col, borderRadius: 2, marginRight: 8, verticalAlign: 'middle' }} />
                  <span style={{ color: m.col, fontSize: 22 }}>{m.nick}</span>
                  <span style={{ color: '#1a3545', fontSize: 12, fontFamily: "'Share Tech Mono'", marginLeft: 10 }}>{m.body.slice(0, 45)}{m.body.length > 45 ? '…' : ''}</span>
                  {m.delReq && <span style={{ color: '#ff525544', fontSize: 10, fontFamily: "'Share Tech Mono'", marginLeft: 8 }}>[DEL REQ]</span>}
                </div>
                <button onClick={() => adminDelete(m.id)} style={{ ...BTN_S, border: '1px solid #ff525222', color: '#ff525555', fontSize: 14, padding: '2px 10px', flexShrink: 0 }}>delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
