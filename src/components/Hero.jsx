import React, { useEffect, useRef } from 'react'
import styles from './Hero.module.css'
import avatarImg from '../assets/avatar.jpg'

const isPointerFine = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export default function Hero() {
  const labelRef  = useRef(null)
  const nameRef   = useRef(null)
  const tagRef    = useRef(null)
  const scrollRef = useRef(null)
  const imgRef    = useRef(null)

  useEffect(() => {
    const items = [
      { el: imgRef.current,    delay: 100,  dur: 1400, scale: true },
      { el: labelRef.current,  delay: 500,  dur: 900,  y: 28 },
      { el: nameRef.current,   delay: 700,  dur: 900,  y: 36 },
      { el: tagRef.current,    delay: 900,  dur: 900,  y: 24 },
      { el: scrollRef.current, delay: 1100, dur: 800,  y: 16 },
    ]

    items.forEach(({ el, delay, dur, y, scale }) => {
      if (!el) return
      el.style.transform = scale ? 'scale(1.06)' : `translateY(${y}px)`
      setTimeout(() => {
        el.style.transition = `opacity ${dur}ms cubic-bezier(.22,1,.36,1), transform ${dur}ms cubic-bezier(.22,1,.36,1)`
        el.style.opacity    = '1'
        el.style.transform  = scale ? 'scale(1)' : 'translateY(0)'
      }, delay)
    })

    // Only attach scroll parallax on pointer devices (not mobile)
    let scrollListenerAttached = false

    const onScroll = () => {
      const y = window.scrollY
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(1) translateY(${y * 0.1}px)`
      }
    }

    let attachScrollAfterIntro
    if (isPointerFine()) {
      attachScrollAfterIntro = setTimeout(() => {
        window.addEventListener('scroll', onScroll, { passive: true })
        scrollListenerAttached = true
      }, 1600)
    }

    return () => {
      clearTimeout(attachScrollAfterIntro)
      if (scrollListenerAttached) window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleMagnet = (e) => {
    if (!isPointerFine()) return
    const btn  = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.3
    const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.3
    btn.style.transform = `translate(${dx}px, ${dy}px)`
    btn.style.transition = 'transform 0.1s ease'
  }
  const handleMagnetLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0,0)'
    e.currentTarget.style.transition = 'transform 0.4s cubic-bezier(.22,1,.36,1)'
  }

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.avatarWrap}>
        <img ref={imgRef} src={avatarImg} alt="Yashashvi Tiwari" className={styles.avatar} />
        <div className={styles.vignette} />
      </div>
      <div className={styles.content}>
        <span ref={labelRef} className={styles.label}>PORTFOLIO</span>
        <h1   ref={nameRef}  className={styles.name}>YASHASHVI<br />TIWARI</h1>
        <p    ref={tagRef}   className={styles.tagline}>
          CS STUDENT &nbsp;·&nbsp; FULL STACK &nbsp;·&nbsp; APPLIED AI
        </p>
      </div>
      <div ref={scrollRef} className={styles.scrollIndicator}>
        <span className={styles.scrollLabel}>SCROLL</span>
        <div  className={styles.scrollLine} />
      </div>
    </section>
  )
}
