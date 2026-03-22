'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Song = {
  id: string
  title: string
  artist: string
  src: string
  cover: string
  accent: string
  comment: string  // Sam's personal comment
}

const SONGS: Song[] = [
  {
    id: '1',
    title: 'Ventura Highway',
    artist: 'America',
    src: '/playlist/song1.mp3',
    cover: '',
    accent: '#ff6b6b',
    comment: 'This song feels like driving down a California highway with the windows down. Pure nostalgia.',
  },
  {
    id: '2',
    title: 'Bon Iver\'s one song',
    artist: 'Bon Iver',
    src: '/playlist/song2.mp3',
    cover: '',
    accent: '#748ffc',
    comment: 'ABSOLUTE BEAUTY',
  },
  {
    id: '3',
    title: 'Still from Bon Iver',
    artist: 'Bon Iver',
    src: '/playlist/song3.mp3',
    cover: '',
    accent: '#ffd43b',
    comment: 'The hook hits every single time.',
  },
  {
    id: '4',
    title: 'Tower, my fav from Bon Iver',
    artist: 'Bon Iver',
    src: '/playlist/song4.mp3',
    cover: '',
    accent: '#ff922b',
    comment: 'I want to have sex like him did in the song.',
  },
  {
    id: '5',
    title: 'Bon Iver still lol',
    artist: 'Bon Iver',
    src: '/playlist/song5.mp3',
    cover: '',
    accent: '#69db7c',
    comment: 'The production on this is insane. Every listen reveals something new.',
  },
  {
    id: '6',
    title: 'Kaytranada\'s one song',
    artist: 'Kaytranada',
    src: '/playlist/song6.mp3',
    cover: '',
    accent: '#da77f2',
    comment: 'Minimalist genius. Billie proved you don\'t need a wall of sound to make a banger.',
  },
  {
    id: '7',
    title: 'Kay\'s another song',
    artist: 'Kaytranada',
    src: '/playlist/song7.mp3',
    cover: '',
    accent: '#38d9a9',
    comment: 'i cant like him more',
  },
  {
    id: '8',
    title: 'kaytranada again',
    artist: 'kaytranada',
    src: '/playlist/song8.mp3',
    cover: '',
    accent: '#4dabf7',
    comment: 'marvellous',
  },
]

