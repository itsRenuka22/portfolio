import { useEffect, useRef, useState } from 'react'

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0])
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { threshold: [0.5, 0.6, 0.7] },
    )

    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [sectionIds])

  return activeId
}
