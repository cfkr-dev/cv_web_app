function createUtcDate(year: number, monthIndex: number, day: number) {
  return new Date(Date.UTC(year, monthIndex, day))
}

function isSameUtcDate(
  date: Date,
  year: number,
  monthIndex: number,
  day: number
) {
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === monthIndex &&
    date.getUTCDate() === day
  )
}

function parseStandardDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const day = Number(match[3])
  const date = createUtcDate(year, monthIndex, day)

  return isSameUtcDate(date, year, monthIndex, day) ? date : null
}

function parseComparableDate(value: string) {
  const standardDate = parseStandardDate(value)

  if (standardDate) {
    return standardDate
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const date = createUtcDate(year, monthIndex, 1)

  return isSameUtcDate(date, year, monthIndex, 1) ? date : null
}

export function isValidYearMonthStringDate(value: string) {
  return Boolean(parseComparableDate(value) && /^\d{4}-\d{2}$/.test(value))
}

export function isDateOutOfAllowedRange(
  value: string,
  minDate: string,
  maxDate: string
) {
  const date = parseComparableDate(value)
  const min = parseStandardDate(minDate)
  const max = parseStandardDate(maxDate)

  if (!date || !min || !max) {
    return true
  }

  const time = date.getTime()

  return time < min.getTime() || time > max.getTime()
}

export function isStartDateAfterEndDate(startDate: string, endDate: string) {
  const start = parseComparableDate(startDate)
  const end = parseComparableDate(endDate)

  if (!start || !end) {
    return false
  }

  return start.getTime() > end.getTime()
}
