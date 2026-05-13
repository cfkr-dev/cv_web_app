export function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}
