import compromise from 'compromise'
import Sherlockjs from 'sherlockjs'
import { MarkType, DateRange, NLPResponse, QueryFragment, Mark } from './types'
import * as DateFns from 'date-fns'

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

const integrationFilters = {
  slack: 'slack',
  gmail: 'gmail',
  gdrive: 'gdrive',
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
    addMarkIfClear([Math.max(0, start), end, className, word])
  }

  // @ts-ignore
  const nlp = compromise(query)
  const dates: string[] = nlp
    .dates()
    .out('frequency')
    .map(word => word.normal)
  const nouns = filterNouns(nlp.nouns().out('frequency')).map(
    word => word.normal,
  )
  const words = query.toLowerCase().split(' ')
  const integrations = []

  // find all marks for highlighting
  const prefix = prefixes[words[0]]
  if (prefix) {
    const mark: Mark = [0, words[0].length, MarkType.Integration, words[0]]
    marks.push(mark)
  }

  // sort marks in order of occurance
  marks = marks.sort((a, b) => (a[0] > b[0] ? 1 : -1))

  for (const dateString of dates) {
    highlightIfClear(dateString, MarkType.Date)
  }
  if (state.namePattern) {
    const nameMatches = query.match(state.namePattern)
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
    if (integrationFilters[word]) {
      integrations.push(word)
      highlightIfClear(word, MarkType.Integration)
      continue
    }
  }

  // date
  const date: DateRange = Sherlockjs.parse(query)
  // better "now", sherlock often says a few hours earlier than actually now
  if (dates.indexOf('now') > -1) {
    date.endDate = new Date()
  }
  if (date.startDate) {
    // sherlock found a date in the future
    // but we don't deal with future dates
    // so lets convert it to the past
    const startDaysAheadOfNow = DateFns.differenceInDays(
      date.startDate,
      new Date(),
    )
    if (startDaysAheadOfNow > 0) {
      const dateBehindEquivOfStartAhead = DateFns.subDays(
        new Date(),
        startDaysAheadOfNow,
      )
      date.startDate = dateBehindEquivOfStartAhead
    }
  }
  // if end date in future, just set it to now
  if (date.endDate && DateFns.differenceInDays(date.endDate, new Date()) > 0) {
    date.endDate = new Date()
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

  const searchQuery = parsedQuery
    .filter(x => !x.type)
    .map(x => x.text.trim())
    .join(' ')
    .trim()
  const people = parsedQuery
    .filter(x => x.type === MarkType.Person)
    .map(x => x.text)

  return {
    query,
    searchQuery,
    parsedQuery,
    dates,
    nouns,
    date,
    marks,
    people,
    integrations,
    startDate: date.startDate || null,
    endDate: date.endDate || null,
  }
}

// if (typeof window !== 'undefined') {
//   window.nlp = {
//     parseSearchQuery: x => JSON.stringify(parseSearchQuery(x), null, 2),
//     setUserNames: setUserNames,
//     state: state,
//   }
// }

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
