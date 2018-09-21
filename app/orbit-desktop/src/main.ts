import 'isomorphic-fetch'
import { Logger } from '@mcro/logger'
import { cleanupChildren } from './helpers/cleanupChildren'
import root from 'global'
import { once } from 'lodash'

const log = new Logger('desktop')

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.stack)
  throw error
})

export async function main() {
  log.info('Desktop is starting')

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
  const dispose = once(() => {
    console.log('Orbit Desktop exiting...')
    appRoot.dispose()
    cleanupChildren()
  })
  process.on('exit', dispose)

  await appRoot.start()

  return dispose
}
