import { AppOpenWorkspaceCommand, CommandWsOptions } from '@o/models'
import { readJSON } from 'fs-extra'
import { join } from 'path'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'
import { getWorkspaceApps } from './util/getWorkspaceApps'
import { WorkspaceManager } from './WorkspaceManager'

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
  reporter.info(`Running command ws, daemon? ${options.daemon}`)
  if (options.daemon) {
    const wsManager = new WorkspaceManager()
    wsManager.setWorkspace(options)
    await wsManager.start()
    return wsManager
  } else {
    await sendOrbitDesktopOpenWorkspace(options)
  }
}

async function sendOrbitDesktopOpenWorkspace(options: CommandWsOptions) {
  const { mediator } = await getOrbitDesktop()
  if (!mediator) {
    reporter.panic(`Could not open orbit desktop`)
  }
  try {
    reporter.info(`Sending open workspace command`)
    // this will tell orbit to look for this workspace and re-run the cli
    // we centralize all commands through orbit so we don't want to do it directly here
    await mediator.command(AppOpenWorkspaceCommand, options)
  } catch (err) {
    reporter.panic(`Error opening app for dev ${err.message}\n${err.stack}`)
  }
}

/**
 * Sends command to open workspace with latest packageIds
 * Gets packageIds by reading current workspace directory
 */
export async function reloadAppDefinitions(directory: string) {
  let { mediator } = await getOrbitDesktop()
  const apps = await getWorkspaceApps(directory)
  await mediator.command(AppOpenWorkspaceCommand, {
    path: directory,
    packageIds: apps.map(x => x.packageId),
  })
}

export async function isInWorkspace(packagePath: string, workspacePath: string): Promise<boolean> {
  try {
    const packageInfo = await readJSON(join(packagePath, 'package.json'))
    const workspaceInfo = await getWorkspaceApps(workspacePath)
    if (packageInfo && workspaceInfo) {
      return workspaceInfo.some(x => x.packageId === packageInfo.name)
    }
  } catch (err) {
    reporter.verbose(`Potential err ${err.message}`)
  }
  return false
}

export const isOrbitWs = async (rootDir: string) => {
  try {
    const pkg = await readJSON(join(rootDir, 'package.json'))
    return pkg.config && pkg.config.orbitWorkspace === true
  } catch (err) {
    reporter.error(err.message, err)
  }
  return false
}
