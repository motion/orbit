import 'isomorphic-fetch'
import { cleanupChildren } from './helpers/cleanupChildren'
import root from 'global'
import { once } from 'lodash'

// process.on('unhandledRejection', error => {
//   console.log('unhandledRejection', error.stack)
//   throw error
// })

export async function main() {
  /*
   *  Setup app after config
   */
  const { Root } = require('./Root')
  const appRoot = new Root()

  // this is super important for debugging in REPL
  // if you hate that its here, move it to installGlobals properly
  root['Root'] = appRoot

  if (process.env.NODE_ENV === 'development') {
    require('./helpers/startDevelopment').startDevelopment(appRoot)
  }

  // handle exits gracefully
  const dispose = once(async () => {
    console.log('Desktop exiting...')
    await appRoot.dispose()
    process.kill(process.pid)
    try {
      cleanupChildren()
    } catch {}
  })
  process.on('exit', dispose)
  process.on('SIGINT', dispose)
  process.on('SIGSEGV', dispose)
  process.on('SIGTERM', dispose)
  process.on('SIGQUIT', dispose)

  await appRoot.start()

  return dispose
}

if (process.env.AUTO_START) {
  main()
}
