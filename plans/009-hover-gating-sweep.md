# 009 — Gate all `:hover` motion behind `(hover: hover) and (pointer: fine)`

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: LOW
- **Category**: Accessibility
- **Estimated scope**: 1 file (`src/index.css`), restructure ~10 rules into one media block

## Problem

`src/index.css` has no `@media (hover: hover) and (pointer: fine)` anywhere. Every `:hover` rule in the file fires on tap on touch devices (browsers synthesize a hover event on first tap), and the hover state can then persist ("stick") until the user taps elsewhere — this affects effectively every hover-animated element in the file:

- `.organic-shape:hover` (line 41)
- `.btn-pop:hover` (line 57)
- `.wavy-text span:hover`, `.wavy-title span:hover` (line 89)
- `.stat-block:hover` (line 116)
- `.hero-section:hover .hero-glow` (line 156)
- `.experience-card:hover` (line 188)
- `.project-card:hover` (line 244)
- `.skill-chip:hover` (line 264)
- `.group:hover .hackathon-parallax-img` (line 438)
- `.pub-card:hover` (line 356)

## Target

Wrap the hover-triggering *rules* (not the base/resting-state rules) in a single `@media (hover: hover) and (pointer: fine)` block, so hover motion only applies on devices that support real hover (mouse/trackpad), and touch devices simply skip straight to tap behavior (click handlers, focus states) with no stuck hover residue.

```css
/* target — append near the end of src/index.css, before the existing
   @media (prefers-reduced-motion: reduce) block */
@media (hover: hover) and (pointer: fine) {
  .organic-shape:hover {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  .btn-pop:hover {
    transform: scale(1.05);
    box-shadow: 4px 4px 0px rgba(196, 171, 1, 1);
  }
  .wavy-text span:hover,
  .wavy-title span:hover {
    transform: translateY(-8px) scale(1.1);
    color: #6b38d4;
  }
  .stat-block:hover {
    transform: scale(1.05) translateY(-4px);
  }
  .stat-block:hover .stat-num {
    animation: pop-bounce 0.5s ease-out;
    display: inline-block;
  }
  .hero-section:hover .hero-glow {
    opacity: 1;
  }
  .experience-card:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    z-index: 20;
  }
  .project-card:hover {
    transform: translate(-12px, -8px) rotate(-1deg);
    box-shadow: 12px 8px 32px rgba(107, 56, 212, 0.15);
  }
  .skill-chip:hover {
    transform: scale(1.05) translateY(-2px) rotate(-1deg);
    box-shadow: 4px 4px 0px rgba(109, 94, 0, 0.2);
  }
  .group:hover .hackathon-parallax-img {
    transform: scale(1.14);
  }
  .pub-card:hover {
    transform: rotateY(-14deg) translateX(6px);
    box-shadow:
      -12px 10px 28px rgba(0, 0, 0, 0.18),
      0 12px 48px rgba(107, 56, 212, 0.15);
  }
  .pub-card:hover::before {
    opacity: 1;
  }
}
```

Then delete each of these `:hover` rules from its *original* location in the file (they move into the new block, they don't get duplicated).

## Repo conventions to follow

- The file already has one media-query block at the very end (`@media (prefers-reduced-motion: reduce) { ... }`, lines 447-474) — add the new `@media (hover: hover) and (pointer: fine)` block immediately before that one, following the same top-level placement convention (media blocks live at the end of the file, after all base rules).
- Base/resting-state rules (e.g. `.organic-shape { border-radius: ...; transition: ...; }`, `.btn-pop` has no base rule, `.experience-card { border-bottom: ...; transition: ...; position: ...; }`) stay exactly where they are — only the `:hover` (and `:hover`-descendant, e.g. `.group:hover .x`) rules move into the gated block. The `transition` declarations on the base rules stay put too (a transition with nothing to trigger it on touch is harmless and inert).

## Steps

1. Add the full `@media (hover: hover) and (pointer: fine) { ... }` block shown in Target immediately before the existing `@media (prefers-reduced-motion: reduce)` block (currently starting at `src/index.css:447`).
2. Remove each individual `:hover` rule from its original location once it's been copied into the new block: `.organic-shape:hover` (line 41-43), `.btn-pop:hover` (line 57-60), `.wavy-text span:hover, .wavy-title span:hover` (line 89-93), `.stat-block:hover` and `.stat-block:hover .stat-num` (lines 116-122), `.hero-section:hover .hero-glow` (line 156-158), `.experience-card:hover` (line 188-192), `.project-card:hover` (line 244-247), `.skill-chip:hover` (line 264-267), `.group:hover .hackathon-parallax-img` (line 438-440), `.pub-card:hover` and `.pub-card:hover::before` (lines 356-364).
3. Leave every non-`:hover` rule (base states, `:active`, `:focus`, keyframes, the existing `prefers-reduced-motion` block) exactly where it is.

## Boundaries

- Do NOT touch any Tailwind `hover:` utility classes in `.tsx` files (e.g. `hover:scale-105` in JSX) — Tailwind has its own way to gate hover (the `hover` variant already compiles to a plain `:hover` selector without a `pointer: fine` guard in this project's config, but changing that is a build-config change, not a CSS-file change, and is out of scope for this plan; only the hand-written `.css` file rules are in scope).
- Do NOT change any of the hover rules' actual property values while moving them — copy them verbatim into the new block.
- Do NOT move the base/resting rules — only the `:hover` selectors change location.
- If any listed line number doesn't match the rule described (drift from other plans landing first), find the rule by its selector text instead and apply the same move.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed. Run the dev server and confirm no CSS parse errors in the browser console.
- **Feel check**:
  - On a real trackpad/mouse (desktop browser), hover every affected element (organic shape, btn-pop buttons, wavy hero text, experience cards, project cards, skill chips, hackathon tile images, publication cards) and confirm every hover effect still works exactly as before.
  - Using Chrome DevTools' device toolbar in touch-emulation mode (or a real phone), tap one of the affected cards and confirm no hover-style visual (lift, shadow, flip) appears or sticks after the tap — only whatever click/focus behavior the element has (e.g. opening a modal) should occur.
  - Confirm `.pub-card:hover::before` (the page-curl gradient) is also gated — check it moved into the block correctly.
- **Done when**: mouse/trackpad hover behavior is unchanged, and touch-emulated taps produce no lingering hover visuals on any of the 10 affected selectors.