function formatTime(s: number) {
  if (isNaN(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function MusicPage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)

  const [currentIdx, setCurrentIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loadError, setLoadError] = useState(false)
  const [expandedComment, setExpandedComment] = useState<string | null>(null)

  const song = SONGS[currentIdx]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => { setDuration(audio.duration); setLoadError(false) }
    const onEnd = () => { setCurrentIdx(prev => (prev + 1) % SONGS.length); setPlaying(true) }
    const onError = () => setLoadError(true)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onError)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = song.src; audio.load()
    if (playing) audio.play().catch(() => setPlaying(false))
  }, [currentIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.play().catch(() => setPlaying(false))
    else audio.pause()
  }, [playing])

  function resetTrackState() {
    setCurrentTime(0)
    setDuration(0)
    setLoadError(false)
  }

  function togglePlay() { setPlaying(p => !p) }
  function playIdx(i: number) { resetTrackState(); setCurrentIdx(i); setPlaying(true) }
  function prevTrack() { resetTrackState(); setCurrentIdx(i => (i - 1 + SONGS.length) % SONGS.length); setPlaying(true) }
  function nextTrack() { resetTrackState(); setCurrentIdx(i => (i + 1) % SONGS.length); setPlaying(true) }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  function toggleComment(id: string) {
    setExpandedComment(prev => prev === id ? null : id)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400&display=swap');

        .music-page {
          font-family: 'DM Sans', sans-serif;
          background: #080810;
          color: white;
          width: 100vw;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .music-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px; position: sticky; top: 0; z-index: 20;
          background: linear-gradient(#080810 80%, transparent);
        }
        .music-back {
          background: none; border: none; color: rgba(255,255,255,0.3);
          font: 12px 'Space Mono', monospace; letter-spacing: 1px;
          cursor: pointer; padding: 6px 0;
        }

        .now-playing {
          padding: 20px 24px 12px; display: flex; align-items: center; gap: 24px;
        }
        .np-cover {
          width: 100px; height: 100px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 40px; flex-shrink: 0; overflow: hidden;
        }
        .np-cover img { width: 100%; height: 100%; object-fit: cover; }
        .np-info { flex: 1; min-width: 0; }
        .np-info .np-label {
          font: 10px 'Space Mono', monospace; color: rgba(255,255,255,0.15);
          letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px;
        }
        .np-info h2 {
          font-size: 22px; font-weight: 700; margin: 0 0 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .np-info .np-artist {
          font-size: 14px; color: rgba(255,255,255,0.35); font-weight: 300;
        }

        /* Now-playing comment */
        .np-comment {
          margin: 0 24px 16px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.02);
          border-left: 2px solid;
          border-radius: 0 6px 6px 0;
          font-size: 13px;
          line-height: 1.7;
          color: rgba(255,255,255,0.4);
          font-style: italic;
          animation: commentIn 0.3s ease;
        }
        .np-comment .comment-label {
          font-style: normal;
          font: 9px 'Space Mono', monospace;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.12);
          margin-bottom: 6px;
        }
        @keyframes commentIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .progress-area { padding: 0 24px 8px; }
        .progress-bar {
          width: 100%; height: 4px; background: rgba(255,255,255,0.06);
          border-radius: 2px; cursor: pointer;
        }
        .progress-fill { height: 100%; border-radius: 2px; transition: width 0.2s linear; }
        .progress-times {
          display: flex; justify-content: space-between; margin-top: 6px;
          font: 10px 'Space Mono', monospace; color: rgba(255,255,255,0.12);
        }

        .controls {
          display: flex; align-items: center; justify-content: center;
          gap: 28px; padding: 12px 0 24px;
        }
        .ctrl-btn {
          background: none; border: none; color: rgba(255,255,255,0.4);
          font-size: 22px; cursor: pointer; padding: 8px;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .ctrl-btn:hover { color: white; }
        .ctrl-btn.play {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          font-size: 20px; color: white;
        }
        .ctrl-btn.play:hover { background: rgba(255,255,255,0.12); }

        .tracklist { flex: 1; padding: 0 12px 100px; }
        .tracklist-header {
          font: 10px 'Space Mono', monospace; color: rgba(255,255,255,0.1);
          letter-spacing: 3px; text-transform: uppercase; padding: 12px 12px 8px;
        }
        .track-item {
          display: flex; align-items: center; gap: 14px;
          padding: 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s;
        }
        .track-item:hover { background: rgba(255,255,255,0.03); }
        .track-item.active { background: rgba(255,255,255,0.04); }
        .track-num {
          width: 24px; text-align: center;
          font: 12px 'Space Mono', monospace; color: rgba(255,255,255,0.12); flex-shrink: 0;
        }
        .track-item.active .track-num { color: currentColor; }
        .track-cover {
          width: 44px; height: 44px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .track-info { flex: 1; min-width: 0; }
        .track-info .t-title {
          font-size: 14px; font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .track-info .t-artist {
          font-size: 12px; color: rgba(255,255,255,0.2); font-weight: 300; margin-top: 2px;
        }

        /* Comment toggle button in tracklist */
        .comment-toggle {
          background: none; border: none;
          color: rgba(255,255,255,0.1); font-size: 14px;
          cursor: pointer; padding: 4px 8px; flex-shrink: 0;
          transition: color 0.2s; border-radius: 4px;
        }
        .comment-toggle:hover { color: rgba(255,255,255,0.3); }
        .comment-toggle.open { color: rgba(255,255,255,0.4); }

        /* Inline comment in tracklist */
        .track-comment {
          margin: 0 12px 8px 50px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.015);
          border-left: 2px solid;
          border-radius: 0 6px 6px 0;
          font-size: 12px; line-height: 1.7;
          color: rgba(255,255,255,0.3);
          font-style: italic;
          animation: commentIn 0.2s ease;
        }
        .track-comment .tc-label {
          font-style: normal;
          font: 8px 'Space Mono', monospace;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.08); margin-bottom: 4px;
        }

        .track-eq {
          display: flex; align-items: flex-end; gap: 2px; height: 16px;
        }
        .track-eq span {
          width: 3px; background: currentColor; border-radius: 1px;
          animation: eqBounce 0.6s ease-in-out infinite alternate;
        }
        .track-eq span:nth-child(2) { animation-delay: 0.15s; }
        .track-eq span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes eqBounce { 0% { height: 4px; } 100% { height: 14px; } }

        .track-error {
          font: 10px 'Space Mono', monospace; color: rgba(255,80,80,0.3);
          padding: 0 24px; margin-bottom: 12px;
        }
      `}</style>

      <div className="music-page">
        <audio ref={audioRef} preload="auto" />

        <div className="music-top">
          <button className="music-back" onClick={() => router.push('/')}>← Back</button>
          <span style={{ font: '10px "Space Mono", monospace', color: 'rgba(255,255,255,0.08)', letterSpacing: 3 }}>
            SAM&apos;S PLAYLIST
          </span>
          <div style={{ width: 50 }} />
        </div>

        {/* Now playing */}
        <div className="now-playing">
          <div className="np-cover" style={{ background: `linear-gradient(135deg, ${song.accent}30, ${song.accent}10)` }}>
            {song.cover ? <img src={song.cover} alt={song.title} /> : <span>♫</span>}
          </div>
          <div className="np-info">
            <div className="np-label">Now Playing</div>
            <h2 style={{ color: song.accent }}>{song.title}</h2>
            <div className="np-artist">{song.artist}</div>
          </div>
        </div>

        {/* Now-playing comment */}
        {song.comment && (
          <div className="np-comment" style={{ borderColor: song.accent + '40' }} key={song.id}>
            <div className="comment-label">Sam&apos;s take</div>
            {song.comment}
          </div>
        )}

        {/* Progress */}
        <div className="progress-area">
          <div className="progress-bar" onClick={seek}>
            <div className="progress-fill" style={{ width: `${progress}%`, background: song.accent }} />
          </div>
          <div className="progress-times">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {loadError && <div className="track-error">File not found — add mp3 to public/playlist/</div>}

        {/* Controls */}
        <div className="controls">
          <button className="ctrl-btn" onClick={prevTrack}>⏮</button>
          <button className="ctrl-btn play" onClick={togglePlay}>{playing ? '⏸' : '▶'}</button>
          <button className="ctrl-btn" onClick={nextTrack}>⏭</button>
        </div>

        {/* Track list */}
        <div className="tracklist">
          <div className="tracklist-header">All Tracks · {SONGS.length}</div>
          {SONGS.map((s, i) => {
            const isActive = i === currentIdx
            const commentOpen = expandedComment === s.id
            return (
              <div key={s.id}>
                <div
                  className={`track-item ${isActive ? 'active' : ''}`}
                  style={isActive ? { color: s.accent } : {}}
                >
                  <div className="track-num" onClick={() => playIdx(i)}>
                    {isActive && playing ? (
                      <div className="track-eq" style={{ color: s.accent }}>
                        <span /><span /><span />
                      </div>
                    ) : (
                      String(i + 1).padStart(2, '0')
                    )}
                  </div>
                  <div className="track-cover" style={{ background: `${s.accent}15` }} onClick={() => playIdx(i)}>
                    {s.cover ? (
                      <img src={s.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <span style={{ opacity: 0.5 }}>♫</span>
                    )}
                  </div>
                  <div className="track-info" onClick={() => playIdx(i)}>
                    <div className="t-title" style={isActive ? { color: s.accent } : {}}>{s.title}</div>
                    <div className="t-artist">{s.artist}</div>
                  </div>
                  {s.comment && (
                    <button
                      className={`comment-toggle ${commentOpen ? 'open' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleComment(s.id) }}
                      title="Sam's comment"
                      style={commentOpen ? { color: s.accent + '80' } : {}}
                    >
                      💬
                    </button>
                  )}
                </div>
                {commentOpen && s.comment && (
                  <div className="track-comment" style={{ borderColor: s.accent + '30' }}>
                    <div className="tc-label">Sam&apos;s take</div>
                    {s.comment}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
