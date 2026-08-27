# 006 — Replace ProgressRail's width/height dot animation with transform: scale

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, 1 line

## Problem

The scroll-position indicator dots in `ProgressRail` grow when active by swapping Tailwind width/height utility classes, transitioned via `transition-all` — animating `width` and `height` directly, both layout-triggering properties.

```tsx
// src/components/ProgressRail.tsx:19-24 — current
<span
  className={`block rounded-full transition-all duration-300 ${
    isActive ? 'w-3 h-3 bg-primary' : 'w-2 h-2 bg-outline-variant group-hover:bg-primary/60'
  }`}
/>
```

This fires on every scroll-driven active-section change (once per section, every time the user scrolls through the one-page site) — not a one-off, so the layout cost is paid repeatedly per session.

## Target

Keep the dot at a fixed size and scale it up via `transform` when active.

```tsx
// src/components/ProgressRail.tsx:19-24 — target
<span
  className={`block w-2 h-2 rounded-full transition-[transform,background-color] duration-300 ${
    isActive ? 'scale-150 bg-primary' : 'bg-outline-variant group-hover:bg-primary/60'
  }`}
/>
```

`scale-150` (Tailwind's `transform: scale(1.5)`) applied to a `w-2 h-2` (8px) dot renders at 12px when active — the same 8px → 12px growth as the original `w-2 h-2` → `w-3 h-3` swap, but via `transform` instead of `width`/`height`.

## Repo conventions to follow

- This is the same fix pattern as plan 002/003 (layout property → transform) — Tailwind's `scale-*` utilities are the idiomatic way to express this in a codebase that's already all-Tailwind for sizing (see `hover:scale-105`, `active:scale-95` used throughout `TopNav.tsx`, `HomeSection.tsx`).
- `transition-[transform,background-color]` follows the same arbitrary-value convention introduced in plan 005 — use it here too instead of `transition-all`, since only two properties actually change (this also resolves audit finding 008's `transition-all` instance at this location, so do not duplicate that fix separately if plan 008 is executed after this one — see plans/README.md ordering).

## Steps

1. In `src/components/ProgressRail.tsx`, replace the `<span>`'s className (lines 20-23) with the Target version: move `w-2 h-2` to the always-on base classes, replace `transition-all` with `transition-[transform,background-color]`, and replace the `isActive ? 'w-3 h-3 bg-primary' : ...` ternary's size classes with `isActive ? 'scale-150 bg-primary' : ...` (drop `w-3 h-3`, drop the now-redundant `w-2 h-2` from the inactive branch since it's now in the base classes).

## Boundaries

- Do NOT change the tooltip label (`<span className="pointer-events-none absolute ...">`) — it's a separate, already-correct opacity transition, not part of this finding.
- Do NOT change which section is considered "active" or the `SECTIONS` data — this is a pure CSS/className fix.
- If `src/components/ProgressRail.tsx:19-24` doesn't match the current-code snippet above, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Load the site and scroll through each section — confirm the corresponding rail dot still grows and turns primary-colored as it becomes active, with the same ~300ms feel as before.
  - In DevTools Rendering panel, enable "Paint flashing", scroll through sections, and confirm the rail dot's growth no longer triggers a layout-flash on neighboring dots (a `width`/`height` change can shift sibling flex/gap layout; a `transform: scale()` change should not).
  - In DevTools Elements panel, inspect an active dot's computed style and confirm `width`/`height` stay constant (8px) while `transform` shows the scale.
- **Done when**: the dot still visibly grows on activation with no layout-triggering property changes.
