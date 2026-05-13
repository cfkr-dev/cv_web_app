import { getNavigableUrl } from "../../utils/general/url"

export function getOptionalHttpUrl(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  try {
    const url = new URL(getNavigableUrl(trimmedValue))
    const isHttpUrl = url.protocol === "http:" || url.protocol === "https:"
    const hasValidHost =
      url.hostname === "localhost" || url.hostname.includes(".")

    return isHttpUrl && hasValidHost ? url : null
  } catch {
    return null
  }
}

export function isValidOptionalHttpUrl(value: string) {
  return !value.trim() || Boolean(getOptionalHttpUrl(value))
}
