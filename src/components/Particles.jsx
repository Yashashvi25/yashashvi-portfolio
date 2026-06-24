import React, { useEffect, useRef } from 'react'

export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let W = 0, H = 0, stars = [], animId
    let mouse = { x: -9999, y: -9999 }

    const makeStars = () => {
      const count = Math.min(500, Math.floor((W * H) / 6000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: 0.003 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const sizeCanvas = () => {
      W = window.innerWidth
      H = document.documentElement.scrollHeight
      canvas.width = W
      canvas.height = H
      makeStars()
    }
    sizeCanvas()

    const onMouse = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY + window.scrollY
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      stars.forEach(s => {
        s.phase += s.twinkleSpeed
        const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.phase))

        const dx = s.x - mouse.x
        const dy = s.y - mouse.y
        const dist = Math.hypot(dx, dy)
        let drawX = s.x
        let drawY = s.y

        if (dist < 120 && dist > 0) {
          const force = (1 - dist / 120) * 40
          const angle = Math.atan2(dy, dx)
          drawX += Math.cos(angle) * force
          drawY += Math.sin(angle) * force
        }

        ctx.beginPath()
        ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }

    draw()

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(sizeCanvas, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas id="particles-canvas" ref={canvasRef} />
}