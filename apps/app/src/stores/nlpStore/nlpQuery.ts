import compromise from 'compromise'
import Sherlockjs from 'sherlockjs'
import { TYPES, DateRange, NLPResponse, QueryFragment } from './types'

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
  gdocs: 'gdocs',
  drive: 'gdocs',
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
  const marks = []

  // mark helpers
  function addMarkIfClear(newMark) {
    if (marks.some(mark => inside(newMark, mark))) {
      return
    }
    marks.push(newMark)
  }
  function highlightIfClear(word, className) {
    const start = query.indexOf(word)
    const end = start + word.length
    addMarkIfClear([start, end, className])
  }

  // @ts-ignore
  const nlp = compromise(query)
  const date: DateRange = Sherlockjs.parse(query)
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
    marks.push([0, words[0].length, TYPES.INTEGRATION])
  }
  for (const curDate of dates) {
    highlightIfClear(curDate, TYPES.DATE)
  }
  if (state.namePattern) {
    const nameMatches = query.match(state.namePattern)
    if (nameMatches && nameMatches.length) {
      for (const name of nameMatches) {
        highlightIfClear(name, TYPES.PERSON)
      }
    }
  }
  for (const word of words) {
    if (types[word]) {
      highlightIfClear(word, TYPES.TYPE)
      continue
    }
    if (integrationFilters[word]) {
      integrations.push(word)
      highlightIfClear(word, TYPES.INTEGRATION)
      continue
    }
  }

  // build a nicer object describing the query for easier parsing
  let parsedQuery: QueryFragment[] = []

  if (!marks.length) {
    parsedQuery.push({ text: query })
  } else {
    // prefix
    parsedQuery.push({
      text: query.slice(0, marks[0][0]),
    })
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
    .filter(x => x.type === TYPES.PERSON)
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
