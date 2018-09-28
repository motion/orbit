import { spawn, ChildProcess } from 'child_process'
import { getGlobalConfig } from '@mcro/config'
import * as Path from 'path'

const Config = getGlobalConfig()

export function startDesktop(): ChildProcess {
  // enable remote debugging in dev
  const root = Path.join(__dirname, 'main')
  let args = [root]
  if (!Config.isProd) {
    args = ['--inspect=9000', ...args]
  }
  try {
    console.log('Starting Desktop:', Config.paths.nodeBinary, args)
    const child = spawn(Config.paths.nodeBinary, args, {
      // detached: true,
      env: {
        PROCESS_NAME: 'desktop',
        STACK_FILTER: 'orbit-desktop',
        ELECTRON_RUN_AS_NODE: 1,
        IS_DESKTOP: true,
        NODE_ENV: process.env.NODE_ENV,
        ORBIT_CONFIG: JSON.stringify(Config),
        PATH: process.env.PATH,
      },
    })

    child.stdout.on('data', b => console.log('desktop:', b.toString()))
    child.stderr.on('data', b => {
      const error = b.toString()
      // for some reason node logs into error
      if (error.indexOf('Debugger ') === 0) {
        return
      }
      if (error.indexOf('Error') === -1) {
        console.log('\n\n\n got an error but may not be worth reporting \n\n\n')
        console.log('error:', error)
        return
      }
      if (process.env.IS_DESKTOP) {
        console.log('error is', error)
      } else {
        console.log('CHILD ERROR', error)
      }
    })

    return child
  } catch (err) {
    console.log('error starting desktop', err)
  }
}
