import { AppOpenWorkspaceCommand, CommandWsOptions } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

/**
 * This is run either from the daemon (Orbit app process) or from the
 * cli directly. The app process will then call *back* to here to run the
 * WorkspaceManager. This gives us a lot of flexibility. It means we can update
 * the cli independently of the app, because it lives outside. But, it also lets
 * us keep a single .app process running that manages everything.
 *
 * Or more simply:
 *
 *  when calling from cli:
 *   1. cli => find running app or start app in own process
 *   2. app => imports cli to start workspace with { daemon: true }
 *
 */
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
