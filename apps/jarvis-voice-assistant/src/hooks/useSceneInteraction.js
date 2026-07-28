import { useCallback, useEffect, useRef, useState } from 'react'

// Turns the desktop node graph into a real pannable, zoomable canvas:
// drag anywhere — including empty background, not just near a node — to
// pan the whole scene, scroll/pinch to zoom (toward the cursor/midpoint),
// and nodes right under the pointer during a drag still get an extra local
// "repel" push, layered on top of the pan.
const MIN_SCALE = 0.6
const MAX_SCALE = 2.5
const REPEL_RADIUS = 22
const REPEL_STRENGTH = 9

export function useSceneInteraction({ containerRef, svgRef }) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [influence, setInfluence] = useState(null)
  const [interacting, setInteracting] = useState(false)

  const dragRef = useRef(null) // { startClientX, startClientY, startPanX, startPanY }
  const pointersRef = useRef(new Map())
  const pinchRef = useRef(null) // { startDist, startScale, startPan, mid }
  const rafRef = useRef(null)
  const pendingRef = useRef(null)

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
    const p = pendingRef.current
    pendingRef.current = null
    if (!p) return
    if (p.pan) setPan(p.pan)
    if (p.scale !== undefined) setScale(p.scale)
    setInfluence(p.influence ?? null)
  }, [])

  const schedule = useCallback((patch) => {
    pendingRef.current = { ...pendingRef.current, ...patch }
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(flush)
  }, [flush])

  // Keeps the world-point under (clientX, clientY) fixed on screen while
  // scale changes — the standard "zoom toward cursor" feel.
  const zoomAt = useCallback((clientX, clientY, nextScaleRaw, base) => {
    const container = containerRef.current
    if (!container) return base
    const rect = container.getBoundingClientRect()
    const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScaleRaw))
    const cx = clientX - rect.left
    const cy = clientY - rect.top
    const worldX = (cx - base.pan.x) / base.scale
    const worldY = (cy - base.pan.y) / base.scale
    return {
      pan: { x: cx - worldX * nextScale, y: cy - worldY * nextScale },
      scale: nextScale,
    }
  }, [containerRef])

  const onPointerDown = useCallback((e) => {
    // Deliberately no setPointerCapture here: this handler lives on the
    // wrapper that also contains clickable hexes/hub, and capturing on an
    // ancestor retargets the resulting click event to the wrapper instead
    // of whatever was actually clicked. The wrapper already covers the
    // full scene, so plain bubbling is enough to keep tracking the drag.
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    setInteracting(true)

    if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values())
      pinchRef.current = {
        startDist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
        startScale: scale,
        startPan: pan,
        mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
      }
      dragRef.current = null
      setInfluence(null)
    } else if (pointersRef.current.size === 1) {
      dragRef.current = { startClientX: e.clientX, startClientY: e.clientY, startPanX: pan.x, startPanY: pan.y }
      setInfluence(toViewBoxPoint(e.clientX, e.clientY))
    }
  }, [pan, scale, toViewBoxPoint])

  const onPointerMove = useCallback((e) => {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const pts = Array.from(pointersRef.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const factor = dist / pinchRef.current.startDist
      const next = zoomAt(
        pinchRef.current.mid.x, pinchRef.current.mid.y,
        pinchRef.current.startScale * factor,
        { pan: pinchRef.current.startPan, scale: pinchRef.current.startScale },
      )
      schedule({ pan: next.pan, scale: next.scale, influence: null })
      return
    }

    const drag = dragRef.current
    if (!drag) return
    schedule({
      pan: {
        x: drag.startPanX + (e.clientX - drag.startClientX),
        y: drag.startPanY + (e.clientY - drag.startClientY),
      },
      influence: toViewBoxPoint(e.clientX, e.clientY),
    })
  }, [schedule, toViewBoxPoint, zoomAt])

  const endPointer = useCallback((e) => {
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size < 2) pinchRef.current = null
    if (pointersRef.current.size === 0) {
      dragRef.current = null
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      pendingRef.current = null
      setInfluence(null)
      setInteracting(false)
    }
  }, [])

  const zoomBy = useCallback((factor, atClient) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const point = atClient ?? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    const next = zoomAt(point.x, point.y, scale * factor, { pan, scale })
    setPan(next.pan)
    setScale(next.scale)
  }, [containerRef, pan, scale, zoomAt])

  // Non-passive listener — a passive `onWheel` prop can't preventDefault,
  // and without it the page would scroll instead of the scene zooming.
  useEffect(() => {
    const el = svgRef.current
    if (!el) return undefined
    const handleWheel = (e) => {
      e.preventDefault()
      zoomBy(Math.exp(-e.deltaY * 0.0015), { x: e.clientX, y: e.clientY })
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [svgRef, zoomBy])

  const reset = useCallback(() => {
    setPan({ x: 0, y: 0 })
    setScale(1)
  }, [])

  const displace = useCallback((x, y) => {
    if (!influence) return { x, y }
    const dx = x - influence.x
    const dy = y - influence.y
    const dist = Math.hypot(dx, dy)
    if (dist >= REPEL_RADIUS || dist === 0) return { x, y }
    const push = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH
    return { x: x + (dx / dist) * push, y: y + (dy / dist) * push }
  }, [influence])

  return {
    scale,
    influence,
    displace,
    interacting,
    canvasStyle: {
      transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
      transformOrigin: '0 0',
    },
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
    },
    zoomBy,
    reset,
  }
}
