import { fork } from 'child_process'
import { logger } from '@mcro/logger'
import * as Path from 'path'
import { getConfig } from '@mcro/config'
import electronUtil from 'electron-util/node'

const log = logger('electron')

export function startDesktopInProcess(port) {
  const desktopRoot = electronUtil.fixPathForAsarUnpack(
    require.resolve('@mcro/orbit-desktop'),
  )
  const productionRoot = Path.join(desktopRoot, '..', 'main-production.js')
  log(`Desktop main file: ${productionRoot}`)
  try {
    const child = fork(productionRoot, [], {
      cwd: Path.join(desktopRoot, '..'),
      env: {
        DESKTOP_PORT: port,
        NODE_ENV: process.env.NODE_ENV,
        ORBIT_CONFIG: JSON.stringify(getConfig()),
        PATH: process.env.PATH,
      },
    })

    // return pid
    return child.pid
  } catch (err) {
    console.log('error starting desktop', err)
  }
}
