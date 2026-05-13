export function getNavigableUrl(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ""
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmedValue)) {
    return trimmedValue
  }

  return `https://${trimmedValue}`
}
