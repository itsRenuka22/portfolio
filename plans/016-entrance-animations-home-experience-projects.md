# 016 — Add arrival entrances to Home hero, Experience rows, and fix Projects' mount-timing bug

- **Status**: TODO
- **Commit**: 7cf21d9
- **Severity**: (opportunity — additive, plus one moment-correction; not a craft regression)
- **Category**: Missed opportunity — Preventing a jarring change / group entrance
- **Estimated scope**: 3 files (`HomeSection.tsx`, `ExperienceSection.tsx`, `ProjectsSection.tsx`), no shared files between them — safe to execute in any order or in parallel

## Problem

Three separate but related gaps, all found by `/find-animation-opportunities`:

**1. Home hero (`HomeSection.tsx:220-337`)** — the entire hero (name, title, about paragraphs, both CTAs, the education cards, and the photo) renders with zero entrance. Only continuous scroll-parallax transforms exist (`textTransform`, `photoTransform`, `blobATransform`, `blobBTransform` — see `HomeSection.tsx:36-39`). Since this is the first section a visitor sees, everything simply appears instantly on page load.

```tsx
// src/sections/HomeSection.tsx:238-296 — current (abridged, showing the structure that needs per-child entrances)
<motion.div className="md:col-span-7 flex flex-col gap-3 z-10 relative" style={{ transform: textTransform }}>
  <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface cursor-default leading-tight text-balance">
    <WavyText text="Renuka Prasad Patwari" className="wavy-text" />
  </h1>
  <h2 className="font-headline-md text-headline-md text-primary relative z-10 cursor-default text-balance">
    <WavyText text="Software Engineer & AI Systems Builder" className="wavy-title" />
  </h2>
  <div ref={aboutRef} className="cursor-default flex flex-col gap-1.5 relative z-10 max-w-2xl">
    <div ref={lineHighlightRef} className="marker-line-highlight" />
    {ABOUT_PARAGRAPHS.map((paragraph, i) => (
      <p key={i} className="font-body-md text-body-md text-on-surface-variant leading-snug text-pretty">
        {paragraph}
      </p>
    ))}
  </div>
  <div className="flex flex-wrap gap-4 mt-1 relative z-10">
    <button onClick={...} className="... btn-pop transition-[transform,box-shadow] active:scale-[0.97]">View Projects</button>
    <button onClick={...} className="... hover:scale-105 active:scale-[0.97] transition-transform duration-200 shadow-violet-hard">Get in Touch</button>
  </div>
  <div className="mt-5 pt-5 border-t-2 border-secondary-container/30 relative z-10">
    <div className="flex items-center gap-3 mb-4">
      <span className="material-symbols-outlined text-primary text-[28px]">school</span>
      <h3 className="...">
        <WaveHeading text="Education" />
      </h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary-container/10 border border-secondary-container/30 rounded-3xl p-4">
      {EDUCATION.map((edu) => ( <div key={edu.degree} className="experience-card ...">...</div> ))}
    </div>
  </div>
</motion.div>

<motion.div
  ref={blobContainerRef}
  className="md:col-span-5 relative mt-6 md:mt-0 md:-translate-y-8 flex justify-center md:justify-end"
  style={{ transform: photoTransform }}
>
  <div ref={blobShadowRef} className="absolute inset-0 bg-secondary-container organic-shape blur-xl opacity-50 transform translate-x-4 translate-y-4" />
  <div ref={blobImageRef} className="w-64 h-64 md:w-96 md:h-96 relative z-10 organic-shape overflow-hidden border-4 border-surface-container-lowest shadow-violet-float">
    <img src={headshot} alt="Renuka Prasad Patwari" className="w-full h-full object-cover" />
  </div>
</motion.div>
```

