'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const COLS        = 10
const CELL        = 44
const VISIBLE_R   = 14
const TOTAL_R     = 60
const BW          = COLS * CELL          // board pixel width
const VH          = VISIBLE_R * CELL     // visible board height
const DROP_TICK   = 48                   // ms per animation frame
const ADMIN_PW    = 'sam2024'
const LS_KEY      = 'sam-wall-v2'

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
  cells: [number, number][]   // [row, col] of each block cell
  ua: string
  delReq: boolean
  del: boolean
}

// ─────────────────────────────────────────────────────────────
// TETROMINOES  (row-offset, col-offset pairs)
// ─────────────────────────────────────────────────────────────
const PIECES: Record<string, { cells: [number,number][]; color: string }> = {
  I: { cells: [[0,0],[0,1],[0,2],[0,3]],         color: '#00e5ff' },
  O: { cells: [[0,0],[0,1],[1,0],[1,1]],          color: '#ffd600' },
  T: { cells: [[0,1],[1,0],[1,1],[1,2]],          color: '#e040fb' },
  S: { cells: [[0,1],[0,2],[1,0],[1,1]],          color: '#69f0ae' },
  Z: { cells: [[0,0],[0,1],[1,1],[1,2]],          color: '#ff5252' },
  J: { cells: [[0,0],[1,0],[1,1],[1,2]],          color: '#448aff' },
  L: { cells: [[0,2],[1,0],[1,1],[1,2]],          color: '#ff8c00' },
}
const KEYS = Object.keys(PIECES)

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const randKey = () => KEYS[Math.floor(Math.random() * KEYS.length)]

/** legal horizontal range for a piece given its col-offsets */
function hBounds(cells: [number,number][]) {
  const cols = cells.map(([,c]) => c)
  const lo = -Math.min(...cols)
  const hi =  COLS - 1 - Math.max(...cols)
  return { lo, hi, mid: Math.floor((lo + hi) / 2) }
}

/** build a grid[row][col] → msgId map (skips deleted msgs) */
function buildGrid(msgs: Msg[]) {
  const g: (string|null)[][] = Array.from({ length: TOTAL_R }, () => Array(COLS).fill(null))
  for (const m of msgs) {
    if (m.del) continue
    for (const [r, c] of m.cells) {
      if (r >= 0 && r < TOTAL_R && c >= 0 && c < COLS) g[r][c] = m.id
    }
  }
  return g
}

/** find topmost occupied row (TOTAL_R if empty) */
function topRow(grid: (string|null)[][]) {
  for (let r = 0; r < TOTAL_R; r++) if (grid[r].some(Boolean)) return r
  return TOTAL_R
}

