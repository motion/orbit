import 'isomorphic-fetch'
import * as Path from 'path'
import { setConfig } from './config'
import { logger } from '@mcro/logger'

const log = logger('desktop')

export async function main({ port }) {
  log(`Desktop is starting`)
  /*
   *  Set config before requiring app!
   */

  // local
  setConfig({
    env: {
      prod: process.env.NODE_ENV !== 'development',
    },
    server: {
      url: `http://localhost:${port}`,
      host: 'localhost',
      port,
    },
    directories: {
      root: Path.join(__dirname, '..'),
      orbitAppStatic: Path.join(
        require.resolve('@mcro/orbit-app'),
        '..',
        'dist',
      ),
    },
  })

  /*
   *  Setup app after config
   */
  const { Root } = require('./root')
  const appRoot = new Root()
  if (process.env.NODE_ENV === 'development') {
    require('./helpers/startDevelopment').startDevelopment(appRoot)
  }
  await appRoot.start()
}
