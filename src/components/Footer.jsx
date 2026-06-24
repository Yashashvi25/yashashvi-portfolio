import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.name}>YASHASHVI TIWARI</p>
        <p className={styles.copy}>© 2026 · All rights reserved</p>
      </div>
    </footer>
  )
}