/** find lowest row a piece can land given current grid */
function landRow(grid: (string|null)[][], cells: [number,number][], ox: number) {
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

/** column-wise gravity: drop blocks to fill holes */
function gravity(msgs: Msg[]): Msg[] {
  const g = buildGrid(msgs)
  const ng: (string|null)[][] = Array.from({ length: TOTAL_R }, () => Array(COLS).fill(null))
  for (let c = 0; c < COLS; c++) {
    const stack: string[] = []
    for (let r = 0; r < TOTAL_R; r++) if (g[r][c]) stack.push(g[r][c]!)
    let nr = TOTAL_R - 1
    for (let i = stack.length - 1; i >= 0; i--) { ng[nr][c] = stack[i]; nr-- }
  }
  const nb: Record<string, [number,number][]> = {}
  for (let r = 0; r < TOTAL_R; r++)
    for (let c = 0; c < COLS; c++) {
      const id = ng[r][c]
      if (id) (nb[id] ??= []).push([r, c])
    }
  return msgs.map(m => m.del ? m : { ...m, cells: nb[m.id] ?? m.cells })
}

// ─────────────────────────────────────────────────────────────
// PERSISTENCE  (localStorage)
// ─────────────────────────────────────────────────────────────
function load(): Msg[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') } catch { return [] }
}
function save(msgs: Msg[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(LS_KEY, JSON.stringify(msgs)) } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function InteractivePage() {
  const router = useRouter()

  // ── data ──
  const [msgs,    setMsgs]    = useState<Msg[]>([])
  const [ready,   setReady]   = useState(false)

  // ── input form ──
  const [nick,    setNick]    = useState('')
  const [body,    setBody]    = useState('')

  // ── piece placement state ──
  // phase: idle → placing → dropping → idle
  const [phase,   setPhase]   = useState<'idle'|'placing'|'dropping'>('idle')
  const [pieceKey,setPieceKey]= useState<string|null>(null)
  const [ox,      setOx]      = useState(0)          // horizontal offset
  const [animRow, setAnimRow] = useState(0)           // current animated row
  const pendingNick = useRef('')
  const pendingBody = useRef('')
  const dropTimer   = useRef<ReturnType<typeof setInterval>|null>(null)

  // ── interaction ──
  const [hovId,   setHovId]   = useState<string|null>(null)
  const [selId,   setSelId]   = useState<string|null>(null)

  // ── admin ──
  const [isAdm,   setIsAdm]   = useState(false)
  const [showLogin,setShowLogin]=useState(false)
  const [showPanel,setShowPanel]=useState(false)
  const [admPw,   setAdmPw]   = useState('')

  // ── scroll ref ──
  const boardRef = useRef<HTMLDivElement>(null)

  // ── load on mount ──
  useEffect(() => { setMsgs(load()); setReady(true) }, [])

  // ─── derived ───────────────────────────────────────────────
  const grid    = useMemo(() => buildGrid(msgs), [msgs])
  const stackTop= useMemo(() => topRow(grid),    [grid])
  const piece   = pieceKey ? PIECES[pieceKey] : null
  const bounds  = piece ? hBounds(piece.cells) : null
  const ghostR  = piece && phase !== 'idle' ? landRow(grid, piece.cells, ox) : null
  const selMsg  = selId ? msgs.find(m => m.id === selId) ?? null : null
  const msgMap  = useMemo(() => {
    const m: Record<string, Msg> = {}
    for (const msg of msgs) m[msg.id] = msg
    return m
  }, [msgs])

  // ─── auto-scroll ───────────────────────────────────────────
  useEffect(() => {
    const el = boardRef.current; if (!el) return
    if      (phase === 'placing')  el.scrollTop = 0
    else if (phase === 'dropping') el.scrollTop = Math.max(0, animRow * CELL - VH * 0.2)
    else                           el.scrollTop = Math.max(0, stackTop * CELL - VH * 0.72)
  }, [phase, stackTop, animRow])

  // ─── send ──────────────────────────────────────────────────
  const handleSend = () => {
    const n = nick.trim(), b = body.trim()
    if (!n || !b) return
    pendingNick.current = n
    pendingBody.current = b
    setNick(''); setBody('')
    const k = randKey()
    setPieceKey(k)
    setOx(hBounds(PIECES[k].cells).mid)
    setAnimRow(0)
    setPhase('placing')
  }

  // ─── move ──────────────────────────────────────────────────
  const moveLeft  = useCallback(() => bounds && setOx(x => Math.max(bounds.lo, x - 1)), [bounds])
  const moveRight = useCallback(() => bounds && setOx(x => Math.min(bounds.hi, x + 1)), [bounds])

  // ─── drop ──────────────────────────────────────────────────
  const handleDrop = useCallback(() => {
    if (ghostR == null || ghostR < 0 || !piece || !pieceKey) return
    const target = ghostR
    const pCells = piece.cells
    const pCol   = piece.color
    const pKey   = pieceKey
    const pOx    = ox
    const pNick  = pendingNick.current
    const pBody  = pendingBody.current

    setAnimRow(0)
    setPhase('dropping')

    dropTimer.current = setInterval(() => {
      setAnimRow(prev => {
        if (prev >= target) {
          clearInterval(dropTimer.current!)
          const newMsg: Msg = {
            id:     `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            nick:   pNick,
            body:   pBody,
            ts:     Date.now(),
            shape:  pKey,
            col:    pCol,
            cells:  pCells.map(([dr, dc]) => [target + dr, pOx + dc]),
            ua:     navigator.userAgent.slice(0, 300),
            delReq: false,
            del:    false,
          }
          setMsgs(prev => { const u = [...prev, newMsg]; save(u); return u })
          setPhase('idle')
          setPieceKey(null)
          return prev
        }
        return prev + 1
      })
    }, DROP_TICK)
  }, [ghostR, piece, pieceKey, ox])

  // ─── keyboard ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'placing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')                          { e.preventDefault(); moveLeft()  }
      if (e.key === 'ArrowRight')                         { e.preventDefault(); moveRight() }
      if ([' ','Enter','ArrowDown'].includes(e.key))      { e.preventDefault(); handleDrop() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, moveLeft, moveRight, handleDrop])

  useEffect(() => () => { if (dropTimer.current) clearInterval(dropTimer.current) }, [])

  // ─── block click ───────────────────────────────────────────
  const onBlock = (id: string) => {
    setSelId(prev => prev === id ? null : id)
  }

  // ─── delete request ────────────────────────────────────────
  const requestDelete = (id: string) => {
    setMsgs(prev => { const u = prev.map(m => m.id === id ? { ...m, delReq: true } : m); save(u); return u })
  }

  // ─── admin delete + gravity ────────────────────────────────
  const adminDelete = (id: string) => {
    setMsgs(prev => {
      const marked   = prev.map(m => m.id === id ? { ...m, del: true } : m)
      const settled  = gravity(marked).filter(m => !m.del)
      save(settled)
      return settled
    })
    if (selId === id) setSelId(null)
  }

  // ─── admin login ───────────────────────────────────────────
  const admLogin = () => {
    if (admPw === ADMIN_PW) {
      setIsAdm(true); setShowLogin(false); setShowPanel(true); setAdmPw('')
    } else {
      alert('密码错误')
    }
  }

  // ─── fall / ghost cells ────────────────────────────────────
  const fallCells = (phase === 'placing' || phase === 'dropping') && piece
    ? piece.cells.map(([dr, dc]) => [animRow + dr, ox + dc] as [number,number])
    : null
  const ghostCells = phase === 'placing' && ghostR != null && ghostR >= 0 && piece
    ? piece.cells.map(([dr, dc]) => [ghostR + dr, ox + dc] as [number,number])
    : null

  // ─────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────
  if (!ready) return (
    <div style={{ background: '#030507', color: '#00e5ff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Share Tech Mono", monospace', fontSize: 20, letterSpacing: 6 }}>
      LOADING...
    </div>
  )

  return (
    <>
      {/* ─── fonts + keyframes ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #030507; }

        .wall-scroll::-webkit-scrollbar       { width: 4px; }
        .wall-scroll::-webkit-scrollbar-track { background: #010204; }
        .wall-scroll::-webkit-scrollbar-thumb { background: #0a2030; border-radius: 2px; }

        input.wall-input, textarea.wall-input {
          background: #030710;
          border: 1px solid #0a1e2e;
          border-radius: 3px;
          color: #6a9ab5;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          padding: 9px 11px;
          width: 100%;
          outline: none;
          transition: border-color 0.15s;
        }
        input.wall-input:focus, textarea.wall-input:focus { border-color: #1a4a6a; }
        input.wall-input::placeholder, textarea.wall-input::placeholder { color: #0f1e2a; }

        @keyframes wall-slide-up   { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes wall-pulse      { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes wall-glow-title { 0%,100% { text-shadow: 0 0 20px #00e5ff, 0 0 60px #00e5ff44; } 50% { text-shadow: 0 0 40px #00e5ff, 0 0 100px #00e5ff66; } }
        @keyframes wall-scan       { 0% { top: 0; } 100% { top: 100%; } }
      `}</style>

      {/* ─── root wrapper ─── */}
      <div style={{ minHeight: '100vh', background: '#030507', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 240, fontFamily: "'VT323', monospace" }}>

        {/* ─── BACK BUTTON ─── */}
        <button
          onClick={() => router.push('/')}
          style={{ position: 'fixed', top: 14, left: 14, zIndex: 500, background: 'transparent', border: '1px solid #0a1e2a', borderRadius: 3, color: '#0a2535', fontFamily: "'Share Tech Mono', monospace", fontSize: 12, padding: '5px 10px', cursor: 'pointer', letterSpacing: 2 }}
        >
          ← BACK
        </button>

        {/* ─── HEADER ─── */}
        <div style={{ textAlign: 'center', padding: '32px 0 22px', userSelect: 'none' }}>
          <div style={{ fontSize: 52, letterSpacing: 10, color: '#00e5ff', animation: 'wall-glow-title 3s ease-in-out infinite' }}>
            SAM&apos;S WALL
          </div>
          <div style={{ fontSize: 13, letterSpacing: 4, color: '#091e2a', fontFamily: "'Share Tech Mono'", marginTop: 6 }}>
            PUBLIC · TETRIS MESSAGE BOARD
          </div>
          {/* shape colour legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
            {KEYS.map(k => (
              <div key={k} style={{ width: 9, height: 9, background: PIECES[k].color, borderRadius: 2, boxShadow: `0 0 8px ${PIECES[k].color}` }} />
            ))}
          </div>
        </div>

        {/* ─── INPUT FORM  (idle only) ─── */}
        {phase === 'idle' && (
          <div style={{ width: BW, background: '#060911', border: '1px solid #091824', borderRadius: 5, padding: 16, marginBottom: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
            <input
              className="wall-input"
              value={nick}
              onChange={e => setNick(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="昵称 / Nickname"
              maxLength={24}
            />
            <textarea
              className="wall-input"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="给 Sam 留言 / Leave a message for Sam..."
              maxLength={160}
              rows={3}
              style={{ marginTop: 8, resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ color: '#0a1e2a', fontSize: 12, fontFamily: "'Share Tech Mono'" }}>
                {body.length} / 160
              </span>
              <button
                onClick={handleSend}
                disabled={!nick.trim() || !body.trim()}
                style={{
                  background: (!nick.trim() || !body.trim()) ? 'transparent' : '#00e5ff0d',
                  border: '1px solid #00e5ff',
                  borderRadius: 3,
                  color: '#00e5ff',
                  fontFamily: "'VT323', monospace",
                  fontSize: 22,
                  padding: '4px 28px',
                  cursor: (!nick.trim() || !body.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (!nick.trim() || !body.trim()) ? 0.18 : 1,
                  textShadow: '0 0 14px #00e5ff',
                  transition: 'opacity 0.2s',
                  letterSpacing: 2,
                }}
              >
                SEND ▶
              </button>
            </div>
          </div>
        )}

        {/* ─── PLACEMENT CONTROLS ─── */}
        {phase === 'placing' && piece && (
          <div style={{ width: BW, marginBottom: 10 }}>
            {/* control bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#060911', border: `2px solid ${piece.color}55`, borderRadius: 5, padding: '10px 16px', marginBottom: 8, boxShadow: `0 0 30px ${piece.color}18` }}>
              <button
                onClick={moveLeft}
                style={{ background: 'transparent', border: `1px solid ${piece.color}55`, borderRadius: 3, color: piece.color, fontFamily: "'VT323'", fontSize: 34, padding: '0 18px', cursor: 'pointer', textShadow: `0 0 12px ${piece.color}` }}
              >◀</button>

              <div style={{ textAlign: 'center' }}>
                <div style={{ color: piece.color, fontSize: 26, letterSpacing: 3, textShadow: `0 0 16px ${piece.color}` }}>
                  {pieceKey} · 选位置
                </div>
                <div style={{ color: '#091e2a', fontSize: 11, fontFamily: "'Share Tech Mono'", marginTop: 3 }}>
                  ← → 移动 · SPACE 落下
                </div>
              </div>

              <button
                onClick={moveRight}
                style={{ background: 'transparent', border: `1px solid ${piece.color}55`, borderRadius: 3, color: piece.color, fontFamily: "'VT323'", fontSize: 34, padding: '0 18px', cursor: 'pointer', textShadow: `0 0 12px ${piece.color}` }}
              >▶</button>
            </div>

            {/* drop button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleDrop}
                style={{ background: `${piece.color}0e`, border: `2px solid ${piece.color}`, borderRadius: 4, color: piece.color, fontFamily: "'VT323'", fontSize: 26, padding: '8px 56px', cursor: 'pointer', boxShadow: `0 0 30px ${piece.color}44`, textShadow: `0 0 16px ${piece.color}`, letterSpacing: 4, transition: 'box-shadow 0.15s' }}
              >
                ▼ 落下
              </button>
            </div>
          </div>
        )}

        {/* ─── DROPPING INDICATOR ─── */}
        {phase === 'dropping' && piece && (
          <div style={{ width: BW, textAlign: 'center', marginBottom: 10 }}>
            <div style={{ color: piece.color, fontSize: 22, letterSpacing: 4, opacity: 0.7, animation: 'wall-pulse 0.5s infinite' }}>
              SENDING...
            </div>
          </div>
        )}

        {/* ─── BOARD ─── */}
        <div
          ref={boardRef}
          className="wall-scroll"
          style={{ width: BW + 2, height: VH, overflowY: 'scroll', overflowX: 'hidden', border: '1px solid #091522', borderRadius: 3, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.85), 0 0 50px rgba(0,80,130,0.08)', position: 'relative' }}
        >
          {/* scanline overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)' }} />

          {/* inner canvas */}
          <div style={{ width: BW, height: TOTAL_R * CELL, position: 'relative', background: '#020406', backgroundImage: `linear-gradient(rgba(0,229,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.018) 1px, transparent 1px)`, backgroundSize: `${CELL}px ${CELL}px` }}>

            {/* empty state */}
            {msgs.length === 0 && phase === 'idle' && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', color: '#08161f', fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 2, lineHeight: 2.4, pointerEvents: 'none' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>⠿</div>
                NO MESSAGES YET<br />BE THE FIRST
              </div>
            )}

            {/* ── settled blocks ── */}
            {Array.from({ length: TOTAL_R }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => {
                const id = grid[r][c]; if (!id) return null
                const msg = msgMap[id]; if (!msg) return null
                const hi = hovId === id || selMsg?.id === id
                const cl = msg.col
                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHovId(id)}
                    onMouseLeave={() => setHovId(null)}
                    onClick={() => onBlock(id)}
                    style={{
                      position: 'absolute',
                      top:  r * CELL + 2,
                      left: c * CELL + 2,
                      width:  CELL - 4,
                      height: CELL - 4,
                      borderRadius: 3,
                      cursor: 'pointer',
                      zIndex: 2,
                      opacity: msg.delReq ? 0.32 : 1,
                      background: hi ? `${cl}d0` : `${cl}58`,
                      border:     `2px solid ${cl}${hi ? 'ff' : '66'}`,
                      boxShadow:  hi
                        ? `0 0 22px ${cl}, 0 0 44px ${cl}55, inset 0 0 14px ${cl}66`
                        : `0 0 5px ${cl}28`,
                      transition: 'background 0.12s, box-shadow 0.12s, border-color 0.12s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {msg.delReq && (
                      <span style={{ fontSize: 7, color: '#ff5252', fontFamily: "'Share Tech Mono'", fontWeight: 700, letterSpacing: 0 }}>DEL</span>
                    )}
                  </div>
                )
              })
            )}

            {/* ── ghost cells ── */}
            {ghostCells?.map(([r, c], i) => {
              if (grid[r]?.[c]) return null
              return (
                <div key={`gh-${i}`} style={{ position: 'absolute', top: r * CELL + 2, left: c * CELL + 2, width: CELL - 4, height: CELL - 4, border: `2px dashed ${piece?.color}38`, borderRadius: 3, pointerEvents: 'none', zIndex: 1 }} />
              )
            })}

            {/* ── falling piece ── */}
            {fallCells?.map(([r, c], i) => (
              <div key={`fp-${i}`} style={{ position: 'absolute', top: r * CELL + 2, left: c * CELL + 2, width: CELL - 4, height: CELL - 4, background: `${piece?.color}cc`, border: `2px solid ${piece?.color}`, boxShadow: `0 0 28px ${piece?.color}, 0 0 56px ${piece?.color}44, inset 0 0 16px ${piece?.color}55`, borderRadius: 3, zIndex: 6, pointerEvents: 'none' }} />
            ))}
          </div>
        </div>

        {/* ─── status bar ─── */}
        <div style={{ color: '#081622', fontSize: 11, fontFamily: "'Share Tech Mono'", marginTop: 9, letterSpacing: 2 }}>
          {msgs.length} MESSAGES &nbsp;·&nbsp; HOVER TO GLOW &nbsp;·&nbsp; CLICK TO READ
        </div>

      </div>{/* end root */}

      {/* ═══════════════════════════════════════════════════════
          MESSAGE DETAIL PANEL  (slides up from bottom)
      ═══════════════════════════════════════════════════════ */}
      {selMsg && (
        <div
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#04070d', borderTop: `2px solid ${selMsg.col}`, padding: '20px 18px', zIndex: 400, animation: 'wall-slide-up 0.28s ease', boxShadow: `0 -30px 80px ${selMsg.col}14` }}
          onClick={e => { if (e.target === e.currentTarget) setSelId(null) }}
        >
          <div style={{ maxWidth: BW, margin: '0 auto', position: 'relative' }}>
            {/* close */}
            <button
              onClick={() => setSelId(null)}
              style={{ position: 'absolute', top: 0, right: 0, background: 'transparent', border: 'none', color: '#1a3545', fontFamily: "'VT323'", fontSize: 28, cursor: 'pointer', padding: '0 4px' }}
            >✕</button>

            {/* meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11, flexWrap: 'wrap' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: selMsg.col, boxShadow: `0 0 10px ${selMsg.col}`, flexShrink: 0 }} />
              <span style={{ color: selMsg.col, fontSize: 30, textShadow: `0 0 16px ${selMsg.col}` }}>{selMsg.nick}</span>
              <span style={{ color: '#0a1e2a', fontSize: 11, fontFamily: "'Share Tech Mono'" }}>
                {new Date(selMsg.ts).toLocaleString('zh-CN')}
              </span>
              <span style={{ color: '#0a1e2a', fontSize: 11, fontFamily: "'Share Tech Mono'" }}>
                [{selMsg.shape} 型]
              </span>
            </div>

            {/* body */}
            <div style={{ color: '#6a9ab5', fontFamily: "'Share Tech Mono'", fontSize: 13, lineHeight: 1.8, background: '#020406', padding: '13px 15px', borderRadius: 4, border: '1px solid #08161f', marginBottom: 13 }}>
              {selMsg.body}
            </div>

            {/* admin meta */}
            {isAdm && (
              <div style={{ color: '#0a1620', fontSize: 11, fontFamily: "'Share Tech Mono'", padding: '8px 10px', background: '#020406', borderRadius: 4, marginBottom: 12, wordBreak: 'break-all', border: '1px solid #08161f' }}>
                <div>UA: {selMsg.ua}</div>
                <div style={{ marginTop: 4 }}>TIME: {new Date(selMsg.ts).toISOString()}</div>
              </div>
            )}

            {/* actions */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {!selMsg.delReq && !isAdm && (
                <button
                  onClick={() => requestDelete(selMsg.id)}
                  style={{ background: '#ff52520d', border: '1px solid #ff525244', borderRadius: 3, color: '#ff5252', fontFamily: "'VT323'", fontSize: 18, padding: '5px 18px', cursor: 'pointer' }}
                >
                  申请删除
                </button>
              )}
              {selMsg.delReq && !isAdm && (
                <span style={{ color: '#ff525266', fontSize: 14, fontFamily: "'Share Tech Mono'", animation: 'wall-pulse 2s infinite' }}>
                  ⏳ 删除申请审核中...
                </span>
              )}
              {isAdm && (
                <button
                  onClick={() => adminDelete(selMsg.id)}
                  style={{ background: '#ff52521a', border: '1px solid #ff5252', borderRadius: 3, color: '#ff5252', fontFamily: "'VT323'", fontSize: 18, padding: '5px 18px', cursor: 'pointer' }}
                >
                  🗑 确认删除 + 重力更新
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          ADMIN HIDDEN BUTTON  (bottom-right corner)
      ═══════════════════════════════════════════════════════ */}
      <button
        onClick={() => isAdm ? setShowPanel(true) : setShowLogin(true)}
        style={{ position: 'fixed', bottom: 14, right: 14, zIndex: 500, background: 'transparent', border: '1px solid #091520', borderRadius: 3, color: '#091520', fontFamily: "'Share Tech Mono'", fontSize: 11, padding: '3px 8px', cursor: 'pointer', letterSpacing: 1 }}
      >
        {isAdm ? '⚙ ADM' : '⚙'}
      </button>

      {/* ═══════════════════════════════════════════════════════
          ADMIN LOGIN MODAL
      ═══════════════════════════════════════════════════════ */}
      {showLogin && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }}
          onClick={e => e.target === e.currentTarget && setShowLogin(false)}
        >
          <div style={{ background: '#060911', border: '1px solid #0a1e30', borderRadius: 8, padding: 32, width: 310 }}>
            <div style={{ color: '#00e5ff', fontSize: 32, letterSpacing: 6, marginBottom: 20, textShadow: '0 0 24px #00e5ff' }}>ADMIN</div>
            <input
              className="wall-input"
              type="password"
              value={admPw}
              onChange={e => setAdmPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && admLogin()}
              placeholder="password..."
              style={{ marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={admLogin}
                style={{ flex: 1, background: '#00e5ff0d', border: '1px solid #00e5ff66', borderRadius: 3, color: '#00e5ff', fontFamily: "'VT323'", fontSize: 22, padding: '6px 0', cursor: 'pointer', textShadow: '0 0 12px #00e5ff' }}
              >
                登录
              </button>
              <button
                onClick={() => setShowLogin(false)}
                style={{ background: 'transparent', border: '1px solid #1a2a35', borderRadius: 3, color: '#2a4050', fontFamily: "'VT323'", fontSize: 22, padding: '6px 16px', cursor: 'pointer' }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          ADMIN PANEL MODAL
      ═══════════════════════════════════════════════════════ */}
      {showPanel && isAdm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }}
          onClick={e => e.target === e.currentTarget && setShowPanel(false)}
        >
          <div
            className="wall-scroll"
            style={{ background: '#060911', border: '1px solid #0a1e30', borderRadius: 8, padding: 26, width: 580, maxHeight: '80vh', overflowY: 'auto' }}
          >
            {/* header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: '#00e5ff', fontSize: 28, letterSpacing: 4 }}>⚙ ADMIN PANEL</span>
              <button onClick={() => setShowPanel(false)} style={{ background: 'transparent', border: 'none', color: '#2a4050', fontFamily: "'VT323'", fontSize: 28, cursor: 'pointer' }}>✕</button>
            </div>

            {/* stats */}
            <div style={{ color: '#0a2030', fontSize: 12, fontFamily: "'Share Tech Mono'", padding: '8px 10px', background: '#020406', borderRadius: 4, marginBottom: 18, letterSpacing: 1 }}>
              TOTAL: {msgs.length}&nbsp;&nbsp;·&nbsp;&nbsp;
              PENDING DELETE: {msgs.filter(m => m.delReq).length}&nbsp;&nbsp;·&nbsp;&nbsp;
              CELLS USED: {msgs.reduce((a, m) => a + m.cells.length, 0)} / {COLS * TOTAL_R}
            </div>

            {/* pending deletes */}
            {msgs.filter(m => m.delReq).length > 0 && (
              <>
                <div style={{ color: '#ff5252', fontSize: 22, marginBottom: 10, letterSpacing: 2 }}>⚠ 待处理删除申请</div>
                {msgs.filter(m => m.delReq).map(m => (
                  <div key={m.id} style={{ background: '#020406', border: '1px solid #ff525222', borderRadius: 4, padding: '11px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: m.col, fontSize: 22, textShadow: `0 0 8px ${m.col}` }}>{m.nick}</div>
                      <div style={{ color: '#2a5060', fontSize: 12, fontFamily: "'Share Tech Mono'", margin: '5px 0', lineHeight: 1.6 }}>
                        {m.body.slice(0, 80)}{m.body.length > 80 ? '…' : ''}
                      </div>
                      <div style={{ color: '#091522', fontSize: 11, fontFamily: "'Share Tech Mono'" }}>
                        {new Date(m.ts).toLocaleString('zh-CN')}
                      </div>
                    </div>
                    <button
                      onClick={() => adminDelete(m.id)}
                      style={{ background: '#ff52521a', border: '1px solid #ff5252', borderRadius: 3, color: '#ff5252', fontFamily: "'VT323'", fontSize: 17, padding: '4px 14px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                      批准删除
                    </button>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #091522', margin: '18px 0' }} />
              </>
            )}

            {/* all messages */}
            <div style={{ color: '#0a2030', fontSize: 22, marginBottom: 10, letterSpacing: 2 }}>
              所有留言 ({msgs.length})
            </div>
            {msgs.length === 0 && (
              <div style={{ color: '#081018', fontFamily: "'Share Tech Mono'", fontSize: 12 }}>暂无留言</div>
            )}
            {[...msgs].reverse().map(m => (
              <div key={m.id} style={{ background: '#020406', border: '1px solid #08141e', borderRadius: 4, padding: '9px 12px', marginBottom: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, background: m.col, borderRadius: 2, marginRight: 8, verticalAlign: 'middle' }} />
                  <span style={{ color: m.col, fontSize: 20 }}>{m.nick}</span>
                  <span style={{ color: '#1a3040', fontSize: 12, fontFamily: "'Share Tech Mono'", marginLeft: 10 }}>
                    {m.body.slice(0, 45)}{m.body.length > 45 ? '…' : ''}
                  </span>
                  {m.delReq && (
                    <span style={{ color: '#ff525544', fontSize: 10, fontFamily: "'Share Tech Mono'", marginLeft: 8 }}>[DEL REQ]</span>
                  )}
                </div>
                <button
                  onClick={() => adminDelete(m.id)}
                  style={{ background: 'transparent', border: '1px solid #ff525222', borderRadius: 3, color: '#ff525544', fontFamily: "'VT323'", fontSize: 14, padding: '2px 10px', cursor: 'pointer', flexShrink: 0 }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}