import { getSkillCatalog } from "@/lib/services/search/skill"
import { getNormalizedSearchValue } from "@/lib/utils/general/search"

export function capitalizeSkillWords(value: string) {
  return value
    .trim()
    .replace(/(^|\s)([A-Za-zÀ-ÿ])/g, (_, prefix: string, letter: string) => {
      return `${prefix}${letter.toLocaleUpperCase("es-ES")}`
    })
}

export function validateSkillName(value: string) {
  const normalizedValue = getNormalizedSearchValue(capitalizeSkillWords(value))

  if (!normalizedValue) {
    return false
  }

  return getSkillCatalog().some(
    (skill) => getNormalizedSearchValue(skill.name) === normalizedValue
  )
}
