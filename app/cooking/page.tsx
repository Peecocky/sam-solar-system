'use client'

import { useRouter } from 'next/navigation'

export default function CookingPage() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0c0a09',
      color: '#faf8f5',
      fontFamily: 'DM Sans, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#d4a574'
      }}>
        还在施工中
      </h1>
      <p style={{
        fontSize: '1.1rem',
        marginBottom: '2rem',
        color: '#a8a29e'
      }}>
        Restaurant Planet 正在建设中，请稍后再来访问。
      </p>
      <button
        onClick={() => router.push('/')}
        style={{
          padding: '12px 24px',
          background: 'rgba(212, 165, 116, 0.1)',
          border: '1px solid #d4a574',
          color: '#d4a574',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)'
        }}
      >
        返回上一层
      </button>
    </div>
  )
}
