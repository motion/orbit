import compromise from 'compromise'
import Sherlockjs from 'sherlockjs'

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

export function parseSearchQuery(query: string) {
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
  // const words = query.split(' ')

  let highlights = {}

  // for (const [index, word] of words.entries()) {
  //   if (index === 0 && prefixes[word]) {
  //     highlights[index] = { type: 'integration', value: prefixes[word] }
  //     continue
  //   }
  //   if (date.startDate && dates.length) {
  //     if (dates.indexOf(word) > -1) {
  //       highlights[index] = { type: 'date', value: date.startDate }
  //       continue
  //     }
  //   }
  //   if (nouns.length) {
  //     if (nouns.indexOf(word) > -1) {
  //       if (integrations[word]) {
  //         highlights[index] = { type: 'integration', value: integrations[word] }
  //         continue
  //       }
  //       if (types[word]) {
  //         highlights[index] = { type: 'type', value: types[word] }
  //         continue
  //       }
  //     }
  //   }
  // }

  return {
    state,
    matches: state.namePattern ? query.match(state.namePattern) : null,
    dates,
    people,
    nouns,
    date,
    highlights,
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
