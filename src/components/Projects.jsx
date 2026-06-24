import React from 'react'
import styles from './Projects.module.css'
import { useInView } from 'react-intersection-observer'

const projects = [
  {
    num: '01', type: 'PERSONAL · GENAI', name: 'ECHOMIND', sub: 'Multi-Agent Audio AI',
    stack: 'Gemini API · React · Twilio · tRPC · Web Audio API · XAI Risk Engine',
    desc: 'Real-time audio threat detection using a multi-agent pipeline (Perception → Decision → Action) to identify critical events like screams, alarms, and gunshots.',
    status: 'IN PROGRESS', link: 'https://echomind-multi-agent-audio-intelligence.onrender.com/',
  },
  {
    num: '02', type: 'PERSONAL · AI', name: 'VIDSNAPAI', sub: 'AI-Powered Reel Generator',
    stack: 'Python · Flask · AI APIs · FFmpeg',
    desc: 'Python-based application for automated short-form video generation with AI text-to-speech, Flask backend, and FFmpeg for combining visuals and audio.',
    status: 'COMPLETE', link: null,
  },
  {
    num: '03', type: 'ACADEMIC', name: 'CAMPUS MARKETPLACE', sub: 'Student Marketplace Platform',
    stack: 'HTML · CSS · Backend · SQL',
    desc: 'A student marketplace for buying, selling, and exchanging campus items. Built user auth pages and collaborated across a team in a full project workflow.',
    status: 'COMPLETE', link: null,
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

function ProjectCard({ project }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.18 })

  // Determine button label and disabled state
  const isLive       = !!project.link
  const isInProgress = project.status === 'IN PROGRESS'
  // Only "COMPLETE" projects with no link get "SOURCE PRIVATE" — clearly communicates
  // that the project exists but isn't publicly linked, so the button feels intentional.
  const btnLabel = isLive       ? 'LIVE PROJECT'    :
                   isInProgress ? 'COMING SOON'     : 'SOURCE PRIVATE'

  return (
    <div
      ref={ref}
      className={`${styles.card} ${inView ? styles.visible : ''}`}
      onMouseMove={handleMagnet}
      onMouseLeave={handleMagnetLeave}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={styles.cardNum}>{project.num}</span>
          <div>
            <p className={styles.cardType}>{project.type}</p>
            <h3 className={styles.cardName}>{project.name}</h3>
            <p className={styles.cardSub}>{project.sub}</p>
          </div>
        </div>
        <span className={`${styles.badge} ${isInProgress ? styles.badgeActive : ''}`}>
          {project.status}
        </span>
      </div>
      <p className={styles.cardStack}>{project.stack}</p>
      <p className={styles.cardDesc}>{project.desc}</p>

      {isLive
        ? <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.liveBtn}>
            {btnLabel}
          </a>
        : <button className={styles.liveBtn} disabled>
            {btnLabel}
          </button>
      }
    </div>
  )
}

export default function Projects() {
  const { ref: titleRef, inView: titleIn } = useInView({ triggerOnce: false, threshold: 0.1 })

  return (
    <section className={styles.projects} id="projects">
      <div className={styles.titleWrap} ref={titleRef}>
        <h2 className={`${styles.sectionTitle} ${titleIn ? styles.titleVisible : ''}`}>PROJECTS</h2>
      </div>
      <div className={styles.cards}>
        {projects.map((p) => <ProjectCard key={p.num} project={p} />)}
      </div>
    </section>
  )
}
