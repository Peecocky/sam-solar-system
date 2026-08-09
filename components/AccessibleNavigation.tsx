'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './AccessibleNavigation.module.css'

const destinations = [
  { cn: '认识 Sam', en: 'Sam', href: '/sam', marker: '☀' },
  { cn: '艺术画廊', en: 'Art Gallery', href: '/art', marker: '01' },
  { cn: '个人简历', en: 'Curriculum Vitae', href: '/cv', marker: '02' },
  { cn: '幻想地图与小游戏', en: 'Games & Fantasy Map', href: '/games', marker: '03' },
  { cn: 'Sam 的厨房', en: "Sam's Kitchen", href: '/cooking', marker: '04' },
  { cn: '股票研究', en: 'Stock Research', href: '/stocks', marker: '05' },
  { cn: '留言墙', en: 'Message Wall', href: '/interactive', marker: '06' },
  { cn: 'Minecraft 星球', en: 'Minecraft', href: '/minecraft', marker: '07' },
  { cn: '神秘视觉实验', en: 'Mystery Vision', href: '/vision', marker: '08' },
]

export default function AccessibleNavigation() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        className={styles.launcher}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="large-text-navigation"
      >
        <span aria-hidden="true">☰</span>
        大字导航
      </button>

      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="large-nav-title">
          <div className={styles.panel} id="large-text-navigation">
            <header>
              <div>
                <p>容易阅读和点击的列表</p>
                <h2 id="large-nav-title">选择要前往的星球</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="关闭大字导航">关闭 ×</button>
            </header>

            <nav aria-label="所有星球的大字列表">
              {destinations.map((item) => (
                <Link href={item.href} key={item.href}>
                  <span className={styles.marker}>{item.marker}</span>
                  <span className={styles.names}>
                    <strong>{item.cn}</strong>
                    <small>{item.en}</small>
                  </span>
                  <b aria-hidden="true">→</b>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
