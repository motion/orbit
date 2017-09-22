import { includes, isNull, some, find } from 'lodash'
import Sherlock from 'sherlockjs'

const allPeople = ['nick', 'me', 'nate', 'steel', 'steph']

const parse = text => {
  const lower = text
    .toLowerCase()
    // remove posessives
    .replace(/\'/g, '')
    .replace(/\ my\ /g, ' me ')
    .replace(/^my\ /g, ' me ')

  const services = {
    calendar: ['cal', 'calendar'],
    issues: ['issues', 'tasks', 'issue'],
    github: ['github', 'git'],
    docs: ['docs', 'google docs', 'gdrive'],
    jira: ['jira', 'tickets'],
  }

  const { startDate, endDate } = Sherlock.parse(text)

  const people = allPeople.filter(
    person => includes(lower, person) || includes(lower, person + 's')
  )

  const service = find(Object.keys(services), service => {
    return some(services[service], name => includes(lower.split(' '), name))
  })

  return {
    people,
    service,
    startDate,
    endDate,
  }
}

const testParses = () => {
  let correct = 0
  let checks = 0
  let logs = []

  const check = (text, fn) => {
    const right = fn(parse(text))
    if (right) correct++
    logs.push(text + ' ' + (right ? '✓' : 'x'))
    checks++
  }

  check(
    'cal',
    ({ people, service }) => people[0] === 'me' && service === 'calendar'
  )

  check(
    'nick and nate',
    ({ people }) => people[0] === 'nick' && people[1] === 'nate'
  )
  check(
    'nick cal',
    ({ people, service }) => people[0] === 'nick' && service === 'calendar'
  )
  check(
    `nate's issues`,
    ({ people, service }) => people[0] === 'nate' && service === 'issues'
  )
  check(
    `nick and nate's tickets`,
    ({ people, service }) =>
      people[0] === 'nick' && people[1] === 'nate' && service === 'jira'
  )
  check(
    `nick's jira last week`,
    ({ people, service }) => people[0] === 'nick' && service === 'jira'
  )

  check(
    `nate's cal last week`,
    ({ startDate, endDate, people }) =>
      !isNull(startDate) && isNull(endDate) && people[0] === 'nate'
  )
  check(
    `nate's cal sep 2 - next week`,
    ({ startDate, endDate, people }) =>
      !isNull(startDate) && !isNull(endDate) && people[0] === 'nate'
  )

  console.log(
    `checks: ${checks}, correct: ${correct}, logs: \n${logs.join('\n')}`
  )
}

window.testParser = testParses

export default parse
