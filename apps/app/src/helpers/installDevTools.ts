import './installGlobals'
import * as Mobx from 'mobx'

// 🐛 note: dont import router or app here
// it causes the entire app to be imported before boot
import debug from '@mcro/debug'

// lets log loudly by default
console.log(
  'In dev mode, setting debug.loud() by default. Call debug.quiet() to turn down logs',
)
debug.loud()

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
  'WARNING! console.warn is patched because Electron spits out 3 pages of warnings initially... need to patch before prod',
)
const ogWarn = console.warn.bind(console)
console.warn = function(...args) {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].indexOf('Electron Security Warning')) {
      return
    }
  }
  return ogWarn.call(this, ...args)
}

// really nice for quicker debugging...
if (!Object.prototype.toJS) {
  Object.defineProperty(Object.prototype, 'toJS', {
    enumerable: false,
    value: function() {
      return Mobx.toJS(this)
    },
  })
}
