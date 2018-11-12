import 'react-hot-loader' // must be imported before react
import { setGlobalConfig } from '@mcro/config'
import { App } from '@mcro/stores'
import { configureUseStore } from '@mcro/use-store'
import { viewEmitter } from '@mcro/black'
import { CompositeDisposable } from 'event-kit'

// because for some reason we are picking up electron process.env stuff...
// we want this for web-app because stack traces dont have filenames properly
// see Logger.ts
if (process.env) {
  process.env.STACK_FILTER = 'true'
}

configureUseStore({
  onMount: store => {
    store.subscriptions = new CompositeDisposable()
    if (process.env.NODE_ENV === 'development') {
      viewEmitter.emit('store.mount', { name: store.constructor.name, thing: store })
    }
  },
  onUnmount: store => {
    if (!store.subscriptions) {
      console.log('no subscriptions!', store)
      debugger
    }
    store.subscriptions.dispose()
    if (process.env.NODE_ENV === 'development') {
      viewEmitter.emit('store.unmount', { name: store.constructor.name, thing: store })
    }
  },
})

async function main() {
  // set config before app starts...
  const config = await fetch('/config').then(res => res.json())
  console.log('app:', window.location.href, config)
  setGlobalConfig(config)

  await App.start()

  // now run app..
  require('./start')
}

main()
