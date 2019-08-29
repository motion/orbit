import { spy } from 'mobx'

let spyOff: any = null
export function debug(level?: number) {
  let next = 0
  if (typeof level === 'number') {
    next = level
  } else {
    const last = window['enableLog']
    next = last ? 0 : 1
  }
  if (next) {
    console.log(`%c 🐛 👍 debug() enabled`, 'background: green; color: white; font-weight: bold;')
  } else {
    console.log(`%c 🐛 🤫 debug() disabled`, 'color: white; background: red; font-weight: bold;')
  }
  window['enableLog'] = next
  localStorage.setItem('enableLog', `${next}`)
  if (next) {
    spyOff = spy(logMobxEvent)
  } else {
    spyOff && spyOff()
  }
}

if (localStorage.getItem('enableLog')) {
  debug(+localStorage.getItem('enableLog')! || 0)
}

function lightLog(val: any) {
  const type = typeof val
  if (!type || type === 'number' || type === 'boolean') {
    return `${val}`
  }
  if (type === 'string' && val.length < 50) {
    return `"${val}"`
  }
  if (
    type === 'object' &&
    (type.constructor.name === 'Object' || type.constructor.name === 'Array') &&
    Object.keys(type).length < 30
  ) {
    try {
      const str = JSON.stringify(val)
      if (str.length < 200) {
        return `(${str})`
      }
    } catch {}
  }
  if (type === 'object') {
    return `(type object, keys: ${Object.keys(type)})`
  }
  return `(type: ${type}`
}

function logMobxEvent(event) {
  switch (event.type) {
    case 'action':
      console.groupCollapsed(
        `%c  ${event.name}(${event.arguments.map(lightLog).join(', ')})`,
        'color:orange;',
      )
      console.log(event)
      console.groupEnd()
      break
    case 'update':
      if (!event.object) {
        console.groupCollapsed(`%c ${event.name} = ${lightLog(event.newValue)}`, 'color:red;')
        console.log(event)
        console.groupEnd()
      } else {
        let name = `${event.object.constructor.name}.${event.key}`
        if (event.object.constructor.name === 'Object') {
          name = event.name
        }
        console.groupCollapsed(`%c ${name} = ${lightLog(event.newValue)}`, 'color:red;')
        console.log(event)
        console.groupEnd()
      }
      break
    case 'reaction':
      if (event.name.indexOf('Reaction') === 0 || event.name.indexOf('Autorun') === 0) {
        break
      }
      if (event.name.indexOf('track(') === 0) {
        break
      }
      if (event.name.indexOf('magicReaction') === 0) {
        break
      }
      if (window['enableLog'] > 1) {
        console.log(`%c ${event.name}`, 'color:blue;')
      }
      break
  }
}
