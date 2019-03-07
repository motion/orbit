import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { fork } from 'child_process'
import electronUtil from 'electron-util/node'
import * as Path from 'path'

const log = new Logger('electron')

export function startDesktopInProcess(port) {
  const desktopRoot = electronUtil.fixPathForAsarUnpack(require.resolve('@o/orbit-desktop'))
  const productionRoot = Path.join(desktopRoot, '..', 'main-production.js')
  log.info(`Desktop main file: ${productionRoot}`)
  try {
    const child = fork(productionRoot, [], {
      cwd: Path.join(desktopRoot, '..'),
      env: {
        DESKTOP_PORT: port,
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
