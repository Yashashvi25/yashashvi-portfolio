import React, { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const [isPointerFine, setIsPointerFine] = useState(false)

  useEffect(() => {
    // Only show cursor on mouse/trackpad devices
    const pointerFine = window.matchMedia('(pointer: fine)').matches
    setIsPointerFine(pointerFine)
    if (!pointerFine) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0
    let animId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top  = mouseY + 'px'
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'
      animId = requestAnimationFrame(animate)
    }

    const onEnterLink = () => {
      dot.style.width   = '20px'
      dot.style.height  = '20px'
      ring.style.width  = '60px'
      ring.style.height = '60px'
    }
    const onLeaveLink = () => {
      dot.style.width   = '12px'
      dot.style.height  = '12px'
      ring.style.width  = '40px'
      ring.style.height = '40px'
    }

    // Use event delegation — works for dynamically rendered elements
    const onBodyEnter = (e) => {
      if (e.target.closest('a, button')) onEnterLink()
    }
    const onBodyLeave = (e) => {
      if (e.target.closest('a, button')) onLeaveLink()
    }

    window.addEventListener('mousemove', onMove)
    document.body.addEventListener('mouseover',  onBodyEnter)
    document.body.addEventListener('mouseout',   onBodyLeave)
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      document.body.removeEventListener('mouseover',  onBodyEnter)
      document.body.removeEventListener('mouseout',   onBodyLeave)
    }
  }, [])

  // Don't render cursor elements on touch-only devices
  if (!isPointerFine && typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null
  }

  return (
    <>
      <div className="cursor"      ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
