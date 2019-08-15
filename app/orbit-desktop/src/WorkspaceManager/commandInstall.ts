import { getPackageId, getRegistryLatestVersion, isInstalled } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { CommandOpts, resolveCommand } from '@o/mediator'
import { AppInstallCommand, CommandInstallOptions, StatusReply } from '@o/models'
import execa from 'execa'

import { attachLogToCommand, statusReplyCommand, yarnOrNpm } from './commandHelpers'

const log = new Logger('commandInstall')

export const resolveAppInstallCommand = resolveCommand(
  AppInstallCommand,
  statusReplyCommand(commandInstall),
)

export async function commandInstall(
  options: CommandInstallOptions,
  helpers?: CommandOpts,
): Promise<StatusReply> {
  if (helpers) {
    attachLogToCommand(log, helpers)
  }
  log.info(`commandInstall ${options.directory} ${options.identifier}`)

  const command = await yarnOrNpm()
  const packageId = await getPackageId(options.identifier, {
    search: true,
    rescanWorkspacePath: options.directory,
  })

  if (!packageId) {
    return {
      type: 'error',
      message: `No packageId found locally or in app store for: ${options.identifier}`,
    }
  }

  const curVersion = options.upgrade ? await getRegistryLatestVersion(packageId) : undefined

  // check if already installed and avoid work
  if (await isInstalled(packageId, options.directory, curVersion)) {
    log.info(`Definition is already installed ${packageId}`)
    if (!options.forceInstall) {
      return {
        type: 'success',
        message: `Already installed this version, use --force-install or options.forceInstall to force update`,
      }
    }
  }

  const packageInstallKey = `${packageId}@${curVersion || 'latest'}`
  log.info(`Installing ${packageInstallKey}`)

  if (command === 'yarn') {
    await runCommand(`yarn add ${packageInstallKey}`, {
      cwd: options.directory,
    })
  } else {
    await runCommand(`npm install --save ${packageInstallKey}`, {
      cwd: options.directory,
    })
  }

  // TODO app bit? we handle this in two ways: `installApp`  and then `ensureAppBitsForAppDefinitions`
  // but it may be better to avoid ensureAppBitsForAppDefinitions and just have it here

  // re-open this workspace to trigger loading newly installed app definition
  await reloadAppDefinitions(options.directory)

  return {
    type: 'success',
    message: 'Installed',
  }
}

async function runCommand(command: string, opts?: Object) {
  log.info(`runCommand ${command} ${process.env.NODE_ENV}`)
  const proc = execa.command(command, opts)
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
async function reloadAppDefinitions(_directory: string) {
  console.log('\n\n\n\nTODO\n\n\n\n\n')
  // let { mediator } = await getOrbitDesktop()
  // const apps = await getWorkspaceApps(directory)
  // await mediator.command(AppOpenWorkspaceCommand, {
  //   workspaceRoot: directory,
  //   packageIds: apps.map(x => x.packageId),
  // })
}
