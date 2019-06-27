import { AppOpenWorkspaceCommand } from '@o/models'
import { readJSON } from 'fs-extra'
import { join } from 'path'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'
import { getWorkspaceApps } from './util/getWorkspaceApps'

export type CommandWsOptions = {
  workspaceRoot: string
  mode: 'development' | 'production'
  clean?: boolean
}

export async function commandWs(options: CommandWsOptions) {
  reporter.info(`Running command ws`)
  const { mediator } = await getOrbitDesktop()
  if (!mediator) {
    reporter.panic(`Could not open orbit desktop`)
  }
  try {
    reporter.info(`Sending open workspace command`)
    // this will tell orbit to look for this workspace and re-run the cli
    // we centralize all commands through orbit so we don't want to do it directly here
    await mediator.command(AppOpenWorkspaceCommand, {
      path: options.workspaceRoot,
    })
  } catch (err) {
    reporter.panic(`Error opening app for dev ${err.message}\n${err.stack}`)
  }
}

/**
 * Sends command to open workspace with latest packageIds
 * Gets packageIds by reading current workspace directory
 */
export async function reloadAppDefinitions(directory: string) {
  let orbitDesktop = await getOrbitDesktop()
  if (orbitDesktop) {
    const apps = await getWorkspaceApps(directory)
    await orbitDesktop.command(AppOpenWorkspaceCommand, {
      path: directory,
      packageIds: apps.map(x => x.packageId),
    })
  } else {
    reporter.info('No orbit desktop running, didnt reload active app definitions...')
  }
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
