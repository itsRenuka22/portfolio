# 002 — Move hero glow cursor-follow off layout properties

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files (1 TSX, 1 CSS), small

## Problem

The radial "glow" that follows the cursor over the hero section is positioned via `.style.left` / `.style.top` inside a raw, unthrottled `mousemove` listener — both are layout-triggering properties, and the handler runs on every native mousemove event with no `requestAnimationFrame` batching.

```tsx
// src/sections/HomeSection.tsx:78-85 — current
const heroEl = heroRef.current
const onHeroMouseMove = (e: MouseEvent) => {
  if (!heroEl || !glowRef.current) return
  const rect = heroEl.getBoundingClientRect()
  glowRef.current.style.left = `${e.clientX - rect.left}px`
  glowRef.current.style.top = `${e.clientY - rect.top}px`
}
heroEl?.addEventListener('mousemove', onHeroMouseMove)
```

```css
/* src/index.css:135-158 — current */
.hero-section {
  position: relative;
}
.hero-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(107, 56, 212, 0.15) 0%,
    rgba(166, 242, 207, 0.05) 50%,
    rgba(255, 255, 255, 0) 70%
  );
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: opacity 0.3s;
  opacity: 0;
  mix-blend-mode: multiply;
}
.hero-section:hover .hero-glow {
  opacity: 1;
}
```

Note `.hero-glow` already has `transform: translate(-50%, -50%)` — that's the recentering offset, not positioning. The actual cursor-follow positioning happens exclusively via the JS-set `left`/`top`, which is what needs to move onto `transform`.

## Target

Position the glow via `transform: translate()`, composed with the existing `-50%, -50%` recentering offset, and batch the DOM write through a `requestAnimationFrame`.

```css
/* src/index.css:135-158 — target (only the positioning mechanism changes; keep every other property identical) */
.hero-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(107, 56, 212, 0.15) 0%,
    rgba(166, 242, 207, 0.05) 50%,
    rgba(255, 255, 255, 0) 70%
  );
  border-radius: 50%;
  pointer-events: none;
  left: 0;
  top: 0;
  z-index: 0;
  transition: opacity 0.3s;
  opacity: 0;
  mix-blend-mode: multiply;
}
.hero-section:hover .hero-glow {
  opacity: 1;
}
```

```tsx
// src/sections/HomeSection.tsx:78-85 — target
const heroEl = heroRef.current
let glowRafId = 0
let pendingGlowX = 0
let pendingGlowY = 0
const applyGlowPosition = () => {
  if (glowRef.current) {
    glowRef.current.style.transform = `translate(${pendingGlowX - 200}px, ${pendingGlowY - 200}px)`
  }
}
const onHeroMouseMove = (e: MouseEvent) => {
  if (!heroEl) return
  const rect = heroEl.getBoundingClientRect()
  pendingGlowX = e.clientX - rect.left
  pendingGlowY = e.clientY - rect.top
  cancelAnimationFrame(glowRafId)
  glowRafId = requestAnimationFrame(applyGlowPosition)
}
heroEl?.addEventListener('mousemove', onHeroMouseMove)
```

`-200` is half of the glow's fixed `400px` width/height (`src/index.css:140-141`), replacing the `translate(-50%, -50%)` CSS recentering with an equivalent px offset baked into the JS-computed transform, since the element's own `transform` is now fully JS-owned (a CSS `transform` and a JS-set `.style.transform` can't both apply — the JS one must include the recentering math itself). If the glow's width/height ever change, this `200` constant must change with it (half of whatever the new size is).

## Repo conventions to follow

- The hero section already has a *correct* reference implementation for exactly this pattern two effects below: the magnetic blob-follow effect at `src/sections/HomeSection.tsx:59-76` reads raw mouse position into `targetX`/`targetY`, then applies the final `.style.transform = translate(...)` write from inside an `requestAnimationFrame` loop (`animateBlob`), never from the raw event handler. Follow that same shape here (rAF-batched write, transform-only).
- Unlike the blob-follow (which lerps toward the target for a "trailing" feel), the glow should track the cursor immediately with no lerp — only the *event batching* (rAF) is being added here, not smoothing. Do not add lerp/easing to this effect; it would change the felt behavior beyond the scope of this fix.

## Steps

1. In `src/sections/HomeSection.tsx`, inside the `useEffect` at line 49 (the one containing `onMouseMove`, `animateBlob`, and `onHeroMouseMove`), replace the `onHeroMouseMove` function and its listener registration (current lines 78-85) with the rAF-batched version shown in Target above. Declare `glowRafId`, `pendingGlowX`, `pendingGlowY`, and `applyGlowPosition` alongside the existing `raf`/`currentX`/`currentY` declarations already in this effect.
2. Add `cancelAnimationFrame(glowRafId)` to the effect's cleanup function (the `return () => { ... }` block at line 87-91), alongside the existing `cancelAnimationFrame(raf)`.
3. In `src/index.css`, in the `.hero-glow` rule (lines 138-155), remove the line `transform: translate(-50%, -50%);` and add `left: 0;` and `top: 0;` in its place (the element's static position; the JS now supplies the full transform every frame). Leave every other property (`width`, `height`, `background`, `border-radius`, `pointer-events`, `z-index`, `transition`, `opacity`, `mix-blend-mode`) unchanged.

## Boundaries

- Do NOT touch the blob-follow effect (`blobImageRef`/`blobShadowRef`, lines 59-76) — it's already correct; it's the exemplar, not part of this fix.
- Do NOT touch the `.marker-line-highlight` mousemove handler (lines 94-197) — that's a separate finding (plan 003).
- Do NOT change the glow's visual size, gradient, blend mode, or hover-triggered opacity fade.
- If `src/index.css:135-158` or `src/sections/HomeSection.tsx:78-85` don't match the snippets above (drift since this plan was written), STOP and report instead of improvising a fix around different code.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Load the site, hover over the hero section, and move the mouse around — confirm the glow still follows the cursor smoothly with no visible lag introduced by the rAF batching (one frame of latency, ~16ms, is imperceptible).
  - In Chrome DevTools → Rendering panel, enable "Paint flashing" and move the mouse across the hero — confirm no green flash outside the glow element itself (a `left`/`top`-driven version would show layout recalculation flashing on ancestor/sibling elements; a `transform`-driven version should not).
  - In DevTools → Performance panel, record 3 seconds of mouse movement over the hero, and confirm the flame chart shows no "Layout" or "Recalculate Style" entries attributed to `onHeroMouseMove` (only "Composite Layers").
  - Confirm the glow still fades in/out correctly on hero hover-enter/leave (the `opacity` transition is untouched).
- **Done when**: the glow tracks the cursor with identical felt responsiveness to before, and Performance-panel recording shows zero layout/paint cost from this specific handler.
