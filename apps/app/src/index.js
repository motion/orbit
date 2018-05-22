import './createElement'
import 'regenerator-runtime/runtime'
import 'isomorphic-fetch'
import '@mcro/debug/inject'
import * as Constants from './constants'

process.on('uncaughtException', err => {
  console.log('App.uncaughtException', err.stack)
})

if (Constants.IS_PROD) {
  require('./helpers/installProd')
} else {
  require('./helpers/installDevTools')
}

export function start() {
  if (!window.Root) {
    console.warn(`NODE_ENV=${process.env.NODE_ENV} ${window.location.pathname}`)
    console.timeEnd('splash')
  }
  require('./app')
}

start()
