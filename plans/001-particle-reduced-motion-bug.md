# 001 — Fix ParticleBackground ignoring prefers-reduced-motion

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 1 file, ~5 line change

## Problem

`ParticleBackground` checks `prefers-reduced-motion` but the check doesn't actually stop the animation loop — the reduced-motion branch calls `draw()` once directly, but `draw()` itself unconditionally schedules another frame at its own end, so the loop continues forever regardless of the media query.

```tsx
// src/components/ParticleBackground.tsx:28-52 — current
let raf = 0
const draw = () => {
  ctx.clearRect(0, 0, width, height)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0) p.x = width
    if (p.x > width) p.x = 0
    if (p.y < 0) p.y = height
    if (p.y > height) p.y = 0

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = 0.35
    ctx.fill()
  }
  raf = requestAnimationFrame(draw)
}

if (!reduceMotion) {
  raf = requestAnimationFrame(draw)
} else {
  draw()
}
```

Every call to `draw()` — including the single reduced-motion call — ends with `raf = requestAnimationFrame(draw)`, re-entering the loop. The `if (!reduceMotion) { ... } else { draw() }` split only controls how the loop *starts*, not whether it *continues*. This is a correctness bug, not a design choice: the intent (checked one line earlier) was clearly to stop the animation for reduced-motion users, but the code doesn't do that.

## Target

`draw()` schedules its own next frame only when motion is not reduced. The reduced-motion path renders the particles once (a static frame) and stops.

```tsx
// target
let raf = 0
const draw = () => {
  ctx.clearRect(0, 0, width, height)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0) p.x = width
    if (p.x > width) p.x = 0
    if (p.y < 0) p.y = height
    if (p.y > height) p.y = 0

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = 0.35
    ctx.fill()
  }
  if (!reduceMotion) {
    raf = requestAnimationFrame(draw)
  }
}

draw()
```

Note the call site collapses to a single unconditional `draw()` — the branching now lives entirely inside `draw()`, which is the only place that can correctly decide whether to keep looping.

## Repo conventions to follow

- This file already reads `window.matchMedia('(prefers-reduced-motion: reduce)').matches` correctly into a `reduceMotion` const at the top of the effect (`src/components/ParticleBackground.tsx:14`) — reuse that same variable, don't re-query the media query.
- `src/sections/HomeSection.tsx:50-51` shows the simpler, correct pattern used elsewhere in this codebase: check reduced motion once, and early-return / branch cleanly from it — mirror that same directness here.

## Steps

1. In `src/components/ParticleBackground.tsx`, inside the `draw` function body, change the final line from `raf = requestAnimationFrame(draw)` to:
   ```tsx
   if (!reduceMotion) {
     raf = requestAnimationFrame(draw)
   }
   ```
2. Replace the call-site block:
   ```tsx
   if (!reduceMotion) {
     raf = requestAnimationFrame(draw)
   } else {
     draw()
   }
   ```
   with a single unconditional call:
   ```tsx
   draw()
   ```
3. Leave everything else in the file (particle generation, resize handler, cleanup) unchanged.

## Boundaries

- Do NOT touch `src/sections/ContactSection.tsx` (the only consumer of this component) — no prop changes needed.
- Do NOT change the particle count, velocity, colors, or canvas sizing logic.
- Do NOT add a new dependency or library for this — it's a control-flow fix only.
- If the current code in `src/components/ParticleBackground.tsx` doesn't match the snippet above (line numbers may have drifted), find the `draw` function by its `ctx.clearRect` call and the `requestAnimationFrame(draw)` line — if the logic structure looks meaningfully different from what's described, STOP and report rather than guessing.

## Verification

- **Mechanical**: `npx tsc --noEmit` (expect no errors) and `npm run build` (expect success).
- **Feel check**:
  - In Chrome DevTools → Rendering panel, set "Emulate CSS media feature prefers-reduced-motion" to `reduce`, reload, scroll to the Contact section, and confirm the particle canvas shows a single static frame — dots visible but not drifting.
  - Turn reduced-motion back to "no preference", reload, and confirm particles drift continuously as before (no regression to the normal-motion path).
  - Open DevTools Performance panel with reduced-motion enabled, record 3 seconds on the Contact section, and confirm there is no recurring `requestAnimationFrame` callback for this component (the call stack should show `draw` firing once, not repeatedly).
- **Done when**: reduced-motion users get a static particle field (not moving, not zero), and normal-motion users see no change from today's behavior.
