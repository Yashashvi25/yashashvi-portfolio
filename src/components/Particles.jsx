import React, { useEffect, useRef } from 'react'

export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let W = 0
    let H = 0
    let stars = []
    let animId
    let mouse = { x: -9999, y: -9999 }

    const makeStars = () => {
      const count = Math.min(350, Math.floor((W * H) / 5000))
      stars = Array.from({ length: count }, () => {
        const x = Math.random() * W
        const y = Math.random() * H
        return {
          baseX: x,
          baseY: y,
          r: Math.random() * 1.4 + 0.4,
          baseAlpha: Math.random() * 0.45 + 0.35,
          twinkleSpeed: 0.004 + Math.random() * 0.015,
          phase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.04,
          driftY: (Math.random() - 0.5) * 0.04,
        }
      })
    }

    const sizeCanvas = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
      makeStars() // fresh star field matching the new size — avoids any stale-coordinate seam
    }
    sizeCanvas()

    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      stars.forEach(s => {
        s.phase += s.twinkleSpeed
        const twinkle = 0.5 + 0.5 * Math.sin(s.phase)
        const alpha = s.baseAlpha * (0.4 + 0.6 * twinkle)

        s.baseX += s.driftX
        s.baseY += s.driftY
        if (s.baseX < 0) s.baseX = W
        if (s.baseX > W) s.baseX = 0
        if (s.baseY < 0) s.baseY = H
        if (s.baseY > H) s.baseY = 0

        const dx = s.baseX - mouse.x
        const dy = s.baseY - mouse.y
        const dist = Math.hypot(dx, dy)
        const REPEL_RADIUS = 140
        let drawX = s.baseX
        let drawY = s.baseY
        if (dist < REPEL_RADIUS) {
          const force = (1 - dist / REPEL_RADIUS) * 30
          const angle = Math.atan2(dy, dx)
          drawX += Math.cos(angle) * force
          drawY += Math.sin(angle) * force
        }

        if (s.r > 1) {
          const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, s.r * 4)
          glow.addColorStop(0, `rgba(255,255,255,${alpha * 0.5})`)
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(drawX, drawY, s.r * 4, 0, Math.PI * 2)
          ctx.fill()
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