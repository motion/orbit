import { isOrbitApp } from '@o/libs-node'
import { AppBuildCommand, CommandBuildOptions } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

export async function commandBuild(options: CommandBuildOptions) {
  reporter.info(`Running build in ${options.projectRoot}`)

  if (!(await isOrbitApp(options.projectRoot))) {
    reporter.panic(
      `\nNot inside an orbit app, add "config": { "orbitApp": true } } to the package.json`,
    )
  }

  const { mediator } = await getOrbitDesktop()
  if (!mediator) {
    reporter.panic('No mediator found')
  }

  await mediator.command(AppBuildCommand, options)
}
