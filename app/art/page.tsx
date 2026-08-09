'use client'

import Link from 'next/link'
import styles from './art.module.css'

const gallerySlots = [
  { file: 'art-01.jpg', title: 'First Light', ratio: 'portrait' },
  { file: 'art-02.jpg', title: 'Soft Geometry', ratio: 'landscape' },
  { file: 'art-03.jpg', title: 'Afterimage', ratio: 'square' },
  { file: 'art-04.jpg', title: 'Blue Hour', ratio: 'landscape' },
  { file: 'art-05.jpg', title: 'Material Study', ratio: 'portrait' },
  { file: 'art-06.jpg', title: 'Uncatalogued', ratio: 'square' },
]

const dimensions = [
  { name: 'Villas', note: 'Interactive architectural map', shape: 'villa', open: true },
  { name: 'Form Study 02', note: '3D experiment', shape: 'orb' },
  { name: 'Form Study 03', note: '3D experiment', shape: 'prism' },
  { name: 'Form Study 04', note: '3D experiment', shape: 'ring' },
  { name: 'Form Study 05', note: '3D experiment', shape: 'arch' },
  { name: 'Form Study 06', note: '3D experiment', shape: 'stack' },
]

function ImageSlot({
  file,
  label,
  className = '',
}: {
  file: string
  label: string
  className?: string
}) {
  return (
    <div className={`${styles.imageSlot} ${className}`}>
      <div className={styles.slotGuide}>
        <span>{label}</span>
        <code>public/gallery/{file}</code>
      </div>
      {/* A missing CSS background stays transparent; adding the file covers the guide. */}
      <span
        className={styles.slotImage}
        style={{ backgroundImage: `url('/gallery/${file}')` }}
        role="img"
        aria-label={label}
      />
    </div>
  )
}

export default function ArtPage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.logo} href="#top">SAM / ART</a>
        <nav>
          <a href="#gallery">Gallery</a>
          <a href="#dimensions">3D</a>
          <Link href="/">Back to orbit ↗</Link>
        </nav>
      </header>

      <section className={styles.hero} id="top">
        <svg className={styles.ribbon} viewBox="0 0 1440 1100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-60 50 C380 150 135 370 505 414 C810 450 1040 390 990 650 C955 842 750 758 710 617 C675 485 917 500 1012 668 C1090 810 1020 990 1510 1090" />
        </svg>
        <div className={styles.heroCopy}>
          <p>PERSONAL ARCHIVE · 2026</p>
          <h1>Things I made<br />to understand things.</h1>
          <div className={styles.heroIntro}>
            <span>ART, VISUAL NOTES &amp; HALF-FINISHED OBJECTS</span>
            <p>
              A growing field of images, models, small obsessions and experiments.
              The empty frames are intentional—for now.
            </p>
            <a href="#gallery">Enter the archive ↓</a>
          </div>
        </div>

        <ImageSlot file="hero.jpg" label="HERO ARTWORK" className={styles.heroImage} />

        <div className={styles.ticker} aria-hidden="true">
          <span>DRAWING · LIGHT · SPACE · MOTION · DRAWING · LIGHT · SPACE · MOTION ·</span>
        </div>
      </section>

      <section className={styles.gallery} id="gallery">
        <div className={styles.sectionHead}>
          <div>
            <p>01 / IMAGE ARCHIVE</p>
            <h2>Selected<br />works</h2>
          </div>
          <p className={styles.sectionNote}>
            将图片按卡片标注的文件名放进 <code>public/gallery</code>，占位框会自动被图片覆盖。
          </p>
        </div>

        <div className={styles.galleryGrid}>
          {gallerySlots.map((item, index) => (
            <article className={`${styles.artwork} ${styles[item.ratio]}`} key={item.file}>
              <ImageSlot file={item.file} label={`IMAGE SLOT ${String(index + 1).padStart(2, '0')}`} />
              <div className={styles.caption}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <small>IMAGE / OPEN MEDIUM</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.manifesto}>
        <p>AN UNFINISHED MANIFESTO</p>
        <h2>
          Keep the edges visible.<br />
          Leave room for the accident.<br />
          Make the system feel alive.
        </h2>
      </section>

      <section className={styles.dimensions} id="dimensions">
        <div className={styles.dimensionTitle}>
          <p>02 / SPATIAL WORK</p>
          <h2>Other<br />dimensions</h2>
          <span>One door is open. The rest are still being built.</span>
        </div>

        <div className={styles.dimensionGrid}>
          {dimensions.map((item, index) => {
            const content = (
              <>
                <div className={styles.objectStage}>
                  <i className={styles[item.shape]} aria-hidden="true" />
                  {!item.open && <span className={styles.lock}>LOCKED</span>}
                  {item.open && <span className={styles.enter}>ENTER ↗</span>}
                </div>
                <p>{String(index + 1).padStart(2, '0')} · {item.note}</p>
                <h3>{item.name}</h3>
              </>
            )

            return item.open ? (
              <a
                className={`${styles.dimensionCard} ${styles.unlocked}`}
                href="https://villa-map.samsamsam.workers.dev/"
                target="_blank"
                rel="noreferrer"
                key={item.name}
              >
                {content}
              </a>
            ) : (
              <article className={`${styles.dimensionCard} ${styles.locked}`} key={item.name}>
                {content}
              </article>
            )
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>SAM ARCHIVE</span>
        <strong>More work will land here.</strong>
        <Link href="/">Return to the solar system →</Link>
      </footer>
    </main>
  )
}
