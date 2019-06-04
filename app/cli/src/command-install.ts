import { Logger } from '@o/logger'
import execa from 'execa'

import { getRegistryLatestVersion, yarnOrNpm } from './command-publish'
import { reporter } from './reporter'
import { getPackageId } from './util/getPackageId'

export type CommandInstallOptions = {
  directory: string
  identifier: string
  verbose?: boolean
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
    console.warn('no package id found')
    return
  }

  const curVersion = await getRegistryLatestVersion(packageId)
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

  // TODO send command to desktop to AppOpenWorkspaceCommand

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
