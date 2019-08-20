import { AppInstallCommand, CommandInstallOptions } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { logStatusReply } from './logStatusReply'
import { reporter } from './reporter'

export async function commandInstall(options: CommandInstallOptions, singleUseMode = false) {
  reporter.info(`Checking for installation ${options.identifier} into ${options.directory}`)
  const { mediator, orbitProcess } = await getOrbitDesktop({
    singleUseMode: true,
  })
  logStatusReply(
    await mediator.command(AppInstallCommand, options, {
      onMessage: reporter.info,
    }),
  )
  if (singleUseMode) {
    orbitProcess.kill()
  }
  process.exit(0)
}
