import { useCallback, useRef, useState } from 'react'

// Dragging across the desktop background pushes nearby graph nodes away
// from the pointer, in viewBox units (the node graph's SVG is 0-100).
const RADIUS = 22
const STRENGTH = 9

export function useNodeRepel(svgRef) {
  const [influence, setInfluence] = useState(null)
  const rafRef = useRef(null)
  const pendingRef = useRef(null)
  const activeRef = useRef(false)

  const toViewBoxPoint = useCallback((clientX, clientY) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }, [svgRef])

  const flush = useCallback(() => {
    rafRef.current = null
    if (pendingRef.current) setInfluence(pendingRef.current)
  }, [])

  const onPointerDown = useCallback((e) => {
    // Let every button layered on top of the background (dock, skills
    // panel, status ring, tweaks, command bar) handle its own click.
    if (e.target.closest('button, a')) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    activeRef.current = true
    const pt = toViewBoxPoint(e.clientX, e.clientY)
    pendingRef.current = pt
    setInfluence(pt)
  }, [toViewBoxPoint])

  const onPointerMove = useCallback((e) => {
    if (!activeRef.current) return
    pendingRef.current = toViewBoxPoint(e.clientX, e.clientY)
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(flush)
  }, [toViewBoxPoint, flush])

  const endDrag = useCallback(() => {
    activeRef.current = false
    pendingRef.current = null
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setInfluence(null)
  }, [])

  const displace = useCallback((x, y) => {
    if (!influence) return { x, y }
    const dx = x - influence.x
    const dy = y - influence.y
    const dist = Math.hypot(dx, dy)
    if (dist >= RADIUS || dist === 0) return { x, y }
    const push = ((RADIUS - dist) / RADIUS) * STRENGTH
    return { x: x + (dx / dist) * push, y: y + (dy / dist) * push }
  }, [influence])

  return {
    influence,
    displace,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  }
}
