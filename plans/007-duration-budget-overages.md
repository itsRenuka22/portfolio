# 007 — Cap hackathon-tile and publication-card hover durations to the 300ms UI budget

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 2 files, 2 lines

## Problem

Two hover-triggered transforms exceed the 300ms UI ceiling on elements hovered repeatedly while browsing a grid — durations feel sluggish on the second and third hover, not just the first.

```tsx
// src/sections/HackathonsSection.tsx:46 — current
className="group relative flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest text-left shadow-sm grayscale transition-all duration-400 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:grayscale-0 hover:shadow-2xl hover:z-10"
```

```css
/* src/index.css:335-339 — current */
.pub-card {
  transform-origin: left center;
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s ease;
  transform-style: preserve-3d;
  position: relative;
}
```

400ms and 500ms respectively — both well past the 300ms UI ceiling for a hover fired "tens of times" while scanning a grid of tiles/cards.

## Target

Cap both at 250ms (within the "tooltips/small popovers" and comfortably under the ceiling), keeping their existing easing curves unchanged — this is a duration-only fix.

```tsx
/* src/sections/HackathonsSection.tsx:46 — target (duration-400 → duration-250; this line also has its transition-all fixed separately by plan 008 — if plan 008 runs first, apply this duration change to whatever the post-008 transition-property list looks like) */
className="group relative flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest text-left shadow-sm grayscale transition-all duration-250 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:grayscale-0 hover:shadow-2xl hover:z-10"
```

```css
/* src/index.css:335-339 — target */
.pub-card {
  transform-origin: left center;
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.25s ease;
  transform-style: preserve-3d;
  position: relative;
}
```

Note: Tailwind's default `duration-*` scale doesn't include `250` out of the box in some configs — if `duration-250` doesn't produce `250ms` (check the rendered class in DevTools), use the arbitrary-value form `duration-[250ms]` instead.

## Repo conventions to follow

- This codebase already uses bounce/overshoot curves for hover-triggered card lifts as a deliberate stylistic choice (`cubic-bezier(0.34, 1.56, 0.64, 1)` also appears on `.hover-pop` at `src/index.css:311-313`, already at a compliant `0.2s`) — do not change the curve shape, only the duration, to stay consistent with that existing convention.
- `.hover-pop` (`src/index.css:310-319`) is this codebase's exemplar of the same bounce curve at a compliant duration (200ms) — match its cadence, not its exact number, since 200ms vs 250ms is a minor stylistic choice; 250ms was chosen here to stay a comfortable margin under 300ms while changing as little of the felt timing as possible from the original 400/500ms.

## Steps

1. In `src/sections/HackathonsSection.tsx:46`, change `duration-400` to `duration-[250ms]` (using the arbitrary-value form to guarantee the exact value regardless of the Tailwind config's duration scale).
2. In `src/index.css`, in the `.pub-card` rule (lines 335-339), change `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)` to `transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)`, and change `box-shadow 0.4s ease` to `box-shadow 0.25s ease`.
3. Check the `.pub-card::before` rule (`src/index.css:343-355`), which has its own `transition: opacity 0.4s ease;` for the page-curl gradient overlay — align this to `0.25s` too so the overlay fade doesn't visibly lag the now-faster card flip: change `opacity 0.4s ease` to `opacity 0.25s ease`.

## Boundaries

- Do NOT change any easing curve (`cubic-bezier` values) — duration only.
- Do NOT change the hover transform values themselves (`translateY`, `scale`, `rotateY`, `translateX`) — only timing.
- If `src/sections/HackathonsSection.tsx:46` or `src/index.css:335-355` don't match what's shown (e.g. plan 008's `transition-all` fix already landed and changed the property list), locate the `duration-400` / `0.5s` / `0.4s` values by search and apply the same numeric change to whatever the surrounding property list looks like — STOP only if you cannot find these values at all.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Hover a hackathon tile and a publication card repeatedly (move on/off several times quickly) — confirm both now feel snappier and no longer sluggish on repeat hovers.
  - In DevTools Elements panel, inspect the computed `transition-duration` on both elements and confirm they read `0.25s` (or `250ms`).
  - Confirm the publication card's page-curl gradient overlay (`.pub-card::before`) still fades in/out in sync with the card's flip — no visible lag between the two.
- **Done when**: both hover transitions complete in ≤250ms with unchanged curves and transform values.
