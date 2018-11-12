import './installGlobals'
import { debugState } from '@mcro/black'
import { setConfig } from 'react-hot-loader'

debugState(({ stores, views }) => {
  const Root = window['Root']
  if (Root) {
    Root.stores = stores
    Root.views = views
  }
  // if we can just put the store right on window
  for (const key in stores) {
    if (typeof window[key] === 'undefined' || window[key].__isAStore) {
      const storeOrStores = stores[key]
      if (window[key]) {
        // could be array of stores or just one, but either way we can define this to help check for replacements
        Object.defineProperty(storeOrStores.prototype, '__isAStore', {
          enumerable: false,
          configurable: true,
          value: true,
        })
      }
      window[key] = storeOrStores
    }
  }
})

// just for now since its spitting out so many
setConfig({
  logLevel: 'no-errors-please',
  // fixes HMR for react hooks
  // @ts-ignore
  pureSFC: true,
})

Error.stackTraceLimit = Infinity

// should enable eventually for safer mobx
// really should be even safer with automagical to enforce same-store only actions
// actually hard because async actions dont have a good story in mobx
// https://mobx.js.org/best/actions.html
// Mobx.configure({
//   enforceActions: true,
// })
