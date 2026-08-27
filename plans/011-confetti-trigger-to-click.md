# 011 — Fire winner-tile confetti on click, not hover

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / Product decision
- **Estimated scope**: 1 file, 1 line

## Decision this plan bakes in

`/review-animations` and `/find-animation-opportunities` both flagged that confetti firing on `onMouseEnter` is triggered by a passive, incidental action (the cursor crossing a tile while scanning a dense grid), not a deliberate one — the existing 1.5s cooldown prevents literal spam but doesn't fix the wrong trigger event. This plan moves the trigger to the click that already opens the tile's modal, so confetti becomes a deliberate-action reward instead of a hover accident. If you'd rather keep hover as the trigger, don't execute this plan.

## Problem

```tsx
// src/sections/HackathonsSection.tsx:41-47 — current
<button
  ref={cardRef as never}
  type="button"
  onMouseEnter={entry.confetti ? onHoverStart : undefined}
  onClick={onOpen}
  className="..."
>
```

`onHoverStart` (aliased from `useDebouncedConfetti`'s `fire`, `src/hooks/useDebouncedConfetti.ts:41`) runs on every `mouseenter`, gated only by a 1.5s cooldown ref. A visitor's cursor can cross a winner tile multiple times while scrolling/reading the grid without ever intending to interact with it.

## Target

Fire confetti from the same click handler that opens the modal, only for entries flagged `entry.confetti`.

```tsx
// src/sections/HackathonsSection.tsx:19-27 — target (function signature/destructure, showing the new combined handler)
function HackathonTile({
  entry,
  index,
  onOpen,
}: {
  entry: HackathonEntry
  index: number
  onOpen: () => void
}) {
  const { cardRef, onHoverStart } = useDebouncedConfetti()
  const isCompact = entry.size === 'square'
  const reduceMotion = useReducedMotion()
  const bgOffset = reduceMotion ? 0 : PARALLAX_OFFSETS[index % PARALLAX_OFFSETS.length]

  const handleOpen = () => {
    if (entry.confetti) onHoverStart()
    onOpen()
  }

  return (
    // ...
```

```tsx
// src/sections/HackathonsSection.tsx:41-47 — target
<button
  ref={cardRef as never}
  type="button"
  onClick={handleOpen}
  className="..."
>
```

(`onHoverStart` keeps its current name from `useDebouncedConfetti` — renaming the destructured binding is optional and out of scope for this plan; the important change is removing `onMouseEnter` and calling the same `fire` function from `handleOpen` instead.)

## Repo conventions to follow

- `useDebouncedConfetti`'s 1.5s cooldown (`COOLDOWN_MS`, `src/hooks/useDebouncedConfetti.ts:4`) stays exactly as-is — it's still useful protection against rapid re-clicks (e.g. double-click), just no longer the primary defense against passive hover-spam since hover is no longer the trigger.
- The `entry.confetti` flag (already read today at `HackathonsSection.tsx:44`) continues to gate which entries celebrate — only the event that checks it changes.

## Steps

1. In `src/sections/HackathonsSection.tsx`, inside `HackathonTile`, add a `handleOpen` function (placed after the existing `const bgOffset = ...` line, before the `return`) that calls `onHoverStart()` when `entry.confetti` is true, then calls `onOpen()`.
2. On the `<button>` element (lines 41-47), remove the `onMouseEnter={entry.confetti ? onHoverStart : undefined}` prop entirely, and change `onClick={onOpen}` to `onClick={handleOpen}`.

## Boundaries

- Do NOT change `useDebouncedConfetti.ts` — the hook's cooldown, particle config, and reduced-motion check are all correct and untouched by this plan.
- Do NOT change which entries have `entry.confetti: true` in `src/data/hackathons.ts` — this plan changes the trigger event, not which tiles celebrate.
- Do NOT remove the existing `cardRef` usage — it's still needed for the confetti origin calculation (`getBoundingClientRect()` inside `fire`).
- If `src/sections/HackathonsSection.tsx:41-47` doesn't match the current-code snippet shown, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Load the site, scroll to Hackathons, and move the mouse across a winner tile (one with `entry.confetti: true`) without clicking — confirm no confetti fires.
  - Click that same tile — confirm confetti fires from the tile's location at the same moment the modal opens.
  - Click a non-confetti tile — confirm the modal opens with no confetti, as before.
  - Click a confetti tile twice in rapid succession (before the modal's close animation would allow a second real interaction) — confirm the 1.5s cooldown still prevents a double-burst.
- **Done when**: confetti only fires on a deliberate click of a winner tile, never on passive hover.
