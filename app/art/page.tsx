import Link from 'next/link'
import { artProjects } from '@/lib/art-projects'
import ArtPointerEffects from './ArtPointerEffects'
import styles from './art.module.css'

export const metadata = {
  title: 'Art & 3D Course Archive | Sam',
  description: 'Sketches, Fusion 360 process, 3D models and assignment evidence from five weeks and a final project.',
}

const RIBBON_PATH = 'M-60 50 C380 150 135 370 505 414 C810 450 1040 390 990 650 C955 842 750 758 710 617 C675 485 917 500 1012 668 C1090 810 1020 990 1510 1090'

export default function ArtPage() {
  const finalProject = artProjects[5]
  return (
    <main className={styles.page} id="top">
      <ArtPointerEffects />
      <header className={styles.nav}>
        <Link className={styles.logo} href="/art">SAM / ART</Link>
        <nav aria-label="Art navigation">
          <a href="#weeks">WEEKS 01—05</a>
          <a href="#final">FINAL PROJECT</a>
          <a href="#checklist">REQUIREMENTS</a>
          <Link href="/">BACK TO ORBIT ↗</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <svg className={styles.ribbon} id="art-ribbon" viewBox="0 0 1440 1100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="artRibbonGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ef4b31" />
              <stop offset=".56" stopColor="#d63a25" />
              <stop offset="1" stopColor="#43170d" />
            </linearGradient>
            <mask id="artRibbonReveal" maskUnits="userSpaceOnUse" x="-300" y="-300" width="2100" height="1700">
              <path className={styles.ribbonReveal} d={RIBBON_PATH} pathLength={1} />
            </mask>
          </defs>
          <g className={styles.ribbonFlow}>
            <g mask="url(#artRibbonReveal)">
              <path className={styles.ribbonMain} d={RIBBON_PATH} />
              <path className={styles.ribbonSheen} d={RIBBON_PATH} />
            </g>
          </g>
        </svg>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>PERSONAL ARCHIVE · FUSION 360 · 2026</p>
          <h1>Things I made<br />to understand things.</h1>
          <div className={styles.heroIntro}>
            <span>ART, PROTOTYPES &amp; PROCESS</span>
            <p>Five weeks of sketching, modeling and testing—followed by one final design. Each project opens to its process, dimensions and source material.</p>
            <a href="#weeks">Explore the archive ↓</a>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <img className={styles.heroMediaBackdrop} src="/art-course/final-original/03.webp" alt="" aria-hidden="true" />
          <img src="/art-course/final-original/03.webp" alt="The printed helmet with a black visor, white shell and red fabric crest" />
          <span>FINAL PROJECT / PRINTED ORNATE HINGED HELMET</span>
        </div>
        <div className={styles.ticker} aria-hidden="true">DRAW / MODEL / TEST / REFINE</div>
      </section>

      <section className={styles.introBand}>
        <p>FOR THE REVIEWER</p>
        <h2>Start with a week.<br />See the evidence.</h2>
        <p>Each week opens to a focused explanation, then the complete source document with every picture in order. The final project includes physical print photos, drawings and browser-viewable parts.</p>
      </section>

      <section className={styles.gallery} id="weeks">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>01 / COURSE JOURNAL</p>
            <h2>Five weeks<br />of making.</h2>
          </div>
          <p>Follow the work from a first Fusion form study to a printed fit test and the helmet prototype.</p>
        </div>
        <div className={styles.galleryGrid}>
          {artProjects.slice(0, 5).map((project, index) => (
            <Link className={styles.projectCard} href={`/art/${project.slug}`} key={project.slug}>
              <div className={styles.projectImage}>
                <img src={project.cover} alt={project.coverAlt} loading="lazy" />
                <span className={styles.weekBadge}>WEEK {index + 1}</span>
                <span className={styles.projectHover} aria-hidden="true">WEEK {index + 1}<small>VIEW PROJECT ↗</small></span>
              </div>
              <div className={styles.projectCaption}>
                <span>{String(index + 1).padStart(2, '0')} / {project.eyebrow.split(' / ')[1]}</span>
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
                <small>{project.stat}</small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.finalFeature} id="final">
        <div className={styles.finalCopy}>
          <p className={styles.eyebrow}>02 / FINAL PROJECT</p>
          <h2>Ornate<br />Hinged Helmet.</h2>
          <p>{finalProject.summary}</p>
          <div className={styles.finalStats}>
            <span><strong>06</strong> documented components</span>
            <span><strong>111</strong> Fusion steps</span>
            <span><strong>112.5 × 137.6 × 142.3</strong> mm CAD assembly</span>
          </div>
          <Link className={styles.actionLink} href="/art/final">OPEN THE FINAL PROJECT ↗</Link>
        </div>
        <Link className={styles.finalImage} href="/art/final" aria-label="Open the final helmet project">
          <img src={finalProject.cover} alt={finalProject.coverAlt} loading="lazy" />
        </Link>
      </section>

      <section className={styles.checklist} id="checklist">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>03 / ASSIGNMENT CHECK</p>
            <h2>Every requirement,<br />checked.</h2>
          </div>
          <p>Each page links the original documents and shows the images in their source order.</p>
        </div>
        <div className={styles.checkRows}>
          {artProjects.map((project) => {
            const pending = project.requirements.filter((item) => item.state !== 'shown')
            return (
              <Link href={`/art/${project.slug}#requirements`} className={styles.checkRow} key={project.slug}>
                <span>{project.eyebrow.split(' / ')[0]}</span>
                <strong>{project.title}</strong>
                <span>{pending.length ? `${pending.length} item${pending.length > 1 ? 's' : ''} to review` : 'All requirements met ✓'}</span>
                <b aria-hidden="true">↗</b>
              </Link>
            )
          })}
        </div>
        <p className={styles.auditNote}>The final project documentation includes the assembled print, fabric details, bolts, technical drawings and sanding notes.</p>
      </section>

      <aside className={styles.otherWork}>
        <span>ELSEWHERE IN THE ARCHIVE</span>
        <a href="https://villa-map.samsamsam.workers.dev/" target="_blank" rel="noreferrer">Villas / interactive architectural map ↗</a>
      </aside>

      <footer className={styles.footer}>
        <span>SAM / ART ARCHIVE</span>
        <strong>Made to be examined.</strong>
        <Link href="/">Return to the solar system ↗</Link>
      </footer>
      <section className={styles.foliageOnly} id="foliage" aria-hidden="true">
        <canvas id="art-foliage-canvas" className={styles.palmCanvas} />
      </section>
    </main>
  )
}
