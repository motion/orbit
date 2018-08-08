import exec from 'execa'
import { logger } from '@mcro/logger'
import * as Path from 'path'
import { getConfig } from '@mcro/config'

const log = logger('electron')

export function startDesktopInProcess(port) {
  const desktopRoot = require.resolve('@mcro/orbit-desktop')
  const productionRoot = Path.join(desktopRoot, '..', 'main-production.js')
  log(`Desktop main file: ${productionRoot}`)
  const subProcess = exec('node', [productionRoot, '--port', port], {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      ORBIT_CONFIG: JSON.stringify(getConfig()),
    },
  })
  subProcess.stdout.pipe(process.stdout)
  subProcess.stderr.pipe(process.stderr)
}
