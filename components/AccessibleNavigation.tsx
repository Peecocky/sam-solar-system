'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './AccessibleNavigation.module.css'

type Language = 'en' | 'cn'

const destinations = [
  { cn: '认识 Sam', en: 'Meet Sam', href: '/sam', marker: '☀' },
  { cn: '艺术画廊', en: 'Art Gallery', href: '/art', marker: '01' },
  { cn: '个人简历', en: 'Curriculum Vitae', href: '/cv', marker: '02' },
  { cn: '幻想地图与小游戏', en: 'Games & Fantasy Map', href: '/games', marker: '03' },
  { cn: 'Sam 的厨房', en: "Sam's Kitchen", href: '/cooking', marker: '04' },
  { cn: '股票研究', en: 'Stock Research', href: '/stocks', marker: '05' },
  { cn: '留言墙', en: 'Message Wall', href: '/interactive', marker: '06' },
  { cn: 'Minecraft 星球', en: 'Minecraft Planet', href: '/minecraft', marker: '07' },
  { cn: '神秘视觉实验', en: 'Mystery Vision', href: '/vision', marker: '08' },
  { cn: 'Sam 的别墅', en: "Sam's Villas", href: 'https://villa-map.samsamsam.workers.dev/', marker: '09' },
]

const copy = {
  en: {
    launcher: 'Guide',
    kicker: 'An easy-to-read, easy-to-click list',
    title: 'Choose a planet to visit',
    close: 'Close ×',
    closeLabel: 'Close the guide',
    navLabel: 'All planets in a large-text list',
    switchTo: '中文',
    switchLabel: '切换到中文',
  },
  cn: {
    launcher: '大字导航',
    kicker: '容易阅读和点击的列表',
    title: '选择要前往的星球',
    close: '关闭 ×',
    closeLabel: '关闭大字导航',
    navLabel: '所有星球的大字列表',
    switchTo: 'English',
    switchLabel: 'Switch to English',
  },
}

/** The large-text guide. The sun opens it; the launcher only appears for keyboard focus. */
export default function AccessibleNavigation({
  open,
  onOpen,
  onClose,
}: {
  open: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const [language, setLanguage] = useState<Language>('en')
  const closeRef = useRef<HTMLButtonElement>(null)
  const text = copy[language]

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <>
      <button
        className={styles.launcher}
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        aria-controls="large-text-navigation"
      >
        <span aria-hidden="true">☰</span>
        {text.launcher}
      </button>

      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="large-nav-title" lang={language === 'en' ? 'en' : 'zh-CN'}>
          <div className={styles.panel} id="large-text-navigation">
            <header>
              <div>
                <p>{text.kicker}</p>
                <h2 id="large-nav-title">{text.title}</h2>
              </div>
              <div className={styles.headerActions}>
                <button type="button" onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')} aria-label={text.switchLabel}>
                  {text.switchTo}
                </button>
                <button type="button" ref={closeRef} onClick={onClose} aria-label={text.closeLabel}>{text.close}</button>
              </div>
            </header>

            <nav aria-label={text.navLabel}>
              {destinations.map((item) => {
                const content = (
                  <>
                    <span className={styles.marker}>{item.marker}</span>
                    <span className={styles.names}>
                      <strong>{item[language]}</strong>
                      <small>{item[language === 'en' ? 'cn' : 'en']}</small>
                    </span>
                    <b aria-hidden="true">→</b>
                  </>
                )
                return item.href.startsWith('http') ? (
                  <a href={item.href} target="_blank" rel="noreferrer" key={item.href}>{content}</a>
                ) : (
                  <Link href={item.href} key={item.href}>{content}</Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
