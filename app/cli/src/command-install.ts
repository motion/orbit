import { AppInstallCommand, CommandInstallOptions, StatusReply } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

export async function commandInstall(options: CommandInstallOptions): Promise<StatusReply> {
  reporter.info(`Checking for installation ${options.identifier} into ${options.directory}`)
  const { mediator } = await getOrbitDesktop({
    singleUseMode: true,
  })
  return await mediator.command(AppInstallCommand, options)
}
