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

export function formatMonth(value: string) {
  if (!value) {
    return ""
  }

  const [year, month] = value.split("-")
  const monthNumber = Number(month)

  if (!year || Number.isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return value
  }

  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    year: "numeric",
  }).format(new Date(Number(year), monthNumber - 1, 1))
}
