import { getRegistryLatestVersion, yarnOrNpm } from './command-publish'
import { reporter } from './reporter'
import { getPackageId } from './util/getPackageId'
import execa from 'execa'

export type CommandInstallOptions = {
  directory: string
  identifier: string
  verbose?: boolean
}

export async function commandInstall(options: CommandInstallOptions) {
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
      await execa(command, `add ${packageInstallKey}`)
    } else {
      await execa(command, `install --save ${packageInstallKey}`)
    }
  } catch (err) {
    return {
      type: 'error' as const,
      message: `${err.message}`,
    }
  }

  return {
    type: 'success' as const,
    message: 'Installed',
  }
}
