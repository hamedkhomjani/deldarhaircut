import { useEffect, useRef, useState } from 'react'

type CursorState = 'closed' | 'open' | 'snip'

/**
 * The scissors SVG rendered inline — no external file, no browser cursor: url() support
 * issues (Firefox famously ignores SVG cursor files).
 *
 * Hotspot — the blade tip that acts as the actual click point — sits at approximately
 * (6, 4) within the 32×32 viewBox. The parent div is offset by (-6, -4) px so the
 * hot-spot tracks the OS pointer exactly.
 *
 * The pivot (rivet) is at (20, 16.5). The snip animation scales the SVG down relative
 * to that point so the blades visually "squeeze" toward the pivot.
 */
function Scissors({ state }: { state: CursorState }) {
  const isOpen = state === 'open'
  const isSnip = state === 'snip'

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        // Squeeze toward the pivot on click, spring back after
        transform: isSnip ? 'scale(0.8)' : 'scale(1)',
        transformOrigin: '20px 16.5px',
        transition: isSnip
          ? 'transform 0.07s ease-in'
          : 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {isOpen ? (
        <>
          {/* TOP BLADE — open: angles steeply toward upper-left */}
          <path
            d="M9 3 C 13 8, 16.5 12, 19.5 15.5"
            stroke="#555047"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* BOTTOM BLADE — open: angles toward the left */}
          <path
            d="M3 11 C 9 12, 14 13.8, 19.5 17"
            stroke="#555047"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* TOP HANDLE RING — rotated outward */}
          <ellipse
            cx="25.5"
            cy="10"
            rx="3.8"
            ry="2.5"
            stroke="#555047"
            strokeWidth="1.6"
            transform="rotate(-52 25.5 10)"
          />
          {/* BOTTOM HANDLE RING — rotated outward */}
          <ellipse
            cx="25.5"
            cy="23"
            rx="3.8"
            ry="2.5"
            stroke="#555047"
            strokeWidth="1.6"
            transform="rotate(52 25.5 23)"
          />
        </>
      ) : (
        <>
          {/* TOP BLADE — closed: tips nearly meeting at upper-left */}
          <path
            d="M7 5 C 11 9, 15.5 12.5, 19.5 15.5"
            stroke="#555047"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* BOTTOM BLADE — closed: parallel to top blade */}
          <path
            d="M5 8 C 9 10.5, 14 13.5, 19.5 17"
            stroke="#555047"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* TOP HANDLE RING */}
          <ellipse
            cx="25"
            cy="12"
            rx="3.8"
            ry="2.5"
            stroke="#555047"
            strokeWidth="1.6"
            transform="rotate(-35 25 12)"
          />
          {/* BOTTOM HANDLE RING */}
          <ellipse
            cx="25"
            cy="21"
            rx="3.8"
            ry="2.5"
            stroke="#555047"
            strokeWidth="1.6"
            transform="rotate(35 25 21)"
          />
        </>
      )}

      {/* PIVOT RIVET — always at the crossing point */}
      <circle cx="19.5" cy="16.3" r="2.1" fill="#f7f5f2" stroke="#555047" strokeWidth="1.4" />
      <circle cx="19.5" cy="16.3" r="0.65" fill="#948a7a" />
    </svg>
  )
}

/** Interactive-element detector used by both mousemove and mousedown handlers. */
const isInteractive = (el: EventTarget | null): boolean =>
  el instanceof Element
    ? Boolean(
        el.closest(
          'a, button, label, input, select, textarea, [role="button"], [role="link"]',
        ),
      )
    : false

export default function ScissorsCursor() {
  const cursorEl = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>('closed')
  const [visible, setVisible] = useState(false)
  const stateRef = useRef<CursorState>('closed')
  const snipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep ref in sync so event-handler closures always see the latest state
  // without needing it as an effect dependency.
  stateRef.current = state

  useEffect(() => {
    // Skip entirely on touchscreen-only devices — cursors are invisible there
    // and hiding the OS cursor would break accessibility.
    if (!window.matchMedia('(any-pointer: fine)').matches) return

    // Inject a single style rule that hides the native cursor everywhere.
    // Using !important beats Tailwind utilities (cursor-pointer, cursor-not-allowed, etc.)
    // that would otherwise let the OS cursor peek through.
    const style = document.createElement('style')
    style.id = 'scissors-cursor-hide'
    style.textContent = '*, *::before, *::after { cursor: none !important; }'
    document.head.appendChild(style)

    // ── Position update: bypasses React reconciler for smooth 60fps tracking ──
    const onMove = (e: MouseEvent) => {
      if (cursorEl.current) {
        // Subtract the hotspot offset (≈ blade tip at [6, 4] in the 32×32 SVG)
        cursorEl.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 4}px)`
      }

      // Fade in on the very first movement (avoids a flash at [0,0] on mount)
      setVisible(true)

      // Only update open/closed when we're not mid-snip
      if (stateRef.current !== 'snip') {
        const next: CursorState = isInteractive(e.target) ? 'open' : 'closed'
        if (next !== stateRef.current) setState(next)
      }
    }

    // ── Snip: fires on mousedown (before any navigation) ──
    const onDown = (e: MouseEvent) => {
      if (snipTimer.current) {
        clearTimeout(snipTimer.current)
        snipTimer.current = null
      }
      setState('snip')
      snipTimer.current = setTimeout(() => {
        // After 150ms, settle back to whichever state the pointer is now over
        const under = document.elementFromPoint(e.clientX, e.clientY)
        setState(isInteractive(under) ? 'open' : 'closed')
        snipTimer.current = null
      }, 150)
    }

    const onLeave = () => setVisible(false)

    document.addEventListener('mousemove', onMove, { passive: true })
    // capture:true so the snip fires before any React onClick handler
    document.addEventListener('mousedown', onDown, { capture: true, passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown, { capture: true })
      document.documentElement.removeEventListener('mouseleave', onLeave)
      if (snipTimer.current) clearTimeout(snipTimer.current)
      style.remove()
    }
  }, []) // empty dep array: all mutable values are accessed through refs

  return (
    // This div is the cursor overlay. It starts off-screen and is repositioned
    // on the first mousemove via the ref, avoiding a React state update per frame.
    <div
      ref={cursorEl}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 32,
        height: 32,
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
        // Off-screen until the first mousemove sets the real position
        transform: 'translate(-200px, -200px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s',
        // Soft shadow so the scissors read on any background (dark, light, image)
        filter: 'drop-shadow(0 1.5px 3px rgba(85,80,71,0.22))',
      }}
    >
      <Scissors state={state} />
    </div>
  )
}
