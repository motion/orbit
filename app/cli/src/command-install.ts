import { Logger } from '@o/logger'
import execa from 'execa'

import { getRegistryLatestVersion, yarnOrNpm } from './command-publish'
import { reloadAppDefinitions } from './command-ws'
import { reporter } from './reporter'
import { getPackageId } from './util/getPackageId'
import { isInstalled } from './util/isInstalled'

export type CommandInstallOptions = {
  directory: string
  identifier: string
  verbose?: boolean
  forceInstall?: boolean
  upgrade?: boolean
}

export type CommandInstallRes = {
  type: 'success' | 'error'
  message: string
}

export async function commandInstall(options: CommandInstallOptions): Promise<CommandInstallRes> {
  reporter.info(`Checking for installation ${options.identifier} into ${options.directory}`)

  const command = await yarnOrNpm()
  const packageId = await getPackageId(options.identifier, {
    search: true,
  })

  if (!packageId) {
    return {
      type: 'error' as const,
      message: `No packageId found locally or in app store`,
    }
  }

  const curVersion = options.upgrade ? await getRegistryLatestVersion(packageId) : 'latest'

  // check if already installed and avoid work
  if (await isInstalled(packageId, options.directory, curVersion)) {
    reporter.info(`Definition is already installed ${packageId}`)
    if (!options.forceInstall) {
      return {
        type: 'success' as const,
        message: `Already installed this version, use --force-install or options.forceInstall to force update`,
      }
    }
  }

  const packageInstallKey = `${packageId}@${curVersion}`
  reporter.info(`Installing ${packageInstallKey}`)

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

const log = new Logger('runCommand')

export async function runCommand(command: string, args: string, env?: Object) {
  log.info(`${command} ${args}`)
  const proc = execa(command, args.split(' '), env)
  if (process.env.NODE_ENV !== 'production') {
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
  }
  return await proc
}
