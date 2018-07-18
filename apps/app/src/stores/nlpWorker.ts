import compromise from 'compromise'
import Sherlockjs from 'sherlockjs'

const state = {
  namePattern: null,
}

const CLASSES = {
  DATE: 'date',
  INTEGRATION: 'integration',
  PERSON: 'person',
  TYPE: 'type',
}

const prefixes = {
  gh: 'github',
  sl: 'slack',
  gm: 'gmail',
  gd: 'gdocs',
  ji: 'jira',
  co: 'confluence',
}

const integrations = {
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

const inside = (a, b) => {
  if (a[0] > b[0] && a[0] < b[1]) return true
  if (a[0] > b[1] && a[1] > b[1]) return true
  return false
}

export function parseSearchQuery(query: string) {
  const marks = []

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
  const date = Sherlockjs.parse(query)
  const dates = nlp
    .dates()
    .out('frequency')
    .map(word => word.normal)
  const nouns = filterNouns(nlp.nouns().out('frequency')).map(
    word => word.normal,
  )
  const people = nlp.people().out('frequency')
  const words = query.split(' ')

  const prefix = prefixes[words[0]]
  if (prefix) {
    marks.push([0, words[0].length, CLASSES.INTEGRATION])
  }

  for (const curDate of dates) {
    highlightIfClear(curDate, CLASSES.DATE)
  }

  if (state.namePattern) {
    const nameMatches = query.match(state.namePattern)
    if (nameMatches.length) {
      for (const name of nameMatches) {
        highlightIfClear(name, CLASSES.PERSON)
      }
    }
  }

  for (const word of words) {
    if (types[word]) {
      highlightIfClear(word, CLASSES.TYPE)
    }
    if (integrations[word]) {
      highlightIfClear(word, CLASSES.INTEGRATION)
    }
  }

  return {
    state,
    matches: state.namePattern ? query.match(state.namePattern) : null,
    dates,
    people,
    nouns,
    date,
    marks,
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
