import { useRef } from 'react'
import { useScroll, useSpring, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
import { useScrollContainer } from '../context/ScrollContainerContext'

/**
 * Continuous, scroll-linked progress (0 at the section entering the bottom of the
 * viewport, 1 at it leaving the top) scoped to the app's actual scroll container
 * (`<main>`), since sections snap-scroll inside it rather than the window. Backed
 * by framer-motion's useScroll, so it updates on every scroll frame instead of only
 * flipping once like an IntersectionObserver-triggered entrance would.
 */
export function useSectionParallax<T extends HTMLElement>() {
  const sectionRef = useRef<T>(null)
  const container = useScrollContainer()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: container ?? undefined,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.5 })

  return { sectionRef, progress: smoothProgress }
}

/** Maps 0→1 scroll progress to a px offset that runs from -distance to +distance. */
export function useParallaxOffset(progress: MotionValue<number>, distance: number) {
  const reduceMotion = useReducedMotion()
  return useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [-distance, distance])
}
