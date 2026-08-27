# 010 — Convert scroll-parallax from Framer Motion `y` shorthand to a full transform string

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: HIGH
- **Category**: Performance / Product decision
- **Estimated scope**: 4 files, ~9 small edits

## Decision this plan bakes in

The `/review-animations` pass found that continuous scroll-linked parallax (`useSectionParallax`/`useParallaxOffset`) is live in four sections (Home, Experience, Skills, Contact) — contradicting an earlier assumption that it had been removed. Two options were on the table: remove it, or keep it and fix its performance issue. **This plan keeps it** (least destructive — it's elaborately wired with per-element offsets and a documented rationale for *not* using it elsewhere (`HackathonsSection.tsx:7-10`), suggesting it was a deliberate choice for these four sections specifically) and fixes the one real defect: it's implemented with Framer Motion's `y` shorthand, which is not hardware-accelerated. If you'd rather remove parallax from some or all of these sections instead, don't execute this plan — say so and a removal plan can be written instead.

## Problem

Four sections drive continuous, scroll-linked motion through `style={{ y: someMotionValue }}` on a `motion.div`. Framer Motion's `x`/`y`/`scale` shorthand props are not hardware-accelerated — they're computed and applied via the main thread on every scroll frame, competing with everything else running during scroll (four separate `useScroll`/`useSpring` instances, active simultaneously once all sections are mounted, since `App.tsx` renders all seven sections at once).

```tsx
// src/sections/HomeSection.tsx:205-214 — current
<motion.div
  className="hero-parallax-blob hero-parallax-blob-a"
  style={{ y: blobAY }}
  aria-hidden="true"
/>
<motion.div
  className="hero-parallax-blob hero-parallax-blob-b"
  style={{ y: blobBY }}
  aria-hidden="true"
/>
```
(same file also has `style={{ y: textY }}` at line 217 and `style={{ y: photoY }}` at line 279)

```tsx
// src/sections/ExperienceSection.tsx:14-22 — current
<motion.div
  style={{ y: dotY }}
  className={`w-4 h-4 rounded-full mt-2 ${...}`}
/>
...
<motion.div className="flex-1" style={{ y: contentY }}>
```

```tsx
// src/sections/SkillsSection.tsx:105 — current
<motion.div className="absolute inset-0 overflow-hidden" style={{ y: textureY }} aria-hidden="true">
```

```tsx
// src/sections/ContactSection.tsx:45,49 — current
<motion.div className="contact-parallax-bg animated-gradient-bg absolute inset-0" style={{ y: bgY }}>
  ...
</motion.div>
...
<motion.div className="relative" style={{ y: cardY }}>
```

## Target

Framer Motion supports passing a `MotionValue` directly into a template-literal `transform` string via `useTransform`/`useMotionTemplate`, or — more simply for this codebase, since these are one-axis translations with no other transform on the same element — using `style={{ transform: someMotionValue.to((v) => \`translateY(${v}px)\`) }}` is not the idiomatic Framer Motion v13 API. The correct, idiomatic fix in this version is `useMotionTemplate`:

```tsx
// pattern to apply at every call site listed above
import { motion, useMotionTemplate } from 'framer-motion'
// ...
const blobATransform = useMotionTemplate`translateY(${blobAY}px)`
// ...
<motion.div
  className="hero-parallax-blob hero-parallax-blob-a"
  style={{ transform: blobATransform }}
  aria-hidden="true"
/>
```

`useMotionTemplate` composes one or more `MotionValue`s into a single hardware-accelerated `transform` string that Framer Motion updates directly via `element.style.transform`, bypassing the non-accelerated `x`/`y`/`scale` shorthand path entirely.

## Repo conventions to follow

- `useParallaxOffset` (`src/hooks/useSectionParallax.ts:27-31`) is the shared source of every one of these `MotionValue`s — it does not need to change; only the JSX call sites that consume its return value change, from `style={{ y: value }}` to `style={{ transform: useMotionTemplate\`translateY(${value}px)\` }}`.
- Every element in this fix has exactly one axis of motion (vertical) and no other simultaneous transform (no rotation/scale on these specific elements) — confirm this for each site before applying the pattern; if a site turns out to also need a static transform (none currently do, based on the code read for this plan), compose it inside the same template literal, e.g. `` `translateY(${v}px) rotate(-1deg)` ``.

## Steps

1. In `src/sections/HomeSection.tsx`: add `useMotionTemplate` to the `framer-motion` import (line 2). For each of the four parallax values (`blobAY`, `blobBY`, `textY`, `photoY`, declared lines 32-35), add a corresponding `useMotionTemplate` call directly below its declaration, e.g. `const blobATransform = useMotionTemplate\`translateY(${blobAY}px)\``. Update the four `motion.div` elements at lines 205-214, 217, and 279 to use `style={{ transform: blobATransform }}` (and the matching name for each) instead of `style={{ y: ... }}`.
2. In `src/sections/ExperienceSection.tsx`: add `useMotionTemplate` to the import (line 1). Below `dotY`/`contentY` (lines 8-9), add `const dotTransform = useMotionTemplate\`translateY(${dotY}px)\`` and `const contentTransform = useMotionTemplate\`translateY(${contentY}px)\``. Update the two `motion.div`s (lines 14-19 and 22) to use `style={{ transform: dotTransform }}` / `style={{ transform: contentTransform }}`.
3. In `src/sections/SkillsSection.tsx`: add `useMotionTemplate` to the import (line 2). Below `textureY` (line 13), add `const textureTransform = useMotionTemplate\`translateY(${textureY}px)\``. Update the `motion.div` at line 105 to `style={{ transform: textureTransform }}`.
4. In `src/sections/ContactSection.tsx`: add `useMotionTemplate` to the import (line 1). Below `bgY`/`cardY` (lines 36-37), add `const bgTransform = useMotionTemplate\`translateY(${bgY}px)\`` and `const cardTransform = useMotionTemplate\`translateY(${cardY}px)\``. Update the two `motion.div`s (lines 45 and 49) to use `style={{ transform: bgTransform }}` / `style={{ transform: cardTransform }}`.

## Boundaries

- Do NOT change `src/hooks/useSectionParallax.ts` — the hook's return values (`MotionValue<number>`) are exactly what `useMotionTemplate` needs to consume; no change needed there.
- Do NOT change the parallax distances (the second argument to `useParallaxOffset`, e.g. `-60`, `80`, `24`, `44`) — felt motion range is unchanged, only the underlying mechanism.
- Do NOT touch `HackathonsSection.tsx`'s settle-in drift effect (`PARALLAX_OFFSETS`, lines 7-54) — it already uses Framer Motion's `initial`/`whileInView`/`transition` props (a one-time animation, not a continuous scroll-linked `MotionValue`), which is a different mechanism not affected by this finding, and its code comment explicitly documents why it deliberately avoids continuous parallax — that's a settled decision, leave it exactly as-is.
- If plans 002 or 003 have already modified `HomeSection.tsx`'s effect blocks, re-read the current file before editing — the parallax `motion.div`s (lines 205-291) are in the JSX return, separate from the mousemove effects those plans touch, so conflicts should be minimal, but confirm line numbers before editing.
- If any of the four files' current code doesn't match what's shown here, STOP and report rather than guessing at the current shape.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed (this introduces a new named import, `useMotionTemplate`, from the already-installed `framer-motion` package — confirm it resolves with no type errors).
- **Feel check**:
  - Scroll through Home, Experience, Skills, and Contact sections and confirm every parallax-driven element (hero blobs, hero text, hero photo, experience timeline dot + card, skills texture background, contact gradient background + card) still shifts with scroll position exactly as before — same direction, same apparent range.
  - In DevTools → Rendering panel, enable "Paint flashing", scroll slowly through each of these four sections, and confirm the parallax elements composite (a `transform`-only change should not trigger layout/paint flashing on the element itself beyond compositing).
  - In DevTools → Performance panel, record a scroll pass through all four sections and compare the "Main" thread activity during scroll to a pre-fix recording if available — confirm no "Recalculate Style" / "Layout" entries attributed to these specific elements.
  - Toggle `prefers-reduced-motion` in DevTools Rendering panel and confirm all four sections' parallax collapses to no movement (this is handled inside `useParallaxOffset` already, unchanged by this plan — just confirm it still works after the transform-string change).
- **Done when**: parallax motion is visually identical to before, and Performance-panel recordings during scroll show no layout cost attributable to these elements.
