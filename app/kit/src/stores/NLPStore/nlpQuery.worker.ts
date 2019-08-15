import compromise from 'compromise'
import { differenceInDays, getDaysInMonth, getYear, subDays } from 'date-fns'
import Sherlockjs from 'sherlockjs'

import { NLPResponse } from '../../types/NLPResponse'
import { DateRange, Mark, MarkType, QueryFragment } from '../../types/NLPTypes'

const state = {
  namePattern: null,
}

const prefixes = {
  gh: 'github',
  sl: 'slack',
  gm: 'gmail',
  gd: 'gdocs',
  ji: 'jira',
  co: 'confluence',
}

const appFilters = {
  slack: 'slack',
  gmail: 'gmail',
  drive: 'drive',
  confluence: 'confluence',
  jira: 'jira',
  github: 'github',
}

const types = {
  issues: 'task',
  tasks: 'task',
  emails: 'mail',
  mail: 'mail',
  documents: 'document',
  docs: 'document',
  files: 'document',
  messages: 'conversation',
  chats: 'conversation',
}

const thisYear = getYear(new Date())
const getMonthRange = month => ({
  startDate: new Date(thisYear, month, 1),
  endDate: new Date(thisYear, month, getDaysInMonth(new Date(thisYear, month, 1))),
})

const months = {
  january: getMonthRange(0),
  february: getMonthRange(1),
  march: getMonthRange(2),
  april: getMonthRange(3),
  may: getMonthRange(4),
  june: getMonthRange(5),
  july: getMonthRange(6),
  august: getMonthRange(7),
  september: getMonthRange(8),
  october: getMonthRange(9),
  november: getMonthRange(10),
  december: getMonthRange(11),
}
const monthNames = Object.keys(months)

const findMonth = str => {
  const mstr = str.toLowerCase()
  for (const month of monthNames) {
    if (month.indexOf(mstr) === 0) {
      return months[month]
    }
  }
  return null
}

// const simpleNames = /(with|from|by)\s([A-Za-z]+)$/

const filterNounsObj = {
  week: true,
  month: true,
}

const filterNouns = strings => strings.filter(x => !filterNounsObj[x])

const inside = ([startA, endA], [startB, endB]) => {
  if (endA > startB && startA < endB) return true
  if (startA < endB && endA > endB) return true
  if (endA > endB && startA < endB) return true
  return false
}

