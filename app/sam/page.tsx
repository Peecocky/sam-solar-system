'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './sam.module.css'

export default function SamPage() {
  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/" aria-label="Back to the solar system">
        <span aria-hidden="true">←</span>
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

        <h1>Sam</h1>
      </section>
    </main>
  )
}
