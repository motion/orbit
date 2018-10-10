import { formatDistance, differenceInCalendarDays } from 'date-fns'

const simplerDateWords = str => str.replace('about ', '').replace('less than a minute', 'now')
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const getSuffix = str => {
  const m = str.match(/(months|days|weeks)/)
  return m ? m[0] : null
}

export const getDateAbbreviated = ({
  startDate,
  endDate,
}: {
  startDate?: Date
  endDate?: Date
}) => {
  if (!startDate) {
    return null
  }
  let startInWords = simplerDateWords(formatDistance(Date.now(), startDate))
  if (!endDate) {
    return `${startInWords}`
  }
  const oneDayInMinutes = 60 * 24 * 1000
  if (endDate.getTime() - startDate.getTime() <= oneDayInMinutes) {
    return startInWords
  }
  // if pretty recent we can show week/day level word diff
  const dayDiff = differenceInCalendarDays(new Date(), endDate)
  if (dayDiff < 30) {
    const endInWords = simplerDateWords(formatDistance(Date.now(), endDate))
    // we can remove the first suffix for brevity
    if (getSuffix(endInWords) === getSuffix(startInWords)) {
      startInWords = startInWords.replace(` ${getSuffix(startInWords)}`, '')
    }
    return `${startInWords} - ${endInWords}`
  }
  // if older we should just show month level words
  const startMonth = monthNames[startDate.getMonth()]
  const endMonth = monthNames[endDate.getMonth()]
  if (startMonth === endMonth) {
    return startMonth
  }
  return `${startMonth.slice(0, 3)} - ${endMonth.slice(0, 3)}}`
}
