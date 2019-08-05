import { AppOpenWorkspaceCommand, CommandWsOptions } from '@o/models'

import { isInWorkspace } from './command-new'
import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

export async function commandWs(options: CommandWsOptions) {
  if (!(await isInWorkspace(options.workspaceRoot))) {
    reporter.panic(
      `Not in an orbit workspace, be sure package.json has "config": { "orbitWorkspace": true }`,
    )
  }
  reporter.info(`Running command ws mode${options.dev ? ' in dev mode' : ''}`)
  const { mediator } = await getOrbitDesktop({
    singleUseMode: options.build,
  })
  try {
    reporter.info(options.build ? `Building workspace` : `Running workspace`)
    // this will tell orbit to look for this workspace and re-run the cli
    // we centralize all commands through orbit so we don't want to do it directly here
    await mediator.command(AppOpenWorkspaceCommand, options, {
      timeout: 1000 * 60 * 3,
      onMessage: reporter.info,
    })
    if (options.build) {
      process.exit(0)
    }
  } catch (err) {
    reporter.panic(`Error opening app for dev ${err.message}\n${err.stack}`)
  }
}
