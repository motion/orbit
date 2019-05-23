import { AppDevCloseCommand, AppDevOpenCommand, AppOpenWindowCommand } from '@o/models'
import { readJSON } from 'fs-extra'
import { join } from 'path'

import { getOrbitDesktop } from './getDesktop'
import { addProcessDispose } from './processDispose'
import { reporter } from './reporter'

export async function commandDev(options: { projectRoot: string }) {
  let orbitDesktop = await getOrbitDesktop()

  if (!orbitDesktop) {
    process.exit(0)
  }

  const pkg = await readJSON(join(options.projectRoot, 'package.json'))
  const entry = pkg['ts:main'] || pkg.main

  try {
    const appId = await orbitDesktop.command(AppDevOpenCommand, {
      path: options.projectRoot,
      entry: join(options.projectRoot, entry),
    })
    await orbitDesktop.command(AppOpenWindowCommand, {
      appId,
      isEditing: true,
    })

    addProcessDispose(async () => {
      reporter.info('Disposing orbit dev process...')
      await orbitDesktop.command(AppDevCloseCommand, {
        appId,
      })
    })
  } catch (err) {
    console.log('Error opening app for dev', err.message, err.stack)
  }
  return
}
