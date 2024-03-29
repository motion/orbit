import { Logger } from '@o/logger'
import { ApiSearchItem } from '@o/models'

import { apiUrl } from './getRegistryLatestVersion'
import { updateWorkspacePackageIds } from './updateWorkspacePackageIds'

export const identifierToPackageId: { [key: string]: string } = {}

const log = new Logger('getPackageId')

export function setIdentifierToPackageId(identifier: string, packageId: string) {
  log.debug(`setIdentifierToPackageId ${identifier} ${packageId}`)
  identifierToPackageId[identifier] = packageId
}

export async function getPackageId(
  identifier: string,
  options: { search?: boolean; rescanWorkspacePath?: string } = {},
): Promise<string | null> {
  if (options.rescanWorkspacePath) {
    await updateWorkspacePackageIds(options.rescanWorkspacePath)
  }
  const info = JSON.stringify(identifierToPackageId, null, 2)
  log.debug(`getPackageId ${identifier}, checking loaded app identifiers`, info)
  if (identifierToPackageId[identifier]) {
    return identifierToPackageId[identifier]
  }
  if (options.search) {
    log.verbose(`Fetching package info from registry ${identifier}`)
    const searchApp: ApiSearchItem = await fetch(`${apiUrl}/apps/${identifier}`).then(x => x.json())
    return searchApp.packageId || null
  }
  return null
}

export function getIdentifierFromPackageId(packageId: string) {
  const found = Object.keys(identifierToPackageId).find(x => identifierToPackageId[x] === packageId)
  if (found) {
    return found
  }
  log.info(
    `getIdentifierFromPackageId failed to find ${packageId} ${JSON.stringify(
      identifierToPackageId,
    )}`,
  )
  return null
}
