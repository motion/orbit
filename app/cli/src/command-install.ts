import { getRegistryLatestVersion, yarnOrNpm } from './command-publish'
import { reporter } from './reporter'
import { getPackageId } from './util/getPackageId'

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

  console.log('TODO INSTALL', command, curVersion, packageId)

  return
}
