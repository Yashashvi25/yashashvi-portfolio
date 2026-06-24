import React, { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const links = ['ABOUT', 'PROJECTS', 'EXPERIENCE', 'CERTIFICATES', 'CONTACT']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id) => {
    setMenuOpen(false)
    setTimeout(() => {
      document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    }, menuOpen ? 300 : 0)
  }

  const handleMagnet = (e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.3
    const dy = (e.clientY - rect.top  - rect.height / 2) * 0.3
    btn.style.transform = `translate(${dx}px, ${dy}px)`
    btn.style.transition = 'transform 0.1s ease'
  }
  const handleMagnetLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0,0)'
    e.currentTarget.style.transition = 'transform 0.5s cubic-bezier(.22,1,.36,1)'
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        {/* Desktop links */}
        <div className={styles.links}>
          {links.map(l => (
            <button
              key={l}
              className={styles.link}
              onClick={() => scrollTo(l)}
              onMouseMove={handleMagnet}
              onMouseLeave={handleMagnetLeave}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Desktop resume button */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.resumeBtn}
          onMouseMove={handleMagnet}
          onMouseLeave={handleMagnetLeave}
        >
          VIEW RESUME
        </a>

        {/* Hamburger button — mobile only */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerLinks}>
          {links.map(l => (
            <button
              key={l}
              className={styles.drawerLink}
              onClick={() => scrollTo(l)}
            >
              {l}
            </button>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeBtn}
            onClick={() => setMenuOpen(false)}
          >
            VIEW RESUME
          </a>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}
