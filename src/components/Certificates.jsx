import React from 'react'
import styles from './Certificates.module.css'
import { useInView } from 'react-intersection-observer'

const certs = [
  { name: 'Programming in Java',             org: 'NPTEL',           note: '98% · Top 1%' },
  { name: 'Fundamentals of OOP & Design',    org: 'NPTEL',           note: '82%' },
  { name: 'Operating Systems',               org: 'NPTEL',           note: '' },
  { name: 'Design & Analysis of Algorithms', org: 'NPTEL',           note: '' },
  { name: 'Database & Management Systems',   org: 'NPTEL',           note: '' },
  { name: 'Python Bootcamp',                 org: 'code with harry', note: 'Learn Python from Scratch' },
  { name: 'OCI Data Science Professional',   org: 'Oracle',          note: 'Pursuing' },
  { name: 'HackerRank Badges',               org: 'HackerRank',      note: 'C++ · Java · Python — 3 Stars each' },
]

const handleMagnet = (e) => {
  const el   = e.currentTarget
  const rect = el.getBoundingClientRect()
  const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.06
  const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.06
  el.style.transform  = `translate(${dx}px, ${dy}px)`
  el.style.transition = 'transform 0.1s ease'
}
const handleMagnetLeave = (e) => {
  e.currentTarget.style.transform  = 'translate(0,0)'
  e.currentTarget.style.transition = 'transform 0.5s cubic-bezier(.22,1,.36,1)'
}

function CertCard({ cert, index }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.15 })

  return (
    <div
      ref={ref}
      className={`${styles.certCard} ${inView ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
      onMouseMove={handleMagnet}
      onMouseLeave={handleMagnetLeave}
    >
      <div className={styles.certOrg}>{cert.org}</div>
      <h3 className={styles.certName}>{cert.name}</h3>
      {cert.note && <p className={styles.certNote}>{cert.note}</p>}
    </div>
  )
}

export default function Certificates() {
  const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.15 })

  return (
    <section className={styles.certs} id="certificates" ref={sectionRef}>
      <div className={`${styles.titleWrap} ${inView ? styles.visible : ''}`}>
        <h2 className={styles.sectionTitle}>CERTIFICATIONS</h2>
      </div>
      <div className={styles.grid}>
        {certs.map((c, i) => (
          <CertCard key={i} cert={c} index={i} />
        ))}
      </div>
    </section>
  )
}
