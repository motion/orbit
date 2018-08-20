import './installGlobals'
import * as Mobx from 'mobx'

// just for now since its spitting out so many
import { setConfig } from 'react-hot-loader'

setConfig({
  logLevel: 'no-errors-please',
})

Error.stackTraceLimit = Infinity

// should enable eventually for safer mobx
// really should be even safer with automagical to enforce same-store only actions
// actually hard because async actions dont have a good story in mobx
// https://mobx.js.org/best/actions.html
// Mobx.configure({
//   enforceActions: true,
// })

const recrusiveMobxToJS = obj => {
  const next = Mobx.toJS(obj)
  if (Array.isArray(next)) {
    return next.map(recrusiveMobxToJS)
  }
  return next
}

// really nice for quicker debugging...
if (!Object.prototype['toJS']) {
  Object.defineProperty(Object.prototype, 'toJS', {
    enumerable: false,
    value: function() {
      return recrusiveMobxToJS(this)
    },
  })
}

// really nice for quicker debugging...
// if (!Object.prototype['stringify']) {
//   Object.defineProperty(Object.prototype, 'stringify', {
//     enumerable: false,
//     value: function() {
//       try {
//         return JSON.stringify(recrusiveMobxToJS(this))
//       } catch {
//         return this
//       }
//     },
//   })
// }
