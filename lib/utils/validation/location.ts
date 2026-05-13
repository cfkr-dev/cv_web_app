import { getNormalizedSearchValue } from "@/lib/utils/general/search"
import { getLocation } from "@/lib/services/search/location"

export async function validateLocation(value: string) {
  const trimmedValue = value.trim()
  const normalizedValue = getNormalizedSearchValue(trimmedValue)

  if (!normalizedValue) {
    return false
  }

  try {
    const locations = await getLocation(trimmedValue)

    return locations.some((location) => {
      const normalizedLabel = getNormalizedSearchValue(location.label)
      const normalizedName = getNormalizedSearchValue(location.name)

      return (
        normalizedLabel === normalizedValue ||
        normalizedName === normalizedValue
      )
    })
  } catch {
    return false
  }
}
