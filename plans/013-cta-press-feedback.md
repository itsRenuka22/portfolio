# 013 — Add press feedback to the primary CTA buttons

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: (opportunity — additive, not a correction)
- **Category**: Missed opportunity — Feedback
- **Estimated scope**: 2 files, 3 small edits

## Problem

The hero's "View Projects" and "Get in Touch" buttons, and TopNav's "Contact Me" pill, all have hover feedback but nothing that responds to the press itself before the smooth-scroll navigation happens.

```tsx
// src/sections/HomeSection.tsx:233-238 — current
<button
  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
  className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold btn-pop transition-all"
>
  View Projects
</button>
```
```tsx
// src/sections/HomeSection.tsx:239-244 — current
<button
  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
  className="bg-surface-container-lowest text-primary border-2 border-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold hover:scale-105 transition-transform duration-200 shadow-violet-hard"
>
  Get in Touch
</button>
```
```tsx
// src/components/TopNav.tsx:35-40 — current
<button
  onClick={() => onNavigate('contact')}
  className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-bold text-label-bold btn-pop transition-all"
>
  Contact Me
</button>
```

## Target

Add `active:scale-[0.97]` to all three, per the standard press-feedback budget (100-160ms, subtle 0.95-0.98 range). Note: if plan 008 has already run, `transition-all` on the two `btn-pop` buttons will already be `transition-[transform,box-shadow]` — either way, `transform` is already in the animated property list (via `btn-pop`'s own hover transform or `transition-all`), so `active:scale` will animate correctly regardless of which plan lands first.

```tsx
// src/sections/HomeSection.tsx:233-238 — target
<button
  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
  className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold btn-pop transition-all active:scale-[0.97]"
>
  View Projects
</button>
```
```tsx
// src/sections/HomeSection.tsx:239-244 — target
<button
  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
  className="bg-surface-container-lowest text-primary border-2 border-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold hover:scale-105 active:scale-[0.97] transition-transform duration-200 shadow-violet-hard"
>
  Get in Touch
</button>
```
```tsx
// src/components/TopNav.tsx:35-40 — target
<button
  onClick={() => onNavigate('contact')}
  className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-bold text-label-bold btn-pop transition-all active:scale-[0.97]"
>
  Contact Me
</button>
```

## Repo conventions to follow

- `active:scale-95` already exists in this codebase on the TopNav *nav-link* buttons (`src/components/TopNav.tsx:27`, fixed in plan 005) — this plan uses `active:scale-[0.97]` instead (slightly more subtle) since these three buttons are visually larger/more prominent CTAs than the small text nav links; `0.97` stays within the audit's recommended 0.95-0.98 press-feedback range and reads as a lighter touch appropriate to a filled pill button.
- All three buttons already have a `transform`-animating transition in their property list (via `btn-pop`'s hover rule + `transition-all`/`transition-[transform,box-shadow]`, or via `transition-transform` on the second button) — no new `transition` declaration is needed, `active:scale` will use whatever transform-transition duration is already declared (200ms on the "Get in Touch" button; whatever plan 008 leaves the two `btn-pop` buttons at, which should include `transform`).

## Steps

1. In `src/sections/HomeSection.tsx:233-238`, add `active:scale-[0.97]` to the "View Projects" button's className (append after `transition-all`, or after whatever plan 008 has changed it to).
2. In `src/sections/HomeSection.tsx:239-244`, add `active:scale-[0.97]` to the "Get in Touch" button's className, placed after `hover:scale-105` (order doesn't affect Tailwind's output, but keep related utilities grouped for readability).
3. In `src/components/TopNav.tsx:35-40`, add `active:scale-[0.97]` to the "Contact Me" button's className, same placement convention as step 1.

## Boundaries

- Do NOT change the `onClick` scroll behavior, button colors, padding, or any other visual property.
- Do NOT touch the TopNav nav-link buttons (already has `active:scale-95` and is covered by plan 005) — this plan is only the three CTA buttons listed above.
- If any of the three button className strings don't match what's shown (e.g. plan 008 already changed `transition-all`), just add `active:scale-[0.97]` to whatever the current className is — the addition is independent of that other fix.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Click and hold (or use DevTools' `:active` state pinning in the Elements panel) each of the three buttons and confirm a subtle scale-down (~3%) is visible while pressed, releasing back to normal on release.
  - Confirm the existing hover effects (scale-up on "Get in Touch", `.btn-pop` hover scale+shadow on the other two) still work unchanged — the active state should only apply during the actual press, not replace hover.
  - Confirm clicking still navigates to the correct section (scroll behavior unaffected).
- **Done when**: all three buttons visibly compress on press and spring back on release, with no change to their existing hover behavior or click functionality.
