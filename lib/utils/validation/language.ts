import { getLanguageCatalog } from "@/lib/services/search/language"
import { getNormalizedSearchValue } from "@/lib/utils/general/search"

export async function validateLanguage(value: string, code?: string) {
  const trimmedValue = value.trim()
  const normalizedValue = getNormalizedSearchValue(trimmedValue)
  const normalizedCode = getNormalizedSearchValue(code ?? "")

  if (!normalizedValue || !normalizedCode) {
    return false
  }

  try {
    const languages = await getLanguageCatalog({})

    return languages.some((language) => {
      const languageCode = getNormalizedSearchValue(language.code)
      const nativeName = getNormalizedSearchValue(language.nativeName)
      const englishName = getNormalizedSearchValue(language.englishName)
      const matchesValue =
        nativeName === normalizedValue ||
        englishName === normalizedValue ||
        languageCode === normalizedValue

      return matchesValue && languageCode === normalizedCode
    })
  } catch {
    return false
  }
}
