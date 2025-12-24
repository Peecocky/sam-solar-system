'use client'

export default function PrizePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src="/prize.jpg"
        alt="prize"
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          border: '4px solid white',
        }}
      />
    </div>
  )
}
