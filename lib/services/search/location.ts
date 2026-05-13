import { GEOAPIFY_API_AUTOCOMPLETE_URL } from "@/lib/config/api-routes"
import { getNormalizedSearchValue } from "@/lib/utils/general/search"

export type LocationSearchResult = {
  id: string
  label: string
  name: string
  description: string
  lat?: number
  lon?: number
}

type GeoapifyAutocompleteResult = {
  place_id?: string
  name?: string
  city?: string
  county?: string
  state?: string
  country?: string
  formatted?: string
  lat?: number
  lon?: number
}

type GeoapifyAutocompleteResponse = {
  results?: GeoapifyAutocompleteResult[]
}

type GetLocationOptions = {
  signal?: AbortSignal
}

const locationSearchCache = new Map<string, LocationSearchResult[]>()

export async function getLocation(
  query: string,
  options: GetLocationOptions = {}
): Promise<LocationSearchResult[]> {
  const trimmedQuery = query.trim()
  const normalizedQuery = getNormalizedSearchValue(trimmedQuery)

  if (!normalizedQuery) {
    return []
  }

  const cachedLocations = locationSearchCache.get(normalizedQuery)

  if (cachedLocations) {
    return cachedLocations
  }

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

  if (!apiKey) {
    throw new Error("Geoapify API key is not configured.")
  }

  const url = new URL(GEOAPIFY_API_AUTOCOMPLETE_URL)
  url.searchParams.set("text", trimmedQuery)
  url.searchParams.set("type", "city")
  url.searchParams.set("format", "json")
  url.searchParams.set("lang", "es")
  url.searchParams.set("limit", "8")
  url.searchParams.set("apiKey", apiKey)

  const response = await fetch(url, {
    cache: "no-store",
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error("Geoapify autocomplete request failed.")
  }

  const data = (await response.json()) as GeoapifyAutocompleteResponse
  const seen = new Set<string>()

  const locations: LocationSearchResult[] = []

  for (const result of data.results ?? []) {
    const name = result.city ?? result.name

    if (!name) {
      continue
    }

    const regionParts = [result.state, result.country].filter(Boolean)
    const description = regionParts.join(", ")
    const label = [name, description].filter(Boolean).join(", ")
    const key = result.place_id ?? label

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    locations.push({
      id: key,
      label,
      name,
      description,
      lat: result.lat,
      lon: result.lon,
    })
  }

  locationSearchCache.set(normalizedQuery, locations)

  return locations
}
