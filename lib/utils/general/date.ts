export type StringDateFormat = "yyyy-mm" | "yyyy-mm-dd"

function padDateUnit(value: number) {
  return String(value).padStart(2, "0")
}

export function getCurrentStringDate(format: StringDateFormat) {
  const now = new Date()
  const year = now.getFullYear()
  const month = padDateUnit(now.getMonth() + 1)

  if (format === "yyyy-mm") {
    return `${year}-${month}`
  }

  const day = padDateUnit(now.getDate())

  return `${year}-${month}-${day}`
}
