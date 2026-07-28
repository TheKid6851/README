import { useCallback, useRef, useState } from 'react'

// Lightweight decorative trail for surfaces without a node graph (mobile):
// dragging across the background spawns small dots that fade out.
const MIN_SPAWN_DIST_PX = 14
const PARTICLE_LIFETIME_MS = 700

let nextParticleId = 0

export function useDragTrail(containerRef, colors) {
  const [particles, setParticles] = useState([])
  const lastPointRef = useRef(null)
  const activeRef = useRef(false)

  const spawn = useCallback((clientX, clientY) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const id = nextParticleId++
    const particle = {
      id,
      x: clientX - rect.left,
      y: clientY - rect.top,
      color: colors[id % colors.length],
    }
    setParticles((ps) => [...ps, particle])
    setTimeout(() => {
      setParticles((ps) => ps.filter((p) => p.id !== id))
    }, PARTICLE_LIFETIME_MS)
  }, [containerRef, colors])

  const onPointerDown = useCallback((e) => {
    if (e.target.closest('button')) return
    activeRef.current = true
    lastPointRef.current = { x: e.clientX, y: e.clientY }
    spawn(e.clientX, e.clientY)
  }, [spawn])

  const onPointerMove = useCallback((e) => {
    if (!activeRef.current) return
    const last = lastPointRef.current
    if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < MIN_SPAWN_DIST_PX) return
    lastPointRef.current = { x: e.clientX, y: e.clientY }
    spawn(e.clientX, e.clientY)
  }, [spawn])

  const endDrag = useCallback(() => {
    activeRef.current = false
    lastPointRef.current = null
  }, [])

  return {
    particles,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
    },
  }
}
