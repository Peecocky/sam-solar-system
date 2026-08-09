'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './sam.module.css'

const socials = [
  {
    label: 'YouTube',
    detail: '@Samsamsam-i2w',
    href: 'https://www.youtube.com/@Samsamsam-i2w',
  },
  {
    label: 'GitHub',
    detail: '@Peecocky',
    href: 'https://github.com/Peecocky',
  },
]

export default function SamPage() {
  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/">
        <span aria-hidden="true">←</span> Back to orbit
      </Link>

      <div className={styles.stars} aria-hidden="true" />
      <section className={styles.profile} aria-label="Sam's profile">
        <div className={styles.orbit} aria-hidden="true">
          <span />
        </div>
        <div className={styles.avatarWrap}>
          <Image
            className={styles.avatar}
            src="/avatar.jpg"
            alt="Portrait of Sam"
            width={520}
            height={520}
            priority
          />
        </div>

        <p className={styles.kicker}>THE PERSON AT THE CENTRE</p>
        <h1>Sam</h1>
        <p className={styles.intro}>
          Data science, creative computing, finance, games, food, and a small
          universe of side projects.
        </p>

        <nav className={styles.socials} aria-label="Social links">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
            >
              <span>{social.label}</span>
              <small>{social.detail}</small>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
          <span className={styles.pendingLink} title="Instagram URL pending">
            <span>Instagram</span>
            <small>link arriving soon</small>
            <b aria-hidden="true">·</b>
          </span>
        </nav>
      </section>
    </main>
  )
}
