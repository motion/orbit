import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import './createElement'
// import 'regenerator-runtime/runtime'
import 'isomorphic-fetch'
import '@mcro/debug/inject.js'
import * as Constants from './constants'
import { start } from './app'

// for hmr
import '~/router'

process.on('uncaughtException', err => {
  console.log('App.uncaughtException', err.stack)
})

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

export function main() {
  if (!window.Root) {
    console.warn(`NODE_ENV=${process.env.NODE_ENV} ${window.location.pathname}`)
    console.timeEnd('splash')
  }
  start()
}

main()

if (module.hot) {
  module.hot.accept(async () => {
    setTimeout(() => console.log('real root'), 17)
    for (const store of [...window.loadedStores]) {
      store.onWillReload()
    }
    await start(true)
    for (const store of [...window.loadedStores]) {
      store.onReload()
    }
  })
}
