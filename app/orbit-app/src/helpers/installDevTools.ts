import { debugUseStore, IS_STORE } from '@mcro/use-store'
import { setConfig } from 'react-hot-loader'
import './installGlobals'

// TODO we already have a log helper called `log`
// we can just make it a proxy where `log.enabled = true/false` sets localStorage and persists
// instead of this global
window['enableLog'] = localStorage.getItem('enableLog')

// enableLogging({
//   predicate: ({ name }) => {
//     if (window['enableLog'] !== 1) {
//       return false
//     }
//     if (!name) {
//       return false
//     }
//     if (name.indexOf('.render()') >= 0) {
//       return false
//     }
//     if (name.indexOf('__updateProps') >= 0) {
//       return false
//     }
//     if (name.indexOf('updateIsSelected') >= 0) {
//       return false
//     }
//     return true
//   },
//   action: true,
//   reaction: true,
//   transaction: true,
//   compute: true,
// })

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
      if (window['enableLog']) {
        console.log(event.component.renderName, event)
      }
      addEvent(event.component, event)
      return
  }
})

function globalizeStores(stores: Object) {
  window['Stores'] = stores
  // if we can, put store right on window
  for (const key in stores) {
    if (window[key]) {
      if (Array.isArray(window[key]) && !window[key][0][IS_STORE]) return
      if (!window[key][IS_STORE]) return
      window[key] = stores[key]
    }
  }
}

// just for now since its spitting out so many
setConfig({
  logLevel: 'no-errors-please',
  pureSFC: true,
  pureRender: true,
  disableHotRenderer: true,
})

Error.stackTraceLimit = Infinity

// should enable eventually for safer mobx
// really should be even safer with automagical to enforce same-store only actions
// actually hard because async actions dont have a good story in mobx
// https://mobx.js.org/best/actions.html
// Mobx.configure({
//   enforceActions: true,
// })
