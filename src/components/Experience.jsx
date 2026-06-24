import React from 'react'
import styles from './Experience.module.css'
import { useInView } from 'react-intersection-observer'

const experiences = [
  {
    role: 'Cyber Security Intern',
    company: 'InternsElite',
    type: 'Virtual Internship',
    period: 'Jun 2025 – Aug 2025',
    points: [
      'Completed introductory internship focused on basic cybersecurity concepts.',
      'Learned about common security threats, vulnerabilities, and safe computing practices.',
      'Performed tasks related to network security and system protection.',
      'Gained awareness of security fundamentals and industry terminology.',
    ],
  },
  {
    role: 'Data Analytics Job Simulation',
    company: 'Deloitte',
    type: 'Virtual Experience Program',
    period: 'Dec 2025',
    points: [
      'Completed a virtual simulation involving data analysis and business problem interpretation.',
      'Applied analytical thinking to real-world business scenarios.',
    ],
  },
]

const handleMagnet = (e) => {
  const el   = e.currentTarget
  const rect = el.getBoundingClientRect()
  const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.05
  const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.05
  el.style.transform  = `translate(${dx}px, ${dy}px)`
  el.style.transition = 'transform 0.1s ease'
}
const handleMagnetLeave = (e) => {
  e.currentTarget.style.transform  = 'translate(0,0)'
  e.currentTarget.style.transition = 'transform 0.5s cubic-bezier(.22,1,.36,1)'
}

function ExpCard({ exp }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={`${styles.card} ${inView ? styles.visible : ''}`}
      onMouseMove={handleMagnet}
      onMouseLeave={handleMagnetLeave}
    >
      <div className={styles.left}>
        <p className={styles.period}>{exp.period}</p>
        <p className={styles.type}>{exp.type}</p>
      </div>
      <div className={styles.right}>
        <h3 className={styles.role}>{exp.role}</h3>
        <p className={styles.company}>{exp.company}</p>
        <ul className={styles.points}>
          {exp.points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default function Experience() {
  const { ref: titleRef, inView: titleIn } = useInView({ triggerOnce: false, threshold: 0.1 })

  return (
    <section className={styles.experience} id="experience">
      <div className={styles.titleWrap} ref={titleRef}>
        <h2 className={`${styles.sectionTitle} ${titleIn ? styles.titleVisible : ''}`}>EXPERIENCE</h2>
      </div>
      <div className={styles.cards}>
        {experiences.map((e, i) => <ExpCard key={i} exp={e} />)}
      </div>
    </section>
  )
}
