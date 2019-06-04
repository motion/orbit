import { Logger } from '@o/logger'
import execa from 'execa'
import { readJSON } from 'fs-extra'
import { join } from 'path'

import { getRegistryLatestVersion, yarnOrNpm } from './command-publish'
import { reloadAppDefinitions } from './command-ws'
import { reporter } from './reporter'
import { findPackage } from './util/findPackage'
import { getPackageId } from './util/getPackageId'

export type CommandInstallOptions = {
  directory: string
  identifier: string
  verbose?: boolean
  forceInstall?: boolean
}

export type CommandInstallRes = {
  type: 'success' | 'error'
  message: string
}

export async function commandInstall(options: CommandInstallOptions): Promise<CommandInstallRes> {
  reporter.info(`Installing ${options.identifier} into ${options.directory}`)

  const command = await yarnOrNpm()
  const packageId = await getPackageId(options.identifier)

  if (!packageId) {
    return {
      type: 'error' as const,
      message: `No packageId found locally or in app store`,
    }
  }

  const curVersion = await getRegistryLatestVersion(packageId)

  // check if already installed and avoid work
  if (await isInstalled(packageId, options.directory, curVersion)) {
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

async function isInstalled(packageId: string, directory: string, version: string) {
  try {
    const pkg = await readJSON(join(directory, 'package.json'))
    if (!pkg.dependencies[packageId]) {
      return false
    }
    const packagePath = findPackage(packageId, directory)
    if (!packagePath) {
      return false
    }
    const packageInfo = await readJSON(packagePath)
    reporter.info(`Got packageInfo ${packagePath} ${packageInfo.version}`)
    return packageInfo.version === version
  } catch (err) {
    reporter.error(err.message, err)
    return false
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
