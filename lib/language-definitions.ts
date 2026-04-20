import iso6391Languages from "@/lib/iso-639-1.json"

export type Iso6391LanguageCode = keyof typeof iso6391Languages

export type Iso6391LanguageDefinition = {
  "639-1": string
  "639-2": string
  "639-2/B"?: string
  family: string
  name: string
  nativeName: string
  wikiUrl: string
}

export const languageDefinitions = iso6391Languages as Record<
  Iso6391LanguageCode,
  Iso6391LanguageDefinition
>

export function getLanguageDefinition(code: Iso6391LanguageCode) {
  return languageDefinitions[code]
}
