# 008 — Replace `transition: all` / `transition-all` with named properties across 7 sites

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 4 files, 7 small edits

## Problem

Seven rules across the codebase use `transition: all` (CSS) or Tailwind's `transition-all`, animating every property that changes rather than the intended ones — this includes any future property addition, and currently animates non-GPU properties (box-shadow, background-color) alongside transform where a scoped list would be cheaper and clearer.

```css
/* src/index.css:240-241 — current */
.project-card {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```
```css
/* src/index.css:260-261 — current */
.skill-chip {
  transition: all 0.2s ease-in-out;
}
```
```tsx
// src/sections/SkillsSection.tsx:148 — current (relevant excerpt)
className="slider-panel wobble-card bg-surface p-6 shadow-[0_8px_32px_rgba(107,56,212,0.1)] h-80 flex flex-col transition-all duration-300 ease-out hover:scale-105 focus:scale-105 hover:-translate-y-2 focus:-translate-y-2 hover:shadow-2xl focus:shadow-2xl hover:z-50 focus:z-50 active:scale-95 cursor-pointer outline-none"
```
```tsx
// src/sections/HackathonsSection.tsx:46 — current (relevant excerpt)
className="group relative flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest text-left shadow-sm grayscale transition-all duration-400 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:grayscale-0 hover:shadow-2xl hover:z-10"
```
```tsx
// src/sections/HomeSection.tsx:235 — current (relevant excerpt)
className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold btn-pop transition-all"
```
```tsx
// src/components/TopNav.tsx:37 — current (relevant excerpt)
className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-bold text-label-bold btn-pop transition-all"
```
```tsx
// src/sections/ProjectsSection.tsx:57 — current (relevant excerpt)
className={`filter-btn px-6 py-2 rounded-full border-2 border-primary text-primary font-label-bold text-label-bold transition-all duration-200 bg-surface hover:bg-primary-fixed ${...}`}
```

## Target

Each site lists only the properties it actually animates.

```css
/* src/index.css:240-241 — target */
.project-card {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```
(`.project-card:hover` at line 244-247 changes `transform` and `box-shadow` — no other property.)

```css
/* src/index.css:260-261 — target */
.skill-chip {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
```
(`.skill-chip:hover` at line 264-267 changes `transform` and `box-shadow` only.)

```tsx
// src/sections/SkillsSection.tsx:148 — target (relevant excerpt)
className="slider-panel wobble-card bg-surface p-6 shadow-[0_8px_32px_rgba(107,56,212,0.1)] h-80 flex flex-col transition-[transform,box-shadow] duration-300 ease-out hover:scale-105 focus:scale-105 hover:-translate-y-2 focus:-translate-y-2 hover:shadow-2xl focus:shadow-2xl hover:z-50 focus:z-50 active:scale-95 cursor-pointer outline-none"
```
(hover/focus states here only change `transform` (`scale`, `-translate-y-2`) and `shadow-2xl`/`box-shadow`; `z-50` is not animatable and doesn't need a transition entry.)

```tsx
// src/sections/HackathonsSection.tsx:46 — target (relevant excerpt; duration also changes per plan 007 — this plan only fixes the property list, use duration-[250ms] if plan 007 has already run, otherwise duration-400 as a placeholder to be updated by plan 007)
className="group relative flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest text-left shadow-sm grayscale transition-[transform,filter,box-shadow] duration-400 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:grayscale-0 hover:shadow-2xl hover:z-10"
```
(`grayscale`/`hover:grayscale-0` is implemented via the CSS `filter` property in Tailwind, hence `filter` is included; `z-10` is not animatable.)

```tsx
// src/sections/HomeSection.tsx:235 — target
className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-bold text-label-bold btn-pop transition-[transform,box-shadow]"
```

```tsx
// src/components/TopNav.tsx:37 — target
className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-bold text-label-bold btn-pop transition-[transform,box-shadow]"
```
(`.btn-pop:hover` at `src/index.css:57-60` changes only `transform` and `box-shadow` — no base-rule transition exists today, so both usages inherit only from the Tailwind class in their own JSX, which this plan is fixing.)

```tsx
// src/sections/ProjectsSection.tsx:57 — target (relevant excerpt)
className={`filter-btn px-6 py-2 rounded-full border-2 border-primary text-primary font-label-bold text-label-bold transition-[background-color,box-shadow,transform] duration-200 bg-surface hover:bg-primary-fixed ${...}`}
```
(`.filter-btn.active` at `src/index.css:233-238` sets `background-color`, `color`, `box-shadow`, and `transform` — `color` is a text-color swap that doesn't need to be listed since it reads fine as an instant swap here, matching how abruptly the active state is meant to register; if you'd rather animate it too, add `color` to the list — either is acceptable, but do not use `all`.)

## Repo conventions to follow

- `src/components/TopNav.tsx:27` (fixed by plan 005) establishes the `transition-[property,property]` arbitrary-value convention for multi-property Tailwind transitions in this codebase — use the identical syntax here.
- Every property list above was derived by reading each rule's own `:hover`/`:active`/`.active` companion rule and listing exactly what it changes — do the same verification (re-read the paired hover/active rule) before editing each site, in case the code has drifted from what's shown.

## Steps

1. `src/index.css:240-241` (`.project-card`): replace `transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);` with the two-property version shown in Target.
2. `src/index.css:260-261` (`.skill-chip`): replace `transition: all 0.2s ease-in-out;` with the two-property version shown in Target.
3. `src/sections/SkillsSection.tsx:148`: replace `transition-all duration-300` with `transition-[transform,box-shadow] duration-300`.
4. `src/sections/HackathonsSection.tsx:46`: replace `transition-all duration-400` with `transition-[transform,filter,box-shadow] duration-400` (leave the duration number as-is here; plan 007 owns changing it to 250ms — if plan 007 has already run when you execute this plan, keep whatever duration value is currently present, just fix the property list).
5. `src/sections/HomeSection.tsx:235`: replace `transition-all` with `transition-[transform,box-shadow]`.
6. `src/components/TopNav.tsx:37`: replace `transition-all` with `transition-[transform,box-shadow]`.
7. `src/sections/ProjectsSection.tsx:57`: replace `transition-all duration-200` with `transition-[background-color,box-shadow,transform] duration-200`.

## Boundaries

- Do NOT change any duration or easing value in this plan — property-list scoping only. (Plan 007 separately shortens two of these durations; don't pre-empt it here.)
- Do NOT touch any `transition` rule not listed above — this plan's scope is exactly these 7 sites.
- If a listed line's current content doesn't match what's shown here (property list differs, class already fixed, etc.), re-read that specific rule's paired `:hover`/`:active` state to confirm what properties actually change before editing — STOP and report only if you can't determine the set of animated properties from the paired rule.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run build`, and `npm run lint` (oxlint) all succeed with no new warnings.
- **Feel check**:
  - Hover/press each of the 7 affected elements (project card, skill chip, skills slider panel, hackathon tile, both "btn-pop" CTA buttons, project filter button) and confirm each one's hover/active visual behavior is pixel-for-pixel identical to before — this plan changes *which* properties are declared as animatable, not *what* changes on interaction.
  - In DevTools Elements panel, inspect computed `transition-property` on each of the 7 elements and confirm none read `all`.
- **Done when**: all 7 sites have named transition-property lists, and every hover/active interaction looks and times identically to before this change.
