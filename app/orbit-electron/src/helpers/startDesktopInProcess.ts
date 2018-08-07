import exec from 'execa'
import * as Path from 'path'
import { logger } from '@mcro/logger'

const log = logger('electron')

export function startDesktopInProcess() {
  log('Starting desktop sub process...')
  const desktopRoot = require.resolve('@mcro/orbit-desktop')
  const desktopMain = Path.join(desktopRoot, '_', 'main.js')
  const subProcess = exec('node', [desktopMain])
  subProcess.stdout.pipe(process.stdout)
  subProcess.stderr.pipe(process.stderr)
}
