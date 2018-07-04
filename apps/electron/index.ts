import 'babel-polyfill'
import { setTimeout } from 'core-js/library/web/timers'

// @ts-ignore
process.env.HAS_BABEL_POLYFILL = true
process.env.NODE_ENV = 'production'
process.title = 'Electron'

// uncaught exceptions
process.on('uncaughtException', err => {
  console.log('uncaughtException', err)
})

// promise exceptions
process.on('unhandledRejection', function(reason, promise) {
  console.log('Electron: Possibly Unhandled Rejection')
  console.log(promise, reason)
  console.log(reason.stack)
})

console.log('starting app AND API together')

require('./start-app').start()

export async function startAPI() {
  console.log('starting api')
  const sleep = ms => new Promise(res => setTimeout(res, ms))
  await sleep(100)
  require('@mcro/desktop')
}

if (!process.env.DISABLE_API) {
  startAPI()
}