**Important constraint**: the two outer `motion.div`s above (`textTransform`/`photoTransform`) and the two inner refs `blobShadowRef`/`blobImageRef` (magnetic cursor-follow, `HomeSection.tsx:65-76`) already own `transform` via direct `style.transform` writes or `useMotionTemplate`. Framer Motion's `initial`/`animate` with a `y` value generates its *own* `transform`, which would silently fight these three existing writers. The fix must add entrance animation only to elements that don't already have a transform-writer, and must use an **opacity-only** entrance (no `y`) for anything nested inside the photo column, since every element there already has one.

**2. Experience timeline rows (`ExperienceSection.tsx:6-72`, `ExperienceRow`, called at `ExperienceSection.tsx:119-121`)** — only the section header has an entrance (`ExperienceSection.tsx:88-93`). The three job rows render with no `initial`/`whileInView` at all — only continuous parallax (`dotTransform`, `contentTransform`, `ExperienceSection.tsx:8-11`).

```tsx
// src/sections/ExperienceSection.tsx:6-22 — current
function ExperienceRow({ job }: { job: ExperienceEntry }) {
  const { sectionRef, progress } = useSectionParallax<HTMLDivElement>()
  const dotY = useParallaxOffset(progress, 10)
  const contentY = useParallaxOffset(progress, 22)
  const dotTransform = useMotionTemplate`translateY(${dotY}px)`
  const contentTransform = useMotionTemplate`translateY(${contentY}px)`

  return (
    <div ref={sectionRef} className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
      <div className="hidden md:flex flex-col items-center shrink-0 w-16">
        <motion.div
          style={{ transform: dotTransform }}
          className={`w-4 h-4 rounded-full mt-2 ${...}`}
        />
      </div>
      <motion.div className="flex-1" style={{ transform: contentTransform }}>
        <div className={`bg-surface rounded-[24px_8px_32px_12px] p-6 md:p-10 experience-card ...`}>
          ...
        </div>
      </motion.div>
    </div>
  )
}
```

```tsx
// src/sections/ExperienceSection.tsx:119-121 — current
{EXPERIENCE.map((job) => (
  <ExperienceRow key={job.company} job={job} />
))}
```

Same transform-ownership constraint applies here: the `dotTransform`/`contentTransform` `motion.div`s already own `transform`. The entrance must go on the outer wrapping `<div ref={sectionRef}>` (a plain div, no competing transform-writer) rather than the two inner `motion.div`s.

**3. Projects cards (`ProjectsSection.tsx:69-76`)** — this is a moment-correction, not a missing animation. The cards already fade in, but via `initial`/`animate` (not `whileInView`), which fires once at component mount — i.e. page load, before the user has scrolled anywhere near Projects (all 7 sections mount simultaneously in `App.tsx`'s single `<main>`, there's no route-based lazy mount). By the time a visitor actually arrives at this section, the entrance already played, invisibly.

```tsx
// src/sections/ProjectsSection.tsx:66-77 — current
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
  <AnimatePresence mode="popLayout">
    {filtered.map((project, idx) => (
      <motion.div
        key={project.title}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
```

This same `motion.div` also drives the fade when a visitor clicks a filter pill (`activeFilter` changes, `ProjectsSection.tsx:27,52-64`) — that path must stay fast and only lightly staggered, since filter-clicking is a repeated, tens-per-session interaction, not a rare arrival moment.

## Target

