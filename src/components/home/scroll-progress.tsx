'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100
        setScrollPercent(Math.min(100, Math.max(0, current)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      {/* 3D Glowing Progress Bar */}
      <div className="h-1.5 w-full bg-gray-200/30 dark:bg-gray-800/40 backdrop-blur-xs">
        <div
          className="h-full bg-teal-600 dark:bg-teal-400 transition-all duration-75 ease-out"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>
    </div>
  )
}
