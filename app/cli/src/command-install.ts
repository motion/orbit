import { AppInstallCommand, CommandInstallOptions } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'
import { logStatusReply } from './logStatusReply'

export async function commandInstall(options: CommandInstallOptions) {
  reporter.info(`Checking for installation ${options.identifier} into ${options.directory}`)
  const { mediator, orbitProcess } = await getOrbitDesktop({
    singleUseMode: true,
  })
  const res = await mediator.command(AppInstallCommand, options)
  logStatusReply(res)
  if (orbitProcess) {
    orbitProcess.kill()
    process.exit(0)
  }
}
