# 012 — Stop the Skills slider auto-advancing once a visitor navigates manually

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / Product decision
- **Estimated scope**: 1 file, small

## Decision this plan bakes in

The Skills category slider auto-advances every 3 seconds indefinitely, only pausing while the pointer/focus is directly on it, then resuming 3 seconds after the pointer/focus leaves. `/review-animations` flagged this as WCAG 2.2.2-adjacent (unprompted, indefinitely-repeating motion with no persistent pause control) and `/find-animation-opportunities` flagged the compounding risk of layering more motion onto something that already repeats this often. This plan keeps autoplay for visitors who never touch the slider (a reasonable default for first-time viewing) but **permanently stops it once the visitor manually navigates** (via the prev/next arrows or by scrolling the slider themselves) — manual interaction is read as "I'll drive from here," and the slider should respect that instead of resuming and yanking them back into automation. If you'd rather remove autoplay entirely, or keep the current always-resume behavior, don't execute this plan.

## Problem

```tsx
// src/sections/SkillsSection.tsx:7-8,38-56 — current
const AUTO_ADVANCE_MS = 3000
const RESUME_DELAY_MS = 3000
// ...
const startAutoAdvance = () => {
  if (reduceMotion) return
  if (autoAdvanceInterval.current) clearInterval(autoAdvanceInterval.current)
  autoAdvanceInterval.current = setInterval(nextSlide, AUTO_ADVANCE_MS)
}

const stopAutoAdvance = () => {
  if (autoAdvanceInterval.current) clearInterval(autoAdvanceInterval.current)
}

const pause = () => {
  stopAutoAdvance()
  if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
}

const resume = () => {
  if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
  resumeTimeout.current = setTimeout(startAutoAdvance, RESUME_DELAY_MS)
}
```

