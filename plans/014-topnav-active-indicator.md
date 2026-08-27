# 014 — Add a sliding active-section indicator to TopNav

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: (opportunity — additive, not a correction)
- **Category**: Missed opportunity — State indication
- **Estimated scope**: 1 file, moderate (new layout element + Framer Motion `layoutId`)

## Problem

TopNav shows which section is active only via a text-color swap (`text-primary` vs `text-on-surface-variant`) — there's no spatial link between the nav bar and where the visitor actually is on the page as they scroll.

```tsx
// src/components/TopNav.tsx:20-34 — current
<div className="hidden md:flex gap-gutter items-center">
  {navLinks
    .filter((s) => s.id !== 'contact')
    .map((s) => (
      <button
        key={s.id}
        onClick={() => onNavigate(s.id)}
        className={`font-body-md text-body-md transition-colors hover:scale-105 transition-transform duration-200 active:scale-95 ${
          activeId === s.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        {s.navLabel}
      </button>
    ))}
</div>
```

This state change fires on every scroll-triggered section change (tens of times per session) — per the frequency gate, that means only near-imperceptible, fast motion is eligible; nothing showy.

## Target

Wrap each link in a relatively-positioned container and render one shared underline element with a Framer Motion `layoutId`, so it animates its position between links whenever `activeId` changes — Framer Motion's shared-layout animation handles the transform-based interpolation automatically.

```tsx
// src/components/TopNav.tsx:1-6 — target (add the import)
import { motion } from 'framer-motion'
import { SECTIONS } from '../data/sections'
```

```tsx
// src/components/TopNav.tsx:20-34 — target
<div className="hidden md:flex gap-gutter items-center">
  {navLinks
    .filter((s) => s.id !== 'contact')
    .map((s) => (
      <button
        key={s.id}
        onClick={() => onNavigate(s.id)}
        className={`relative font-body-md text-body-md transition-[color,transform] duration-200 hover:scale-105 active:scale-95 pb-1 ${
          activeId === s.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        {s.navLabel}
        {activeId === s.id && (
          <motion.span
            layoutId="topnav-active-indicator"
            className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-primary"
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
      </button>
    ))}
</div>
```

`pb-1` on the button reserves space for the 2px underline without shifting the text baseline when the indicator is present vs. absent. The `duration: 0.2` (200ms) with `[0.23, 1, 0.32, 1]` is this repo's audit-standard strong `--ease-out` curve — appropriate for a state-indication transition that fires often (near-imperceptible, fast).

## Repo conventions to follow

- This codebase already uses `framer-motion`'s `motion.*` components throughout (every section file) — `motion.span` here follows the same import/usage pattern as e.g. `motion.div` in `HomeSection.tsx`.
- The exact `--ease-out` curve `cubic-bezier(0.23, 1, 0.32, 1)` comes from this skill's own standards reference and matches the curve already used for `whileInView` header entrances (`src/sections/ExperienceSection.tsx:91`, which uses `[0.16, 1, 0.3, 1]` — a close but not identical curve; use `[0.23, 1, 0.32, 1]` as written here since it's the audit's specified token, not the section-entrance one).
- `layoutId` is Framer Motion's mechanism for animating a single shared element between different DOM positions (used for exactly this "moving indicator" pattern) — no manual position math is needed; only one `motion.span` with this `layoutId` should ever be mounted at a time (conditionally rendered only on the active link, as shown), which is what makes Framer Motion treat it as "the same element moving" rather than two elements crossfading.

## Steps

1. In `src/components/TopNav.tsx`, add `import { motion } from 'framer-motion'` as a new import line (this component currently has no framer-motion import).
2. In the nav-link `<button>` (lines 24-32), add `relative` and `pb-1` to the className (before the existing classes), and apply the `transition-[color,transform]` fix from plan 005 if it hasn't already landed (this plan's snippet assumes plan 005 is already applied — if not, apply plan 005's fix as part of this step, since this plan's target snippet depends on it).
3. Inside the `<button>`, after `{s.navLabel}`, add the conditional `<motion.span layoutId="topnav-active-indicator" ...>` shown in Target, rendered only `{activeId === s.id && (...)}`.

## Boundaries

- Do NOT add this indicator to the "RP" logo button or the "Contact Me" button — only the section nav-links (`navLinks.filter((s) => s.id !== 'contact')`) get it.
- Do NOT change how `activeId` is computed (`useActiveSection`, unrelated to this plan) — this plan only visualizes the existing value.
- Do NOT animate the indicator's `width` — the underline should span the full width of each button via `left-0 right-0`, not animate its own width; only its position (via Framer Motion's layout animation, which uses `transform` under the hood) changes between links.
- If plan 005 has not been applied when this plan runs, apply its one-line fix first (see step 2) — this plan's target snippet is written assuming it, and skipping it would reintroduce the conflicting-transition-utilities bug on the same element this plan is modifying.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Load the site and scroll slowly through each section — confirm a thin underline appears beneath the currently-active nav link and slides smoothly to the next link as the active section changes, rather than jumping instantly.
  - Confirm the underline is visible under exactly one link at a time (never zero, never two, during a transition — Framer Motion's `layoutId` handles this by design, but confirm visually).
  - Set DevTools Animations panel playback to 10% during a section change and confirm the underline slides (translates) between positions rather than fading out and back in at the new position.
  - Toggle `prefers-reduced-motion` and confirm the underline still appears under the active link (state indication is preserved) but check whether the slide becomes instant or stays animated — if Framer Motion's `layoutId` doesn't automatically respect `prefers-reduced-motion` in this version, that's acceptable for this feature (a 200ms position change is not the kind of large movement reduced-motion guidance targets), but note this in your implementation report rather than silently assuming.
- **Done when**: the active nav link is spatially indicated by a smoothly-sliding underline that tracks scroll position, with no visual glitches (double indicator, zero indicator, layout shift) during transitions.
