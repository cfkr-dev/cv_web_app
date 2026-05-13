import { getOptionalHttpUrl } from "@/lib/utils/validation/url"

export function isValidOptionalLinkedInUrl(value: string) {
  const url = getOptionalHttpUrl(value)

  if (!value.trim()) {
    return true
  }

  if (!url) {
    return false
  }

  const hostname = url.hostname.replace(/^www\./, "")

  return hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")
}