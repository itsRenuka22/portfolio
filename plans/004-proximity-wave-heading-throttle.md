# 004 — Cache letter rects and rAF-batch ProximityWaveHeading's mousemove handler

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, small-moderate

## Problem

The "Selected Works" heading in the Projects section lifts letters near the cursor. On every raw `mousemove` event, it calls `getBoundingClientRect()` on every letter span, with no caching and no `requestAnimationFrame` batching.

```tsx
// src/components/ProximityWaveHeading.tsx:17-34 — current
const onMouseMove = (e: MouseEvent) => {
  const mouseX = e.clientX
  letters.forEach((letter) => {
    const rect = letter.getBoundingClientRect()   // synchronous layout read, per letter, per event
    const letterCenterX = rect.left + rect.width / 2
    const distance = Math.abs(mouseX - letterCenterX)
    const maxDistance = 150
    const maxLift = -15

    if (distance < maxDistance) {
      const normalizedDist = distance / maxDistance
      const liftFactor = (Math.cos(normalizedDist * Math.PI) + 1) / 2
      letter.style.transform = `translateY(${maxLift * liftFactor}px)`
    } else {
      letter.style.transform = 'translateY(0px)'
    }
  })
}
```

For a heading like "Selected Works" (14 letters), this is 14 `getBoundingClientRect()` calls on every mousemove event the browser fires (commonly 60-120+/sec on modern hardware) — a forced-layout-read storm on a heading most visitors will mouse over while scrolling to the Projects section.

## Target

Compute each letter's `left`/`width` once (on mount and on resize), store them, and do the per-move math against the cached values. Batch the actual style write through `requestAnimationFrame` so rapid mousemove events collapse to one DOM write per frame.

```tsx
// src/components/ProximityWaveHeading.tsx — target
export default function ProximityWaveHeading({ text, className = '' }: ProximityWaveHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const heading = headingRef.current
    if (!heading || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters = Array.from(heading.querySelectorAll<HTMLElement>('.wave-letter'))
    let letterCenters: number[] = []

    const measure = () => {
      letterCenters = letters.map((letter) => {
        const rect = letter.getBoundingClientRect()
        return rect.left + rect.width / 2
      })
    }
    measure()

    let pendingX: number | null = null
    let rafId = 0

    const applyLift = () => {
      if (pendingX === null) return
      const mouseX = pendingX
      letters.forEach((letter, i) => {
        const distance = Math.abs(mouseX - letterCenters[i])
        const maxDistance = 150
        const maxLift = -15

        if (distance < maxDistance) {
          const normalizedDist = distance / maxDistance
          const liftFactor = (Math.cos(normalizedDist * Math.PI) + 1) / 2
          letter.style.transform = `translateY(${maxLift * liftFactor}px)`
        } else {
          letter.style.transform = 'translateY(0px)'
        }
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(applyLift)
    }

    const onMouseLeave = () => {
      pendingX = null
      cancelAnimationFrame(rafId)
      letters.forEach((letter) => {
        letter.style.transform = 'translateY(0px)'
      })
    }

    const onResize = () => measure()

    heading.addEventListener('mousemove', onMouseMove)
    heading.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', onResize)
    return () => {
      heading.removeEventListener('mousemove', onMouseMove)
      heading.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <h1 ref={headingRef} className={className}>
      {text.split('').map((char, i) => (
        <span key={i} className="wave-letter">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </h1>
  )
}
```

## Repo conventions to follow

- `src/sections/HomeSection.tsx:65-76` (`animateBlob`) is this codebase's established pattern for "read raw input cheaply, apply the expensive/visual part via rAF" — mirror its shape: a `pending*` variable set synchronously in the event handler, consumed by a separate function scheduled via `requestAnimationFrame`.
- Letters keep the existing `.wave-letter` class name and CSS-driven `transition: transform 0.3s ease-out;` (`src/index.css:253-256`) — do not touch the CSS transition, only the JS that sets `.style.transform`.
- The `prefers-reduced-motion` early-return at the top of the effect is already correct — preserve it exactly as-is.

## Steps

1. In `src/components/ProximityWaveHeading.tsx`, inside the `useEffect`, add a `letterCenters: number[]` array and a `measure()` function that populates it from `letters.map(...)`, as shown in Target. Call `measure()` once immediately after `letters` is computed.
2. Replace the body of `onMouseMove` so it only stores `pendingX = e.clientX` and schedules `applyLift` via `requestAnimationFrame` (cancelling any prior pending frame first) — move the actual per-letter distance/lift math into a new `applyLift` function that reads from `letterCenters`, not from fresh `getBoundingClientRect()` calls.
3. Add a `window.addEventListener('resize', onResize)` (calling `measure()`) so cached centers stay correct if the viewport is resized, and remove it in the cleanup function alongside the existing listener removals.
4. Update the cleanup function to also `cancelAnimationFrame(rafId)` and remove the resize listener.
5. Leave `onMouseLeave` resetting all letters to `translateY(0px)` immediately (no rAF needed there — it's a single cheap write, not a per-move hot path), but have it also cancel any pending rAF frame so a stale `applyLift` doesn't run after the mouse has left.

## Boundaries

- Do NOT change the lift math itself (`maxDistance = 150`, `maxLift = -15`, the cosine falloff curve) — this is a performance fix only, the felt curve should be identical.
- Do NOT touch `src/components/WaveHeading.tsx` — it's a different component (hover-triggered per-letter, not continuous mousemove) and is not part of this finding.
- Do NOT change the `.wave-letter` CSS class or its transition.
- If the current file structure doesn't match what's shown (e.g., the component has been refactored since this plan was written), STOP and report rather than force-fitting this diff.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Load the site, scroll to Projects, and move the mouse across the "Selected Works" heading — confirm letters still lift near the cursor with the same falloff curve and magnitude as before.
  - Resize the browser window (or rotate a device emulation) while hovering the heading, then move the mouse again — confirm the lift still tracks correctly at the new layout (proves the resize-triggered re-measure works).
  - In DevTools → Performance panel, record 3 seconds of mouse movement across the heading, and confirm the number of "Layout" events drops to near-zero compared to before (previously: one forced layout read per letter per mousemove event; now: only on mount and on resize).
  - Toggle `prefers-reduced-motion` to `reduce` in DevTools Rendering panel, reload, and confirm the heading has no hover-lift effect at all (the existing early-return should still work unchanged).
- **Done when**: the lift effect feels identical to before, and a Performance-panel recording shows the mousemove handler no longer triggers per-letter layout reads.
