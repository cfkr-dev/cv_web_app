"use client"

import { useEffect, useState, type RefObject } from "react"

export function useElementBottomVisibility<T extends HTMLElement>(
  ref: RefObject<T | null>
) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    function updateVisibility() {
      const element = ref.current

      if (!element) {
        return
      }

      setIsVisible(element.getBoundingClientRect().bottom > 0)
    }

    updateVisibility()

    window.addEventListener("scroll", updateVisibility, { passive: true })
    window.addEventListener("resize", updateVisibility)

    return () => {
      window.removeEventListener("scroll", updateVisibility)
      window.removeEventListener("resize", updateVisibility)
    }
  }, [ref])

  return isVisible
}
