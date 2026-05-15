"use client"

import { nextFrame } from "@/lib/utils/general/ui"

function isVisible(element: HTMLElement) {
  return element.getClientRects().length > 0
}

function isFocusable(element: HTMLElement) {
  if (element.matches(":disabled")) {
    return false
  }

  if (element.tabIndex >= 0) {
    return true
  }

  return element.matches(
    'input, textarea, select, button, a[href], [contenteditable="true"]'
  )
}

function resolveFocusableTarget(element: HTMLElement) {
  if (isFocusable(element)) {
    return element
  }

  const nestedFocusableElement = element.querySelector<HTMLElement>(
    'input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
  )

  if (nestedFocusableElement && !nestedFocusableElement.matches(":disabled")) {
    return nestedFocusableElement
  }

  return null
}

function getInvalidElements(root: ParentNode) {
  return Array.from(
    root.querySelectorAll<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]')
  ).filter(isVisible)
}

async function focusFirstInvalidElement(elements: HTMLElement[]) {
  for (const element of elements) {
    const focusTarget = resolveFocusableTarget(element)

    if (!focusTarget) {
      continue
    }

    focusTarget.focus()
    return true
  }

  return false
}

export async function focusFirstFormError(formId?: string) {
  if (!formId || typeof document === "undefined") {
    return false
  }

  await nextFrame()
  await nextFrame()

  const formElement = document.getElementById(formId)

  if (!formElement) {
    return false
  }

  return await focusFirstInvalidElement(getInvalidElements(formElement))
}

export async function focusFirstErrorInForms(formIds: string[]) {
  if (typeof document === "undefined") {
    return false
  }

  await nextFrame()
  await nextFrame()

  const invalidElements = formIds.flatMap((formId) => {
    const formElement = document.getElementById(formId)

    if (!formElement) {
      return []
    }

    return getInvalidElements(formElement)
  })

  invalidElements.sort(
    (firstElement, secondElement) =>
      firstElement.getBoundingClientRect().top -
      secondElement.getBoundingClientRect().top
  )

  return await focusFirstInvalidElement(invalidElements)
}
