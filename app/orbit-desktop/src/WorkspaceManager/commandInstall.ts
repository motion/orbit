import { Logger } from '@o/logger'
import { CommandInstallOptions } from '@o/models'
import execa from 'execa'

import { yarnOrNpm } from './commandHelpers'
import { getPackageId } from './getPackageId'
import { getRegistryLatestVersion } from './getRegistryLatestVersion'
import { isInstalled } from './isInstalled'

const log = new Logger('commandInstall')

export async function commandInstall(options: CommandInstallOptions) {
  const command = await yarnOrNpm()
  const packageId = await getPackageId(options.identifier, {
    search: true,
    rescanWorkspacePath: options.directory,
  })

  if (!packageId) {
    return {
      type: 'error' as const,
      message: `No packageId found locally or in app store for: ${options.identifier}`,
    }
  }

  const curVersion = options.upgrade ? await getRegistryLatestVersion(packageId) : undefined

  // check if already installed and avoid work
  if (await isInstalled(packageId, options.directory, curVersion)) {
    log.info(`Definition is already installed ${packageId}`)
    if (!options.forceInstall) {
      return {
        type: 'success' as const,
        message: `Already installed this version, use --force-install or options.forceInstall to force update`,
      }
    }
  }

  const packageInstallKey = `${packageId}@${curVersion || 'latest'}`
  log.info(`Installing ${packageInstallKey}`)

  try {
    if (command === 'yarn') {
      await runCommand(command, `add ${packageInstallKey}`, {
        cwd: options.directory,
      })
    } else {
      await runCommand(command, `install --save ${packageInstallKey}`, {
        cwd: options.directory,
      })
    }
  } catch (err) {
    return {
      type: 'error' as const,
      message: `${err.message}`,
    }
  }

  // TODO app bit? we handle this in two ways: `installApp`  and then `ensureAppBitsForAppDefinitions`
  // but it may be better to avoid ensureAppBitsForAppDefinitions and just have it here

  // re-open this workspace to trigger loading newly installed app definition
  await reloadAppDefinitions(options.directory)

  return {
    type: 'success' as const,
    message: 'Installed',
  }
}

export async function runCommand(command: string, args: string, env?: Object) {
  log.info(`${command} ${args}`)
  const proc = execa(command, args.split(' '), env)
  if (process.env.NODE_ENV !== 'production') {
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
  }
  return await proc
}

/**
 * Sends command to open workspace with latest packageIds
 * Gets packageIds by reading current workspace directory
 */
export async function reloadAppDefinitions(directory: string) {
  let { mediator } = await getOrbitDesktop()
  const apps = await getWorkspaceApps(directory)
  await mediator.command(AppOpenWorkspaceCommand, {
    workspaceRoot: directory,
    packageIds: apps.map(x => x.packageId),
  })
}
