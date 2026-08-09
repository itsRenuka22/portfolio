# Renuka Prasad Patwari — Portfolio

A single-page React portfolio with scroll-snap section navigation, built with Vite, TypeScript, Tailwind CSS, and Framer Motion. Designs originated in Google Stitch and were converted into React components while preserving each section's original micro-interactions.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion (entrance animations)
- canvas-confetti (Hackathons section)

## Structure

```
src/
├── sections/     # One component per full-viewport section (Home, Experience, Projects, ...)
├── components/   # Shared pieces (TopNav, ProgressRail, WaveHeading, ...)
├── data/         # Content for each section
├── hooks/        # useActiveSection, useDebouncedConfetti
└── index.css     # Tailwind entry + design tokens + ported micro-interaction CSS
```

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Backend

The `backend/` directory contains a separate Flask service, unrelated to this frontend rebuild.
