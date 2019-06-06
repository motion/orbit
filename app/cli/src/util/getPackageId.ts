import { ApiSearchItem } from '@o/models'

import { apiUrl } from '../command-publish'
import { reporter } from '../reporter'

export const identifierToPackageId = {}

export async function getPackageId(identifier: string) {
  if (identifierToPackageId[identifier]) {
    return identifierToPackageId[identifier]
  }
  reporter.info(`Fetching package info from registry ${identifier}`)
  const searchApp: ApiSearchItem = await fetch(`${apiUrl}/apps/${identifier}`).then(x => x.json())
  return searchApp.packageId
}
