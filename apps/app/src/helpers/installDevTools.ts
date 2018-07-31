import './installGlobals'
import * as Mobx from 'mobx'

// just for now since its spitting out so many
import { setConfig } from 'react-hot-loader'

setConfig({
  logLevel: 'no-errors-please'
})

Error.stackTraceLimit = Infinity

// 🐛 note: dont import router or app here
// it causes the entire app to be imported before boot

// should enable eventually for safer mobx
// really should be even safer with automagical to enforce same-store only actions
// actually hard because async actions dont have a good story in mobx
// https://mobx.js.org/best/actions.html
// Mobx.configure({
//   enforceActions: true,
// })

// install console formatters
// mobxFormatters(Mobx)

console.warn(
  'WARNING! console.warn off during initial render because Electron spits out 3 pages of warnings... that we need to fix before we release app',
)
const ogWarn = console.warn
console.warn = _ => _
setTimeout(() => {
  console.warn = ogWarn
})

// really nice for quicker debugging...
if (!Object.prototype['toJS']) {
  Object.defineProperty(Object.prototype, 'toJS', {
    enumerable: false,
    value: function() {
      // this does it deeply...
      try {
        return JSON.parse(JSON.stringify(this))
      } catch {
        return Mobx.toJS(this)
      }
    },
  })
}