export function parseSearchQuery(query: string): NLPResponse {
  const lowerCaseQuery = query.toLowerCase()
  let marks: Mark[] = []

  // mark helpers
  function addMarkIfClear(newMark: Mark) {
    // @ts-ignore
    if (marks.some(mark => inside(newMark, mark))) {
      return
    }
    marks.push(newMark)
  }
  function highlightIfClear(word, className) {
    const start = lowerCaseQuery.indexOf(word.toLowerCase())
    const end = start + word.length
    const impartialMatch = query[end] !== ' ' && query[end] !== undefined
    if (!impartialMatch) {
      addMarkIfClear([Math.max(0, start), end, className, word])
    }
  }

  // @ts-ignore
  const nlp = compromise(query)
  const dates: string[] = nlp
    .dates()
    .out('frequency')
    .map(word => word.normal)
  const nouns = filterNouns(nlp.nouns().out('frequency')).map(word => word.normal)
  const words = query.toLowerCase().split(' ')
  const apps: string[] = []

  // find all marks for highlighting
  const prefix = prefixes[words[0]]
  if (prefix) {
    const mark: Mark = [0, words[0].length, MarkType.App, words[0]]
    marks.push(mark)
  }

  for (const dateString of dates) {
    highlightIfClear(dateString, MarkType.Date)
  }
  if (state.namePattern) {
    const nameMatches = query.match(state.namePattern!)
    if (nameMatches && nameMatches.length) {
      for (const name of nameMatches) {
        highlightIfClear(name, MarkType.Person)
      }
    }
  }
  for (const word of words) {
    if (types[word]) {
      highlightIfClear(word, MarkType.Type)
      continue
    }
    if (appFilters[word]) {
      apps.push(word)
      highlightIfClear(word, MarkType.App)
      continue
    }
    // location filter segment
    if (word.indexOf('in:') === 0 && word.length > 3) {
      // just keep the part after in:
      highlightIfClear(word.replace('in:', ''), MarkType.Location)
    }
  }

  // AFTER doing all the marks, sort them
  // sort marks in order of occurance
  marks.sort((a, b) => (a[0] > b[0] ? 1 : -1))

  // date
  const date: DateRange = Sherlockjs.parse(query)
  // better "now", sherlock often says a few hours earlier than actually now
  // also sherlock puts startDate to now but it logically is endDate (and we parse later startdates if found)
  if (dates.filter(x => x.indexOf('now') > -1).length) {
    date.startDate = null
    date.endDate = new Date()
  }
  if (date.startDate) {
    // sherlock found a date in the future
    // but we don't deal with future dates
    // so lets convert it to the past
    const startDaysAheadOfNow = differenceInDays(date.startDate, new Date())
    if (startDaysAheadOfNow > 0) {
      const dateBehindEquivOfStartAhead = subDays(new Date(), startDaysAheadOfNow)
      date.startDate = dateBehindEquivOfStartAhead
    }
  }
  // if end date in future, just set it to now
  if (date.endDate && differenceInDays(date.endDate, new Date()) > 0) {
    date.endDate = new Date()
  }

  // no match!
  // try a few of our own

  // simple month matching
  if (dates.length && !date.startDate) {
    // for now just handle one date
    let [start, end] = dates[0].split(' to ')
    if (!date.endDate && end) {
      const endMonth = findMonth(end)
      if (endMonth) {
        date.startDate = endMonth.startDate
        date.endDate = endMonth.endDate
      }
    }
    if (start) {
      const startMonth = findMonth(start)
      if (startMonth) {
        date.startDate = startMonth.startDate
        if (!date.endDate) {
          date.endDate = startMonth.endDate
        }
      }
    }
  }

  // build a nicer object describing the query for easier parsing
  let parsedQuery: QueryFragment[] = []

  if (!marks.length) {
    parsedQuery.push({ text: query })
  } else {
    // prefix
    if (marks[0][0] > 0) {
      parsedQuery.push({
        text: query.slice(0, marks[0][0]),
      })
    }
    for (const [index, mark] of marks.entries()) {
      // marks
      parsedQuery.push({
        text: query.slice(mark[0], mark[1]),
        type: mark[2],
      })
      // in between marks
      const nextMark = marks[index + 1]
      if (nextMark && nextMark[0] > mark[1]) {
        parsedQuery.push({
          text: query.slice(mark[1], nextMark[0]),
        })
      }
    }
    // postfix
    const lastMark = marks[marks.length - 1]
    if (lastMark[1] < query.length) {
      parsedQuery.push({
        text: query.slice(lastMark[1]),
      })
    }
  }

  // filter empty spaces
  parsedQuery = parsedQuery.filter(x => x.text !== ' ')

  const searchQuery = parsedQuery
    .filter(x => !x.type)
    .map(x => x.text.trim())
    .join(' ')
    .trim()

  const people = parsedQuery.filter(x => x.type === MarkType.Person).map(x => x.text)

  return {
    query,
    searchQuery,
    parsedQuery,
    dates,
    nouns,
    date,
    marks,
    people,
    apps,
    startDate: date.startDate || null,
    endDate: date.endDate || null,
  }
}

export function setUserNames(fullNames = []) {
  const cleanNames = fullNames
    .map(name => name.replace(/[^a-zA-Z\s]/g, '').trim())
    .filter(x => x.length > 1)
  if (!cleanNames.length) {
    return
  }
  const firstNames = cleanNames.map(x => x.split(' ')[0])
  const firstNameGroup = `(${firstNames.join('|').toLowerCase()})`
  const fullNameGroup = `(${cleanNames.join('|')})`
  // do full name first so it matches
  const namePattern = new RegExp(`${fullNameGroup}|${firstNameGroup}`, 'g')
  state.namePattern = namePattern
}

// fake types
export default function initNlp() {
  return {
    setUserNames,
    parseSearchQuery,
    state,
  }
}
