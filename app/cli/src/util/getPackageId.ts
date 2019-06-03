import { ApiSearchItem } from '@o/models'

export const identifierToPackageId = {}

export async function getPackageId(identifier: string) {
  if (identifierToPackageId[identifier]) {
    return identifierToPackageId[identifier]
  }
  const searchApp: ApiSearchItem = await fetch(
    `https://registry.tryorbit.com/apps/${identifier}`,
  ).then(x => x.json())

  console.log('searched for app', identifier, searchApp)

  return searchApp.packageId
}
