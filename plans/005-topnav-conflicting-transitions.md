# 005 — Fix TopNav's conflicting transition utilities so the color hover actually animates

- **Status**: TODO
- **Commit**: bf245a3
- **Severity**: MEDIUM
- **Category**: Correctness (Performance/Easing category in audit terms)
- **Estimated scope**: 1 file, 1 line

## Problem

Each nav link in `TopNav` applies two Tailwind transition utilities to the same element: `transition-colors` and `transition-transform`.

```tsx
// src/components/TopNav.tsx:24-32 — current
<button
  key={s.id}
  onClick={() => onNavigate(s.id)}
  className={`font-body-md text-body-md transition-colors hover:scale-105 transition-transform duration-200 active:scale-95 ${
    activeId === s.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
  }`}
>
  {s.navLabel}
</button>
```

Both `transition-colors` and `transition-transform` are Tailwind shorthands that set the CSS `transition-property` value directly (`transition-colors` → `color, background-color, border-color, ...`; `transition-transform` → `transform`). Since they target the same CSS property, whichever class wins Tailwind's cascade order applies — in practice only `transform` ends up transitioned; the `hover:text-primary` color change on inactive links snaps instantly instead of fading, which contradicts the visible intent (`transition-colors` was clearly meant to apply).

## Target

Use one Tailwind utility that explicitly lists both properties, so both actually transition together.

```tsx
// src/components/TopNav.tsx:24-32 — target
<button
  key={s.id}
  onClick={() => onNavigate(s.id)}
  className={`font-body-md text-body-md transition-[color,transform] duration-200 hover:scale-105 active:scale-95 ${
    activeId === s.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
  }`}
>
  {s.navLabel}
</button>
```

`transition-[color,transform]` is Tailwind's arbitrary-value syntax for `transition-property: color, transform;` — a single utility, no conflict, one `duration-200` applies to both.

## Repo conventions to follow

- This codebase already uses Tailwind's arbitrary-value bracket syntax elsewhere for one-off values (e.g. `shadow-[0_8px_32px_rgba(107,56,212,0.1)]` in `src/sections/SkillsSection.tsx:148`) — `transition-[color,transform]` follows the same convention, not a new pattern.
- Per the audit's easing guidance, hover/color changes should use `ease` (the default Tailwind transition-timing-function, which this rule doesn't override) — leave the timing function as Tailwind's default; only the `transition-property` conflict is being fixed here.

## Steps

1. In `src/components/TopNav.tsx`, in the nav-link `<button>`'s `className` (line 27), replace `transition-colors` and `transition-transform` with `transition-[color,transform]`, keeping `duration-200` immediately after it.

## Boundaries

- Do NOT change `hover:scale-105`, `active:scale-95`, or the `activeId === s.id` conditional classes — only the transition-property declaration changes.
- Do NOT touch the "RP" logo button or the "Contact Me" button in this same file — this finding is specific to the nav-link `<button>` that has the conflicting utilities.
- If the className string in `src/components/TopNav.tsx:27` doesn't contain both `transition-colors` and `transition-transform` as written above, STOP and report — the conflict may already be resolved or the code may have changed shape.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed. Run `npm run lint` (oxlint) and confirm no new warnings.
- **Feel check**:
  - Load the site at a viewport ≥768px (so the nav links are visible), hover over an inactive nav link (e.g. "Experience" while on the Home section), and confirm the text color now visibly fades to primary over ~200ms rather than snapping instantly.
  - Confirm the existing `hover:scale-105` / `active:scale-95` transform behavior is unchanged (same subtle scale-up on hover, scale-down on press).
  - In DevTools Elements panel, inspect the computed `transition-property` on a nav link and confirm it now reads `color, transform` (previously it would have shown only `transform`).
- **Done when**: hovering a nav link visibly fades both its color and its scale together, confirmed via the computed-style check.
