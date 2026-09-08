'use client'

import { useEffect, useRef } from 'react'

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    let scrollY = window.scrollY

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleScroll = () => {
      scrollY = window.scrollY
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Create static clean dot grid
    const spacing = 48

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const cols = Math.ceil(width / spacing)
      const rows = Math.ceil(height / spacing)

      const scrollOffset = (scrollY * 0.1) % spacing

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows + 1; j++) {
          const x = i * spacing + (spacing / 2)
          const y = j * spacing - scrollOffset

          // Subtle opacity gradient near center
          const distFromCenter = Math.sqrt(
            Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
          )
          const maxDist = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          const alpha = Math.max(0.02, 0.08 * (1 - distFromCenter / maxDist))

          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(13, 148, 136, ${alpha})`
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 transition-opacity duration-500"
    />
  )
}

