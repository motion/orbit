import { ApiSearchItem } from '@o/models'

import { apiUrl } from '../command-publish'
import { reporter } from '../reporter'

export const identifierToPackageId: { [key: string]: string } = {}

export async function getPackageId(identifier: string): Promise<string> {
  reporter.info(`Loaded app identifiers: ${Object.keys(identifierToPackageId).join(', ')}`)

  if (identifierToPackageId[identifier]) {
    return identifierToPackageId[identifier]
  }

  reporter.info(`Fetching package info from registry ${identifier}`)
  const searchApp: ApiSearchItem = await fetch(`${apiUrl}/apps/${identifier}`).then(x => x.json())
  return searchApp.packageId
}

export function getIdentifierFromPackageId(packageId: string) {
  const found = Object.keys(identifierToPackageId).find(x => identifierToPackageId[x] === packageId)
  return found || null
}
