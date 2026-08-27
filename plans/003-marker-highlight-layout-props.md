# 003 — Rewrite text marker-highlight to use transform instead of top/left/width/height

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files (1 TSX, 1 CSS), moderate — the highest-effort fix in this plan set

## Problem

The hero's "About Me" paragraphs have a highlighter-style bar that tracks the line of text under the cursor. It's driven by a raw `mousemove` listener doing expensive per-event work, and positions itself via 4 animated layout properties.

```css
/* src/index.css:95-111 — current */
.marker-line-highlight {
  position: absolute;
  background-color: rgba(166, 242, 207, 0.55);
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  transform: scaleX(0);
  transform-origin: left;
  transition:
    top 0.15s ease-out,
    left 0.15s ease-out,
    width 0.15s ease-out,
    height 0.15s ease-out,
    opacity 0.2s ease-out,
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
```

```tsx
// src/sections/HomeSection.tsx:116-183 — current (onMouseMove handler, abridged)
const onMouseMove = (e: MouseEvent) => {
  const caret = getCaretRange(e.clientX, e.clientY)          // synchronous layout read
  // ... text node / paragraph resolution ...
  const lineRange = document.createRange()
  lineRange.selectNodeContents(paragraphEl ?? textNode)
  const fullRects = Array.from(lineRange.getClientRects())    // synchronous layout read
  // ... nearest-line selection, same-line rect merging ...
  const containerRect = container.getBoundingClientRect()      // synchronous layout read
  const top = lineRect.top - containerRect.top
  const left = lineRect.left - containerRect.left
  const lineKey = `${top}:${left}:${lineRect.width}`

  highlight.style.opacity = '1'
  highlight.style.top = `${top}px`        // layout property
  highlight.style.left = `${left}px`      // layout property
  highlight.style.width = `${lineRect.width}px`   // layout property
  highlight.style.height = `${lineRect.height}px` // layout property

  if (lineKey !== currentLineKey) {
    currentLineKey = lineKey
    highlight.style.transition = 'none'
    highlight.style.transform = 'scaleX(0)'
    void highlight.offsetWidth // forced reflow, by design (see below)
    highlight.style.transition = ''
    highlight.style.transform = 'scaleX(1)'
  }
}
```

This runs on every native `mousemove` event (no rAF batching) and performs `caretRangeFromPoint`, `Range.getClientRects()`, and `getBoundingClientRect()` — all synchronous layout reads — then writes 4 layout properties. It is the single most expensive interaction on the page, on the most-hovered element (paragraph text a visitor reads with the mouse resting over it).

Note: the existing `void highlight.offsetWidth` forced reflow (line ~179) is **intentional** — it's the standard "restart a CSS transition/animation from a known state" trick (reset `scaleX(0)` with transitions off, force a style flush, then re-enable transitions and animate to `scaleX(1)`). That specific reflow should be preserved; only the `top`/`left`/`width`/`height` writes and the un-batched event handling are the finding.

## Target

Keep the highlighter's read logic (caret/line detection) exactly as-is — it's necessarily synchronous and correct. Change only:
1. How the computed line box is *applied* to the DOM: batch the write in `requestAnimationFrame`, and position/size via `transform: translate() scaleX() scaleY()` from a fixed 1×1px origin instead of `top`/`left`/`width`/`height`.
2. Keep the CSS `transition` list to `opacity` and `transform` only.

```css
/* src/index.css:95-111 — target */
.marker-line-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background-color: rgba(166, 242, 207, 0.55);
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  transform-origin: left top;
  transition:
    opacity 0.2s ease-out,
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
```

```tsx
// src/sections/HomeSection.tsx — target shape (replace the direct top/left/width/height writes)
// Inside onMouseMove, after `lineRect`/`top`/`left`/`lineKey` are computed exactly as today:

let pendingHighlightRaf = 0 // declare once, above onMouseMove, alongside currentLineKey

const applyHighlight = (top: number, left: number, width: number, height: number, isNewLine: boolean) => {
  highlight.style.opacity = '1'
  if (isNewLine) {
    highlight.style.transition = 'none'
    highlight.style.transform = `translate(${left}px, ${top}px) scaleX(0) scaleY(${height})`
    void highlight.offsetWidth // preserve the existing forced-reflow restart trick
    highlight.style.transition = ''
  }
  highlight.style.transform = `translate(${left}px, ${top}px) scaleX(${width}) scaleY(${height})`
}

// inside onMouseMove, replace the direct style writes with:
cancelAnimationFrame(pendingHighlightRaf)
pendingHighlightRaf = requestAnimationFrame(() => {
  const isNewLine = lineKey !== currentLineKey
  if (isNewLine) currentLineKey = lineKey
  applyHighlight(top, left, lineRect.width, lineRect.height, isNewLine)
})
```

