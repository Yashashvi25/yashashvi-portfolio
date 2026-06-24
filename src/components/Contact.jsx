import React, { useState } from 'react'
import styles from './Contact.module.css'
import { useInView } from 'react-intersection-observer'
import { Mail } from 'lucide-react'

function GithubIcon({ size = 18, className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.235 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon({ size = 18, className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

const channels = [
  {
    icon: Mail,
    label: 'EMAIL',
    value: 'yashashvi3553@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&to=yashashvi3553@gmail.com',
  },
  {
    icon: LinkedinIcon,
    label: 'LINKEDIN',
    value: 'in/yashashvi-tiwari-767237334',
    href: 'https://www.linkedin.com/in/yashashvi-tiwari-767237334/',
  },
  {
    icon: GithubIcon,
    label: 'GITHUB',
    value: 'github.com/Yashashvi25',
    href: 'https://github.com/Yashashvi25',
  },
]

// Shared magnet helpers — defined once at the top, used by both ContactCard and ContactForm
const handleMagnet = (e) => {
  const el   = e.currentTarget
  const rect = el.getBoundingClientRect()
  const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.07
  const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.07
  el.style.transform  = `translate(${dx}px, ${dy}px)`
  el.style.transition = 'transform 0.1s ease'
}
const handleMagnetLeave = (e) => {
  e.currentTarget.style.transform  = 'translate(0,0)'
  e.currentTarget.style.transition = 'transform 0.5s cubic-bezier(.22,1,.36,1)'
}

function ContactCard({ c, index }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 })

  return (
    <a
      ref={ref}
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} ${inView ? styles.cardVisible : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
      onMouseMove={handleMagnet}
      onMouseLeave={handleMagnetLeave}
    >
      <div className={styles.cardTop}>
        <div className={styles.iconWrap}>
          <c.icon className={styles.icon} size={18} />
        </div>
        <span className={styles.arrow}>↗</span>
      </div>
      <div className={styles.cardBottom}>
        <p className={styles.channelLabel}>{c.label}</p>
        <p className={styles.channelValue}>{c.value}</p>
      </div>
    </a>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors,   setErrors]   = useState({})
  const [status,   setStatus]   = useState('idle')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev  => ({ ...prev, [e.target.name]: false }))
  }

  const validate = () => {
    const errs = {}
    const name    = formData.name.trim()
    const email   = formData.email.trim()
    const message = formData.message.trim()

    // Allow letters, spaces, hyphens, apostrophes, and Unicode characters
    // so names like "O'Brien", "Jean-Luc", or names with diacritics work
    if (!name || name.length < 2 || !/^[\p{L}\s'\-]+$/u.test(name)) errs.name = true
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))       errs.email = true
    if (!message || message.length < 10)                                errs.message = true
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('sending')
    try {
      const { name, email, message } = formData
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name:    name.trim(),
          email:   email.trim(),
          message: message.trim(),
        }),
      })
      const data = await res.json()
      setStatus(data.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  // Allow Enter key in name/email fields to submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') handleSubmit()
  }

  if (status === 'success') {
    return (
      <div className={styles.formBox} onMouseMove={handleMagnet} onMouseLeave={handleMagnetLeave}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.successTitle}>MESSAGE SENT</p>
          <p className={styles.successSub}>I'LL GET BACK TO YOU SOON</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.formBox} onMouseMove={handleMagnet} onMouseLeave={handleMagnetLeave}>
      <div className={styles.formField}>
        <label className={styles.formLabel}>Your Name *</label>
        <input
          className={`${styles.formInput} ${errors.name ? styles.formInputError : ''}`}
          type="text"
          name="name"
          placeholder="Alex Johnson"
          value={formData.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {errors.name && <span className={styles.fieldError}>Enter a valid name (min 2 chars)</span>}
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>Email Address *</label>
        <input
          className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
          type="email"
          name="email"
          placeholder="alex@email.com"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {errors.email && <span className={styles.fieldError}>Enter a valid email</span>}
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>Message *</label>
        <textarea
          className={`${styles.formTextarea} ${errors.message ? styles.formInputError : ''}`}
          name="message"
          placeholder="What's on your mind?"
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && <span className={styles.fieldError}>Message must be at least 10 characters</span>}
      </div>

      {status === 'error' && (
        <p className={styles.formError}>Something went wrong. Please try again.</p>
      )}

      <button
        className={styles.sendBtn}
        onClick={handleSubmit}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message ↗'}
      </button>
    </div>
  )
}

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 })

  return (
    <section className={styles.contact} id="contact" ref={ref}>
      <div className={`${styles.inner} ${inView ? styles.visible : ''}`}>
        <h2 className={styles.sectionTitle}>GET IN TOUCH</h2>
        <p className={styles.sub}>PICK WHICHEVER CHANNEL SUITS YOU</p>

        <div className={styles.splitLayout}>
          <div className={styles.leftCol}>
            <div className={styles.cards}>
              {channels.map((c, i) => (
                <ContactCard key={i} c={c} index={i} />
              ))}
            </div>
          </div>
          <div className={styles.rightCol}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
