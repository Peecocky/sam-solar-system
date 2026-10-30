import Link from 'next/link'
import { notFound } from 'next/navigation'
import { artProjects, projectBySlug } from '@/lib/art-projects'
import sourceRecords from '@/lib/art-document-content.json'
import ModelPanel from './ModelPanel'
import HorizontalRecord from './HorizontalRecord'
import ArtPointerEffects from '../ArtPointerEffects'
import styles from '../art.module.css'

// Final document blocks grouped into the modules of the horizontal record.
const FINAL_PANELS = [[0], [1, 2], [3, 4], [5, 6], [7, 8, 9], [10], [11, 12, 13], [14, 15, 16, 17, 18], [19, 20, 21], [22], [23, 24], [25], [26, 27], [28, 29, 30], [31, 32], [33]]
const ORBIT_FRAMES = Array.from({ length: 96 }, (_, index) => `/art-course/final/orbit/${String(index + 1).padStart(3, '0')}.webp`)

export function generateStaticParams() {
  return artProjects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectBySlug[slug]
  return {
    title: project ? `${project.title} | Sam Art Archive` : 'Art Archive | Sam',
    description: project?.summary,
  }
}

export default async function ArtProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectBySlug[slug]
  if (!project) notFound()
  const index = artProjects.findIndex((item) => item.slug === slug)
  const previous = artProjects[index - 1]
  const next = artProjects[index + 1]
  const sourceKey = slug === 'final' ? 'final-original' : slug
  const sourceRecord = sourceRecords[sourceKey as keyof typeof sourceRecords] as Array<{
    type: string
    text?: string
    style?: string
    src?: string
    number?: number
    width?: number
    height?: number
  }>
  const sourceFile = slug === 'final' ? '/art-course/final/original-documentation.docx' : `/art-course/${slug}/source.docx`

  return (
    <main className={styles.page}>
      <ArtPointerEffects />
      <header className={styles.nav}>
        <Link className={styles.logo} href="/art">SAM / ART</Link>
        <nav aria-label="Project navigation">
          <Link href="/art#weeks">ALL PROJECTS</Link>
          <a href="#process">PROCESS</a>
          {project.model && <a href="#model">3D MODEL</a>}
          <a href="#original-record">ORIGINAL DOCUMENT</a>
          <a href="#requirements">CHECKLIST</a>
          <Link href="/">BACK TO ORBIT ↗</Link>
        </nav>
      </header>

      <section className={styles.detailHero}>
        <div>
          <p className={styles.eyebrow}>{project.eyebrow.split(' / ')[0]}</p>
          <h1>{project.title}</h1>
          <p className={styles.detailSubtitle}>{project.subtitle}</p>
          <div className={styles.detailMeta}>
            <span>{project.stat}</span>
            <a href="#process">EXPLORE PROCESS ↓</a>
          </div>
        </div>
        <img src={project.cover} alt={project.coverAlt} />
      </section>

      <section className={styles.detailSummary}>
        <h2>{project.summary}</h2>
      </section>

      <section className={styles.process} id="process">
        <div className={styles.processLead}>
          <h2>How it<br />took shape.</h2>
        </div>
        <div className={styles.processSections}>
          {project.sections.map((section, index) => (
            <article className={styles.processSection} key={section.title}>
              <div className={styles.processText}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </div>
              {section.image && (
                <figure>
                  <a href={section.image} target="_blank" rel="noreferrer" aria-label={`Open full image: ${section.caption || section.title}`}>
                    <img src={section.image} alt={section.caption || section.title} loading="lazy" />
                  </a>
                  <figcaption>{section.caption}</figcaption>
                </figure>
              )}
            </article>
          ))}
        </div>
      </section>

      {!project.model && project.modelNote && (
        <aside className={styles.modelAvailability}>
          <span>3D FILE STATUS</span>
          <p>{project.modelNote}</p>
          {slug === 'week-5' && <Link href="/art/final#model">View the later CAD model ↗</Link>}
        </aside>
      )}

      {project.model && (
        <section className={styles.modelSection} id="model">
          <div className={styles.modelHead}>
            <h2>See the object<br />in three dimensions.</h2>
          </div>
          <ModelPanel parts={project.model} note={project.modelNote} />
        </section>
      )}

      {slug === 'final' ? (
        <HorizontalRecord
          title="The finished object."
          docHref={sourceFile}
          panels={FINAL_PANELS.map((indices) => indices.map((blockIndex) => sourceRecord[blockIndex]))}
          frames={ORBIT_FRAMES}
        />
      ) : (
      <section className={styles.originalRecord} id="original-record">
        <div className={styles.originalRecordHead}>
          <div>
            <h2>The complete week.</h2>
          </div>
          <div>
            <a href={sourceFile} target="_blank" rel="noreferrer">OPEN ORIGINAL DOCX ↗</a>
          </div>
        </div>
        <div className={styles.originalRecordBody}>
          {sourceRecord.map((block, blockIndex) => block.type === 'image' && block.src ? (
            <figure className={styles.originalRecordImage} key={blockIndex}>
              <a href={block.src} target="_blank" rel="noreferrer" aria-label={`Open original document image ${block.number}`}>
                <img src={block.src} width={block.width} height={block.height} alt={`${project.title}, original document image ${block.number}`} loading="lazy" />
              </a>
            </figure>
          ) : block.text ? (
            <p className={block.style?.toLowerCase().includes('heading') || block.style?.toLowerCase() === 'title' ? styles.originalRecordHeading : styles.originalRecordText} key={blockIndex}>{block.text}</p>
          ) : null)}
        </div>
      </section>
      )}

      <section className={styles.evidence} id="requirements">
        <div className={styles.sectionHead}>
          <div>
            <h2>Requirement<br />check ✓</h2>
          </div>
        </div>
        <div className={styles.requirementList}>
          {project.requirements.map((item) => (
            <div className={styles.requirement} key={item.label}>
              <span className={`${styles.status} ${styles[item.state]}`}>{item.state === 'shown' ? '✓ MET' : item.state === 'partial' ? 'PARTIAL' : 'NEEDS EVIDENCE'}</span>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.filesSection}>
        <div>
          <h2>Open the<br />original work.</h2>
        </div>
        <div className={styles.fileList}>
          {project.links.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
              <strong>{link.label}</strong>
              <span>↗</span>
              {link.note && <small>{link.note}</small>}
            </a>
          ))}
        </div>
      </section>

      <footer className={styles.detailFooter}>
        <Link href="/art">← ALL ART PROJECTS</Link>
        <div>
          {previous && <Link href={`/art/${previous.slug}`}>← {previous.title}</Link>}
          {next && <Link href={`/art/${next.slug}`}>{next.title} →</Link>}
        </div>
      </footer>
    </main>
  )
}
