import { AppDevCloseCommand, AppDevOpenCommand, AppOpenWindowCommand } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { addProcessDispose } from './processDispose'
import { reporter } from './reporter'

export async function commandDev(options: { projectRoot: string }) {
  let orbitDesktop = await getOrbitDesktop()

  if (!orbitDesktop) {
    process.exit(0)
  }

  try {
    const appId = await orbitDesktop.command(AppDevOpenCommand, {
      path: options.projectRoot,
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
