import 'babel-polyfill'
import { setTimeout } from 'core-js/library/web/timers'

// @ts-ignore
process.env.HAS_BABEL_POLYFILL = true
process.env.NODE_ENV = 'production'

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
