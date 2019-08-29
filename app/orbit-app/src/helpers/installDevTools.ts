import './installGlobals'

import { debug } from '@o/ui'
import { debugUseStore, IS_STORE } from '@o/use-store'
import { setConfig } from 'react-hot-loader'

import { Stores } from '../om/stores'
import * as Fixtures from './developmentFixtures'

console.warn('To run development fixtures, use Fixtures.*')
window['Fixtures'] = Fixtures

window['StoreState'] = {}
const StoreState = window['StoreState']

window['enableLog'] = false
window['debug'] = debug

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
        addEvent(event.component, event)
      }
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
