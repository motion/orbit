import 'isomorphic-fetch'
import { logger } from '@mcro/logger'
import { cleanupChildren } from './helpers/cleanupChildren'
import { setGlobalConfig } from '@mcro/config'

const log = logger('desktop')

export async function main() {
  log('Desktop is starting')

  if (!process.env.ORBIT_CONFIG) {
    throw new Error('No orbit config in process.env.ORBIT_CONFIG!')
  }

  /*
   *  Set config before requiring app!
   */
  setGlobalConfig(JSON.parse(process.env.ORBIT_CONFIG))

  /*
   *  Setup app after config
   */
  const { Root } = require('./root')
  const appRoot = new Root()
  if (process.env.NODE_ENV === 'development') {
    require('./helpers/startDevelopment').startDevelopment(appRoot)
  }

  // handle exits gracefully
  process.on('exit', () => {
    console.log('Orbit Desktop exiting...')
    appRoot.dispose()
    cleanupChildren()
  })

  await appRoot.start()
}
