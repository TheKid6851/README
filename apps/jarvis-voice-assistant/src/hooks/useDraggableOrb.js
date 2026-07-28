import { useCallback, useRef, useState } from 'react'

// A tap or a fast upward flick springs the orb back to its resting spot and
// counts as "activate" (the caller's onClick fires normally for those — see
// didDragRef below). A slower drag instead repositions it and stays put,
// clamped so it can't leave its container.
const FLICK_MAX_DURATION_MS = 400
const FLICK_MIN_DELTA_Y = 50
const FLICK_MAX_DELTA_X = 60
const REAL_DRAG_THRESHOLD_PX = 10
const EDGE_MARGIN_PX = 8

export function useDraggableOrb({ containerRef, elementRef, disabled = false }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef(null) // { startX, startY, startTime, originOffset, bounds }
  // True while the gesture in progress is a real reposition (not a tap or a
  // flick) — the caller's onClick reads and consumes this to avoid also
  // treating the drag's release as an activation.
  const didDragRef = useRef(false)

  const computeBounds = useCallback((currentOffset) => {
    const container = containerRef.current
    const el = elementRef.current
    if (!container || !el) return null
    const c = container.getBoundingClientRect()
    const e = el.getBoundingClientRect()
    const baseLeft = e.left - currentOffset.x
    const baseTop = e.top - currentOffset.y
    const baseRight = e.right - currentOffset.x
    const baseBottom = e.bottom - currentOffset.y
    return {
      minX: c.left + EDGE_MARGIN_PX - baseLeft,
      maxX: c.right - EDGE_MARGIN_PX - baseRight,
      minY: c.top + EDGE_MARGIN_PX - baseTop,
      maxY: c.bottom - EDGE_MARGIN_PX - baseBottom,
    }
  }, [containerRef, elementRef])

  const onPointerDown = useCallback((e) => {
    if (disabled) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    // Reset at the start of every gesture — a browser that suppressed the
    // click after a previous real drag must not leave this stuck at true.
    didDragRef.current = false
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      originOffset: offset,
      bounds: computeBounds(offset),
    }
    setDragging(true)
  }, [disabled, offset, computeBounds])

  const onPointerMove = useCallback((e) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (Math.hypot(dx, dy) > REAL_DRAG_THRESHOLD_PX) didDragRef.current = true
    let nx = drag.originOffset.x + dx
    let ny = drag.originOffset.y + dy
    if (drag.bounds) {
      nx = Math.min(drag.bounds.maxX, Math.max(drag.bounds.minX, nx))
      ny = Math.min(drag.bounds.maxY, Math.max(drag.bounds.minY, ny))
    }
    setOffset({ x: nx, y: ny })
  }, [])

  const endDrag = useCallback((e) => {
    const drag = dragRef.current
    dragRef.current = null
    setDragging(false)
    if (!drag) return

    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    const duration = Date.now() - drag.startTime
    const isFlickUp = duration < FLICK_MAX_DURATION_MS && dy < -FLICK_MIN_DELTA_Y && Math.abs(dx) < FLICK_MAX_DELTA_X

    if (!didDragRef.current || isFlickUp) {
      // Tap, or a deliberate flick — spring back and let onClick activate.
      setOffset(drag.originOffset)
      didDragRef.current = false
    }
    // A real drag leaves the orb where it was dropped; didDragRef stays
    // true so the caller's onClick (which fires right after) is a no-op.
  }, [])

  return {
    dragStyle: {
      transform: offset.x || offset.y ? `translate(${offset.x}px, ${offset.y}px)` : undefined,
      transition: dragging ? 'none' : 'transform 0.2s ease',
      touchAction: 'none',
      cursor: disabled ? undefined : (dragging ? 'grabbing' : 'grab'),
    },
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
    dragging,
    didDragRef,
  }
}
