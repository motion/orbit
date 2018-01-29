import 'babel-polyfill'
import { setTimeout } from 'core-js/library/web/timers'

process.env.HAS_BABEL_POLYFILL = true
process.env.NODE_ENV = 'production'

console.log('starting app')
require('./start-app').start()

export async function startAPI() {
  console.log('starting api')
  const sleep = ms => new Promise(res => setTimeout(res, ms))
  await sleep(100)
  require('@mcro/api')
}

if (!process.env.DISABLE_API) {
  startAPI()
}

process.on('SIGINT', () => {
  console.log('we should exit')
  setTimeout(() => {
    process.exit(0)
  })
})
