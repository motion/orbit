// import exec from 'execa'
import { execFile } from 'child_process'
// @ts-ignore
import { promisify } from 'util'
import { logger } from '@mcro/logger'
import * as Path from 'path'
import { getConfig } from '@mcro/config'

const log = logger('electron')
const exec = promisify(execFile)

export async function startDesktopInProcess(port) {
  const desktopRoot = require.resolve('@mcro/orbit-desktop')
  const productionRoot = Path.join(desktopRoot, '..', 'main-production.js')
  log(`Desktop main file: ${productionRoot}`)
  const { stdout, stderr } = await exec(productionRoot, [], {
    cwd: Path.join(desktopRoot, '..'),
    env: {
      DESKTOP_PORT: port,
      NODE_ENV: process.env.NODE_ENV,
      ORBIT_CONFIG: JSON.stringify(getConfig()),
    },
  })
  stdout.pipe(process.stdout)
  stderr.pipe(process.stderr)
}
