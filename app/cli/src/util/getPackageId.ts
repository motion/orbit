import { ApiSearchItem } from '@o/models'

import { apiUrl } from '../command-publish'
import { reporter } from '../reporter'
import { updateWorkspacePackageIds } from './updateWorkspacePackageIds'

export const identifierToPackageId: { [key: string]: string } = {}

export async function getPackageId(
  identifier: string,
  options: { search?: boolean; rescanWorkspacePath?: string } = {},
): Promise<string | null> {
  if (options.rescanWorkspacePath) {
    await updateWorkspacePackageIds(options.rescanWorkspacePath)
  }

  reporter.info(`Loaded app identifiers: ${Object.keys(identifierToPackageId).join(', ')}`)

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
  return found || null
}
