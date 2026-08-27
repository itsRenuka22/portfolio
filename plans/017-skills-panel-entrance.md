# 017 — Add a one-time entrance to Skills category panels

- **Status**: TODO
- **Commit**: 7cf21d9
- **Severity**: (opportunity — additive)
- **Category**: Missed opportunity — Preventing a jarring change / group entrance
- **Estimated scope**: 1 file (`SkillsSection.tsx`), small — kept separate from plan 016 specifically because of the frequency-guard reasoning below

## Problem

The Skills category panels (`SkillsSection.tsx:148-177`) render as plain `<div>`s with zero entrance animation — they simply exist, unlike every other repeated-item group on the site (Experience rows, Hackathon tiles, Publication cards all have entrances; see plan 016 for Experience/Projects/Home).

```tsx
// src/sections/SkillsSection.tsx:147-178 — current
<div ref={sliderRef} className="slider-container flex gap-8 pb-12 pt-8 px-4 -mx-4">
  {SKILL_CATEGORIES.map((cat, i) => (
    <div
      key={cat.name}
      ref={(el) => {
        panelRefs.current[i] = el
      }}
      tabIndex={0}
      className="slider-panel wobble-card bg-surface p-6 shadow-[0_8px_32px_rgba(107,56,212,0.1)] h-80 flex flex-col transition-[transform,box-shadow] duration-300 ease-out hover:scale-105 focus:scale-105 hover:-translate-y-2 focus:-translate-y-2 hover:shadow-2xl focus:shadow-2xl hover:z-50 focus:z-50 active:scale-95 cursor-pointer outline-none"
    >
      ...
    </div>
  ))}
</div>
```

This section is **not** a simple "add `whileInView`" case like the others, for one reason that must be handled deliberately: all 8 category panels (`SKILL_CATEGORIES.length === 8`) sit in the DOM simultaneously inside a horizontally-scrolling `.slider-container` (`overflow-x: auto`). Only the first panel (and a sliver of the second) sits within the horizontal viewport bounds when the section first scrolls into view — the rest only become geometrically visible later, when the carousel's autoplay (`nextSlide()`, firing every `AUTO_ADVANCE_MS` = 3000ms, `SkillsSection.tsx:35-38,43`) or a manual nav click (`manualNav()`, `SkillsSection.tsx:95-104`) scrolls them into view.

**This is fine, not a violation** — and the reasoning matters for whoever executes this plan: Framer Motion's `viewport={{ once: true }}` is tracked **per element**, not globally. Each panel's own entrance fires exactly once, the first time *that panel* becomes geometrically visible in the viewport — whether that first visibility happens via the initial vertical scroll into the section (panel 0) or via a later autoplay/manual horizontal reveal (panels 1–7). Once a given panel has played its entrance, `once: true` guarantees it can never replay for that panel again — including on a later autoplay loop that scrolls back around to it. So per-panel `whileInView` naturally satisfies "never re-trigger for something already seen" without needing a separate global gate.

A **global** "only animate during the very first section-arrival, then disable entrances forever" gate was considered and rejected: with 8 panels and only ~1.5 visible at a time, a global gate would close before panels 1–7 ever had a chance to render with any entrance at all (since by the time autoplay reveals them, the global "entrance window" would already be shut) — that defeats the actual goal (each category should feel like it settles in as it's revealed), and produces *fewer* animated moments than doing nothing.

## Target

Convert each panel `<div>` to a `motion.div` with a per-panel one-time `whileInView` entrance, gated for reduced motion:

```tsx
// src/sections/SkillsSection.tsx — add near the top of the component,
// alongside the existing refs (this is a *different* reduced-motion check
// than the one inside the effect at line 26, which gates the autoplay
// interval — this one gates the JSX entrance and must be readable at render time)
const reduceMotion = useReducedMotion()
const panelY = reduceMotion ? 0 : 16
```

```tsx
// src/sections/SkillsSection.tsx:147-178 — target
<div ref={sliderRef} className="slider-container flex gap-8 pb-12 pt-8 px-4 -mx-4">
  {SKILL_CATEGORIES.map((cat, i) => (
    <motion.div
      key={cat.name}
      ref={(el) => {
        panelRefs.current[i] = el
      }}
      tabIndex={0}
      initial={{ opacity: 0, y: panelY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="slider-panel wobble-card bg-surface p-6 shadow-[0_8px_32px_rgba(107,56,212,0.1)] h-80 flex flex-col transition-[transform,box-shadow] duration-300 ease-out hover:scale-105 focus:scale-105 hover:-translate-y-2 focus:-translate-y-2 hover:shadow-2xl focus:shadow-2xl hover:z-50 focus:z-50 active:scale-95 cursor-pointer outline-none"
    >
      ...
    </motion.div>
  ))}
</div>
```

No `delay`/index-based stagger here, deliberately: unlike Experience/Hackathons/Publications (where every item is visible simultaneously and a stagger creates one coordinated cascade), these panels each become visible at *different times* (seconds apart, driven by the carousel) — an index-based delay would either be meaningless (for panels revealed long after the delay window has passed) or would introduce a perceptible lag between a panel scrolling into view and its entrance starting for the panels revealed early. Each panel animates immediately upon its own visibility instead.

`viewport={{ amount: 0.4 }}` (rather than the `0.2`/`0.3` used elsewhere) is intentional: since panels enter horizontally via a fast smooth-scroll (not a slow vertical scroll), a lower threshold could fire the entrance while a panel is still mostly off-screen mid-scroll, when it would still look like it's arriving from the side; `0.4` waits until slightly more of the panel is settled in view.

`transition-[transform,box-shadow]` on the same element already handles the *hover/focus* transform (`hover:scale-105`, etc.) — that's unrelated to and unaffected by adding `whileInView`'s own `initial`/`animate` transform (`y`), since Framer Motion merges its own animated `transform` with whatever the CSS hover rules apply on top, the same way it already coexists with the plain CSS `transition` property on this element today.

## Repo conventions to follow

- `[0.16, 1, 0.3, 1]` is this repo's established entrance curve (see plan 016's citation of `ExperienceSection.tsx:93`) — reused here, not approximated.
- `useReducedMotion` (from `framer-motion`) is the same hook plan 016 introduces to `HomeSection.tsx`/`ExperienceSection.tsx`/`ProjectsSection.tsx` for this exact purpose — add it to this file too rather than reusing the existing `window.matchMedia` check inside the `useEffect` (that one is scoped to the effect and governs autoplay start/stop, not render-time JSX values).
- Panel duration `0.4s` sits between the Hackathon tile's `0.6s` group-entrance and a small popover's `125-200ms` — chosen because these panels are mid-sized cards revealed one at a time (not a whole-page arrival moment like Home, not a small icon), and a snappier fade suits a carousel that's already moving on its own cadence.

