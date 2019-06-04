import { ApiSearchItem } from '@o/models'

import { apiUrl } from '../command-publish'

export const identifierToPackageId = {}

export async function getPackageId(identifier: string) {
  if (identifierToPackageId[identifier]) {
    return identifierToPackageId[identifier]
  }
  const searchApp: ApiSearchItem = await fetch(`${apiUrl}/apps/${identifier}`).then(x => x.json())
  return searchApp.packageId
}
