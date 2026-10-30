'use client'

import { useEffect, useState } from 'react'
import styles from './art.module.css'

const SLIDES = [
  { src: '/art-course/final-original/03.webp', alt: 'The printed helmet with a black visor, white shell and red fabric crest' },
  { src: '/art-course/final-original/04.webp', alt: 'The helmet seen from above with its red fabric crest' },
  { src: '/art-course/final-original/08.webp', alt: 'Printed helmet parts laid out before assembly' },
  { src: '/art-course/week-3/22.webp', alt: 'The printed pea pod holder hanging with three tennis balls' },
  { src: '/art-course/final-original/05.webp', alt: 'The finished helmet held in hand' },
  { src: '/art-course/week-1/20.webp', alt: 'The Week 1 architectural form in Fusion 360' },
  { src: '/art-course/final-original/12.webp', alt: 'The helmet with red fabric and thread for the crest' },
  { src: '/art-course/final-original/06.webp', alt: 'Fusion model of the ornate hinged helmet' },
]
const INTERVAL = 3800

/** Slides back and forth through the strongest photos and renders. */
export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => {
      const next = index + direction
      if (next < 0 || next >= SLIDES.length) {
        setDirection(-direction)
        setIndex(index - direction)
      } else {
        setIndex(next)
      }
    }, INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index, direction, paused])

  return (
    <div
      className={styles.heroMedia}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.carouselTrack} style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
        {SLIDES.map((slide, slideIndex) => (
          <div className={styles.carouselSlide} data-active={slideIndex === index || undefined} key={slide.src} aria-hidden={slideIndex !== index}>
            <img className={styles.heroMediaBackdrop} src={slide.src} alt="" aria-hidden="true" />
            <img src={slide.src} alt={slide.alt} fetchPriority={slideIndex === 0 ? 'high' : 'low'} />
          </div>
        ))}
      </div>
      <div className={styles.carouselDots}>
        {SLIDES.map((slide, slideIndex) => (
          <button
            type="button"
            key={slide.src}
            aria-label={`Show image ${slideIndex + 1} of ${SLIDES.length}`}
            aria-current={slideIndex === index}
            onClick={() => setIndex(slideIndex)}
          />
        ))}
      </div>
    </div>
  )
}
