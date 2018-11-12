import './installGlobals'
import { configureUseStore } from '@mcro/use-store'
import { viewEmitter } from '@mcro/black'
import { setConfig } from 'react-hot-loader'
import { CompositeDisposable } from 'event-kit'

configureUseStore({
  onMount: store => {
    store.subscriptions = new CompositeDisposable()
    viewEmitter.emit('store.mount', { name: store.constructor.name, thing: store })
  },
  onUnmount: store => {
    if (!store.subscriptions) {
      console.log('no subscriptions!', store)
      debugger
    }
    store.subscriptions.dispose()
    viewEmitter.emit('store.unmount', { name: store.constructor.name, thing: store })
  },
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
