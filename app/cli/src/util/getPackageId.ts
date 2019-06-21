import { ApiSearchItem } from '@o/models'

import { apiUrl } from '../command-publish'
import { reporter } from '../reporter'
import { updateWorkspacePackageIds } from './updateWorkspacePackageIds'

const identifierToPackageId: { [key: string]: string } = {}

export function setIdentifierToPackageId(identifier: string, packageId: string) {
  reporter.info(`setIdentifierToPackageId ${identifier} ${packageId}`)
  identifierToPackageId[identifier] = packageId
}

export function getIdentifierToPackageId() {
  return { ...identifierToPackageId }
}

export async function getPackageId(
  identifier: string,
  options: { search?: boolean; rescanWorkspacePath?: string } = {},
): Promise<string | null> {
  if (options.rescanWorkspacePath) {
    await updateWorkspacePackageIds(options.rescanWorkspacePath)
  }

  const info = JSON.stringify(identifierToPackageId, null, 2)
  reporter.info(`getPackageId ${identifier}, checking loaded app identifiers: ${info}`)

  if (identifierToPackageId[identifier]) {
    return identifierToPackageId[identifier]
  }

  if (options.search) {
    reporter.info(`Fetching package info from registry ${identifier}`)
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
  reporter.info(
    `getIdentifierFromPackageId failed to find ${packageId} ${JSON.stringify(
      identifierToPackageId,
    )}`,
  )
  return null
}