`resume()` is wired to `mouseleave`, `touchend`, and `focusout` (lines 70,72,74) — so any manual interaction (including clicking the prev/next arrows, which don't call `pause`/`resume` themselves but do trigger a `scroll` event) is followed by autoplay resuming 3 seconds after the pointer moves away, with no way for the visitor to opt out short of leaving the section entirely.

## Target

Add a `hasInteracted` flag that manual navigation sets permanently. `resume()` becomes a no-op once that flag is set.

```tsx
// src/sections/SkillsSection.tsx — target (relevant additions/changes only)
const hasInteractedRef = useRef(false)

// ... inside the existing useEffect, alongside pause/resume:
const resume = () => {
  if (hasInteractedRef.current) return
  if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
  resumeTimeout.current = setTimeout(startAutoAdvance, RESUME_DELAY_MS)
}
```

```tsx
// manualNav — target (mark manual interaction and stop autoplay for good)
const manualNav = (dir: 1 | -1) => {
  hasInteractedRef.current = true
  stopAutoAdvanceRef.current?.()
  currentPanel.current = (currentPanel.current + dir + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length
  const panel = panelRefs.current[0]
  if (!panel || !sliderRef.current) return
  const panelWidth = panel.offsetWidth + 32
  sliderRef.current.scrollTo({ left: currentPanel.current * panelWidth, behavior: 'smooth' })
}
```

Since `manualNav` is a separate function outside the `useEffect` that owns `stopAutoAdvance`, the effect needs to expose a stable way for `manualNav` to reach it — the simplest approach without restructuring the component is a ref that the effect assigns itself to on mount:

```tsx
// inside the useEffect, near the other ref declarations at the top of the component:
const stopAutoAdvanceRef = useRef<() => void>(() => {})
// ... after startAutoAdvance/stopAutoAdvance are defined inside the effect:
stopAutoAdvanceRef.current = stopAutoAdvance
```

Also treat a manual *scroll* (the user directly dragging/swiping the slider, detected via the existing `onScroll` handler) as interaction, not just the arrow buttons — but only when the scroll wasn't caused by `nextSlide()`'s own `scrollTo` call. The simplest correct signal is: mark interaction inside `pause()`, since `pause()` already fires on `mouseenter`/`touchstart`/`focusin` — i.e., any time the user's pointer or focus lands on the slider at all, treat that as the moment they've taken over, and stop resuming afterward:

```tsx
// target: fold the "user has taken over" flag into pause() itself, which already
// fires on every manual-interaction entry point (mouseenter, touchstart, focusin) —
// this is simpler and more complete than tracking scroll-origin separately.
const pause = () => {
  hasInteractedRef.current = true
  stopAutoAdvance()
  if (resumeTimeout.current) clearTimeout(resumeTimeout.current)
}
```

With this simpler version, the separate `stopAutoAdvanceRef` plumbing above is unnecessary — `manualNav` doesn't need to touch autoplay state directly at all, since any interaction that reaches the slider (including hovering to click an arrow) already runs through `pause()`. Use this simpler version; the `stopAutoAdvanceRef` sketch above is shown only to explain why the simpler version is sufficient, not as a second thing to implement.

## Repo conventions to follow

- Keep using `useRef` for the new flag, matching how `autoAdvanceInterval`, `resumeTimeout`, and `currentPanel` are already tracked in this component (refs, not state, since none of this needs to trigger a re-render).
- `reduceMotion` (computed once per effect run, line 24) already prevents `startAutoAdvance` from ever starting for reduced-motion users — this plan's change composes with that unchanged; `hasInteracted` only matters for users who have motion enabled.

## Steps

1. In `src/sections/SkillsSection.tsx`, inside the `useEffect` (starting at line 21), add `const hasInteractedRef = useRef(false)` — actually, since refs must be declared at the component's top level (not inside an effect) to persist correctly across effect re-runs and be usable elsewhere if needed, declare it alongside the other `useRef` declarations at the top of the component (near `sliderRef`, `panelRefs`, line 15-19): `const hasInteracted = useRef(false)`.
2. In the `pause` function (currently lines 48-51), add `hasInteracted.current = true` as the first line of the function body.
3. In the `resume` function (currently lines 53-56), add a guard as the first line: `if (hasInteracted.current) return`.
4. Leave `manualNav` (lines 91-97) unchanged — clicking the prev/next arrows doesn't go through `pause`/`resume` today, but hovering the button to click it does fire `mouseenter` on the slider container (the buttons are outside `sliderRef`'s DOM subtree per the JSX structure — check this: `manualNav`'s buttons at lines 123-138 are siblings of `sliderRef`'s div at line 140, not descendants). Since they're siblings, clicking an arrow does **not** trigger the slider's own `mouseenter`. Re-check this at implementation time: if the arrows are confirmed to be outside `sliderRef`, add `hasInteracted.current = true` as the first line of `manualNav` directly (mirroring step 2), since this is the only remaining manual-interaction path not already covered by `pause`.

## Boundaries

- Do NOT change `AUTO_ADVANCE_MS` or `RESUME_DELAY_MS` — timing is unchanged, only whether resume ever fires again after genuine interaction.
- Do NOT change the `reduceMotion` gate — it already fully disables autoplay for reduced-motion users, independent of this fix.
- Do NOT add any visible "autoplay paused" UI in this plan — that's a separate, larger feature; this plan only stops the resume-after-interaction behavior.
- If `src/sections/SkillsSection.tsx`'s `pause`/`resume`/`manualNav` functions don't match what's described (line numbers or logic differ), re-read the whole `useEffect` and `manualNav` before editing, and confirm whether the arrow buttons are inside or outside `sliderRef`'s subtree before deciding whether step 4 is needed.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Load the site, scroll to Skills, and don't touch the slider — confirm it still auto-advances every 3 seconds as before.
  - Hover the slider (or tap it on a touch-emulated device) once, then move the pointer away and wait more than 3 seconds — confirm it does NOT resume auto-advancing.
  - Reload, click a prev/next arrow once, then wait — confirm auto-advance does not resume after that either (verifies step 4's arrow-button coverage).
  - Confirm manual navigation (arrows, drag/swipe) still works correctly regardless of autoplay state.
- **Done when**: any manual interaction with the slider (hover, tap, arrow click, or manual scroll) permanently stops future auto-advancing for that page view, while a visitor who never touches it still sees the original auto-advancing behavior.
