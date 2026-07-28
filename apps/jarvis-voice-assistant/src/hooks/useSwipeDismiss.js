import { useCallback, useRef, useState } from 'react'

// Drag the result screen away in any direction to dismiss it — additive to
// the existing tap targets ("Ask something else" / the X), not a
// replacement for them.
const DISMISS_THRESHOLD_PX = 70

export function useSwipeDismiss(onDismiss, enabled = true) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false })
  const startRef = useRef(null)

  const onPointerDown = useCallback((e) => {
    if (!enabled) return
    // Let the existing tap targets (dismiss link / X button) handle their
    // own clicks untouched — only track the drag when it starts elsewhere.
    if (e.target.closest('button, a')) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    startRef.current = { x: e.clientX, y: e.clientY }
    setDrag({ x: 0, y: 0, active: true })
  }, [enabled])

  const onPointerMove = useCallback((e) => {
    const start = startRef.current
    if (!start) return
    setDrag({ x: e.clientX - start.x, y: e.clientY - start.y, active: true })
  }, [])

  const endDrag = useCallback(() => {
    const start = startRef.current
    startRef.current = null
    if (!start) return
    setDrag((d) => {
      if (Math.hypot(d.x, d.y) > DISMISS_THRESHOLD_PX) onDismiss()
      return { x: 0, y: 0, active: false }
    })
  }, [onDismiss])

  const distance = Math.hypot(drag.x, drag.y)
  const swipeStyle = drag.active && distance > 0
    ? {
      transform: `translate(${drag.x}px, ${drag.y}px)`,
      opacity: Math.max(0.35, 1 - distance / (DISMISS_THRESHOLD_PX * 3)),
      transition: 'none',
      touchAction: 'none',
    }
    : { transform: undefined, opacity: 1, transition: 'transform 0.2s ease, opacity 0.2s ease' }

  return {
    swipeStyle,
    swipeHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  }
}
