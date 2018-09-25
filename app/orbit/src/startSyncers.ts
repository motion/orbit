import { spawn, ChildProcess } from 'child_process'
import { getGlobalConfig } from '@mcro/config'
// @ts-ignore
import { app } from 'electron'
import * as Path from 'path'
import { onError } from './handleErrors'

const Config = getGlobalConfig()

export function startSyncers(): ChildProcess {
  // enable remote debugging in dev
  console.log("Config", Config)
  const root = Path.join(__dirname, 'main')
  let args = [root]
  if (!Config.isProd) {
    args = ['--inspect=9003', ...args]
  }
  try {
    console.log('Starting Syncers:', Config.paths.nodeBinary, args)
    const child = spawn(Config.paths.nodeBinary, args, {
      detached: true,
      env: {
        PROCESS_NAME: 'syncers',
        STACK_FILTER: 'orbit-syncers',
        ELECTRON_RUN_AS_NODE: 1,
        IS_SYNCERS: true,
        NODE_ENV: process.env.NODE_ENV,
        ORBIT_CONFIG: JSON.stringify(Config),
        PATH: process.env.PATH,
      },
    })

    child.stdout.on('data', b => console.log('syncers:', b.toString()))
    child.stderr.on('data', b => {
      const error = b.toString()
      // for some reason node logs into error
      if (error.indexOf('Debugger ') === 0) {
        return
      }
      if (error.indexOf('Error') === -1) {
        console.log('\n\n\n syncers got an error but may not be worth reporting \n\n\n')
        console.log('error:', error)
        return
      }
      onError({ stack: error })
    })

    console.log('Syncer process started')
    return child
  } catch (err) {
    console.log('error starting desktop', err)
  }
}