**Home hero** — convert each of the five non-transform-owning children of the text column to `motion` elements with a staggered page-load entrance, and add one opacity-only wrapper inside the photo column. Reduced motion is gated inline via `useReducedMotion()` (already imported as a pattern elsewhere in this file via `window.matchMedia`, but `framer-motion`'s own hook is simpler here since these are `motion` props, not manual style writes) — the `y` values below become `0` when reduced motion is on, while `opacity` always animates:

```tsx
// src/sections/HomeSection.tsx — add near the top of the component, alongside the existing refs
const reduceMotion = useReducedMotion()
const heroY = reduceMotion ? 0 : 24
```

```tsx
// src/sections/HomeSection.tsx — target (text column children)
<motion.h1
  initial={{ opacity: 0, y: heroY }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface cursor-default leading-tight text-balance"
>
  <WavyText text="Renuka Prasad Patwari" className="wavy-text" />
</motion.h1>
<motion.h2
  initial={{ opacity: 0, y: heroY }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
  className="font-headline-md text-headline-md text-primary relative z-10 cursor-default text-balance"
>
  <WavyText text="Software Engineer & AI Systems Builder" className="wavy-title" />
</motion.h2>
<motion.div
  ref={aboutRef}
  initial={{ opacity: 0, y: heroY }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
  className="cursor-default flex flex-col gap-1.5 relative z-10 max-w-2xl"
>
  <div ref={lineHighlightRef} className="marker-line-highlight" />
  {ABOUT_PARAGRAPHS.map((paragraph, i) => ( ... unchanged ... ))}
</motion.div>
<motion.div
  initial={{ opacity: 0, y: heroY }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.21 }}
  className="flex flex-wrap gap-4 mt-1 relative z-10"
>
  <button ...>View Projects</button>
  <button ...>Get in Touch</button>
</motion.div>
<motion.div
  initial={{ opacity: 0, y: heroY }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
  className="mt-5 pt-5 border-t-2 border-secondary-container/30 relative z-10"
>
  <div className="flex items-center gap-3 mb-4">...</div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ...">{EDUCATION.map(...)}</div>
</motion.div>
```

```tsx
// src/sections/HomeSection.tsx — target (photo column: opacity-only, no y, to avoid
// fighting photoTransform on the parent and the magnetic-follow transform on the
// two refs inside — opacity-only means there is nothing for reduced-motion to strip,
// so no reduceMotion branching is needed on this specific element)
<motion.div
  ref={blobContainerRef}
  className="md:col-span-5 relative mt-6 md:mt-0 md:-translate-y-8 flex justify-center md:justify-end"
  style={{ transform: photoTransform }}
>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="contents"
  >
    <div ref={blobShadowRef} className="absolute inset-0 bg-secondary-container organic-shape blur-xl opacity-50 transform translate-x-4 translate-y-4" />
    <div ref={blobImageRef} className="w-64 h-64 md:w-96 md:h-96 relative z-10 organic-shape overflow-hidden border-4 border-surface-container-lowest shadow-violet-float">
      <img src={headshot} alt="Renuka Prasad Patwari" className="w-full h-full object-cover" />
    </div>
  </motion.div>
</motion.div>
```

`className="contents"` (Tailwind's `display: contents`) makes the wrapping `motion.div` invisible to layout — it doesn't introduce a new box, so the existing `absolute inset-0` positioning of `blobShadowRef` (which depends on being positioned relative to `blobContainerRef`, not this new wrapper) keeps working exactly as before. Framer Motion still applies the `opacity` animation to this wrapper element itself, which is enough to fade both children since opacity inherits visually through a `display: contents` box.

**Experience rows** — add the entrance to the outer plain `<div>`, convert it to `motion.div`, and thread an `index` through for the stagger. Gate the `y` value with `useReducedMotion()` the same way as the hero:

```tsx
// src/sections/ExperienceSection.tsx:6 — target signature
function ExperienceRow({ job, index }: { job: ExperienceEntry; index: number }) {
  const reduceMotion = useReducedMotion()
  const rowY = reduceMotion ? 0 : 32
```

```tsx
// src/sections/ExperienceSection.tsx:12-14 — target
<motion.div
  ref={sectionRef}
  initial={{ opacity: 0, y: rowY }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
  className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16"
>
```

```tsx
// src/sections/ExperienceSection.tsx:119-121 — target
{EXPERIENCE.map((job, index) => (
  <ExperienceRow key={job.company} job={job} index={index} />
))}
```

Note `sectionRef` (from `useSectionParallax`) is being attached to a `motion.div` here instead of a plain `div` — this is safe; Framer Motion's `motion.div` forwards refs to the underlying DOM node exactly like a plain element, and `useSectionParallax`'s internal `useScroll({ target: sectionRef })` only needs a DOM node reference, not a plain-element-specific API.

**Projects cards** — swap `animate` for `whileInView`, add a light stagger, and gate the `scale` movement (not just add opacity) for reduced motion, since scale is a transform-based movement per this repo's reduced-motion convention:

```tsx
// src/sections/ProjectsSection.tsx — add near the top of the component
const reduceMotion = useReducedMotion()
const cardScale = reduceMotion ? 1 : 0.95
```

```tsx
// src/sections/ProjectsSection.tsx:69-76 — target
<motion.div
  key={project.title}
  layout
  initial={{ opacity: 0, scale: cardScale }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, amount: 0.2 }}
  exit={{ opacity: 0, scale: cardScale }}
  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
  className="relative z-10"
>
```

Only `animate` → `whileInView`, `viewport`, the `delay`/`ease` additions, and the `scale`→`cardScale` reduced-motion gate change. `layout`, `key`, and the base `duration: 0.3` are untouched.

## Repo conventions to follow

- Entrance curve `[0.16, 1, 0.3, 1]` is this repo's own established ease-out for fades/slides — already used at `ExperienceSection.tsx:93` (soon to be joined by the two new uses in this same file) and should be reused verbatim, not approximated.
- Stagger cadence: `HackathonsSection.tsx:38` already uses `delay: index * 0.08` (80ms) — reuse exactly for Experience rows. Projects uses a lighter `idx * 0.04` (40ms) specifically because its same transition also drives tens-per-session filter clicks, not just the rare page-arrival moment — a larger delay there would make repeated filtering feel sluggish.
- `viewport={{ once: true, amount: 0.2 }}` / `amount: 0.3` matches the exact pattern already used at `ExperienceSection.tsx:92`, `HackathonsSection.tsx:37`, `PublicationsSection.tsx:24` — reuse those values, don't invent new ones.
- Never `scale(0)` — Projects' existing `scale: 0.95` initial state is already correct per this repo's own standard; this plan does not change it.

## Steps

1. In `src/sections/HomeSection.tsx`, add `useReducedMotion` to the `framer-motion` import (currently `import { motion, useMotionTemplate } from 'framer-motion'`). Inside the component body, add `const reduceMotion = useReducedMotion()` and `const heroY = reduceMotion ? 0 : 24` near the top, alongside the existing `blobAY`/`blobBY`/`textY`/`photoY` declarations.
2. Convert the `<h1>` at line 239 to `<motion.h1>` with `initial={{ opacity: 0, y: heroY }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}`, keeping its existing `className` unchanged.
3. Convert the `<h2>` at line 242 to `<motion.h2>` the same way, with `delay: 0.07` added to its transition.
4. Convert the `<div ref={aboutRef} ...>` at line 245 to `<motion.div ref={aboutRef} ...>` the same way, with `delay: 0.14`. Keep `ref={aboutRef}` — this ref is read by the marker-highlight mousemove effect (`HomeSection.tsx:105-197`) via `aboutRef.current`, which works identically whether the element is a plain `div` or a `motion.div`.
5. Convert the buttons row `<div className="flex flex-wrap gap-4 mt-1 relative z-10">` at line 253 to `<motion.div ...>` the same way, with `delay: 0.21`.
6. Convert the education wrapper `<div className="mt-5 pt-5 border-t-2 ...">` at line 268 to `<motion.div ...>` the same way, with `delay: 0.28`.
7. Inside the photo column (starting at line 297), add one new `<motion.div className="contents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>` wrapping the existing `<div ref={blobShadowRef}>` and `<div ref={blobImageRef}>` (do not add `y` here, and no `reduceMotion` branching needed here since there's no movement to strip — see Target above).
8. In `src/sections/ExperienceSection.tsx`, add `useReducedMotion` to the `framer-motion` import (currently `import { motion, useMotionTemplate } from 'framer-motion'`). Change `ExperienceRow`'s props type (line 6) to accept `index: number` alongside `job`, and add `const reduceMotion = useReducedMotion()` / `const rowY = reduceMotion ? 0 : 32` at the top of the function body.
9. Convert the outer `<div ref={sectionRef} className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">` (line 12) to `<motion.div ref={sectionRef} ...>` adding `initial={{ opacity: 0, y: rowY }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.3 }}`, `transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}`.
10. Update the call site at line 119 to `{EXPERIENCE.map((job, index) => ( <ExperienceRow key={job.company} job={job} index={index} /> ))}`.
11. In `src/sections/ProjectsSection.tsx`, add `useReducedMotion` to the `framer-motion` import (currently `import { motion, AnimatePresence } from 'framer-motion'`). Inside the component body, add `const reduceMotion = useReducedMotion()` and `const cardScale = reduceMotion ? 1 : 0.95` near the top, alongside `activeFilter`/`filtered`.
12. On the `motion.div` at lines 69-76: rename the `animate` prop to `whileInView`, add `viewport={{ once: true, amount: 0.2 }}`, change `initial={{ opacity: 0, scale: 0.95 }}` to `initial={{ opacity: 0, scale: cardScale }}`, change `exit={{ opacity: 0, scale: 0.95 }}` to `exit={{ opacity: 0, scale: cardScale }}`, and change `transition={{ duration: 0.3 }}` to `transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}`. Leave `layout` and `key` untouched.

## Boundaries

- Do NOT change any text content, project/experience/education data, tags, bullet points, or copy anywhere in these three files — this is an entrance-timing change only.
- Do NOT add `y` (or any transform-based animate value) to: the two outer `motion.div`s in `HomeSection.tsx` that already carry `style={{ transform: textTransform }}` / `style={{ transform: photoTransform }}`; the two inner refs `blobShadowRef`/`blobImageRef`; or the two `motion.div`s in `ExperienceRow` that carry `dotTransform`/`contentTransform`. Adding a Framer Motion `y` animate value to any of these five elements will silently fight their existing transform writers and produce visibly broken positioning.
- Do NOT change the Projects filter-button logic, `AnimatePresence`'s `mode="popLayout"`, or the `layout` prop on the project cards.
- Do NOT touch `SkillsSection.tsx` — its entrance is plan 017, handled separately because it needs an explicit guard against the autoplay carousel.
- If any of the three files' current code doesn't match what's shown here (line numbers may have drifted since this plan was written), re-read the file in full before editing, and STOP if the structure has diverged meaningfully from what's described.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` both succeed.
- **Feel check**:
  - Reload the site fresh (hard refresh) and watch the Home hero: name, title, about text, buttons, and education cards should each fade + slide up in a quick, visible cascade (roughly name → title → about → buttons → education, ~70ms apart, each taking 0.6s), and the photo should fade in without any position jump.
  - Confirm the hero's existing magnetic photo-follow (move the mouse around the hero) and the marker-line text-highlight (hover the about paragraphs) both still work exactly as before — the new entrance wrappers must not have broken either effect.
  - Scroll to Experience: the three job rows should each fade + slide up as they cross into view, staggered ~80ms apart, only once (scrolling back up and down again should not replay it — confirm via `viewport={{ once: true }}`).
  - Scroll to Projects: the cards should now visibly fade + scale in as you arrive at the section (previously they wouldn't, since the animation had already played at page load) — confirm by reloading the page, waiting a few seconds without scrolling, then scrolling to Projects; the entrance should still play at that point.
  - Click a Projects filter pill and confirm the remaining/re-entering cards still fade in quickly (under ~450ms total for the slowest card) — filtering must not feel sluggish.
  - Toggle `prefers-reduced-motion` in DevTools' Rendering panel, reload, and confirm: Home hero content and Experience rows still fade in (opacity) but do not slide (`heroY`/`rowY` resolve to `0`), and Projects cards fade in without scaling (`cardScale` resolves to `1`).
- **Done when**: all three files' entrances behave as described, the two transform-conflict constraints hold (no jittering/fighting on the hero photo or Experience row dot/card), and reduced-motion drops movement while preserving the opacity fade.
