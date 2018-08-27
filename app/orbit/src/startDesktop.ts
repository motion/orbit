import { spawn } from 'child_process'
import { getGlobalConfig } from '@mcro/config'
// @ts-ignore
import { app } from 'electron'

export function startDesktop() {
  const appBinary = app.getAppPath()
  try {
    const child = spawn(appBinary, [], {
      env: {
        ELECTRON_RUN_AS_NODE: 1,
        IS_DESKTOP: true,
        NODE_ENV: process.env.NODE_ENV,
        ORBIT_CONFIG: JSON.stringify(getGlobalConfig()),
        PATH: process.env.PATH,
      },
    })
    // return pid
    return child.pid
  } catch (err) {
    console.log('error starting desktop', err)
  }
}
