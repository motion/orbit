import { fork } from 'child_process'
import { Logger } from '@mcro/logger'
import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'
import electronUtil from 'electron-util/node'

const log = new Logger('electron')

export function startDesktopInProcess(port) {
  const desktopRoot = electronUtil.fixPathForAsarUnpack(
    require.resolve('@mcro/orbit-desktop'),
  )
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
