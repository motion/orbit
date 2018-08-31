import { spawn, ChildProcess } from 'child_process'
import { getGlobalConfig } from '@mcro/config'
// @ts-ignore
import { app } from 'electron'
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
      env: {
        ELECTRON_RUN_AS_NODE: 1,
        IS_DESKTOP: true,
        NODE_ENV: process.env.NODE_ENV,
        ORBIT_CONFIG: JSON.stringify(Config),
        PATH: process.env.PATH,
      },
    })

    child.stdout.on('data', b => console.log('desktop:', b.toString()))
    child.stderr.on('data', b => console.log('desktop err:', b.toString()))

    // return pid
    return child
  } catch (err) {
    console.log('error starting desktop', err)
  }
}