## Steps

1. In `src/sections/SkillsSection.tsx`, add `useReducedMotion` to the existing `framer-motion` import (`import { motion, useMotionTemplate } from 'framer-motion'` → `import { motion, useMotionTemplate, useReducedMotion } from 'framer-motion'`).
2. Inside the component body, add `const reduceMotion = useReducedMotion()` and `const panelY = reduceMotion ? 0 : 16` near the top, alongside the existing `textureY`/`textureTransform` declarations.
3. Convert the panel `<div>` at line 149 to `<motion.div>`, keeping the existing `key`, callback `ref`, `tabIndex`, and `className` exactly as they are, and adding `initial={{ opacity: 0, y: panelY }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.4 }}`, `transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}`.
4. Do not add any `delay` or index-based stagger to this element — see Target above for why.

## Boundaries

- Do NOT touch the autoplay/manual-nav logic (`nextSlide`, `startAutoAdvance`, `stopAutoAdvance`, `pause`, `resume`, `manualNav`, the `hasInteracted` guard) — none of it needs to change for this plan; the per-panel `viewport={{ once: true }}` already provides the correct "never replay" guarantee without touching any of this carousel state.
- Do NOT add a stagger delay to the panel entrance — deliberately omitted, see Target.
- Do NOT change the skill-chip rendering (`SkillsSection.tsx:166-175`) — chips inside each panel should not get their own separate entrance (already rejected in the `find-animation-opportunities` report: dense, frequently-rescanned content, and they ride in with their parent panel).
- Do NOT change the section-level `textureTransform` parallax (`SkillsSection.tsx:14`) — unrelated, already correct.
- If `SkillsSection.tsx:147-178` doesn't match what's shown here (structure has drifted since this plan was written, e.g. if plan 016 or an unrelated change touched this file), re-read the file in full before editing, and STOP if the panel-rendering structure has diverged meaningfully.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Reload the site, scroll down to Skills, and confirm the first category panel fades + slides up as the section arrives.
  - Wait through 2-3 autoplay cycles (9+ seconds) without touching the slider, and confirm each newly-revealed panel also fades + slides up the first time it scrolls into view — and that a panel which has already played its entrance does **not** replay it if the carousel loops back around to it later.
  - Click the manual prev/next arrows to jump between panels and confirm the same one-time-per-panel behavior holds for manually-triggered reveals too.
  - Toggle `prefers-reduced-motion` in DevTools' Rendering panel, reload, and confirm panels still fade in (opacity) but do not slide (`panelY` resolves to `0`).
  - Confirm the panels' existing hover/focus lift (`hover:scale-105`, `hover:-translate-y-2`, etc.) and the existing `active:scale-95` press feedback both still work exactly as before — the new `whileInView` props must not interfere with the CSS-driven hover/active states.
- **Done when**: every panel gets exactly one entrance, the very first time it becomes visible (whether via section-arrival, autoplay, or manual nav), never replays after that, and reduced motion drops the slide while keeping the fade.
