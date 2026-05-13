import { getNormalizedSearchValue } from "@/lib/utils/general/search"
import { languageDefinitions } from "@/lib/utils/general/search/language-definitions"

export type LanguageSearchResult = {
  id: string
  code: string
  nativeName: string
  englishName: string
}

type GetLanguageOptions = {
  signal?: AbortSignal
}

let languageCatalogCache: LanguageSearchResult[] | null = null
let languageCatalogPromise: Promise<LanguageSearchResult[]> | null = null

function getLanguageSearchTerms(language: LanguageSearchResult) {
  return [language.code, language.nativeName, language.englishName]
}

export async function getLanguage(
  query: string,
  options: GetLanguageOptions = {}
): Promise<LanguageSearchResult[]> {
  const normalizedQuery = getNormalizedSearchValue(query)

  if (!normalizedQuery) {
    return []
  }

  const languages = await getLanguageCatalog(options)

  return languages.filter((language) =>
    getLanguageSearchTerms(language).some((value) =>
      getNormalizedSearchValue(value).includes(normalizedQuery)
    )
  )
}

export async function getLanguageCatalog(
  options: GetLanguageOptions
): Promise<LanguageSearchResult[]> {
  if (options.signal?.aborted) {
    throw new DOMException("The operation was aborted.", "AbortError")
  }

  if (languageCatalogCache) {
    return languageCatalogCache
  }

  if (languageCatalogPromise) {
    return languageCatalogPromise
  }

  languageCatalogPromise = Promise.resolve().then(() => {
    if (options.signal?.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError")
    }

    languageCatalogCache = Object.values(languageDefinitions)
      .map((definition) => {
        const code = definition["639-1"].trim().toLowerCase()
        const nativeName = definition.nativeName.trim()
        const englishName = definition.name.trim()

        return {
          id: code,
          code,
          nativeName,
          englishName,
        }
      })
      .filter((item) => item.code && item.nativeName)
      .sort((left, right) =>
        left.nativeName.localeCompare(right.nativeName, "es-ES")
      )

    return languageCatalogCache
  }).finally(() => {
    languageCatalogPromise = null
  })

  return languageCatalogPromise
}
