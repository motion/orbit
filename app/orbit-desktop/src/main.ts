import 'isomorphic-fetch'
import * as Path from 'path'
import { setConfig } from './config'

export async function main({ port }) {
  /*
   *  Set config before requiring app!
   */

  // local
  setConfig({
    env: {
      prod: process.env.NODE_ENV === 'production',
    },
    server: {
      url: `http://localhost:${port}`,
      host: 'localhost',
      port,
    },
    directories: {
      root: Path.join(__dirname, '..'),
      orbitAppStatic: Path.join(require.resolve('@mcro/orbit-app'), 'dist'),
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
