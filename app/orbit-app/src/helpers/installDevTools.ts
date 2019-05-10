import './installGlobals'

import { debugUseStore, IS_STORE } from '@o/use-store'
import { spy } from 'mobx'
import { setConfig } from 'react-hot-loader'

import { Stores } from '../om/stores'

window['enableLog'] = false

// why-did-you-render
// https://github.com/welldone-software/why-did-you-render
// if (process.env.NODE_ENV !== 'production') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render').default
//   whyDidYouRender(require('React'))
// }

let spyOff = null
function debug(level?: number) {
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

window['debug'] = debug

if (localStorage.getItem('enableLog')) {
  debug(+localStorage.getItem('enableLog'))
}

function lightLog(val: any) {
  const type = typeof val
  if (!type || type === 'number' || type === 'boolean') {
    return `${val}`
  }
  if (type === 'string' && val.length < 50) {
    return `"${val}"`
  }
  if (type === 'object') {
    try {
      const str = JSON.stringify(val)
      if (str.length < 100) {
        return `(${str})`
      }
    } catch {}
  }
  return `(type: ${type})`
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
        console.log(`%c ${event.name} = ${lightLog(event.newValue)}`, 'color:red;')
      } else {
        let name = `${event.object.constructor.name}.${event.key}`
        if (event.object.constructor.name === 'Object') {
          name = event.name
        }
        console.log(`%c ${name} = ${lightLog(event.newValue)}`, 'color:red;')
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

window['StoreState'] = {}
const StoreState = window['StoreState']

function addEvent({ renderName }, event: any) {
  StoreState[renderName] = StoreState[renderName] || []
  StoreState[renderName].push(event)
}

debugUseStore(event => {
  if (event.type === 'state') {
    globalizeStores(event.value)
    return
  }
  switch (event.type) {
    case 'observe':
    case 'render':
    case 'unmount':
    case 'mount':
      if (!event.component) return
      if (window['enableLog'] > 1) {
        console.log(event.component.renderName, event)
      }
      addEvent(event.component, event)
      return
  }
})

window['Stores'] = Stores
for (const key in Stores) {
  defineStoreOnWindow(key, Stores[key])
}

function defineStoreOnWindow(key, store) {
  if (window[key]) {
    if (Array.isArray(window[key]) && !window[key][0][IS_STORE]) return
    if (!window[key][IS_STORE]) return
    window[key] = store
  } else {
    window[key] = store
  }
}

function globalizeStores(stores: Record<string, any>) {
  window['Stores'] = { ...window['Stores'], ...stores }
  // if we can, put store right on window
  for (const key in stores) {
    defineStoreOnWindow(key, stores[key])
  }
}

// just for now since its spitting out so many
setConfig({
  logLevel: 'no-errors-please',
  pureSFC: true,
  pureRender: true,
  // disableHotRenderer: true,
})

Error.stackTraceLimit = Infinity

// should enable eventually for safer mobx
// really should be even safer with automagical to enforce same-store only actions
// actually hard because async actions dont have a good story in mobx
// https://mobx.js.org/best/actions.html
// Mobx.configure({
//   enforceActions: true,
// })
