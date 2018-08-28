import 'isomorphic-fetch'
import { logger } from '@mcro/logger'
import { cleanupChildren } from './helpers/cleanupChildren'

const log = logger('desktop')

export async function main() {
  log('Desktop is starting')

  /*
   *  Setup app after config
   */
  const { Root } = require('./root')
  const appRoot = new Root()
  if (process.env.NODE_ENV === 'development') {
    require('./helpers/startDevelopment').startDevelopment(appRoot)
  }

  // handle exits gracefully
  const dispose = () => {
    console.log('Orbit Desktop exiting...')
    appRoot.dispose()
    cleanupChildren()
  }
  process.on('exit', dispose)

  await appRoot.start()

  return dispose
}
