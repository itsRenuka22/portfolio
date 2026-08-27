# 015 — Add press feedback to remaining interactive elements (slider arrows, external links, modal close)

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: (opportunity — additive, not a correction)
- **Category**: Missed opportunity — Feedback
- **Estimated scope**: 5 files, 8 small edits

## Problem

Several clickable elements across the site have hover feedback but nothing for the press itself: the Skills category prev/next arrows, the external "Code"/"View" links on project cards, the "Read Paper" link on publication cards, the "View Repo" link and contact/social links, and the hackathon modal's close button.

```tsx
// src/sections/SkillsSection.tsx:124-137 — current (both arrow buttons, same pattern)
<button
  onClick={() => manualNav(-1)}
  aria-label="Previous category"
  className="p-2 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors shadow-sm"
>
```
```tsx
// src/sections/ProjectsSection.tsx:124-133,134-143 — current (Code/View links)
<a
  className="text-primary font-label-bold text-label-bold flex items-center gap-1 hover:text-primary-container transition-colors"
  href={project.github}
  ...
>
```
```tsx
// src/sections/PublicationsSection.tsx:36-43 — current (Read Paper link)
<a
  className="text-primary font-label-bold text-label-bold flex items-center gap-2 hover:text-primary-container transition-colors"
  href={pub.link}
  ...
>
```
```tsx
// src/sections/HackathonsSection.tsx:134-143 — current (modal close button)
<button
  type="button"
  onClick={onClose}
  className="group rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-variant"
  aria-label="Close"
>
```
```tsx
// src/sections/ContactSection.tsx:64-79 — current (contact detail links) and 90-101 (social links)
<motion.a
  key={detail.label}
  variants={itemVariants}
  href={detail.href}
  className="flex items-center gap-4 group cursor-pointer"
>
```

## Target

Add `active:scale-[0.97]` (or `active:opacity-70` for full-width row-style links where a scale would look odd) to each, with a matching `transform`/`opacity` transition declared alongside the existing `transition-colors`.

```tsx
// src/sections/SkillsSection.tsx:124-137 — target
<button
  onClick={() => manualNav(-1)}
  aria-label="Previous category"
  className="p-2 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary active:scale-90 transition-[color,background-color,transform] shadow-sm"
>
```
(same change for the "Next category" button)

```tsx
// src/sections/ProjectsSection.tsx:124-133 — target
<a
  className="text-primary font-label-bold text-label-bold flex items-center gap-1 hover:text-primary-container active:scale-[0.97] transition-[color,transform]"
  href={project.github}
  ...
>
```
(same change for the "View" link at lines 134-143)

```tsx
// src/sections/PublicationsSection.tsx:36-43 — target
<a
  className="text-primary font-label-bold text-label-bold flex items-center gap-2 hover:text-primary-container active:scale-[0.97] transition-[color,transform]"
  href={pub.link}
  ...
>
```

```tsx
// src/sections/HackathonsSection.tsx:134-143 — target
<button
  type="button"
  onClick={onClose}
  className="group rounded-full p-2 text-on-surface-variant active:scale-90 transition-[color,background-color,transform] hover:bg-surface-variant"
  aria-label="Close"
>
```

```tsx
// src/sections/ContactSection.tsx:64-79 — target (contact detail links: full-width row, use opacity instead of scale)
<motion.a
  key={detail.label}
  variants={itemVariants}
  href={detail.href}
  className="flex items-center gap-4 group cursor-pointer active:opacity-70 transition-opacity"
>
```
```tsx
// src/sections/ContactSection.tsx:90-101 — target (social links: also full-width rows)
<motion.a
  key={social.label}
  variants={itemVariants}
  className={`wobble-box bg-surface-container-high p-4 flex items-center justify-between active:opacity-70 transition-[color,opacity] duration-300 ${social.hoverBg}`}
  href={social.href}
  ...
>
```

## Repo conventions to follow

- `active:scale-90` on small icon-only buttons matches this codebase's existing precedent at `TopNav.tsx:27`'s `active:scale-95` for compact nav elements — `90` (a slightly stronger press) is used here since these are small square icon buttons (arrows, close button) where a more visible compression reads better than on text links.
- `active:scale-[0.97]` on inline text links matches the CTA-button convention from plan 013 — a subtle press.
- `active:opacity-70` on the two full-row Contact links avoids a scale transform looking odd on a wide flex row (scaling a whole row from its center can visually "pinch" in a way that doesn't read as press feedback) — opacity dimming is the standard alternative for this shape of element.
- Every `transition-colors` in this plan becomes `transition-[color,...]` (or `transition-[color,background-color,transform]` where a background-color hover also exists) rather than adding a second, conflicting Tailwind transition utility — this follows the exact fix pattern from plan 005, applied proactively here instead of introducing the same bug plan 005 fixed elsewhere.

## Steps

1. `src/sections/SkillsSection.tsx:124-130` and `:131-137` (both arrow buttons): add `active:scale-90` and change `transition-colors` to `transition-[color,background-color,transform]`.
2. `src/sections/ProjectsSection.tsx:124-133` and `:134-143` (Code/View links): add `active:scale-[0.97]` and change `transition-colors` to `transition-[color,transform]`.
3. `src/sections/PublicationsSection.tsx:36-43` (Read Paper link): add `active:scale-[0.97]` and change `transition-colors` to `transition-[color,transform]`.
4. `src/sections/HackathonsSection.tsx:134-143` (modal close button): add `active:scale-90` and change `transition-colors` to `transition-[color,background-color,transform]`.
5. `src/sections/ContactSection.tsx:64-79` (each contact detail link): add `active:opacity-70` and change the (currently absent, inherited from nothing — check current classes) transition to include `transition-opacity`. Re-read the current className before editing: if no transition utility exists today on this element, add `transition-opacity` fresh rather than assuming one to modify.
6. `src/sections/ContactSection.tsx:90-101` (each social link): add `active:opacity-70` and change `transition-colors duration-300` to `transition-[color,opacity] duration-300`.

## Boundaries

- Do NOT add press feedback to the icon circles inside contact detail links (the `w-12 h-12` rounded icon backgrounds at `ContactSection.tsx:70-74`) — those already have `group-hover:scale-110 transition-transform` tied to the parent link's hover, and adding a separate active state to the icon specifically (vs. the whole row) would be visually redundant with the row-level `active:opacity-70` added in step 5.
- Do NOT change any `href`, `onClick`, or navigation behavior — className-only changes throughout this plan.
- Do NOT touch the primary CTA buttons (hero/TopNav) — those are plan 013's scope, not this one.
- If any listed element's current className doesn't match what's shown, re-read that specific file section before editing and apply the same `active:*` + transition-property pattern to whatever the current classes are — STOP only if the element itself (by its `aria-label`, `href`, or surrounding text) can't be located at all.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed. Run `npm run lint`.
- **Feel check**:
  - Press-and-hold (or DevTools `:active` pinning) each of the following and confirm a visible, subtle press response: Skills prev/next arrows (scale down), Project card Code/View links (scale down), Publication Read Paper link (scale down), Hackathon modal close button (scale down), Contact detail rows and social link rows (dim slightly).
  - Confirm all existing hover behavior (color changes, background changes, icon scale on contact rows) is unchanged.
  - Confirm no element's text/icon appears to "jump" or reflow when the active state applies — scale/opacity changes should be smooth, not layout-shifting.
- **Done when**: every element listed above visibly responds to being pressed, with no regressions to existing hover states or click functionality.
