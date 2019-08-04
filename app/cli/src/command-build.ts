import { isOrbitApp } from '@o/libs-node'
import { AppBuildCommand, CommandBuildOptions } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { logStatusReply } from './logStatusReply'
import { reporter } from './reporter'

export async function commandBuild(options: CommandBuildOptions, singleUseMode = false) {
  reporter.info(`Building...`)
  reporter.verbose(`command-build ${options.projectRoot}`)
  if (!(await isOrbitApp(options.projectRoot))) {
    reporter.panic(
      `\nNot inside an orbit app, add "config": { "orbitApp": true } } to the package.json`,
    )
  }
  const { mediator, orbitProcess } = await getOrbitDesktop({
    singleUseMode,
  })
  const res = await mediator.command(AppBuildCommand, options, {
    timeout: 50_000,
    onMessage: reporter.info,
  })
  logStatusReply(res)
  if (singleUseMode) {
    orbitProcess.kill()
  }
  process.exit(0)
}