Because `scaleX`/`scaleY` scale from a 1×1px box, `scaleX(width)` and `scaleY(height)` reproduce the original pixel dimensions exactly (a 1px box scaled by `140` is 140px) — this is the same technique the repo's own `transform-origin: left` + `scaleX(0)`→`scaleX(1)` reveal already uses one level up, just extended to also carry width/height instead of the CSS `width`/`height` properties.

## Repo conventions to follow

- The existing `scaleX(0)` → `scaleX(1)` reveal-on-new-line and its `transform-origin: left` are correct and already match this codebase's convention for a growing reveal — extend that exact idea (scale-from-origin) to also cover position and height, rather than inventing a different technique.
- `src/sections/HomeSection.tsx:65-76` (`animateBlob`) is this file's existing exemplar for "compute in the raw handler, apply via rAF, write only `transform`" — mirror that split here: keep the (necessarily synchronous) caret/range reads in `onMouseMove` itself, but move the *DOM write* into an `requestAnimationFrame` callback.

## Steps

1. In `src/index.css`, replace the `.marker-line-highlight` rule (lines 95-111) with the Target version above: add `top: 0; left: 0; width: 1px; height: 1px;`, change `transform-origin: left;` to `transform-origin: left top;`, remove `transform: scaleX(0);` as a static rule (it becomes part of the JS-driven transform string instead), and trim the `transition` list to just `opacity` and `transform`.
2. In `src/sections/HomeSection.tsx`, above the `onMouseMove` declaration inside the highlight effect (the `useEffect` starting at line 94), add a `let pendingHighlightRaf = 0` declaration alongside the existing `let currentLineKey = ''`.
3. Inside `onMouseMove`, keep every line up through where `top`, `left`, and `lineKey` are computed (through the existing line ~166) unchanged. Replace the block that follows (the four `highlight.style.top/left/width/height` writes and the `if (lineKey !== currentLineKey) { ... }` block) with the `cancelAnimationFrame`/`requestAnimationFrame` block and `applyHighlight` helper shown in Target.
4. Add `cancelAnimationFrame(pendingHighlightRaf)` to this effect's cleanup function (the `return () => { ... }` block that currently just removes the two event listeners).
5. In the early-return branches inside `onMouseMove` (the two places that currently do `highlight.style.opacity = '0'; currentLineKey = ''; return`), leave those as direct synchronous writes — they're rare (cursor leaving text entirely) and simple opacity-only, not part of this performance fix.

## Boundaries

- Do NOT change the caret/range detection logic (`getCaretRange`, the nearest-line `verticalDistance` reduction, the same-line rect merging) — that logic is correct and orthogonal to this fix.
- Do NOT remove the `void highlight.offsetWidth` forced-reflow trick — it's required for the scaleX-restart-from-zero effect to replay on each new line.
- Do NOT touch the hero glow effect (lines 78-85) — that's plan 002, a separate fix in the same file.
- If `src/index.css:95-111` or the `onMouseMove` body in `src/sections/HomeSection.tsx` don't match what's described (especially if plan 002 has already changed this file), re-read the current file in full before editing, and STOP if the structure has diverged meaningfully from what's described here.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Load the site, hover the mouse over the "About Me" paragraphs in the hero, and move it across different lines — confirm the mint highlight bar still appears under the line the cursor is on, still grows in from the left (`scaleX` reveal) on each new line, and still fades out when the cursor leaves the text.
  - In DevTools → Rendering panel, enable "Paint flashing" and move the mouse across the paragraphs — confirm no flashing on sibling/ancestor elements (only the highlight bar itself should repaint).
  - In DevTools → Performance panel, record 3 seconds of mouse movement over the paragraph text, and confirm the flame chart shows no "Layout" entries attributed to the highlight's `mousemove` handler (the caret/range reads will still show as script time — that's expected and unavoidable — but there should be no *additional* forced layout from the old `top`/`left`/`width`/`height` writes).
  - Set the DevTools Animations panel playback to 10% and trigger a line change (move from one paragraph line to another) — confirm the bar still scales in from the left edge with no visible jump or double-render.
- **Done when**: the highlight still tracks lines correctly, the reveal-from-left effect is visually unchanged, and the layout-property writes are gone (confirmed via the paint-flashing and Performance-panel checks).
