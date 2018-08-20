import 'isomorphic-fetch'
import * as Path from 'path'
import { setConfig } from './config'
import { logger } from '@mcro/logger'
import psTree from 'ps-tree'

const log = logger('desktop')

export async function main({ port }) {
  log('Desktop is starting')

  // handle exits gracefully
  process.on('exit', () => {
    const exitWait = setTimeout(() => {
      console.log('failed to exit desktop gracefully!')
    }, 500)
    console.log('Orbit Desktop exiting...')
    psTree(process.getuid(), (err, children) => {
      if (err) {
        console.log('error getting children', err)
        return
      }
      const pids = children.map(x => x.PID)
      console.log('exiting children', pids)
      for (const pid of pids) {
        process.kill(pid)
      }
      clearTimeout(exitWait)
    })
  })

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
