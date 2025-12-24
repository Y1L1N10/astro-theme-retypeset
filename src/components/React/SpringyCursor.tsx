'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

interface SpringyCursorProps {
  emoji?: string
  wrapperElement?: HTMLElement
  className?: string
}

class Vec {
  X: number
  Y: number

  constructor(X: number, Y: number) {
    this.X = X
    this.Y = Y
  }
}

const SpringyCursor: React.FC<SpringyCursorProps> = ({
  emoji = '⚽',
  wrapperElement,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<any[]>([])
  const cursorRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | null>(null)

  const nDots = 7
  const DELTAT = 0.01
  const SEGLEN = 10
  const SPRINGK = 10
  const MASS = 1
  const GRAVITY = 50
  const RESISTANCE = 10
  const STOPVEL = 0.1
  const STOPACC = 0.1
  const DOTSIZE = 11
  const BOUNCE = 0.7

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    const canvas = canvasRef.current
    let context: CanvasRenderingContext2D | null = null

    class Particle {
      position: { x: number, y: number }
      velocity: { x: number, y: number }
      canv: HTMLCanvasElement

      constructor(canvasItem: HTMLCanvasElement) {
        this.position = { x: cursorRef.current.x, y: cursorRef.current.y }
        this.velocity = { x: 0, y: 0 }
        this.canv = canvasItem
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
          this.canv,
          Math.floor(this.position.x - this.canv.width / 2),
          Math.floor(this.position.y - this.canv.height / 2),
        )
      }
    }

    function springForce(i: number, j: number, spring: Vec) {
      const dx
        = particlesRef.current[i].position.x - particlesRef.current[j].position.x
      const dy
        = particlesRef.current[i].position.y - particlesRef.current[j].position.y
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len > SEGLEN) {
        const springF = SPRINGK * (len - SEGLEN)
        spring.X += (dx / len) * springF
        spring.Y += (dy / len) * springF
      }
    }

    const onWindowResize = () => {
      if (!canvas)
        return
      // Get the document zoom level

      const rootZoom = Number.parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1

      // Inverse the zoom on the canvas to counteract the global zoom
      canvas.style.zoom = (1 / rootZoom).toString()

      // Set canvas size to full window size
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const getMousePos = (e: MouseEvent | Touch) => {
      return {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const pos = getMousePos(e.touches[0])
        cursorRef.current.x = pos.x
        cursorRef.current.y = pos.y
      }
    }

    const updateParticles = () => {
      if (!canvas || !context)
        return

      const width = canvas.width
      const height = canvas.height

      context.clearRect(0, 0, width, height)

      particlesRef.current[0].position.x = cursorRef.current.x
      particlesRef.current[0].position.y = cursorRef.current.y

      for (let i = 1; i < nDots; i++) {
        const spring = new Vec(0, 0)
        springForce(i - 1, i, spring)
        if (i < nDots - 1)
          springForce(i + 1, i, spring)

        const resist = new Vec(
          -particlesRef.current[i].velocity.x * RESISTANCE,
          -particlesRef.current[i].velocity.y * RESISTANCE,
        )

        const accel = new Vec(
          (spring.X + resist.X) / MASS,
          (spring.Y + resist.Y) / MASS + GRAVITY,
        )

        particlesRef.current[i].velocity.x += DELTAT * accel.X
        particlesRef.current[i].velocity.y += DELTAT * accel.Y

        if (
          Math.abs(particlesRef.current[i].velocity.x) < STOPVEL
          && Math.abs(particlesRef.current[i].velocity.y) < STOPVEL
          && Math.abs(accel.X) < STOPACC
          && Math.abs(accel.Y) < STOPACC
        ) {
          particlesRef.current[i].velocity.x = 0
          particlesRef.current[i].velocity.y = 0
        }

        particlesRef.current[i].position.x
          += particlesRef.current[i].velocity.x
        particlesRef.current[i].position.y
          += particlesRef.current[i].velocity.y

        if (particlesRef.current[i].position.y >= height - DOTSIZE) {
          if (particlesRef.current[i].velocity.y > 0) {
            particlesRef.current[i].velocity.y *= -BOUNCE
          }
          particlesRef.current[i].position.y = height - DOTSIZE
        }

        if (particlesRef.current[i].position.x >= width - DOTSIZE) {
          if (particlesRef.current[i].velocity.x > 0) {
            particlesRef.current[i].velocity.x *= -BOUNCE
          }
          particlesRef.current[i].position.x = width - DOTSIZE
        }

        if (particlesRef.current[i].position.x < 0) {
          if (particlesRef.current[i].velocity.x < 0) {
            particlesRef.current[i].velocity.x *= -BOUNCE
          }
          particlesRef.current[i].position.x = 0
        }

        particlesRef.current[i].draw(context)
      }
    }

    const loop = () => {
      updateParticles()
      animationFrameRef.current = requestAnimationFrame(loop)
    }

    const init = () => {
      if (prefersReducedMotion.matches || !canvas)
        return
      context = canvas.getContext('2d')
      if (!context)
        return

      onWindowResize()

      const bgCanvas = document.createElement('canvas')
      const bgContext = bgCanvas.getContext('2d')

      if (bgContext) {
        bgContext.font = '16px serif'
        const measurements = bgContext.measureText(emoji)
        bgCanvas.width = measurements.width
        bgCanvas.height = 32

        bgContext.textAlign = 'center'
        bgContext.font = '16px serif'
        bgContext.textBaseline = 'middle'
        bgContext.fillText(emoji, bgCanvas.width / 2, bgCanvas.height / 2)

        for (let i = 0; i < nDots; i++) {
          particlesRef.current[i] = new Particle(bgCanvas)
        }
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      window.addEventListener('resize', onWindowResize)

      // Add event listener for Astro view transitions to ensure correct sizing after navigation
      document.addEventListener('astro:page-load', onWindowResize)

      loop()
    }

    init()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onWindowResize)
      document.removeEventListener('astro:page-load', onWindowResize)
    }
  }, [emoji, wrapperElement])

  const style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 9999,
  }

  return <canvas ref={canvasRef} style={style} className={cn(className)} />
}

export default SpringyCursor
