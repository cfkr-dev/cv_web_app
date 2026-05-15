export function nextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

export function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}
