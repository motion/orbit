import { spawn } from 'child_process'
import { getGlobalConfig } from '@mcro/config'
// @ts-ignore
import { app } from 'electron'

const Config = getGlobalConfig()

export function startDesktop() {
  const appBinary = app.getAppPath()
  // enable remote debugging in dev
  const args = Config.isProd ? [] : ['--inspect=127.0.0.1:9000']
  try {
    const child = spawn(appBinary, args, {
      env: {
        ELECTRON_RUN_AS_NODE: 1,
        IS_DESKTOP: true,
        NODE_ENV: process.env.NODE_ENV,
        ORBIT_CONFIG: JSON.stringify(Config),
        PATH: process.env.PATH,
      },
    })
    // return pid
    return child.pid
  } catch (err) {
    console.log('error starting desktop', err)
  }
}
