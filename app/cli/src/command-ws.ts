import { AppOpenWorkspaceCommand, CommandWsOptions } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

export async function commandWs(options: CommandWsOptions) {
  reporter.info(`Running command ws mode ${options.mode}`)
  await sendOrbitDesktopOpenWorkspace(options)
}

async function sendOrbitDesktopOpenWorkspace(options: CommandWsOptions) {
  const { mediator } = await getOrbitDesktop()
  try {
    reporter.info(`Sending open workspace command`)
    // this will tell orbit to look for this workspace and re-run the cli
    // we centralize all commands through orbit so we don't want to do it directly here
    await mediator.command(AppOpenWorkspaceCommand, options)
  } catch (err) {
    reporter.panic(`Error opening app for dev ${err.message}\n${err.stack}`)
  }
}
