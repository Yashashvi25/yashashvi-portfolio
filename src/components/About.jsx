import React, { useEffect, useRef, useState } from 'react'
import styles from './About.module.css'
import { useInView } from 'react-intersection-observer'

const skillGroups = [
  { label: 'LANGUAGES',              items: ['Python', 'Java', 'C', 'C++', 'HTML', 'CSS', 'SQL'] },
  { label: 'FRAMEWORKS & LIBRARIES', items: ['React', 'Flask', 'Pandas', 'NumPy', 'Scikit-learn', 'NLTK'] },
  { label: 'TOOLS & PLATFORMS',      items: ['Git', 'GitHub', 'VS Code', 'IntelliJ', 'FFmpeg', 'Vercel'] },
  { label: 'AI & GENAI',             items: ['Gemini API', 'OpenAI', 'tRPC', 'Prompt Engineering', 'XAI'] },
  { label: 'CORE CS',                items: ['OOP', 'DSA', 'OS', 'DBMS', 'DAA', 'COA'] },
]

const bioSegments = [
  { text: "I'm a Computer Science undergraduate at ", highlight: false },
  { text: "SRM Institute of Science and Technology", highlight: true },
  { text: ", building a strong foundation across backend systems, AI integration, and real-world applications. I enjoy working at the intersection of ", highlight: false },
  { text: "applied AI and modern web tech", highlight: true },
  { text: " — turning ideas into functional, purposeful software. ", highlight: false },
]

function buildWords() {
  const words = []
  bioSegments.forEach(seg => {
    seg.text.split(/(\s+)/).forEach(part => {
      if (part) words.push({ text: part, highlight: !!seg.highlight, dim: !!seg.dim })
    })
  })
  return words
}

const BIO_WORDS = buildWords()

const handleMagnet = (e) => {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const dx = (e.clientX - rect.left - rect.width / 2) * 0.25
  const dy = (e.clientY - rect.top  - rect.height / 2) * 0.25
  el.style.transform = `translate(${dx}px, ${dy}px)`
  el.style.transition = 'transform 0.1s ease'
}
const handleMagnetLeave = (e) => {
  e.currentTarget.style.transform = 'translate(0,0)'
  e.currentTarget.style.transition = 'transform 0.5s cubic-bezier(.22,1,.36,1)'
}

export default function About() {
  // triggerOnce: false → re-triggers every time section enters view
  const { ref: sectionRef, inView } = useInView({ triggerOnce: false, threshold: 0.15 })
  const [litWords, setLitWords] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (inView) {
      // Reset then animate
      setLitWords(0)
      clearInterval(intervalRef.current)
      let i = 0
      intervalRef.current = setInterval(() => {
        i++
        setLitWords(i)
        if (i >= BIO_WORDS.length) clearInterval(intervalRef.current)
      }, 38)
    } else {
      // Reset when out of view so it re-animates next time
      clearInterval(intervalRef.current)
      setLitWords(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [inView])

  return (
    <section className={styles.about} id="about" ref={sectionRef}>
      <div className={`${styles.inner} ${inView ? styles.visible : ''}`}>
        <h2 className={styles.sectionTitle}>ABOUT ME</h2>

        <p className={styles.bio}>
          {BIO_WORDS.map((word, i) => (
            <span
              key={i}
              className={[
                styles.word,
                i < litWords ? styles.wordLit : '',
                word.highlight ? styles.wordHighlight : '',
                word.dim ? styles.wordDim : '',
              ].join(' ')}
            >
              {word.text}
            </span>
          ))}
        </p>

        <div className={styles.skillsBlock}>
          {skillGroups.map((group, gi) => (
            <div
              key={group.label}
              className={`${styles.skillGroup} ${inView ? styles.skillVisible : ''}`}
              style={{ transitionDelay: `${0.6 + gi * 0.1}s` }}
            >
              <p className={styles.skillLabel}>{group.label}</p>
              <div className={styles.pills}>
                {group.items.map((s) => (
                  <span key={s} className={styles.pill} onMouseMove={handleMagnet} onMouseLeave={handleMagnetLeave}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
